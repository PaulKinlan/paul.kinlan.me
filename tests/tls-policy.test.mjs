import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import https from 'node:https';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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

// A certificate check is only actually disabled by the literal false (or the
// minified !1). Measured here against Node 24 with a self-signed TLS server:
// rejectUnauthorized 0, '0', null and undefined all still FAIL the handshake, so
// flagging those spellings would make this guard wrong, not safe.
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

test('repository code never bypasses TLS certificate validation', async () => {
  const files = await sourceFiles(root);
  const scanned = files.map(file => path.relative(root, file));
  // Controls on the scan itself: a walk that finds nothing, or that stops at the
  // first directory, must fail loudly rather than pass vacuously.
  assert.ok(scanned.some(file => file.startsWith('api/')), 'expected api/ to be scanned');
  assert.ok(scanned.some(file => file.startsWith('lib/')), 'expected lib/ to be scanned');
  assert.ok(scanned.some(file => !file.includes('/')), 'expected root-level code to be scanned');

  for (const filename of files) {
    const source = await readFile(filename, 'utf8');
    for (const pattern of forbidden) {
      assert.doesNotMatch(source, pattern, path.relative(root, filename));
    }
  }
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

// ---------------------------------------------------------------------------
// TIER 2: a narrow syntax whitelist (paul-kinlan-me-07h)
//
// Tier 1 is textual: it matches the spelling `false` (or `!1`) next to the key,
// wherever that appears. Measured against Node 24 with the self-signed server in
// the handshake test below, these all spell the same value and tier 1 sees none
// of them: `![]`, `!!0`, `!10`, `!(1)`. These spell something else, so this tier
// must not claim them: `0`, `true`, `!0`, `!1 + 1`, `'0'`. (Tier 1's existing
// false alarm on `!1 + 1` is kept, not masked - see the test below it.)
//
// A general constant folder was tried twice and failed cross-family review twice
// (paul-kinlan-me-dva, paul-kinlan-me-tu6): folding is only sound when every
// operator is modelled, and `new Boolean(false)` - an object the engine prints as
// 'false' and the TLS option refuses - shows how easily that model drifts. So
// this tier is neither a folder nor an evaluator. It reads one fact, the
// truthiness of a literal, and it reports one thing: a property or an assignment
// to the key whose whole right-hand side is, by the language spec and whatever is
// bound in scope, the primitive boolean `false`. Falsy is not enough - `0`, `''`
// and `null` are falsy and disable nothing - so the whitelist is a boolean
// literal, a numeric literal, an empty array literal, a parenthesised form, and a
// chain of unary `!` over those; a chain is read only as far as its literals make
// its truthiness certain.
//
// Everything else is UNKNOWN and unreported: calls (`Boolean(0)` is a real
// disable this tier does not claim), `new`, `==`, arithmetic (`!1 + 1`), string
// literals, BigInt literals, identifiers and variable flow, dynamic keys, a
// source the parser rejects. UNKNOWN is not a clean bill of health: this tier
// only ever adds findings, so the guard is the union of the two tiers and a
// tier-1 finding is never cleared by this one.
//
// Key text is compared after the parser has decoded escapes, so
// `['reject\u0055nauthorized']` and `o.reject\u0055nauthorized = x` are the key
// (a cross-family review found that the walk's prefilter used to skip such a
// file before the parser ever saw it). The one spelling this cannot read is a
// legacy octal escape, `['\162ejectUnauthorized']`: the parser's decoded text for
// it is not what the runtime produces, so the tier deliberately does not guess.
// That case is pinned in the tests, and tier 1 is equally blind to it.
const keyText = 'rejectUnauthorized';
const TRUTHY = 'truthy';
const FALSY = 'falsy';
const UNKNOWN = 'unknown';

let parser;
async function tsModule() {
  // typescript is the only parser already in the tree that reads .js, .mjs and
  // .ts (the repo's api/ handlers). Compiling it costs ~0.4s, which is real money
  // in a gate that runs on every change, so it is loaded on first use: the
  // repository walk pays nothing today, because no source file names the key.
  parser ??= import('typescript').then(module => module.default ?? module);
  return parser;
}

// The repository walk parses a file only when it could name the key at all, and
// this test is sound rather than a guess: to name `rejectUnauthorized` a source
// either writes the letters out - and then it contains 'reject' - or it hides at
// least one of them behind an escape, and every escape, whatever its family
// (\uXXXX, \u{...}, \xXX, a legacy octal, a line continuation, ...) contains a
// backslash. There is no third way: an escape that produced a letter without a
// backslash would have to be an identity escape, and `"\j"` is a syntax error
// (Node: "Invalid Unicode escape sequence"), while a key assembled at runtime is
// not a statically named key and neither tier reads it. Enumerating the escape
// families instead of asking for the backslash was a review finding: the list
// missed line continuations written as U+2028/U+2029. This test is what keeps the
// parser off the majority of the 107 scanned files.
const couldNameKey = /reject|Unauthorized|\\/;

// The truthiness of an expression, when the spec fixes it no matter what is bound
// in scope - the only fact a `!` needs to fold. Numeric literals are read by
// value (0 and 0x0 are falsy, 10 is not); an empty array literal is truthy.
function truthiness(ts, node) {
  if (ts.isParenthesizedExpression(node)) return truthiness(ts, node.expression);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken) {
    const operand = truthiness(ts, node.operand);
    if (operand === UNKNOWN) return UNKNOWN;
    return operand === TRUTHY ? FALSY : TRUTHY;
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return TRUTHY;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return FALSY;
  if (ts.isNumericLiteral(node)) return Number(node.text.replaceAll('_', '')) === 0 ? FALSY : TRUTHY;
  if (ts.isArrayLiteralExpression(node)) return node.elements.length === 0 ? TRUTHY : UNKNOWN;
  return UNKNOWN;
}

// Does this expression produce the primitive boolean false? That is the only
// value this option reads as "do not verify": a falsy 0, '' or null is not it
// (measured, see the handshake test), so falsiness alone is not the question.
function isFalse(ts, node) {
  if (ts.isParenthesizedExpression(node)) return isFalse(ts, node.expression);
  if (node.kind === ts.SyntaxKind.FalseKeyword) return true;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken) {
    return truthiness(ts, node.operand) === TRUTHY;
  }
  return false;
}

// True in a KEY NAME or a DOT access, where an identifier IS the key text: `{`
// rejectUnauthorized: x }` and `o.rejectUnauthorized = x` both name the option,
// quoted or not.
function namesKey(ts, name) {
  if (ts.isStringLiteralLike(name)) return name.text === keyText;
  return ts.isIdentifier(name) && name.text === keyText;
}

// True in a COMPUTED name or an element-access argument, where only a literal
// names the key: `{ [rejectUnauthorized]: false }` and `o[rejectUnauthorized]`
// name whatever the binding holds, so they are a dynamic key and not this key,
// even when the variable is spelled exactly like the option. Reading the
// identifier there was a false alarm on the previous tip of this branch - a
// cross-family review found it with a variable named `rejectUnauthorized`.
function literalNamesKey(ts, expression) {
  if (ts.isParenthesizedExpression(expression)) return literalNamesKey(ts, expression.expression);
  return ts.isStringLiteralLike(expression) && expression.text === keyText;
}

// Every right-hand side in `source` that is assigned to the key and is provably
// the primitive false, as source text so a failure names the spelling that did
// it. ADR e6s pins a source the parser rejects as UNKNOWN, so a file with parse
// diagnostics is not read at all: readings taken from a tree the parser only
// guessed at are the drift the two earlier candidates were failed for. The cost
// is a file that is valid JavaScript but uses syntax this parser (typescript,
// pinned in devDependencies) cannot read - skipped rather than misread, with the
// tier-1 regexes still running over it.
function readSpellings(ts, source, filename = 'probe.ts') {
  // The walk feeds .js, .mjs, .cjs, .ts and .mts today; all of them are read the
  // same way. Only JSX needs a different kind, and reading it as TS would parse
  // the markup as a type assertion, so the extension decides.
  const kind = /\.[jt]sx$/.test(filename) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, false, kind);
  if (file.parseDiagnostics.length > 0) return [];
  const spellings = [];
  const visit = (node) => {
    let value;
    if (ts.isPropertyAssignment(node)) {
      const name = node.name;
      if (ts.isComputedPropertyName(name) ? literalNamesKey(ts, name.expression) : namesKey(ts, name)) {
        value = node.initializer;
      }
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      if (ts.isPropertyAccessExpression(node.left) && namesKey(ts, node.left.name)) value = node.right;
      if (ts.isElementAccessExpression(node.left) && literalNamesKey(ts, node.left.argumentExpression)) value = node.right;
    }
    if (value !== undefined && isFalse(ts, value)) {
      spellings.push(source.slice(value.getStart(file), value.end));
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(file, visit);
  return spellings;
}

// Tier 1 is deliberately untouched by this bead, false alarm included: the guard
// is allowed to over-report and never to under-report, so tier 2 adds findings
// and clears none.
test('tier 1 keeps every finding, and its documented false alarm, exactly as it was', () => {
  const stillFlagged = [
    `{ rejectUnauthorized: false }`,
    `{ 'rejectUnauthorized': false }`,
    `{ ["rejectUnauthorized"]: false }`,
    `options.rejectUnauthorized = false;`,
    `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';`,
    // A comment that spells a bypass out is flagged on purpose - a one-line edit
    // if it is a false alarm, while a missed bypass ships.
    `// never set rejectUnauthorized: false in production`,
    // `!1 + 1` is 1, which disables nothing, so this one is a false alarm. It is
    // kept, not masked: the ADR forbids narrowing tier 1 to cover tier 2's gap.
    `{ rejectUnauthorized: !1 + 1 }`,
  ];
  for (const source of stillFlagged) {
    assert.ok(forbidden.some(pattern => pattern.test(source)), `tier 1 stopped flagging: ${source}`);
  }
});

test('the syntax whitelist claims only expressions that are the primitive false', async () => {
  const ts = await tsModule();
  // Parenthesised so the parser reads an object literal: a bare `{ ... }` in
  // statement position is a block, which would make these pass without testing
  // anything.
  const claimed = [
    `({ rejectUnauthorized: false })`,
    `({ 'rejectUnauthorized': false })`,
    `({ ["rejectUnauthorized"]: false })`,
    `({ [\`rejectUnauthorized\`]: false })`,
    `new https.Agent({ rejectUnauthorized: !1 })`,
    `options.rejectUnauthorized = false;`,
    `options['rejectUnauthorized'] = false;`,
    // The four spellings tier 1 cannot see, all measured to disable verification
    // in the handshake test below.
    `({ rejectUnauthorized: ![] })`,
    `({ rejectUnauthorized: !!0 })`,
    `({ rejectUnauthorized: !10 })`,
    `({ rejectUnauthorized: !(1) })`,
    // A literal behind a computed name is still a literal naming the key.
    `({ [('rejectUnauthorized')]: ![] })`,
    // The same key with the letters hidden behind escapes: the parser decodes
    // them, and the prefilter catches the escape instead of the letters.
    `({ ["reject\\u0055nauthorized"]: ![] })`,
    `({ ['rejectUnautho\\u0072ized']: ![] })`,
    `({ ["\\u0072ejectUnauthorized"]: ![] })`,
    `({ ["reject\\x55nauthorized"]: ![] })`,
    // A line continuation may be U+2028/U+2029, not only \n or \r\n: the parser
    // decodes it, and the prefilter sees the backslash whatever the family.
    `({ ["re\\${'\u2028'}jectUna\\${'\u2028'}uthorized"]: ![] })`,
    `o.reject\\u0055nauthorized = ![];`,
  ];
  for (const source of claimed) {
    // This is what makes the repository walk's prefilter sound: every form this
    // tier can read either spells the key out or carries the escape that hides
    // it, so skipping a file cannot hide a finding.
    assert.ok(couldNameKey.test(source), `a spelling the prefilter would skip: ${source}`);
    assert.equal(readSpellings(ts, source).length, 1, `not claimed: ${source}`);
  }

  const unclaimed = [
    `({ rejectUnauthorized: true })`,
    `({ rejectUnauthorized: 0 })`, // a falsy number is not the primitive false
    `({ rejectUnauthorized: !0 })`, // true
    `({ rejectUnauthorized: !1 + 1 })`, // arithmetic; 1
    `({ rejectUnauthorized: 1 - 1 })`,
    `({ rejectUnauthorized: '0' })`,
    `({ rejectUnauthorized: Boolean(0) })`, // a real disable, outside the whitelist
    `({ rejectUnauthorized: new Boolean(false) })`,
    `({ rejectUnauthorized: value != false })`,
    `({ rejectUnauthorized: process.env.TLS_ALLOW_SELF_SIGNED })`,
    `({ rejectUnauthorized: !void 0 })`,
    `({ rejectUnauthorized: !!0n })`, // BigInt: a blind spot, not a claim
    `({ rejectUnauthorized: [1] })`,
    `({ [key]: false })`, // a dynamic key is not this key
    `({ [value + 'Auth']: false })`,
    // A legacy octal escape is the one spelling this tier cannot read: the
    // parser's decoded text ('162ejectUnauthorized') is not the runtime key
    // ('rejectUnauthorized' in sloppy mode), so it is not guessed at. Pinned so
    // the header comment cannot rot; tier 1 is textual and equally blind, and in
    // a module this expression is a syntax error rather than a loaded bypass.
    `({ ["\\162ejectUnauthorized"]: ![] })`,
    // ... even when the variable is spelled like the option: a computed key names
    // whatever the binding holds (the false alarm found on the previous tip).
    `({ [rejectUnauthorized]: ![] })`,
    `o[rejectUnauthorized] = ![];`,
    `({ [('key')]: false })`,
    `({ requestCert: true, rejectUnauthorizedHost: false })`,
    `if (options.rejectUnauthorized === false) log('verification is off');`,
    // ADR e6s: a source the parser rejects is UNKNOWN, so nothing is read from a
    // file with a syntax error - not even a readable bypass beside the typo. The
    // two earlier candidates were failed for reading a tree the parser had only
    // guessed at; the tier-1 regexes still run over such a file.
    `({ rejectUnauthorized: ![] }); const x = (`,
    `const x = (`,
  ];
  for (const source of unclaimed) {
    assert.deepEqual(readSpellings(ts, source), [], `wrongly claimed: ${source}`);
  }
});

test('repository code never disables certificate validation through a spelling tier 1 cannot see', async () => {
  const files = await sourceFiles(root);
  const scanned = files.map(file => path.relative(root, file));
  // The same controls tier 1 has: a walk that finds nothing, or that stops at the
  // first directory, fails loudly instead of passing vacuously.
  assert.ok(scanned.some(file => file.startsWith('api/')), 'expected api/ to be scanned');
  assert.ok(scanned.some(file => file.startsWith('lib/')), 'expected lib/ to be scanned');
  assert.ok(scanned.some(file => !file.includes('/')), 'expected root-level code to be scanned');

  const findings = [];
  for (const filename of files) {
    const source = await readFile(filename, 'utf8');
    // The prefilter (see couldNameKey): a file that cannot name the key has
    // nothing to find, and no file among the 107 does, so this tier costs only
    // the parse of the ones carrying a backslash or the word 'reject' - which a
    // cross-family review twice caught the earlier enumerations of escapes
    // missing (a unicode-escaped key, then a U+2028 line continuation).
    if (!couldNameKey.test(source)) continue;
    const ts = await tsModule();
    for (const spelling of readSpellings(ts, source, path.relative(root, filename))) {
      findings.push(`${path.relative(root, filename)}: rejectUnauthorized: ${spelling}`);
    }
  }
  assert.deepEqual(findings, [], findings.join('\n'));
});

test('the whitelist and a real TLS handshake agree about which values disable verification', async (t) => {
  // A self-signed certificate, minted per run: no key material in the repository
  // and no expiry date to rot. openssl is the only way to mint an X.509 cert from
  // the stdlib, and EC P-256 keeps it at ~10ms.
  const dir = await mkdtemp(path.join(tmpdir(), 'tls-policy-'));
  const key = path.join(dir, 'key.pem');
  const cert = path.join(dir, 'cert.pem');
  t.after(() => rm(dir, { recursive: true, force: true }));
  execFileSync('openssl', ['req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:P-256',
    '-nodes', '-keyout', key, '-out', cert, '-days', '2', '-subj', '/CN=localhost'], { stdio: 'ignore' });

  const server = https.createServer({ key: await readFile(key), cert: await readFile(cert) },
    (request, response) => response.end('ok'));
  let handshakes = 0;
  server.on('secureConnection', () => { handshakes += 1; });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const port = server.address().port;

  // Every request gets its own connection (agent: false) and the server counts
  // the handshakes, so a case can never be answered from the previous case's
  // socket. The first version of this probe was wrong for exactly that reason:
  // Node 19+ keep-alive handed a rejected case an earlier bypass's socket.
  const attempt = value => new Promise((resolve) => {
    const request = https.request({ host: '127.0.0.1', port, rejectUnauthorized: value, agent: false, timeout: 5000 },
      (response) => { response.resume(); response.on('end', () => resolve('tls')); });
    request.on('timeout', () => request.destroy(new Error('timeout')));
    request.on('error', error => resolve(error.code ?? error.message));
    request.end();
  });

  // [what it is, the code, does tier 2 read it, does it actually disable verification]
  // One declaration per spelling: the tier parses the source text of the arrow
  // function and the engine runs the arrow function, so the two can never
  // describe different code.
  const spellings = [
    ['false', () => ({ rejectUnauthorized: false }), true, true],
    ['!1', () => ({ rejectUnauthorized: !1 }), true, true],
    ['![]', () => ({ rejectUnauthorized: ![] }), true, true],
    ['!!0', () => ({ rejectUnauthorized: !!0 }), true, true],
    ['!10', () => ({ rejectUnauthorized: !10 }), true, true],
    ['!(1)', () => ({ rejectUnauthorized: !(1) }), true, true],
    ['(!!0)', () => ({ rejectUnauthorized: (!!0) }), true, true],
    // A real disable outside the whitelist, pinned here so the header comment
    // cannot rot into a claim that this tier covers every process-wide disable.
    ['Boolean(0)', () => ({ rejectUnauthorized: Boolean(0) }), false, true],
    ['0', () => ({ rejectUnauthorized: 0 }), false, false],
    ['true', () => ({ rejectUnauthorized: true }), false, false],
    ['!0', () => ({ rejectUnauthorized: !0 }), false, false],
    ['!1 + 1', () => ({ rejectUnauthorized: !1 + 1 }), false, false],
    ['1 - 1', () => ({ rejectUnauthorized: 1 - 1 }), false, false],
    [`'0'`, () => ({ rejectUnauthorized: '0' }), false, false],
    ['new Boolean(false)', () => ({ rejectUnauthorized: new Boolean(false) }), false, false],
    ['omitted', () => ({ requestCert: true }), false, false],
  ];

  for (const [label, spelling, reads, disables] of spellings) {
    const claims = readSpellings(await tsModule(), spelling.toString()).length > 0;
    assert.equal(claims, reads, `${label}: tier 2 ${claims ? 'read' : 'did not read'} the value`);
    // A claim that is wrong sends someone to edit a file that is fine, and enough
    // of those turn the guard off altogether - so a claim must be a real disable.
    if (claims) assert.equal(disables, true, `${label}: tier 2 claimed a value that disables nothing`);

    const before = handshakes;
    const outcome = await attempt(spelling().rejectUnauthorized);
    const connected = outcome === 'tls';
    assert.equal(handshakes - before, connected ? 1 : 0, `${label}: each case must open its own connection`);
    assert.equal(connected, disables,
      `${label}: the handshake ${connected ? 'completed' : `failed (${outcome})`}, so this value ${connected ? 'does' : 'does not'} disable verification`);
  }
});
