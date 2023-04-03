/// <reference path="types.d.ts"/>
import { Polymath } from "@polymath-ai/client";
/// <reference path="types.d.ts"/>
import { PolymathPinecone } from "@polymath-ai/host";

import { Form } from "multiparty";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function decodeEmbedding(data: string) {
  const buffer = Buffer.from(data, "base64");
  return Array.from(
    new Float32Array(new Uint8Array(buffer).buffer)
  );
}

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('content-type', 'application/json');

  let ph = new PolymathPinecone({
    namespace: process.env.PINECONE_NAMESPACE,
  });

  if (req.method == "POST") {
    const { body } = req;
    if (body == null) {
      let form = new Form();
      form.parse(req, (err: any, fields: any) => {
        const entries = Object.entries(fields);
        const otherOptions: { [key: string]: any } = {};
        for (const [key, value] of entries) {
          otherOptions[key] = value;
        }

        if ("query_embedding" in otherOptions) {
          otherOptions["query_embedding"] = decodeEmbedding(otherOptions["query_embedding"][0]);
        }

        return ph.query(otherOptions).then((polymathResponse: any) => { 
          return res.json(polymathResponse);
        });
      });
    }
  }
  else {
    return res.send({ error: "Only POST is supported." });
  }
}
