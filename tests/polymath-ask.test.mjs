// Regression tests for /polymath unauthenticated multiparty DoS (paul-kinlan-me-7t79):
// Guards api/polymath/ask.ts against parser crashes, prototype pollution, ReDoS,
// unbounded field parsing, and file upload DoS vectors.
//
// Drives the real TypeScript handler bundled with esbuild, using the real multiparty@4.3.1
// and a stubbed Pinecone client.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
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

test('FORM_LIMITS explicitly bounds files to 0 and limits fields and size', () => {
  assert.equal(FORM_LIMITS.maxFiles, 0, 'maxFiles must be 0 to prevent file upload DoS');
  assert.ok(FORM_LIMITS.maxFields <= 50, `maxFields bounded, got ${FORM_LIMITS.maxFields}`);
  assert.ok(FORM_LIMITS.maxFieldsSize <= 2 * 1024 * 1024, `maxFieldsSize bounded, got ${FORM_LIMITS.maxFieldsSize}`);
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
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.version, 1);
  assert.deepEqual(res.body.options.query, ['What are web intents?']);
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

test('rejects file uploads with 400 Bad Request', async () => {
  const boundary = '----FileUploadAttempt';
  const req = createMultipartStream(boundary, [
    { name: 'maliciousFile', filename: 'exploit.sh', contentType: 'application/x-sh', value: 'echo pwned' },
  ]);
  req.method = 'POST';

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400, 'file upload rejected with 400');
  assert.equal(res.body.error, 'File uploads are not supported.');
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

test('supports parsed JSON object body safely when req.body is provided', async () => {
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: { query: 'test query via json', version: 1 },
  };

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.options.query, 'test query via json');
});

test('rejects invalid req.body types with 400', async () => {
  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: 'plain string body',
  };

  const res = mockResponse();
  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.error, 'Invalid request body.');
});

test('catches vector store query errors and returns 500 without crashing', async () => {
  globalThis.__polymathTest = { throwOnQuery: true };
  try {
    const boundary = '----QueryErrorTest';
    const req = createMultipartStream(boundary, [
      { name: 'query', value: 'hello' },
    ]);
    req.method = 'POST';

    const res = mockResponse();
    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.match(res.body?.error, /Pinecone/i);
  } finally {
    globalThis.__polymathTest = null;
  }
});
