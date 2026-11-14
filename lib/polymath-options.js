// THREAT_MODEL.md invariant 5: caller-controlled field/option NAMES are never
// forwarded to a dependency without an allowlist (paul-kinlan-me-i6sd).
//
// Both lists are grounded in the dependency's own contract - @polymath-ai/types
// AskOptions (node_modules/@polymath-ai/types/dist/src/schemas.d.ts:319-327):
// version, query_embedding, query_embedding_model, count, count_type, omit,
// access_token, sort. A name that is not in that schema is dropped by the
// client's zod parse anyway, so forwarding it is pure pass-through surface with
// no effect except letting a caller pick what the dependency sees.
//
// The legacy /api/polymath route asks by TEXT (query) and deliberately omits
// two names the schema does list (paul-kinlan-me-y38y, paul-kinlan-me-dciv):
//
//   access_token (endpoint.js) - that route configures no polymath servers, and
//   a caller-chosen token must never be forwarded upstream;
//   query_embedding (dciv) - the route never decodes it (the sibling's
//   decodeEmbedding lives in ask.ts), so the raw multipart string became the
//   Pinecone query vector, letting an unauthenticated caller skip embedding
//   generation with a vector that can only fail upstream.
//
// The remaining keys are inert on this route (results.js reads them only in
// response(), and this route returns bits()) but they are the client's
// documented ask() surface, so they stay. Unknown keys are DROPPED, not
// rejected, so a legacy client sending a retired option keeps working (y38y).
export const POLYMATH_ASK_OPTION_KEYS = Object.freeze([
  'version',
  'query_embedding_model',
  'count',
  'count_type',
  'omit',
  'sort',
]);

// /api/polymath/ask.ts is the vector-query route: it accepts an embedding, so
// its list is the schema's list. It decodes query_embedding before forwarding
// (the sibling's dciv reason for excluding it - an undecoded raw string becoming
// the query vector - cannot happen here), and a caller-supplied access_token is
// forwarded as the dependency's documented option, never as a site credential.
export const POLYMATH_VECTOR_QUERY_OPTION_KEYS = Object.freeze([
  'version',
  'query_embedding',
  'query_embedding_model',
  'count',
  'count_type',
  'omit',
  'access_token',
  'sort',
]);

// Copy only permitted names out of a parsed multipart field map.
//
// Iterating the allowlist rather than the caller's keys is the point: a field
// named __proto__, constructor or prototype is never read, so it cannot reach
// the object handed to the dependency (the multiparty prototype-pollution
// shape pinned by tests/polymath-ask.test.mjs).
export const pickPermittedOptions = (fields, permitted) => {
  const options = {};
  if (fields === null || typeof fields !== 'object') return options;
  for (const key of permitted) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      options[key] = fields[key];
    }
  }
  return options;
};
