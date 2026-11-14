// Regression tests for /polymath unauthenticated multiparty DoS (paul-kinlan-me-7t79):
// Guards api/polymath/ask.ts against parser crashes, prototype pollution, ReDoS,
// unbounded field parsing, and file upload DoS vectors.
//
// Drives the real TypeScript handler bundled with esbuild, using the real multiparty@4.3.1
// and a stubbed Pinecone client.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { Form } from 'multiparty';
import { build } from 'esbuild';

const dir = mkdtempSync(join(tmpdir(), 'polymath-ask-test-'));
const bundlePath = join(dir, 'handler.mjs');

const result = await build({
  entryPoints: ['api/polymath/ask.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  plugins: [{
    name: 'stubs',
    setup(b) {
      b.onResolve({ filter: /^@polymath-ai\// }, (args) => ({ path: args.path, namespace: 'stub' }));
      b.onResolve({ filter: /^@vercel\/node/ }, () => ({ path: '@vercel/node', namespace: 'stub' }));
      b.onResolve({ filter: /^multiparty$/ }, () => ({
        path: join(process.cwd(), 'node_modules/multiparty/index.js'),
        external: true,
      }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, (args) => {
        if (args.path.includes('host')) {
          return {
            contents: `
              export class PolymathPinecone {
                constructor(opts) { this.opts = opts; }
                async query(options) {
                  if (globalThis.__polymathTest) {
                    globalThis.__polymathTest.queryCalls = (globalThis.__polymathTest.queryCalls || 0) + 1;
                  }
                  if (globalThis.__polymathTest?.queryError) {
                    throw globalThis.__polymathTest.queryError;
                  }
                  if (globalThis.__polymathTest?.throwOnQuery) {
                    throw new Error('Pinecone connection error');
                  }
                  return { version: 1, bits: [], options };
                }
              }
              export function decodeEmbedding(encoded) {
                if (encoded === 'invalid') throw new Error('Invalid embedding vector');
                return [0.1, 0.2, 0.3];
              }
            `,
            loader: 'js',
          };
        }
        return { contents: 'export {};', loader: 'js' };
      });
    },
  }],
});

writeFileSync(bundlePath, result.outputFiles[0].contents);
const { default: handler, FORM_LIMITS } = await import(`file://${bundlePath}`);

test.after(() => {
  rmSync(dir, { recursive: true, force: true });
});

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    send(data) {
      this.body = data;
      return this;
    },
  };
}

function createMultipartStream(boundary, parts) {
  const chunks = [];
  for (const part of parts) {
    chunks.push(Buffer.from(`--${boundary}\r\n`));
    if (part.filename !== undefined) {
      chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"; filename="${part.filename}"\r\n`));
      chunks.push(Buffer.from(`Content-Type: ${part.contentType || 'application/octet-stream'}\r\n\r\n`));
    } else {
      chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"\r\n\r\n`));
    }
    chunks.push(typeof part.value === 'string' ? Buffer.from(part.value) : part.value);
    chunks.push(Buffer.from('\r\n'));
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));

  const readable = Readable.from(chunks);
  readable.headers = {
    'content-type': `multipart/form-data; boundary=${boundary}`,
  };
  return readable;
}

test('FORM_LIMITS explicitly bounds files via maxFilesSize: 1 and limits fields and size', () => {
  // This documents the values; the pins that matter are the handler-level cases
  // above and below (maxFields, the phce abort, and maxFieldsSize), because a Form
  // built here says nothing about what the route constructs.
  const form = new Form(FORM_LIMITS);
  assert.equal(form.maxFilesSize, 1, 'maxFilesSize must be 1 so multiparty aborts file streams immediately');
  assert.ok(form.maxFields <= 50, `maxFields bounded, got ${form.maxFields}`);
  assert.ok(form.maxFieldsSize <= 2 * 1024 * 1024, `maxFieldsSize bounded, got ${form.maxFieldsSize}`);
});

test('rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
  for (const method of ['GET', 'PUT', 'DELETE', 'PATCH']) {
    const req = { method, headers: {} };
    const res = mockResponse();
    await handler(req, res);
    assert.equal(res.statusCode, 405, `method ${method} returned ${res.statusCode}`);
    assert.deepEqual(res.body, { error: 'Only POST is supported.' });
  }
});

test('parses valid scalar multipart form fields and returns 200 with library data', async () => {
  const boundary = '----ValidBoundary123';
  const req = createMultipartStream(boundary, [
    { name: 'query', value: 'What are web intents?' },
    { name: 'version', value: '1' },
    // cs0m: query_embedding is required now, and the stub echoes back what it was
    // given, so this also proves the decoded vector reached the client.
    { name: 'query_embedding', value: 'AQIDBA==' },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.version, 1);
  assert.deepEqual(res.body.options.query_embedding, [0.1, 0.2, 0.3],
    'the decoded embedding is what the client receives');
  // paul-kinlan-me-i6sd: 'query' is not an AskOptions name, so it is not forwarded
  // any more; a permitted name still is.
  assert.equal('query' in res.body.options, false, 'caller-chosen names must not be forwarded');
  assert.deepEqual(res.body.options.version, ['1']);
});

test('decodes and queries query_embedding when present', async () => {
  const boundary = '----ValidEmbeddingBoundary';
  const req = createMultipartStream(boundary, [
    { name: 'query_embedding', value: 'AQIDBA==' },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.options.query_embedding, [0.1, 0.2, 0.3]);
});

test('rejects malformed query_embedding with 400 Bad Request', async () => {
  const boundary = '----InvalidEmbeddingBoundary';
  const req = createMultipartStream(boundary, [
    { name: 'query_embedding', value: 'invalid' },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /embedding/i);
});

test('rejects malformed multipart stream with 400 without uncaught exception (ReDoS / parser crash)', async () => {
  const req = Readable.from([Buffer.from('not valid multipart body at all')]);
  req.method = 'POST';
  req.headers = { 'content-type': 'multipart/form-data; boundary=----MissingBoundary' };

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400, 'malformed body must yield 400, not crash');
  assert.ok(res.body?.error, 'returns error message');
});

// multiparty resolves os.tmpdir() when the Form is constructed, so pointing TMPDIR at a
// private directory makes the upload-residue assertions exact. Counting entries in the
// machine-wide tmpdir instead makes these tests depend on what every other suite (and
// every other gate job on the box) is doing at the same moment, which is how the tiny-file
// case went red under the parallel fast gate while passing standalone.
const withUploadDir = async (fn) => {
  const uploadDir = mkdtempSync(join(tmpdir(), 'polymath-ask-uploads-'));
  const previous = process.env.TMPDIR;
  process.env.TMPDIR = uploadDir;
  try {
    return await fn(uploadDir);
  } finally {
    if (previous === undefined) delete process.env.TMPDIR;
    else process.env.TMPDIR = previous;
    rmSync(uploadDir, { recursive: true, force: true });
  }
};

test('aborts file upload during parse without saving files to disk (paul-kinlan-me-phce)', async () => {
  await withUploadDir(async (uploadDir) => {
    const boundary = '----FileUploadAttempt';
    const bigPayload = Buffer.alloc(64 * 1024, 'x');
    const req = createMultipartStream(boundary, [
      { name: 'maliciousFile', filename: 'exploit.sh', contentType: 'application/x-sh', value: bigPayload },
    ]);
    req.method = 'POST';

    const res = mockResponse();
    await handler(req, res);

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(res.statusCode, 400, 'file upload rejected with 400');
    assert.match(res.body.error, /maximum file length exceeded/i);
    assert.deepEqual(readdirSync(uploadDir), [], 'no file retained on disk');
  });
});

test('rejects tiny file uploads (<= 1 byte) and cleans up disk', async () => {
  await withUploadDir(async (uploadDir) => {
    const boundary = '----TinyFileUpload';
    const req = createMultipartStream(boundary, [
      { name: 'tinyFile', filename: 'tiny.txt', contentType: 'text/plain', value: '1' },
    ]);
    req.method = 'POST';

    const res = mockResponse();
    await handler(req, res);

    await new Promise((r) => setTimeout(r, 50));
    assert.equal(res.statusCode, 400, 'tiny file rejected with 400');
    assert.equal(res.body.error, 'File uploads are not supported.');
    assert.deepEqual(readdirSync(uploadDir), [], 'temporary file cleaned up');
  });
});

test('rejects requests exceeding maxFields with 400 Bad Request', async () => {
  const boundary = '----TooManyFields';
  const fields = [];
  for (let i = 0; i < FORM_LIMITS.maxFields + 5; i++) {
    fields.push({ name: `field_${i}`, value: `val_${i}` });
  }
  const req = createMultipartStream(boundary, fields);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400, 'too many fields rejected with 400');
  assert.match(res.body?.error, /maxFields/i);
});

test('rejects non-multipart POST requests with 400 (prevents unauthenticated JSON query volume)', async () => {
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { query: 'test query via json', version: 1 },
  };

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Invalid request: multipart form-data required.');
});

test('rejects streaming POST request with unsupported content-type with 400', async () => {
  const boundary = '----Boundary';
  const req = createMultipartStream(boundary, [{ name: 'query', value: 'hello' }]);
  req.method = 'POST';
  req.headers = { 'content-type': 'text/plain' };
  const res = mockResponse();
  await handler(req, res);
  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /unsupported content-type/i);
});

test('accepts multipart/related Content-Type (matching multiparty parser capabilities)', async () => {
  const boundary = '----RelatedBoundary';
  const req = createMultipartStream(boundary, [
    { name: 'query', value: 'Related query' },
    { name: 'query_embedding', value: 'AQIDBA==' },
  ]);
  req.method = 'POST';
  req.headers['content-type'] = `multipart/related; boundary=${boundary}`;

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal('query' in res.body.options, false, 'no caller-chosen name reaches the client');
});

test('accepts case-variant multipart Content-Type header (RFC 2045 5.1)', async () => {
  for (const ct of [
    'Multipart/Form-Data; boundary=----CaseVariantBoundary',
    'MULTIPART/FORM-DATA; boundary=----CaseVariantBoundary',
    'multipart/FORM-DATA; boundary=----CaseVariantBoundary',
  ]) {
    const boundary = '----CaseVariantBoundary';
    const req = createMultipartStream(boundary, [
      { name: 'query', value: 'Case insensitive query' },
      { name: 'query_embedding', value: 'AQIDBA==' },
    ]);
    req.method = 'POST';
    req.headers['content-type'] = ct;

    const res = mockResponse();
    await handler(req, res);

    assert.equal(res.statusCode, 200, `failed for Content-Type: ${ct}`);
    assert.equal('query' in res.body.options, false, 'no caller-chosen name reaches the client');
  }
});

// paul-kinlan-me-iu5i: the catch used to return the raw upstream message and
// statusCode to the unauthenticated caller (sendJson(status, { error: err.message })).
// The contract now is the legacy sibling's failUpstream() (e805): a bounded 502 with a
// generic body, and the log gets the STATUS only.
test('an upstream failure is a bounded 502 with a generic body; the log carries the status only', async () => {
  const upstream = Object.assign(
    new Error('connect to https://us-east1-gcp.pinecone.io/query failed with Api-Key sk-test-iu5i-secret'),
    { statusCode: 401 }
  );
  globalThis.__polymathTest = { queryError: upstream };
  const logged = [];
  const realError = console.error;
  console.error = (...args) => { logged.push(args.map((a) => String(a)).join(' ')); };
  try {
    const boundary = '----QueryErrorTest';
    const req = createMultipartStream(boundary, [
      { name: 'query', value: 'hello' },
      { name: 'query_embedding', value: 'AQIDBA==' },
    ]);
    req.method = 'POST';

    const res = mockResponse();
    await handler(req, res);

    assert.equal(res.statusCode, 502, 'an upstream failure is a bounded 502, not the upstream status');
    assert.deepEqual(res.body, { error: 'Upstream request failed.' }, 'the body is generic');
    assert.doesNotMatch(JSON.stringify(res.body), /sk-test-iu5i-secret|pinecone\.io|Pinecone connection/i,
      'no upstream message, endpoint or key may reach an unauthenticated caller');

    const logText = logged.join('\n');
    assert.match(logText, /\[polymath\] ask upstream failure \(status 401\)/,
      'the failure is still observable, by status');
    assert.doesNotMatch(logText, /sk-test-iu5i-secret|pinecone\.io/,
      'the function log must not carry the upstream detail either');
  } finally {
    console.error = realError;
    globalThis.__polymathTest = null;
  }
});

test('a POST without query_embedding is a 400 and never reaches Pinecone (paul-kinlan-me-cs0m)', async () => {
  // PolymathPinecone.query() reads args.query_embedding and hands `vector: undefined`
  // to Pinecone. The route used to forward {} anyway, so a caller error cost a paid
  // round trip and came back as the generic 502 - the caller could not tell a broken
  // request from a broken upstream.
  globalThis.__polymathTest = {};
  try {
    for (const parts of [
      [{ name: 'query', value: 'What are web intents?' }],
      [{ name: 'version', value: '1' }],
      [],
    ]) {
      const boundary = '----MissingEmbedding';
      const req = createMultipartStream(boundary, parts);
      req.method = 'POST';

      const res = mockResponse();
      await handler(req, res);

      assert.equal(res.statusCode, 400, 'a request the route cannot answer is a caller error');
      assert.deepEqual(res.body, { error: 'Missing query_embedding.' });
    }
    assert.equal(globalThis.__polymathTest.queryCalls ?? 0, 0,
      'no request reaches the paid client without the embedding it needs');
  } finally {
    globalThis.__polymathTest = null;
  }
});

test('the handler refuses a field over FORM_LIMITS.maxFieldsSize (paul-kinlan-me-cs0m)', async () => {
  // cs0m item 4: the FORM_LIMITS test asserts on a Form built inside the test, which
  // proves nothing about the handler. maxFields and maxFilesSize happen to be pinned
  // by the maxFields and phce cases (mutation-checked: dropping FORM_LIMITS from the
  // handler turns both red), but maxFieldsSize - 1MB - had no handler-level case at
  // all: multiparty's default is 2MB, so the route's tighter bound was only a
  // declaration. This drives 1.5MB through the live handler.
  const boundary = '----OversizeField';
  const req = createMultipartStream(boundary, [
    { name: 'query_embedding', value: Buffer.alloc(1.5 * 1024 * 1024, 'a') },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /maxFieldsSize/i,
    "a field over the route's 1MB bound is refused by the route, not by multiparty's 2MB default");
});

// paul-kinlan-me-i6sd (THREAT_MODEL.md invariant 5): the route forwarded EVERY
// caller-chosen multipart field name to PolymathPinecone.query(), so a caller
// picked what the dependency saw. The allowlist is now one shared module; these
// two tests pin the list against the dependency's own schema and pin that an
// unlisted or prototype-polluting name never reaches the client.
const { POLYMATH_VECTOR_QUERY_OPTION_KEYS, pickPermittedOptions } = await import('../lib/polymath-options.js');

test('the vector-query allowlist is exactly the dependency AskOptions names (i6sd)', () => {
  // Source of truth: node_modules/@polymath-ai/types (schemas.d.ts askOptions).
  // If @polymath-ai/* ever adds an option, this list must be updated with it -
  // the test fails loudly rather than silently forwarding the new name.
  assert.deepEqual([...POLYMATH_VECTOR_QUERY_OPTION_KEYS].sort(),
    ['access_token', 'count', 'count_type', 'omit', 'query_embedding', 'query_embedding_model', 'sort', 'version']);
});

test('picking permitted options never copies an unlisted or prototype-polluting name (i6sd)', () => {
  const fields = JSON.parse('{"version":["1"],"count":["3"],"query":["hi"],"__proto__":{"polluted":1},"constructor":["x"]}');
  const picked = pickPermittedOptions(fields, POLYMATH_VECTOR_QUERY_OPTION_KEYS);
  assert.deepEqual(Object.keys(picked).sort(), ['count', 'version']);
  assert.equal({}.polluted, undefined, 'no prototype pollution from a caller field name');
});

test('a caller-chosen field name never reaches the Pinecone client (i6sd)', async () => {
  const boundary = '----I6sdBoundary';
  const req = createMultipartStream(boundary, [
    { name: 'query_embedding', value: 'AQIDBA==' },
    { name: 'filter', value: '{"evil":"selector"}' },
    { name: 'namespace', value: 'someone-elses' },
    { name: 'count', value: '3' },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.options.query_embedding, [0.1, 0.2, 0.3], 'a permitted option is decoded and forwarded');
  assert.equal('filter' in res.body.options, false, 'an unlisted name must not be forwarded');
  assert.equal('namespace' in res.body.options, false, 'an unlisted name must not be forwarded');
  assert.deepEqual(res.body.options.count, ['3'], 'a permitted option is forwarded');
});
