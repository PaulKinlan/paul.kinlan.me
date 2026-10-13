// Offline functional verification for bead paul-kinlan-me-ajt:
// proves openai 3.2.1 (as used by @polymath-ai/client) completes a real
// HTTP request/response cycle on the overridden axios 1.x — the only axios
// API surface openai 3.2.1 uses is axios.request(). Also smoke-loads the two
// production endpoints that import the polymath packages.
import http from 'node:http';
import assert from 'node:assert/strict';

const axios = (await import('axios')).default;
const { readFile } = await import('node:fs/promises');
const axiosVersion = JSON.parse(await readFile(new URL('../node_modules/axios/package.json', import.meta.url), 'utf8')).version;
console.log('installed axios:', axiosVersion);
assert.ok(axiosVersion.startsWith('1.'), `expected axios 1.x, got ${axiosVersion}`);

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({
      id: 'cmpl-roundtrip', object: 'text_completion',
      created: Date.now() / 1000, model: 'gpt-3.5-turbo-instruct',
      choices: [{ text: 'ANSWER:' + req.url, index: 0, finish_reason: 'stop' }],
      _seen_body: body,
    }));
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

try {
  // exactly how @polymath-ai/client/src/main.js uses the openai package
  const { Configuration, OpenAIApi } = await import('openai');
  const openai = new OpenAIApi(new Configuration({ apiKey: 'test-key', basePath: `http://127.0.0.1:${port}/v1` }));
  const response = await openai.createCompletion({ model: 'gpt-3.5-turbo', prompt: 'What are web intents?', max_tokens: 16 });
  assert.equal(response.status, 200);
  assert.ok(response.data.choices[0].text.startsWith('ANSWER:/v1/completions'), `round-trip body: ${response.data.choices[0].text}`);
  const seen = JSON.parse(response.data._seen_body);
  assert.equal(seen.prompt, 'What are web intents?');
  console.log('OK openai 3.2.1 createCompletion round-trip on axios', axiosVersion);

  // error path shape (polymath error handling reads error.response)
  let err;
  try { await openai.createEmbedding({ model: 'x', input: 'y', ...{ _forcePath: true } }); }
  catch (e) { err = e; }
  // (both calls go to the same fake 200 endpoint; this just asserts no axios-1.x API surprises on the happy path)
  assert.ok(!err || err.response || err.isAxiosError !== undefined);

  // module-load smoke: the two production endpoints' import chains
  await import('../api/polymath.js');
  console.log('OK api/polymath.js imports cleanly');
  // api/polymath/ask.ts is TS (compiled by Vercel); load its runtime deps instead
  const host = await import('@polymath-ai/host');
  // dummy creds: PineconeClient validates config shape at construction, no network yet
  const ph = new host.PolymathPinecone({ namespace: 'test-namespace', apiKey: 'test-key', baseUrl: 'https://example.pinecone.io' });
  assert.ok(ph, 'PolymathPinecone constructs');
  console.log('OK @polymath-ai/host PolymathPinecone constructs');

  const client = await import('@polymath-ai/client');
  const p = new client.Polymath({ apiKey: 'test-key', pinecone: { namespace: 'test' }, completionOptions: { model: 'gpt-3.5-turbo' } });
  assert.ok(p, 'Polymath constructs');
  console.log('OK @polymath-ai/client Polymath constructs');

  // host query path with a stubbed paid API (no secrets, no cost): patch
  // PineconeClient.prototype.query, drive PolymathPinecone.query end-to-end
  // (vector search -> makeBit -> library data shape) exactly as api/polymath/ask.ts does.
  const { PineconeClient } = await import('pinecone-client');
  const fakeVector = new Array(4).fill(0.1);
  PineconeClient.prototype.query = async () => ({
    matches: [
      { score: 0.9, metadata: { text: 'Web Intents let apps delegate tasks.', title: 'Web Intents', url: 'https://paul.kinlan.example/intents' } },
    ],
  });
  const libraryData = await ph.query({ query_embedding: fakeVector });
  assert.equal(libraryData.version, 1);
  assert.equal(libraryData.bits.length, 1);
  assert.equal(libraryData.bits[0].text, 'Web Intents let apps delegate tasks.');
  assert.equal(libraryData.bits[0].info.url, 'https://paul.kinlan.example/intents');
  console.log('OK PolymathPinecone.query with stubbed vector store returns library data');
  console.log('ALL CHECKS PASSED');
} finally {
  server.close();
}
