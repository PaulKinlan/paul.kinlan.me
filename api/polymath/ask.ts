/// <reference path="types.d.ts"/>
import { Polymath } from "@polymath-ai/client";
/// <reference path="types.d.ts"/>
import { PolymathPinecone, decodeEmbedding } from "@polymath-ai/host";

import { Form } from "multiparty";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { envInt, guardPaidRequest, rejectRequest } from "../../lib/paid-api-guard.js";

// The host half of the Polymath protocol: it answers a query with Pinecone
// reads, on Paul's account, for the whole internet (the site advertises it with
// `<link rel="polymath" href="/polymath">` and anyone can point the CLI at it).
// The reads are cheap but not free, so this endpoint gets the same shape of
// ceiling as the OpenAI one: a per-IP window, a whole-endpoint daily cap (which
// is what stops an address-rotating caller), and a refusal when the counter
// cannot be read.
//
// A 1536-dimension float32 vector is ~8 KiB of base64 and 1536 floats; these
// caps are headroom over that without letting a caller buffer or decode
// something arbitrary.
const MAX_EMBEDDING_CHARS = 32768;
const MAX_EMBEDDING_DIMENSIONS = 4096;
const MAX_FORM_FIELDS = 16;
const MAX_FORM_FIELD_BYTES = 65536;

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('content-type', 'application/json');

  if (
    await guardPaidRequest(req, res, {
      bucket: "polymath-host",
      limit: envInt("AI_HOST_RATE_LIMIT", 30),
      windowSeconds: envInt("AI_RATE_WINDOW_SECONDS", 60),
      dailyCap: envInt("AI_HOST_DAILY_REQUEST_CAP", 5000),
    })
  ) {
    return;
  }

  let ph = new PolymathPinecone({
    namespace: process.env.PINECONE_NAMESPACE,
  });

  if (req.method == "POST") {
    const { body } = req;
    if (body == null) {
      // Bound what multiparty will buffer before it reads a single field.
      let form = new Form({
        maxFields: MAX_FORM_FIELDS,
        maxFieldsSize: MAX_FORM_FIELD_BYTES,
      });
      // Everything below can throw (a truncated embedding, a Pinecone failure).
      // Inside this callback a throw would be an unhandled rejection that never
      // answers the caller and holds the lambda slot for the full 240s
      // maxDuration, so the body is wrapped.
      form.parse(req, async (err: any, fields: any) => {
        try {
          if (err) {
            return rejectRequest(res, 400, "invalid_form", "The request body could not be read.");
          }

          const entries = Object.entries(fields);
          const otherOptions: { [key: string]: any } = {};
          for (const [key, value] of entries) {
            otherOptions[key] = value;
          }

          const encoded = otherOptions["query_embedding"]?.[0];
          if (typeof encoded !== "string") {
            return rejectRequest(res, 400, "query_embedding_required", "A base64 query_embedding field is required.");
          }
          if (encoded.length > MAX_EMBEDDING_CHARS) {
            return rejectRequest(
              res,
              400,
              "query_embedding_too_large",
              `query_embedding must be at most ${MAX_EMBEDDING_CHARS} base64 characters`
            );
          }

          // decodeEmbedding throws on base64 that is not a whole number of
          // float32s, and a well-formed but huge vector is bounded too.
          let embedding: number[];
          try {
            embedding = decodeEmbedding(encoded);
          } catch {
            return rejectRequest(res, 400, "invalid_query_embedding", "query_embedding must be base64 of a float32 vector.");
          }
          if (embedding.length === 0 || embedding.length > MAX_EMBEDDING_DIMENSIONS) {
            return rejectRequest(
              res,
              400,
              "invalid_query_embedding",
              `query_embedding must be between 1 and ${MAX_EMBEDDING_DIMENSIONS} dimensions`
            );
          }
          otherOptions["query_embedding"] = embedding;

          const polymathResponse = await ph.query(otherOptions);
          return res.json(polymathResponse);
        } catch (error: any) {
          console.error("polymath host: query failed", error);
          return rejectRequest(res, 502, "upstream_error", "The vector store did not answer.");
        }
      });
      return;
    }
    // A parsed body means the caller sent JSON or urlencoded: this protocol is
    // multipart. Before this it fell through and never answered at all.
    return rejectRequest(res, 400, "unsupported_body", "Send query_embedding as multipart/form-data.");
  }
  else {
    return res.send({ error: "Only POST is supported." });
  }
}
