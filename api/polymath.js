import { Polymath } from "@polymath-ai/client";

export default async function (req, res) {
  res.contentType = "application/json";

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
    const body = await request.formData();
    const query = body.get("query");

    const otherOptions = {};

    for (const pair of body.entries()) {
      if (pair[0] !== "query") otherOptions[pair[0]] = pair[1];
    }

    let response = await p.ask(query, otherOptions);

    return res.send({ bits: response.bits() });
  } else {
    const { query = "What are web intents?" } = req.query;
    let response = await p.completion(query);
    return res.send(response);
  }
}
