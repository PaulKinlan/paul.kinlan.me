import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import admin from 'firebase-admin';

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

// Firestore is optional in firebase-admin. The existing handler tests alias the
// entire SDK to a fake, so they cannot detect a broken real SDK import or API.
test('installed Firebase Admin retains the namespaced Firestore follower API', async () => {
  assert.match(admin.SDK_VERSION, /^13\./);
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  // A throwaway key and a demo project construct references locally; no
  // Firestore request, credentials, emulator, or production resource is used.
  const app = admin.initializeApp({ credential: admin.credential.cert({
    projectId: 'demo-followers',
    clientEmail: 'fake@demo-followers.iam.gserviceaccount.com',
    privateKey,
  }) }, 'firebase-admin-compat-test');
  try {
    const followers = admin.firestore(app).collection('followers');
    const doc = followers.doc('https:__example.test_users_test');
    assert.equal(doc.path, 'followers/https:__example.test_users_test');
    assert.equal(typeof doc.get, 'function');
    assert.equal(typeof doc.set, 'function');
    assert.equal(typeof doc.delete, 'function');
    assert.equal(typeof followers.select('actor').get, 'function');
  } finally {
    await app.delete();
  }
});

test('the locked Firestore tree includes patched protobufjs', () => {
  assert.match(lock.packages['node_modules/firebase-admin'].version, /^13\./);
  const protobuf = lock.packages['node_modules/protobufjs'].version.split('.').map(Number);
  assert.ok(protobuf[0] > 7 || (protobuf[0] === 7 && (protobuf[1] > 6 || (protobuf[1] === 6 && protobuf[2] >= 6))),
    'protobufjs 7.6.6+ fixes the originally flagged DoS/prototype advisories');
  assert.equal(lock.packages['node_modules/@google-cloud/firestore'].version, '7.11.6');
});
