import { Polymath } from "@polymath-ai/client";
import * as fs from "fs";
import { Form } from "multiparty";

// The same parse bounds as the live sibling (api/polymath/ask.ts): fields
// bounded, file bytes rejected immediately, so a POST to this legacy route
// cannot buffer or spool unbounded upload bytes either.
const FORM_LIMITS = {
  maxFields: 20,
  maxFilesSize: 1,
  maxFieldsSize: 1024 * 1024,
};

// @polymath-ai/client DOES NOT THROW on an upstream failure (paul-kinlan-me-e805).
// ask()/completion() catch their own Axios error and RETURN it -
// `{ error }` (node_modules/@polymath-ai/client/src/main.js: 'catch (error) {
// console.log("Error: ", error); return { error: error }; }'). So a try/catch
// around the call never fires, and the old `return res.send(response)` handed the
// error object straight to an unauthenticated caller. An openai@3.x failure is an
// AxiosError whose toJSON() carries config.headers.Authorization, i.e.
// "Bearer <OPENAI_API_KEY>", so provoking a 429 (or any upstream outage) was
// enough to read the key. Treat a returned { error } as a failure, answer a
// bounded 502 with a generic message, and never log the object itself - a
// console.error of an AxiosError prints the same header.
const UPSTREAM_FAILURE = { error: "Upstream request failed." };

const upstreamStatus = (error) => {
  const status = error?.status ?? error?.response?.status ?? error?.statusCode;
  return Number.isInteger(status) ? `status ${status}` : "no status";
};

const failUpstream = (res, branch, error) => {
  // Deliberately status-only: the error's own text and config must not reach the
  // function log (see the header comment above).
  console.error(`[polymath] legacy ${branch} upstream failure (${upstreamStatus(error)})`);
  return res.status(502).send(UPSTREAM_FAILURE);
};

// multiparty needs a real stream; VercelRequest is one. Fields come back as
// { name: [values] }.
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    new Form(FORM_LIMITS).parse(req, (err, fields, files) =>
      err ? reject(err) : resolve({ fields, files })
    );
  });

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
    // This was `await request.formData()` - there is no `request` binding in
    // scope, so every POST to the legacy route 500'd with a ReferenceError
    // before any work (paul-kinlan-me-pwk1). Parse the multipart body the way
    // the live route does.
    let fields;
    let files;
    try {
      ({ fields, files } = await parseForm(req));
    } catch (parseErr) {
      return res.status(400).send({ error: parseErr?.message || "Invalid form data." });
    }

    // maxFilesSize: 1 only rejects files of more than one byte, so tiny (<=1
    // byte) parts still reach disk. Reject any file part and unlink what the
    // parser spooled, exactly as the live sibling (api/polymath/ask.ts) does
    // (paul-kinlan-me-ms52, the phce shape).
    if (files && Object.keys(files).length > 0) {
      for (const fileList of Object.values(files)) {
        if (Array.isArray(fileList)) {
          for (const file of fileList) {
            if (file?.path) {
              try {
                fs.unlinkSync(file.path);
              } catch {
                // ignore cleanup error
              }
            }
          }
        }
      }
      return res.status(400).send({ error: "File uploads are not supported." });
    }

    const first = (name) => (Array.isArray(fields?.[name]) ? fields[name][0] : undefined);
    const query = first("query");
    if (typeof query !== "string" || query.trim() === "") {
      return res.status(400).send({ error: "Missing query." });
    }

    const otherOptions = {};
    for (const [key, value] of Object.entries(fields)) {
      if (key !== "query") otherOptions[key] = value;
    }

    let response;
    try {
      response = await p.ask(query, otherOptions);
    } catch (error) {
      return failUpstream(res, "ask", error);
    }
    // The library's real failure contract is a returned { error }, not a throw.
    if (response?.error) {
      return failUpstream(res, "ask", response.error);
    }
    if (typeof response?.bits !== "function") {
      return failUpstream(res, "ask");
    }

    return res.send({ bits: response.bits() });
  } else {
    const { query = "What are web intents?" } = req.query;
    let response;
    try {
      response = await p.completion(query);
    } catch (error) {
      return failUpstream(res, "completion", error);
    }
    if (response?.error) {
      return failUpstream(res, "completion", response.error);
    }

    return res.send(response);
  }
}
