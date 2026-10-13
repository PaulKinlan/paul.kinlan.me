import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
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

// TIER 1 - textual. A certificate check is only actually disabled by the literal
// false (or the minified !1). Measured here against Node 24.21.0 with a
// self-signed TLS server, one connection per case (`agent: false`, because the
// default keep-alive agent answers a case from an earlier case's socket): false,
// !1, ![], !!0, !10, Boolean(0) and !(1) all disable; 0, '0', null, undefined,
// '', {} and new Boolean(false) all still FAIL the handshake, so flagging those
// spellings would make this guard wrong, not safe.
// Matching is textual, so a comment that spells a bypass out is flagged too. That
// way round is deliberate: a false alarm is a one-line edit, a missed bypass ships.
const forbidden = [
  // Node reads this variable as the string '0' and disables verification process-wide.
  /NODE_TLS_REJECT_UNAUTHORIZED/,
  // Every spelling of the key: rejectUnauthorized: false, 'rejectUnauthorized': false,
  // "rejectUnauthorized" : false, ['rejectUnauthorized']: false, rejectUnauthorized:!1,
  // options.rejectUnauthorized = false (the reviewed tip missed the quoted,
  // computed and assignment forms - repro A).
  /["'`]?rejectUnauthorized["'`]?\s*\]?\s*[:=]\s*(?:false|!1)\b/,
];

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

// TIER 2 - the value position, constant-folded (paul-kinlan-me-07h).
//
// Tier 1 can only recognise the value spellings someone wrote into a regex, so
// `rejectUnauthorized: ![]`, `!!0`, `!10`, `Boolean(0)` and `!(1)` - all measured
// above as real bypasses - reach the tree unflagged, and a truthy spelling that
// happens to contain `!1` (`!1 + 1`) is flagged wrongly. The value a property is
// assigned is an expression, not a string, so this tier parses it and folds it
// with JS semantics: whatever folds to the boolean false disables verification,
// however it is spelled (quoted, computed, assignment, `Object.assign` value).
//
// It is a floor, not a proof. A value that depends on a variable, a call into
// code we cannot see, or a dynamic lookup is left alone, so tier 1 stays in
// place as the backstop that flags the *name* however the value is composed.
//
// COST: measured on 2026-10-13 by running this suite against the previous guard
// on the same machine, back to back: 808 ms -> 1078 ms for the file (+270 ms for
// the typescript import and four extra tests), on a fast gate that takes ~36 s.
// The walk itself parses nothing unless a file names the key - the prefilter sees
// 0 of the tree's 107 files - so on a clean tree the scan costs the same as it did.
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

// Only the boolean false disables verification (measured, see tier 1).
function disablesVerification(initializer) {
  const value = fold(initializer);
  return value.known && value.value === false;
}

const lineOf = (source, node) => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;

/**
 * Every place in `sourceText` where a statically-known `rejectUnauthorized`
 * property is assigned a value that folds to false.
 * @param {string} sourceText
 * @param {string} fileName
 * @returns {string[]} one description per finding
 */
function disablingTlsValues(sourceText, fileName) {
  const source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, false, scriptKindFor(fileName));
  const findings = [];
  const record = (node, initializer) => {
    findings.push(`rejectUnauthorized = ${initializer.getText(source)} folds to false (line ${lineOf(source, node)})`);
  };
  const visit = (node) => {
    if (ts.isPropertyAssignment(node)) {
      // `{ rejectUnauthorized: value }`, quoted or computed key alike.
      if (declaredPropertyName(node.name) === TLS_KEY && disablesVerification(node.initializer)) record(node, node.initializer);
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      // `options.rejectUnauthorized = value` / `options['rejectUnauthorized'] = value`.
      if (accessedPropertyName(node.left) === TLS_KEY && disablesVerification(node.right)) record(node, node.right);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
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
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, relative);
    }
    // Tier 2 runs only on files that name the key at all. Everything this tier
    // can see is a property whose key is a string literal, so a finding it would
    // make is impossible in a file that does not contain that literal: the
    // prefilter cannot hide a finding, it only avoids the parse.
    if (mentionsTlsKey.test(source)) {
      findings.push(...disablingTlsValues(source, filename).map(finding => `${relative}: ${finding}`));
    }
  }
  assert.deepEqual(findings, [], 'a rejectUnauthorized value that folds to false reached the tree');
});

test('the guard detects every spelling of a disabled certificate check', () => {
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
    assert.equal(disablingTlsValues(source, 'sample.js').length, 1, `tier 2 missed: ${label}`);
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
    assert.equal(disablingTlsValues(source, 'sample.js').length, 1, `tier 2 missed: ${source}`);
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
    // A computed key that is not a string literal is a different key, and an
    // identifier index looks up a value: neither is this property.
    `const a = { [tlsKey]: false };`,
    `agent[rejectUnauthorized] = false;`,
  ];
  for (const source of safe) {
    assert.deepEqual(disablingTlsValues(source, 'sample.js'), [], `wrongly flagged: ${source}`);
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
    assert.deepEqual(disablingTlsValues(source, 'sample.js'), [], `tier 2 guessed: ${source}`);
    // KNOWN GAP: tier 1 does not see this either - it only knows the name
    // pattern, and none of these spell `false` or `!1`. Flow-sensitive analysis
    // (a value carried through a variable, a call or an index) is what neither
    // tier does; moving any of these to a covered test is the signal to widen
    // the scope and delete this assertion.
    assert.ok(forbidden.every(pattern => !pattern.test(source)), `tier 1 now covers this - widen the tiers and update the comment: ${source}`);
  }
});
