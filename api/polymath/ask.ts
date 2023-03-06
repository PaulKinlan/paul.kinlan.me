import { Polymath } from "@polymath-ai/client/main.js";
import { Form } from "multiparty";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('content-type', 'application/json');

  let p = new Polymath({
    apiKey: process.env.OPENAI_API_KEY,
    pinecone: {
      namespace: process.env.PINECONE_NAMESPACE,
    },
    completionOptions: {
      model: "gpt-3.5-turbo",
    },
  });

  if (req.method == "POST") {
    const { query, body } = req;
    let askQuery = "";
    if (body && body.query) {
      askQuery = body.query;
    } else if (query.query) {
      askQuery = <string>query.query;
    }

    if (body == null) {
      let form = new Form();
      form.parse(req, (err: any, fields: any) => {
        const entries = Object.entries(fields);
        askQuery = fields["query"] || askQuery;
        const otherOptions = {};
        for (const [key, value] of entries) {
          if (key !== "query") otherOptions[key] = value;
        }

        return p.ask(askQuery, otherOptions).then(polymathResponse => {
          const bits = polymathResponse.bits();
    
          return res.send({ 
            version: 1, 
            "embedding_model": otherOptions.query_embedding_model[0],
            "omit": "embedding",
            "//sort": "similarity",
            "details": {
              "counts": {
                  "bits": bits.length
              }
          },
            "bits": bits })
        }
        )
      });
    }
    else {
      const entries = body.entries();
    }
  }
  else {
    return res.send({ error: "Only POST is supported." });
  }
}
