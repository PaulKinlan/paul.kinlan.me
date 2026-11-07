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
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
    return { bits: () => ['bit-1', 'bit-2'] };
  }
  async completion(query) {
    globalThis.__polymathLegacy.calls.push(['completion', query]);
    return { completion: query };
  }
}
`;

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

    // A non-multipart POST is refused before any parsing.
    const notMultipart = mockResponse();
    await handler(streamRequest('query=hi', { 'content-type': 'application/json' }, { method: 'POST' }), notMultipart);
    assert.equal(notMultipart.statusCode, 400);
    assert.match(notMultipart.body.error, /multipart form-data required/);

    // Missing content-type header is also refused before any parsing.
    const missingCt = mockResponse();
    await handler(streamRequest('query=hi', {}, { method: 'POST' }), missingCt);
    assert.equal(missingCt.statusCode, 400);
    assert.match(missingCt.body.error, /multipart form-data required/);

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
