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
    const contentType = (req.headers?.["content-type"] || "").toLowerCase();
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).send({ error: "Invalid request: multipart form-data required." });
    }

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

    let response = await p.ask(query, otherOptions);

    return res.send({ bits: response.bits() });
  } else {
    const { query = "What are web intents?" } = req.query;
    let response = await p.completion(query);
    return res.send(response);
  }
}
