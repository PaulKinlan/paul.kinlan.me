/**
 * Maps the two packages that spend money to local stubs, so the endpoint tests
 * drive the real handlers - request limits, input caps, deadlines, response
 * shapes - without calling OpenAI or Pinecone.
 *
 * Registered from a test with:
 *   import { register } from "node:module";
 *   register("./helpers/upstream-stub-loader.mjs", import.meta.url);
 */

const stubs = new Map([
  ["@polymath-ai/client", new URL("./polymath-client.stub.mjs", import.meta.url).href],
  ["@polymath-ai/host", new URL("./polymath-host.stub.mjs", import.meta.url).href],
]);

export async function resolve(specifier, context, nextResolve) {
  const stub = stubs.get(specifier);
  if (stub) return { url: stub, shortCircuit: true };
  return nextResolve(specifier, context);
}
