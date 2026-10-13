import { Polymath } from "@polymath-ai/client";

import { envInt, guardPaidRequest, isTimeoutError, rejectRequest, withDeadline } from "../lib/paid-api-guard.js";

// The client half of the Polymath protocol: it answers a question with OpenAI
// (an embedding call plus a gpt-3.5-turbo completion) over Pinecone results, on
// Paul's account, for whoever asks. It is public on purpose - /api/ask-paul.ts
// calls it server-side and the site advertises the protocol - so the only
// ceiling it has is the one applied at the top of this function.
export default async function (req, res) {
  res.contentType = "application/json";

  if (
    await guardPaidRequest(req, res, {
      bucket: "polymath-openai",
      limit: envInt("AI_RATE_LIMIT", 8),
      windowSeconds: envInt("AI_RATE_WINDOW_SECONDS", 60),
      // A per-IP limit bounds one caller, not the bill. This is the whole
      // endpoint's ceiling for a UTC day.
      dailyCap: envInt("AI_DAILY_REQUEST_CAP", 2000),
    })
  ) {
    return;
  }

  let p = new Polymath({
    apiKey: process.env.OPENAI_API_KEY,
    pinecone: {
      namespace: process.env.PINECONE_NAMESPACE,
    },
    completionOptions: {
      model: "gpt-3.5-turbo",
      // The library reserves 1024 tokens of answer per request
      // (@polymath-ai/client DEFAULT_MAX_TOKENS_COMPLETION); this is what we
      // can actually be billed for.
      max_tokens: envInt("AI_MAX_COMPLETION_TOKENS", 256),
    },
  });

  if (req.method == "POST") {
    // Left as it was: this branch throws a ReferenceError (`request` is not
    // defined, and the Node runtime's req has no formData()) before it can
    // reach OpenAI, so it costs nothing. It is a defect of its own, not this
    // guard's, and the limit above counts POSTs too.
    const body = await request.formData();
    const query = body.get("query");

    const otherOptions = {};

    for (const pair of body.entries()) {
      if (pair[0] !== "query") otherOptions[pair[0]] = pair[1];
    }

    let response = await p.ask(query, otherOptions);

    return res.send({ bits: response.bits() });
  }

  const maxQueryChars = envInt("AI_MAX_QUERY_CHARS", 300);
  const { query = "What are web intents?" } = req.query;

  // A repeated `?query=a&query=b` arrives as an array, and an unbounded query is
  // an unbounded embedding call.
  if (typeof query !== "string" || query.length > maxQueryChars) {
    return rejectRequest(
      res,
      400,
      "query_too_long",
      `query must be a string of at most ${maxQueryChars} characters`
    );
  }

  try {
    const response = await withDeadline(
      p.completion(query),
      envInt("AI_UPSTREAM_TIMEOUT_MS", 20000),
      "polymath completion"
    );
    return res.send(response);
  } catch (error) {
    if (isTimeoutError(error)) {
      return rejectRequest(res, 504, "upstream_timeout", "The model did not answer in time.");
    }
    throw error;
  }
}
