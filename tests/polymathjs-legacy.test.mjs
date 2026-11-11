// Regression test for the legacy /api/polymath.js route (paul-kinlan-me-pwk1).
//
// The POST branch used to read `await request.formData()` - a binding that
// does not exist in a Vercel Node handler - so every POST died with a
// ReferenceError before any work. This suite drives the POST branch with a
// real multipart stream through the same esbuild bundling the other handler
// suites use, and asserts the parse contract matches the live sibling
// (api/polymath/ask.ts): multipart required, bounds enforced, query required,
// extra fields forwarded. The @polymath-ai/client is stubbed at the ask()
// boundary; multiparty itself is real. Run with:
// node --test tests/polymathjs-legacy.test.mjs
import { strict as assert } from 'node:assert';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { test } from 'node:test';

import { build } from 'esbuild';

const CLIENT_STUB = `
export class Polymath {
  constructor(options) { globalThis.__polymathLegacy.calls.push(['ctor', options]); }
  async ask(query, options) {
    globalThis.__polymathLegacy.calls.push(['ask', query, options]);
    if (globalThis.__polymathLegacy.failAsk) throw new Error('ask failed');
    // The REAL library returns { error } instead of throwing (paul-kinlan-me-e805).
    if (globalThis.__polymathLegacy.askError) return { error: globalThis.__polymathLegacy.askError };
    return { bits: () => ['bit-1', 'bit-2'] };
  }
  async completion(query) {
    globalThis.__polymathLegacy.calls.push(['completion', query]);
    if (globalThis.__polymathLegacy.completionError) return { error: globalThis.__polymathLegacy.completionError };
    return { completion: query };
  }
}
`;

// An AxiosError-shaped failure, the way openai@3.2.1 reports a 429. toJSON() is
// what res.send() serialises, and it includes config.headers - the bearer key.
const BEARER_SECRET = 'sk-test-DEADBEEF-not-a-real-key';
const axiosFailure = () => {
  const error = new Error('Request failed with status code 429');
  error.status = 429;
  error.config = { headers: { Authorization: `Bearer ${BEARER_SECRET}` } };
  error.toJSON = () => ({
    message: error.message,
    status: error.status,
    config: error.config,
    request: { path: '/v1/completions' }
  });
  return error;
};

const buildHandler = async () => {
  const dir = mkdtempSync(join(tmpdir(), 'polymath-legacy-'));
  const built = await build({
    entryPoints: [new URL('../api/polymath.js', import.meta.url).pathname],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    // multiparty's dependency tree lazy-requires node builtins (depd -> fs);
    // give the ESM bundle a working require so those keep resolving.
    banner: { js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);" },
    plugins: [{
      name: 'polymath-legacy-stubs',
      setup(plugin) {
        plugin.onResolve({ filter: /^@polymath-ai\/client$/ }, () => ({ path: 'client', namespace: 'stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ loader: 'js', contents: CLIENT_STUB }));
      }
    }]
  });
  const file = join(dir, 'handler.mjs');
  writeFileSync(file, built.outputFiles[0].contents);
  const { default: handler } = await import(`file://${file}`);
  return { handler, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

// A minimal IncomingMessage-shaped request: multiparty reads .headers and the
// stream body; the handler reads .method/.query.
const streamRequest = (body, headers = {}, extra = {}) => {
  const req = Readable.from([Buffer.from(body)]);
  req.headers = headers;
  Object.assign(req, extra);
  return req;
};

const mockResponse = () => ({
  statusCode: 0,
  contentType: undefined,
  body: undefined,
  send(value) { this.body = value; return this; },
  status(code) { this.statusCode = code; return this; }
});

const multipartBody = (fields) => {
  const boundary = '----pwk1boundary';
  const parts = Object.entries(fields).map(([name, value]) =>
    `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
  ).join('');
  return {
    body: `${parts}--${boundary}--\r\n`,
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` }
  };
};

// A single file part. maxFilesSize: 1 only aborts files larger than one byte,
// so 0- or 1-byte parts are spooled to os.tmpdir() by the parser.
const multipartFileBody = (filename, value) => {
  const boundary = '----ms52boundary';
  return {
    body: `--${boundary}\r\nContent-Disposition: form-data; name="upload"; filename="${filename}"\r\n` +
      `Content-Type: text/plain\r\n\r\n${value}\r\n--${boundary}--\r\n`,
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` }
  };
};

test('legacy /api/polymath.js POST parses multipart, forwards fields, and never hits the old ReferenceError', async () => {
  const { handler, cleanup } = await buildHandler();
  globalThis.__polymathLegacy = { calls: [] };
  try {
    // The documented shape: query + extra fields, both reach ask().
    const { body, headers } = multipartBody({ query: 'What are web intents?', answerCount: '3' });
    const res = mockResponse();
    await handler(streamRequest(body, headers, { method: 'POST' }), res);
    assert.deepEqual(res.body, { bits: ['bit-1', 'bit-2'] });
    assert.deepEqual(globalThis.__polymathLegacy.calls.at(-1),
      ['ask', 'What are web intents?', { answerCount: ['3'] }],
      'query is forwarded as the query, other multipart fields as options');

    // A missing query is the caller's error, not a crash.
    const missing = mockResponse();
    const missingBody = multipartBody({ answerCount: '3' });
    await handler(streamRequest(missingBody.body, missingBody.headers, { method: 'POST' }), missing);
    assert.equal(missing.statusCode, 400);
    assert.match(missing.body.error, /Missing query/);

    // A non-multipart POST is refused by the parser with 400.
    const notMultipart = mockResponse();
    await handler(streamRequest('query=hi', { 'content-type': 'application/json' }, { method: 'POST' }), notMultipart);
    assert.equal(notMultipart.statusCode, 400);
    assert.match(notMultipart.body.error, /unsupported content-type/i);

    // Missing content-type header is also refused by the parser with 400.
    const missingCt = mockResponse();
    await handler(streamRequest('query=hi', {}, { method: 'POST' }), missingCt);
    assert.equal(missingCt.statusCode, 400);
    assert.match(missingCt.body.error, /missing content-type/i);

    // A truncated multipart body is a 400 from the parser, not a hang or a 500.
    const truncated = multipartBody({ query: 'x' });
    const cut = mockResponse();
    await handler(streamRequest(truncated.body.slice(0, 10), truncated.headers, { method: 'POST' }), cut);
    assert.equal(cut.statusCode, 400);

    // The empty value case is still a query-less 400.
    const empty = multipartBody({ query: '' });
    const emptyRes = mockResponse();
    await handler(streamRequest(empty.body, empty.headers, { method: 'POST' }), emptyRes);
    assert.equal(emptyRes.statusCode, 400);
  } finally {
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});

test('legacy /api/polymath.js rejects tiny file parts and leaves no temp file behind (paul-kinlan-me-ms52)', async () => {
  const { handler, cleanup } = await buildHandler();
  globalThis.__polymathLegacy = { calls: [] };
  // multiparty resolves os.tmpdir() when the Form is constructed, so pointing
  // TMPDIR at a private directory turns the residue check into an exact
  // assertion instead of a whole-machine directory diff.
  const uploadDir = mkdtempSync(join(tmpdir(), 'polymath-legacy-uploads-'));
  const previousTmpdir = process.env.TMPDIR;
  process.env.TMPDIR = uploadDir;
  try {
    // Both parts fit under maxFilesSize: 1, so the parse succeeds and the only
    // thing standing between the caller and a leaked temp file is the handler.
    for (const value of ['', '1']) {
      const { body, headers } = multipartFileBody('tiny.txt', value);
      const res = mockResponse();
      await handler(streamRequest(body, headers, { method: 'POST' }), res);
      assert.equal(res.statusCode, 400, `${Buffer.byteLength(value)}-byte file part is rejected with 400`);
      assert.deepEqual(res.body, { error: 'File uploads are not supported.' },
        'the contract matches the live sibling (api/polymath/ask.ts)');
      assert.deepEqual(readdirSync(uploadDir), [],
        'the spooled temp file is unlinked, not left behind in os.tmpdir()');
    }
    assert.deepEqual(globalThis.__polymathLegacy.calls.filter(([kind]) => kind === 'ask'), [],
      'an upload never reaches the paid ask() call');
  } finally {
    if (previousTmpdir === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = previousTmpdir;
    rmSync(uploadDir, { recursive: true, force: true });
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});

test('legacy /api/polymath.js POST accepts case-variant multipart Content-Type headers (RFC 2045 5.1)', async () => {
  const { handler, cleanup } = await buildHandler();
  globalThis.__polymathLegacy = { calls: [] };
  try {
    for (const ct of [
      'Multipart/Form-Data; boundary=----pwk1boundary',
      'MULTIPART/FORM-DATA; boundary=----pwk1boundary',
      'multipart/FORM-DATA; boundary=----pwk1boundary',
    ]) {
      const { body } = multipartBody({ query: 'case test' });
      const res = mockResponse();
      await handler(streamRequest(body, { 'content-type': ct }, { method: 'POST' }), res);
      assert.equal(res.statusCode, 0);
      assert.deepEqual(res.body, { bits: ['bit-1', 'bit-2'] }, `failed for Content-Type: ${ct}`);
      assert.deepEqual(globalThis.__polymathLegacy.calls.at(-1), ['ask', 'case test', {}]);
    }
  } finally {
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});

test('legacy /api/polymath.js POST accepts multipart/related Content-Type (matching multiparty parser capabilities)', async () => {
  const { handler, cleanup } = await buildHandler();
  globalThis.__polymathLegacy = { calls: [] };
  try {
    const boundary = '----RelatedBoundary';
    const body = `--${boundary}\r\nContent-Disposition: form-data; name="query"\r\n\r\nRelated legacy query\r\n--${boundary}--\r\n`;
    const res = mockResponse();
    await handler(streamRequest(body, { 'content-type': `multipart/related; boundary=${boundary}` }, { method: 'POST' }), res);
    assert.equal(res.statusCode, 0);
    assert.deepEqual(res.body, { bits: ['bit-1', 'bit-2'] });
    assert.deepEqual(globalThis.__polymathLegacy.calls.at(-1), ['ask', 'Related legacy query', {}]);
  } finally {
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});

test('legacy /api/polymath.js GET keeps its documented default and forwards the caller query', async () => {
  const { handler, cleanup } = await buildHandler();
  globalThis.__polymathLegacy = { calls: [] };
  try {
    const res = mockResponse();
    await handler({ method: 'GET', query: {} }, res);
    assert.equal(res.body.completion, 'What are web intents?');
    assert.deepEqual(globalThis.__polymathLegacy.calls.at(-1), ['completion', 'What are web intents?'],
      'GET without a query uses the documented default');

    const custom = mockResponse();
    await handler({ method: 'GET', query: { query: 'web intents' } }, custom);
    assert.deepEqual(globalThis.__polymathLegacy.calls[globalThis.__polymathLegacy.calls.length - 1],
      ['completion', 'web intents']);
  } finally {
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});

test('legacy /api/polymath.js never echoes an upstream error object - or its bearer token (paul-kinlan-me-e805)', async () => {
  const { handler, cleanup } = await buildHandler();
  // The library's contract is a RETURNED { error }, not a throw, so the stub has to
  // return it: a throwing stub is a fiction that let the previous delta's 502 test
  // pass while the real route still serialised the AxiosError to the caller.
  globalThis.__polymathLegacy = { calls: [] };
  const logged = [];
  const realError = console.error;
  console.error = (...args) => { logged.push(args.map((a) => String(a)).join(' ')); };
  try {
    // GET (the completion branch) - the reachable leak: res.send(response).
    globalThis.__polymathLegacy.completionError = axiosFailure();
    const getRes = mockResponse();
    await handler({ method: 'GET', query: { query: 'web intents' } }, getRes);
    assert.equal(getRes.statusCode, 502, 'an upstream failure is a bounded 502, not a 200 carrying the error');
    assert.deepEqual(getRes.body, { error: 'Upstream request failed.' }, 'the body is generic');
    assert.doesNotMatch(JSON.stringify(getRes.body), /Authorization|Bearer|sk-test/i,
      'no upstream header or key may reach an unauthenticated caller');

    // POST (the ask branch) - same contract; before the fix this threw on .bits().
    globalThis.__polymathLegacy.askError = axiosFailure();
    const post = multipartBody({ query: 'web intents' });
    const postRes = mockResponse();
    await handler(streamRequest(post.body, post.headers, { method: 'POST' }), postRes);
    assert.equal(postRes.statusCode, 502);
    assert.deepEqual(postRes.body, { error: 'Upstream request failed.' });

    // A client that does throw (or a synchronous validation error) is still bounded.
    delete globalThis.__polymathLegacy.askError;
    globalThis.__polymathLegacy.failAsk = true;
    const thrown = multipartBody({ query: 'web intents' });
    const thrownRes = mockResponse();
    await handler(streamRequest(thrown.body, thrown.headers, { method: 'POST' }), thrownRes);
    assert.equal(thrownRes.statusCode, 502);

    // Nothing above may put the key in the function log either: an AxiosError
    // prints its config, so the handler logs the status only.
    const logText = logged.join('\n');
    assert.doesNotMatch(logText, /Authorization|Bearer|sk-test/i,
      `the function log must not carry the bearer header: ${logText}`);
    assert.match(logText, /legacy (completion|ask) upstream failure \(status 429\)/,
      'the failure is still observable, by status');
  } finally {
    console.error = realError;
    cleanup();
    delete globalThis.__polymathLegacy;
  }
});
