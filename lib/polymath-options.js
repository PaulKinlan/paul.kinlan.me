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
// query_embedding and access_token: a second query form would compete with the
// text query, and that route's own token handling predates AskOptions.
export const POLYMATH_ASK_OPTION_KEYS = Object.freeze([
  'version',
  'query_embedding_model',
  'count',
  'count_type',
  'omit',
  'sort',
]);

// /api/polymath/ask.ts is the vector-query route: it accepts an embedding, so
// its list is the schema's list.
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
