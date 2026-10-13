/** Stands in for @polymath-ai/host (which reads Pinecone). */
globalThis.__PAID_UPSTREAM__ ??= { constructed: 0, ask: 0, completion: 0, query: 0 };

export class PolymathPinecone {
  constructor(config) {
    globalThis.__PAID_UPSTREAM__.constructed++;
    this.config = config;
  }

  async query() {
    globalThis.__PAID_UPSTREAM__.query++;
    return { version: 1, bits: [] };
  }
}

export function decodeEmbedding(data) {
  return Array.from(new Float32Array(new Uint8Array(Buffer.from(data, "base64")).buffer));
}
