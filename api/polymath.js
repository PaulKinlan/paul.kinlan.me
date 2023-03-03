import { Polymath } from "@polymath-ai/client/main.js";

export default async function (req, res) {
  res.contentType = "application/json";
  const { question = "What are web intents?" } = req.query;
  
  let p = new Polymath({
    apiKey: process.env.OPENAI_API_KEY,
    pinecone: {
      namespace: process.env.PINECONE_NAMESPACE,
    },
  });

  let response = await p.completion(question);
  return res.send(response);
}
