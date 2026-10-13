import { strict as assert } from 'node:assert';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { fetchActorInformation } from './fetchActorInformation.ts';

test('rejects private, link-local, local and non-HTTPS keyIds without connecting', async () => {
  let requests = 0;
  const server = createServer((_req, res) => { requests++; res.end('{}'); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const address = server.address();
    assert(address && typeof address !== 'string');
    const urls = [
      `http://127.0.0.1:${address.port}/actor#main-key`,
      `https://127.0.0.1:${address.port}/actor#main-key`,
      `https://localhost:${address.port}/actor#main-key`,
      'https://169.254.169.254/latest/meta-data/',
      'https://10.0.0.1/actor', 'https://192.168.1.1/actor',
      'https://[::1]/actor', 'https://[::ffff:127.0.0.1]/actor',
      'https://2130706433/actor', 'https://user:pass@example.com/actor',
      'file:///etc/passwd', 'not a url'
    ];
    for (const url of urls) assert.equal(await fetchActorInformation(url), null, url);
    assert.equal(requests, 0);
  } finally {
    server.close();
  }
});
