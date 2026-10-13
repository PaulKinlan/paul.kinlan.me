/** Stands in for @polymath-ai/client (which calls OpenAI). */
globalThis.__PAID_UPSTREAM__ ??= { constructed: 0, ask: 0, completion: 0, query: 0 };

export class Polymath {
  constructor(options) {
    globalThis.__PAID_UPSTREAM__.constructed++;
    this.options = options;
  }

  async ask() {
    globalThis.__PAID_UPSTREAM__.ask++;
    return { bits: () => [] };
  }

  async completion(query) {
    globalThis.__PAID_UPSTREAM__.completion++;
    // Lets a test exercise the endpoint's upstream deadline.
    if (String(query).includes("SLOW")) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return { completion: "stub answer", infos: [] };
  }
}
