import { AP } from 'activitypub-core-types';
import { Sha256Signer } from '../../http-signature/index.js';
import { createHash } from 'crypto';
import { BlockedRequestError, guardedFetch, isSafeFederationUrl } from './guardedFetch.js';
import { logSafeUrl } from './logSafeUrl.js';

export async function sendSignedRequest(endpoint: URL, object: AP.Activity): Promise<Response> {
  // The endpoint usually comes from a remote actor's document, so it is
  // untrusted: a signed POST must never leave for a non-public address. Checked
  // before the activity is even signed, and again by guardedFetch().
  if (!isSafeFederationUrl(endpoint)) throw new BlockedRequestError('unsafe-endpoint');

  const publicKeyId = "https://paul.kinlan.me/paul#main-key";
  const privateKey = process.env.ACTIVITYPUB_PRIVATE_KEY;

  const signer = new Sha256Signer({ publicKeyId, privateKey, headerNames: ["host", "date", "digest"] });

  const requestHeaders = {
    host: endpoint.hostname,
    date: new Date().toUTCString(),
    digest: `SHA-256=${createHash('sha256').update(JSON.stringify(object)).digest('base64')}`
  };

  // Generate the signature header
  const signature = signer.sign({
    url: endpoint,
    method: "POST",
    headers: requestHeaders
  });

  // The Signature header is a short-lived credential: the covered headers, the
  // digest and the activity body are exactly what it authenticates, and a log
  // that carries all four is a replay recipe rather than a diagnostic. Only the
  // peer is logged, and only the part of its URL that logSafeUrl() will render -
  // the endpoint comes from a remote actor's document, so it is untrusted too.
  console.log("Sending signed POST to", logSafeUrl(endpoint));

  return await guardedFetch(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(object),
      headers: {
        'content-type': "application/activity+json",
        accept: "application/activity+json",
        ...requestHeaders,
        signature: signature
      },
      timeoutMs: 5000 // kill after 5 seconds
    }
  );
}
