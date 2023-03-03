import {Polymath, PolymathEndpoint} from 'polymathjs';


export const config = {
  runtime: 'edge'
}

export default function (req: Request) {
  let p = new Polymath({
    apiKey: process.env.OPENAI_API_KEY,
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY,
      baseUrl: process.env.PINECONE_BASE_URL,
      namespace: process.env.PINECONE_NAMESPACE,
    }
})

  return p.ask("What is SLICE?");
}