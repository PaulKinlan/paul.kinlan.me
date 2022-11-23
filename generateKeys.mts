import { promisify } from 'util';
import { generateKeyPair } from 'crypto';

const generateKeyPairAsync = promisify(generateKeyPair);

const pair = await generateKeyPairAsync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
})

console.log(pair.publicKey);

console.log(pair.privateKey);