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
// The reads are cheap but not free, and nothing bounded them.
//
// A 1536-dimension float32 vector is ~8 KiB of base64; this is headroom over
// that without letting a caller buffer something arbitrary.
const MAX_EMBEDDING_CHARS = 32768;
const MAX_FORM_FIELDS = 16;
const MAX_FORM_FIELD_BYTES = 65536;

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('content-type', 'application/json');

  if (
    await guardPaidRequest(req, res, {
      bucket: "polymath-host",
      limit: envInt("AI_HOST_RATE_LIMIT", 30),
      windowSeconds: envInt("AI_RATE_WINDOW_SECONDS", 60),
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
      form.parse(req, async (err: any, fields: any) => {
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
        otherOptions["query_embedding"] = decodeEmbedding(encoded);

        const polymathResponse = await ph.query(otherOptions);
        return res.json(polymathResponse);
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
