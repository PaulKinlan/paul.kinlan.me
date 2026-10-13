import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import https from 'node:https';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
// typescript is a declared devDependency of this repo (not a hand-picked
// transitive). It is the only available parser that reads .js, .mjs, .ts and
// .tsx, which is what the scan scope below needs.
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

// SCAN SCOPE: every code file in the repository, not a list of directories.
// The previous version scanned only api/ and lib/, so a reintroduced bypass in a
// root runtime file passed green - middleware.ts is Vercel edge runtime code that
// runs in production (paul-kinlan-me-5qh, repro B). A hand-kept list of roots has
// to be kept in step with the tree; walking the tree does not.
//   node_modules     - dependencies, third-party code we do not own or configure
//   dot-directories  - .git, .github, .vscode: VCS and tooling, not runtime code
//   tests            - this guard's own spells and samples live here
const skippedDirs = new Set(['node_modules', 'tests']);
const codeFile = /\.[cm]?[jt]sx?$/;

// TIER 1 - textual, and only two jobs now:
//   a) the process-wide variable, wherever its name appears;
//   b) the value spelling `false`/`!1`, in the places tier 2 below could NOT
//      decide. Tier 1's value pattern is applied to the source with tier 2's
//      decided value expressions blanked out (see guardFindings), so a value
//      tier 2 has read is judged by its value and not by how it is spelled -
//      that is what stops `!1 + 1` (which is 1, so verification stays ON) from
//      being reported. Everything tier 2 cannot read keeps the pattern: a
//      comment, a string literal, or code the parser could not turn into an
//      assignment node.
const processWidePattern = /NODE_TLS_REJECT_UNAUTHORIZED/;
// The key both the value tier and the textual value pattern are about. A file
// without this literal cannot contain a rejectUnauthorized value at all, which is
// what lets guardFindings skip the parse for a file that only names the variable.
const valueKeyPattern = /rejectUnauthorized/;
// Every spelling of the key: rejectUnauthorized: false, 'rejectUnauthorized': false,
// "rejectUnauthorized" : false, ['rejectUnauthorized']: false, rejectUnauthorized:!1,
// options.rejectUnauthorized = false (the reviewed tip missed the quoted,
// computed and assignment forms - repro A).
const valueSpellingPattern = /["'`]?rejectUnauthorized["'`]?\s*\]?\s*[:=]\s*(?:false|!1)\b/;

// Kept as a pair for the tests that describe what the *textual* tier alone knows.
const forbidden = [processWidePattern, valueSpellingPattern];

async function sourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const children = await Promise.all(entries.map(async (entry) => {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || skippedDirs.has(entry.name)) return [];
      return sourceFiles(path.join(dir, entry.name));
    }
    return codeFile.test(entry.name) ? [path.join(dir, entry.name)] : [];
  }));
  return children.flat();
}

// TIER 2 - the value position, constant-folded (paul-kinlan-me-07h / tu6).
//
// Tier 1 can only recognise the value spellings someone wrote into a regex, so
// `rejectUnauthorized: ![]`, `!!0`, `!10`, `Boolean(0)` and `!(1)` - all measured
// as real bypasses by the handshake test below - reach the tree unflagged. The
// value a property is assigned is an expression, not a string, so this tier parses
// it and folds it with JS semantics, and its verdict SUPERSEDES tier 1 for that
// value expression: a value that folds to the boolean false is a finding, and a
// value that folds to anything else is not. That is what stops `!1 + 1` - really
// 1, so verification stays ON - from being reported just because the text
// contains `!1` (paul-kinlan-me-tu6: tier 1 alone still matches that text).
//
// It is a floor, not a proof, and tier 1 stays for everything this tier cannot
// read: a comment, a string literal, or a value whose binding it cannot follow.
// Those keep the textual pattern. Masking is applied only to value expressions
// whose value this tier actually read, so nothing tier 1 used to catch is lost.
//
// COST: measured on 2026-10-13 on this VM, back to back against the regex-only
// version: 808 ms -> ~1.6 s for this file (typescript import, the fold tests and
// the handshake probe, roughly half a second of which is one openssl keygen plus
// 24 loopback handshakes), on a fast gate that takes ~35 s. The walk parses
// nothing unless a file names the key - the prefilter sees 0 of the tree's 107
// files - so on a clean tree the scan itself is unchanged.
const mentionsTlsKey = /rejectUnauthorized|NODE_TLS_REJECT_UNAUTHORIZED/;
const TLS_KEY = 'rejectUnauthorized';

const UNKNOWN = { known: false };
const MAX_DEPTH = 32;
const known = (value) => ({ known: true, value });

// Fold an expression to its value when that value is fixed without any flow
// analysis. Nothing in the scanned file is executed: the values built here are
// our own primitives and empty array/object literals.
function fold(node, depth = 0) {
  if (!node || depth > MAX_DEPTH) return UNKNOWN;
  switch (node.kind) {
    case ts.SyntaxKind.ParenthesizedExpression:
      return fold(node.expression, depth + 1);
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      return known(node.text);
    case ts.SyntaxKind.NumericLiteral:
      return known(Number(node.text));
    case ts.SyntaxKind.TrueKeyword: return known(true);
    case ts.SyntaxKind.FalseKeyword: return known(false);
    case ts.SyntaxKind.NullKeyword: return known(null);
    case ts.SyntaxKind.Identifier:
      // The three built-in identifiers whose value is fixed in any module scope.
      if (node.text === 'undefined') return known(undefined);
      if (node.text === 'NaN') return known(NaN);
      if (node.text === 'Infinity') return known(Infinity);
      return UNKNOWN;
    case ts.SyntaxKind.ArrayLiteralExpression:
      return node.elements.length === 0 ? known([]) : UNKNOWN;
    case ts.SyntaxKind.ObjectLiteralExpression:
      return node.properties.length === 0 ? known({}) : UNKNOWN;
    // typescript 4.9 gives `void x` its own node kind rather than a unary
    // operator, and its value is undefined whatever the operand is.
    case ts.SyntaxKind.VoidExpression:
      return known(undefined);
    case ts.SyntaxKind.PrefixUnaryExpression: {
      const arg = fold(node.operand, depth + 1);
      if (!arg.known) return UNKNOWN;
      switch (node.operator) {
        case ts.SyntaxKind.ExclamationToken: return known(!arg.value);
        case ts.SyntaxKind.MinusToken: return known(-arg.value);
        case ts.SyntaxKind.PlusToken: return known(+arg.value);
        case ts.SyntaxKind.TildeToken: return known(~arg.value);
        default: return UNKNOWN;
      }
    }
    case ts.SyntaxKind.TemplateExpression: {
      let out = node.head.text;
      for (const span of node.templateSpans) {
        const value = fold(span.expression, depth + 1);
        if (!value.known) return UNKNOWN;
        out += String(value.value) + span.literal.text;
      }
      return known(out);
    }
    case ts.SyntaxKind.ConditionalExpression: {
      const condition = fold(node.condition, depth + 1);
      if (!condition.known) return UNKNOWN;
      return fold(condition.value ? node.whenTrue : node.whenFalse, depth + 1);
    }
    case ts.SyntaxKind.BinaryExpression: {
      const op = node.operatorToken.kind;
      const left = fold(node.left, depth + 1);
      // Short-circuit before folding the right-hand side, as JS does.
      if (left.known) {
        if (op === ts.SyntaxKind.AmpersandAmpersandToken && !left.value) return left;
        if (op === ts.SyntaxKind.BarBarToken && left.value) return left;
        if (op === ts.SyntaxKind.QuestionQuestionToken && left.value != null) return left;
      }
      const right = fold(node.right, depth + 1);
      if (!left.known || !right.known) return UNKNOWN;
      const [a, b] = [left.value, right.value];
      switch (op) {
        case ts.SyntaxKind.PlusToken: return known(a + b);
        case ts.SyntaxKind.MinusToken: return known(a - b);
        case ts.SyntaxKind.AsteriskToken: return known(a * b);
        case ts.SyntaxKind.SlashToken: return known(a / b);
        case ts.SyntaxKind.PercentToken: return known(a % b);
        case ts.SyntaxKind.AsteriskAsteriskToken: return known(a ** b);
        case ts.SyntaxKind.AmpersandAmpersandToken: return known(b);
        case ts.SyntaxKind.BarBarToken: return known(b);
        case ts.SyntaxKind.QuestionQuestionToken: return known(b);
        case ts.SyntaxKind.EqualsEqualsToken: return known(a == b); // eslint-disable-line eqeqeq
        case ts.SyntaxKind.ExclamationEqualsToken: return known(a != b); // eslint-disable-line eqeqeq
        case ts.SyntaxKind.EqualsEqualsEqualsToken: return known(a === b);
        case ts.SyntaxKind.ExclamationEqualsEqualsToken: return known(a !== b);
        case ts.SyntaxKind.LessThanToken: return known(a < b);
        case ts.SyntaxKind.GreaterThanToken: return known(a > b);
        case ts.SyntaxKind.LessThanEqualsToken: return known(a <= b);
        case ts.SyntaxKind.GreaterThanEqualsToken: return known(a >= b);
        default: return UNKNOWN;
      }
    }
    case ts.SyntaxKind.CallExpression: {
      if (!ts.isIdentifier(node.expression)) return UNKNOWN;
      const name = node.expression.text;
      if (!['Boolean', 'Number', 'String'].includes(name) || node.arguments.length > 1) return UNKNOWN;
      if (node.arguments.length === 0) return known(name === 'Boolean' ? false : name === 'Number' ? 0 : '');
      const arg = fold(node.arguments[0], depth + 1);
      if (!arg.known) return UNKNOWN;
      return known(name === 'Boolean' ? Boolean(arg.value) : name === 'Number' ? Number(arg.value) : String(arg.value));
    }
    // `new Boolean(false)` is an object, so it does not disable verification
    // (measured), and it must not fold to the primitive false.
    case ts.SyntaxKind.NewExpression:
      return known({});
    default:
      return UNKNOWN;
  }
}

const staticText = (node) => (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) ? node.text : null;

// The key a property assignment declares: `rejectUnauthorized`, `'rejectUnauthorized'`,
// `["rejectUnauthorized"]`. A computed key that is not a string literal is a
// different (unknowable) key, so it is not this one.
function declaredPropertyName(nameNode) {
  if (!nameNode) return null;
  if (ts.isComputedPropertyName(nameNode)) return staticText(nameNode.expression);
  return ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode) || ts.isNoSubstitutionTemplateLiteral(nameNode)
    ? nameNode.text
    : null;
}

// The property `x.y` or `x['y']` accesses. `x[y]` looks up the *value* of `y`,
// which is not the string name, so only a literal index counts.
function accessedPropertyName(node) {
  if (ts.isPropertyAccessExpression(node)) return node.name.text;
  if (ts.isElementAccessExpression(node)) return staticText(node.argumentExpression);
  return null;
}

const lineOf = (source, node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

// Every `rejectUnauthorized` value expression this tier read, and what it read.
// A *decided* position is recorded whether or not it disables, because a decided
// position is exactly where tier 1's spelling rule must stop applying.
function inspectTlsValues(sourceText, fileName) {
  const source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, false, scriptKindFor(fileName));
  const findings = [];
  const decided = [];
  const consider = (node, initializer) => {
    const value = fold(initializer);
    if (!value.known) return;
    decided.push([initializer.getStart(source), initializer.getEnd()]);
    // Only the boolean false disables verification: the handshake test below
    // measures 0, '0', '', null, undefined, {}, new Boolean(false) and the truthy
    // folds as NOT disabling, so flagging any of them would be wrong.
    if (value.value === false) {
      findings.push(`${initializer.getText(source)} folds to false (line ${lineOf(source, node)})`);
    }
  };
  const visit = (node) => {
    if (ts.isPropertyAssignment(node)) {
      // `{ rejectUnauthorized: value }`, quoted or computed literal key alike.
      if (declaredPropertyName(node.name) === TLS_KEY) consider(node, node.initializer);
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      // `options.rejectUnauthorized = value` / `options['rejectUnauthorized'] = value`.
      if (accessedPropertyName(node.left) === TLS_KEY) consider(node, node.right);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return { findings, decided };
}

// Blank the decided ranges, keeping every offset and line break, so the textual
// pattern can only match text no value expression claimed. split('') rather than
// [...text]: the parser's offsets count UTF-16 code units and a spread counts code
// points, so a spread would misalign every range after an emoji.
function blankRanges(text, ranges) {
  if (ranges.length === 0) return text;
  const characters = text.split('');
  for (const [start, end] of ranges) {
    for (let i = start; i < end && i < characters.length; i += 1) {
      if (characters[i] !== '\n') characters[i] = ' ';
    }
  }
  return characters.join('');
}

/**
 * The whole guard over one source: the process-wide variable wherever its name
 * appears, plus the value spelling in the positions the value tier could NOT
 * decide. A value the tier read is judged by its value, not by its spelling.
 * @param {string} sourceText
 * @param {string} fileName
 * @returns {string[]} one description per finding
 */
function guardFindings(sourceText, fileName) {
  const findings = [];
  if (processWidePattern.test(sourceText)) findings.push('NODE_TLS_REJECT_UNAUTHORIZED is named');
  if (!valueKeyPattern.test(sourceText)) return findings;
  const { findings: valueFindings, decided } = inspectTlsValues(sourceText, fileName);
  findings.push(...valueFindings);
  if (valueSpellingPattern.test(blankRanges(sourceText, decided))) {
    findings.push('rejectUnauthorized is assigned the false spelling where the value tier could not fold the expression');
  }
  return findings;
}

// The scan covers .js/.mjs/.cjs as well as TypeScript, and JSX is only JSX in a
// .jsx/.tsx file, so the parser has to be told which grammar it is reading.
function scriptKindFor(fileName) {
  if (/\.tsx$/.test(fileName)) return ts.ScriptKind.TSX;
  if (/\.jsx$/.test(fileName)) return ts.ScriptKind.JSX;
  if (/\.[cm]?js$/.test(fileName)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

// Fold a standalone expression, by parsing it in the position it would really
// appear in. Used by the tier-2 tests below.
function foldSource(expressionText) {
  const source = ts.createSourceFile('sample.ts', `const value = (${expressionText});`, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  const declaration = source.statements[0].declarationList.declarations[0];
  return fold(declaration.initializer);
}

test('repository code never bypasses TLS certificate validation', async () => {
  const files = await sourceFiles(root);
  const scanned = files.map(file => path.relative(root, file));
  // Controls on the scan itself: a walk that finds nothing, or that stops at the
  // first directory, must fail loudly rather than pass vacuously.
  assert.ok(scanned.some(file => file.startsWith('api/')), 'expected api/ to be scanned');
  assert.ok(scanned.some(file => file.startsWith('lib/')), 'expected lib/ to be scanned');
  assert.ok(scanned.some(file => !file.includes('/')), 'expected root-level code to be scanned');

  const findings = [];
  for (const filename of files) {
    const source = await readFile(filename, 'utf8');
    const relative = path.relative(root, filename);
    // The prefilter names both entry points, so it cannot hide a finding: both
    // patterns need their literal text, and the value tier can only decide a
    // property whose key is a string literal. It only avoids the call. Inside
    // guardFindings the same reasoning skips the parse of a file that names only
    // the variable.
    if (!mentionsTlsKey.test(source)) continue;
    for (const finding of guardFindings(source, filename)) findings.push(`${relative}: ${finding}`);
  }
  assert.deepEqual(findings, [], 'a TLS bypass reached the tree');
});

test('tier 1 still detects every spelling it knows, and the whole guard agrees', () => {
  const bypasses = [
    `{ rejectUnauthorized: false }`,
    `{ 'rejectUnauthorized': false }`,
    `{ "rejectUnauthorized" : false }`,
    `{ ["rejectUnauthorized"]: false }`,
    `new https.Agent({ rejectUnauthorized:!1 })`,
    `options.rejectUnauthorized = false;`,
    `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';`,
  ];
  for (const source of bypasses) {
    assert.ok(forbidden.some(pattern => pattern.test(source)), `not flagged: ${source}`);
    assert.ok(guardFindings(source, 'sample.js').length >= 1, `the whole guard lost it: ${source}`);
  }

  // Controls: these do not disable verification (measured, see above), so the
  // guard must not flag them.
  const safe = [
    `{ rejectUnauthorized: true }`,
    `{ rejectUnauthorized: 0 }`,
    `{ rejectUnauthorized: null }`,
    `{ rejectUnauthorized: process.env.TLS_ALLOW_SELF_SIGNED }`,
    `{ requestCert: true, rejectUnauthorizedHost: false }`,
    `if (options.rejectUnauthorized === false) log('verification is off');`,
  ];
  for (const source of safe) {
    assert.ok(forbidden.every(pattern => !pattern.test(source)), `wrongly flagged: ${source}`);
    assert.deepEqual(guardFindings(source, 'sample.js'), [], `the whole guard wrongly flagged: ${source}`);
  }
});

// The folder this tier is built on must agree with the engine it is standing in
// for, on every spelling in the measured set - including the ones that do NOT
// disable, which a regex over `!1` gets wrong.
test('the folder agrees with the JS engine on every measured spelling', () => {
  for (const expression of ['false', '!1', '![]', '!!0', '!10', 'Boolean(0)', '!(1)', '!0', '!1 + 1', '!NaN',
    "''", '1 - 1', 'void 0', 'null', '[]', '({})', "'0'", '0', 'true', 'Number(false)', '![] || true']) {
    const folded = foldSource(expression);
    assert.ok(folded.known, `not folded: ${expression}`);
    assert.deepEqual(folded.value, eval(expression), `folded differently from the engine: ${expression}`); // eslint-disable-line no-eval
  }
});

test('the value tier catches the golf spellings the textual tier misses', () => {
  // Each of these was measured as a real bypass (probe of 2026-10-13 against a
  // self-signed server on Node 24.21.0), and the textual tier only sees `!1`.
  const missedByText = [
    ['rejectUnauthorized: ![]', 'const agent = { rejectUnauthorized: ![] };'],
    ['rejectUnauthorized: !!0', 'const agent = { rejectUnauthorized: !!0 };'],
    ['rejectUnauthorized: !10', 'const agent = { rejectUnauthorized: !10 };'],
    ['rejectUnauthorized: Boolean(0)', 'const agent = { rejectUnauthorized: Boolean(0) };'],
    ['rejectUnauthorized: !(1)', 'const agent = { rejectUnauthorized: !(1) };'],
  ];
  for (const [label, source] of missedByText) {
    assert.ok(forbidden.every(pattern => !pattern.test(source)), `tier 1 now covers this, move it there: ${label}`);
    assert.equal(guardFindings(source, 'sample.js').length, 1, `the guard missed: ${label}`);
  }

  // Tier 2 is spelling-independent: the same value in every key and assignment form.
  const forms = [
    `const a = { rejectUnauthorized: ![] };`,
    `const a = { 'rejectUnauthorized': ![] };`,
    `const a = { "rejectUnauthorized" : !!0 };`,
    `const a = { ["rejectUnauthorized"]: !10 };`,
    `options.rejectUnauthorized = Boolean(0);`,
    `options['rejectUnauthorized'] = !(1);`,
    `new https.Agent({ rejectUnauthorized: !(1 - 1 + 1) });`,
    `new https.Agent({ rejectUnauthorized: Boolean(1 - 1) });`,
  ];
  for (const source of forms) {
    assert.equal(guardFindings(source, 'sample.js').length, 1, `the guard missed: ${source}`);
  }
});

// paul-kinlan-me-tu6. The finding was that the hand-off promised the false alarm
// on `!1 + 1` away while tier 1, unchanged, still produced it. The whole guard -
// not just the folder - is what has to let a truthy value through, so this asserts
// on guardFindings, and it is the test that fails if the superseding is removed.
test('the guard as a whole does not flag a value that keeps verification on', () => {
  const truthy = [
    `const a = { rejectUnauthorized: !1 + 1 };`,
    `const a = { rejectUnauthorized: '' + !1 };`,
    `const a = { rejectUnauthorized: !0 };`,
    `const a = { rejectUnauthorized: !NaN };`,
    `const a = { rejectUnauthorized: 0 };`,
    `const a = { rejectUnauthorized: '0' };`,
    `const a = { rejectUnauthorized: 'false' };`,
    `const a = { rejectUnauthorized: null };`,
    `const a = { rejectUnauthorized: new Boolean(false) };`,
    `const a = { rejectUnauthorized: [false] };`,
    `options.rejectUnauthorized = !1 + 1;`,
  ];
  for (const source of truthy) {
    assert.deepEqual(guardFindings(source, 'sample.js'), [], `false alarm: ${source}`);
  }
  // The first row is the reported one. Tier 1's pattern on its own still matches
  // that text - which is exactly why the value tier has to supersede it - and the
  // value really is truthy, so verification stays on.
  assert.ok(valueSpellingPattern.test(truthy[0]), 'the backstop pattern still matches this text');
  assert.equal(eval('!1 + 1'), 1); // eslint-disable-line no-eval
});

// Superseding must not become a way to switch tier 1 off. Text the value tier
// cannot read as a value keeps the textual pattern, deliberately including a
// comment that spells a bypass out.
test('tier 1 still covers text the value tier cannot read as a value', () => {
  const textualOnly = [
    `// never write rejectUnauthorized: false in this file`,
    `/* rejectUnauthorized:!1 */`,
    `const doc = 'rejectUnauthorized: false is refused by the guard';`,
    // The index is an identifier, not the string, so the key is unknowable: this
    // is not a value position and tier 1 keeps its over-approximation. It is the
    // documented false-alarm side of "a missed bypass ships", and the case that
    // shows superseding is limited to expressions this tier really read.
    `agent[rejectUnauthorized] = false;`,
  ];
  for (const source of textualOnly) {
    assert.equal(inspectTlsValues(source, 'sample.js').decided.length, 0, `not a value position: ${source}`);
    assert.equal(guardFindings(source, 'sample.js').length, 1, `tier 1 lost its coverage: ${source}`);
  }
});

test('the value tier leaves values that do not disable alone', () => {
  // Every one of these was measured as NOT disabling. Tier 1 wrongly flags
  // `!1 + 1`; tier 2 must not add the rest.
  const safe = [
    `const a = { rejectUnauthorized: true };`,
    `const a = { rejectUnauthorized: 0 };`,
    `const a = { rejectUnauthorized: '0' };`,
    `const a = { rejectUnauthorized: null };`,
    `const a = { rejectUnauthorized: undefined };`,
    `const a = { rejectUnauthorized: {} };`,
    `const a = { rejectUnauthorized: new Boolean(false) };`,
    `const a = { rejectUnauthorized: !0 };`,
    `const a = { rejectUnauthorized: !NaN };`,
    `const a = { rejectUnauthorized: !1 + 1 };`,
    `const a = { rejectUnauthorized: !void 0 };`,
    `const a = { rejectUnauthorized: process.env.TLS_ALLOW_SELF_SIGNED };`,
    `const a = { rejectUnauthorized: someFlag };`,
    `const a = { rejectUnauthorized: () => false };`,
    `options.rejectUnauthorized = true;`,
    `if (options.rejectUnauthorized === false) log('verification is off');`,
    // A computed key that is not a string literal is a different key, so it is
    // neither this property nor a value this tier can read.
    `const a = { [tlsKey]: false };`,
  ];
  for (const source of safe) {
    assert.deepEqual(guardFindings(source, 'sample.js'), [], `wrongly flagged: ${source}`);
  }
});

// The floor is documented, not hidden: a value that needs flow analysis is out of
// scope for this tier. Two things are pinned here. First, the tier must not
// guess - a guessed finding on a dynamic value would be as wrong as a miss.
// Second, these are real holes in BOTH tiers, and the assertions below fail if
// one is ever closed, so the comment cannot rot into a false claim of coverage
test('the value tier does not guess at values it cannot fold', () => {
  const dynamic = [
    `const off = false; const a = { rejectUnauthorized: off };`,
    `const a = { rejectUnauthorized: process.env.X };`,
    `const a = { rejectUnauthorized: Boolean(process.env.X) };`,
    `const a = { rejectUnauthorized: [false][0] };`,
    `const a = { rejectUnauthorized: (() => false)() };`,
    `const a = { rejectUnauthorized: flag && false };`,
  ];
  for (const source of dynamic) {
    assert.deepEqual(inspectTlsValues(source, 'sample.js').findings, [], `tier 2 guessed: ${source}`);
    assert.deepEqual(guardFindings(source, 'sample.js'), [], `the whole guard guessed: ${source}`);
    // KNOWN GAP: tier 1 does not see this either - it only knows the name
    // pattern, and none of these spell `false` or `!1`. Flow-sensitive analysis
    // (a value carried through a variable, a call or an index) is what neither
    // tier does; moving any of these to a covered test is the signal to widen
    // the scope and delete this assertion.
    assert.ok(forbidden.every(pattern => !pattern.test(source)), `tier 1 now covers this - widen the tiers and update the comment: ${source}`);
  }
});

// The flag list is a claim about TLS behaviour, so the guard re-measures it: one
// real handshake per spelling against a self-signed server. `agent: false` plus a
// per-case TCP-accept counter is what makes each case independent - Node's default
// keep-alive agent (on since Node 19) otherwise answers a case from a socket an
// earlier case opened, which is how the first probe of this work wrongly reported
// `new Boolean(false)` as a bypass.
const opensslAvailable = (() => {
  try {
    execFileSync('openssl', ['version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

// [expression, does it disable certificate verification?] - every row measured on
// Node 24.21.0 by this probe on 2026-10-13. Only the boolean false disables.
const measuredHandshakes = [
  ['false', true], ['!1', true], ['![]', true], ['!!0', true], ['!10', true],
  ['Boolean(0)', true], ['!(1)', true],
  ['true', false], ['0', false], ["'0'", false], ["'false'", false], ['null', false],
  ['undefined', false], ["''", false], ['{}', false], ['new Boolean(false)', false],
  ['!0', false], ['!NaN', false], ['!void 0', false], ['1 - 1', false],
  ['!1 + 1', false], ["'' + !1", false], ['[false]', false], ['!1 || true', false],
];

test('real handshakes: the measured disabling values are the flagged ones', {
  timeout: 20_000,
  skip: opensslAvailable ? false : 'openssl is not installed, so this probe cannot generate a self-signed certificate; the fold-vs-engine test above still runs everywhere',
}, async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tls-guard-'));
  let server;
  try {
    const key = join(directory, 'key.pem');
    const certificate = join(directory, 'cert.pem');
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-keyout', key, '-out', certificate,
      '-days', '1', '-nodes', '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost'], { stdio: 'ignore' });

    let connections = 0;
    server = https.createServer({ key: readFileSync(key), cert: readFileSync(certificate) }, (_request, response) => response.end('ok'));
    server.on('connection', () => { connections += 1; });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;

    for (const [expression, disables] of measuredHandshakes) {
      const value = eval(expression); // eslint-disable-line no-eval
      const before = connections;
      const outcome = await new Promise((resolve) => {
        const request = https.request(
          // agent: false -> this case gets its own connection, whatever ran before.
          { host: '127.0.0.1', port, path: '/', method: 'GET', agent: false, rejectUnauthorized: value },
          (response) => { response.resume(); response.on('end', () => resolve('verified')); },
        );
        request.on('error', (error) => resolve(error.code));
        request.end();
      });

      assert.equal(connections - before, 1, `case ${expression} did not open its own connection`);
      assert.equal(outcome === 'verified', disables, `${expression}: expected ${disables ? 'the handshake to succeed' : 'a rejected certificate'}, got ${outcome}`);
      // And the guard agrees with the handshake, which is the whole point: what
      // disables is a finding, what does not must not be one.
      assert.equal(
        guardFindings(`const agent = { rejectUnauthorized: ${expression} };`, 'sample.js').length > 0,
        disables,
        `the guard disagrees with the handshake for ${expression}`,
      );
    }
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    rmSync(directory, { recursive: true, force: true });
  }
});
