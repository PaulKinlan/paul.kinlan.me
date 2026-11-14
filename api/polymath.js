import { Polymath } from "@polymath-ai/client";
import * as fs from "fs";
import { Form } from "multiparty";
import { POLYMATH_ASK_OPTION_KEYS, pickPermittedOptions } from "../lib/polymath-options.js";

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

// Upstream option allowlist (paul-kinlan-me-y38y): exactly the ask() option keys
// @polymath-ai/client interprets that are meaningful on THIS route - version,
// query_embedding_model, count, count_type, omit and sort (results.js). Before
// this, EVERY caller-chosen multipart field name was forwarded as an upstream
// option, so an unauthenticated caller picked the vector-query option names as
// well as their values. `access_token` (endpoint.js) is deliberately absent:
// this route configures no polymath servers, and a caller-chosen token must
// never be forwarded. `query_embedding` is deliberately absent too
// (paul-kinlan-me-dciv): the route never decodes it (the sibling's
// decodeEmbedding lives in ask.ts), so the raw multipart string became the
// Pinecone query vector - an unauthenticated caller skipping embedding
// generation with a vector that can only fail upstream. (The remaining keys
// are inert here - results.js only reads them in response(), and this route
// returns bits() - but they are the client's documented ask() surface, so
// they stay.) Field COUNT and total BYTES were already capped by
// FORM_LIMITS (maxFields: 20, maxFieldsSize: 1MB); what was missing was the
// key allowlist. Unknown keys are DROPPED, not rejected, so a legacy client
// sending a retired option keeps working with the options it is allowed.
// The list lives in lib/polymath-options.js so this route and the live
// /api/polymath/ask.ts sibling cannot drift into two different allowlists
// (paul-kinlan-me-i6sd).

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

// ---------------------------------------------------------------------------
// LOG REDACTION (paul-kinlan-me-0elw). Sanitising this route's own console.error
// is not enough: @polymath-ai/client prints the raw error itself before it
// returns it - `console.log("Error: ", error)` at src/main.js:236 - and Node's
// inspection of an openai@3 AxiosError walks config.headers.Authorization, so
// 'Bearer <OPENAI_API_KEY>' lands in the function log every time an upstream
// call fails. The dependency has no logger hook, so the boundary is the console:
// install a REDACTING wrapper once per function process. It redacts rather than
// suppresses, so unrelated log lines still appear - an Error becomes
// `Name: message (status N)` and any bearer/Authorization/sk- value in a string
// is masked. Never prints more than the status of the failure.
const REDACTED = "[redacted]";
const MAX_LOG_DEPTH = 4;

const redactLogText = (text) =>
  text
    // Authorization first, consuming a "Bearer " prefix, so the later rules do not
    // redact the same value twice (a "Bearer sk-..." pair would otherwise become
    // two [redacted] tokens).
    .replace(/(authorization["']?\s*[:=]\s*["']?(?:bearer\s+)?)[^\s"',}]+/gi, `$1${REDACTED}`)
    .replace(/(bearer\s+)[A-Za-z0-9._~+/=-]+/gi, `$1${REDACTED}`)
    .replace(/\bsk-[A-Za-z0-9_-]{8,}/g, REDACTED);

const describeError = (error) => {
  try {
    const name = error.name || "Error";
    const message = typeof error.message === "string" ? error.message : "";
    const status = error.status ?? error.statusCode ?? error.response?.status;
    const suffix = Number.isInteger(status) ? ` (status ${status})` : "";
    return `${name}${message ? `: ${message}` : ""}${suffix}`;
  } catch {
    return "<unloggable-error>";
  }
};

const sanitiseLogValue = (value, depth = 0, seen = new WeakSet()) => {
  if (typeof value === "string") return redactLogText(value);
  if (value instanceof Error) return describeError(value);
  if (typeof value !== "object" || value === null) return value;
  if (depth >= MAX_LOG_DEPTH) return "<object>";
  if (seen.has(value)) return "<circular>";
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sanitiseLogValue(item, depth + 1, seen));
  const sanitised = {};
  for (const [key, item] of Object.entries(value)) {
    sanitised[key] = sanitiseLogValue(item, depth + 1, seen);
  }
  return sanitised;
};

// Module-scoped rather than global: one install per loaded handler module, which
// is one per function process in production. A test that bundles the handler again
// gets its own instance and therefore its own install.
let logRedactionInstalled = false;
const installLogRedaction = () => {
  if (logRedactionInstalled) return;
  logRedactionInstalled = true;
  for (const method of ["log", "error", "warn", "info"]) {
    const original = console[method];
    if (typeof original !== "function") continue;
    console[method] = (...args) => original.apply(console, args.map((arg) => sanitiseLogValue(arg)));
  }
};

installLogRedaction();

// multiparty needs a real stream; VercelRequest is one. Fields come back as
// { name: [values] }.
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    new Form(FORM_LIMITS).parse(req, (err, fields, files) =>
      err ? reject(err) : resolve({ fields, files })
    );
  });

// One call, two bounds (paul-kinlan-me-et2t). This route used to treat EVERY
// non-POST method as the GET branch, so PUT/PATCH/DELETE - and any drive-by GET
// a third-party page could fire from an <img> - reached a paid OpenAI
// completion, with a query of whatever length was sent. GET stays allowed
// because /ask-paul's own request goes through it (lib/ask-paul-request.js);
// everything else is refused before a Polymath client exists. The upstream
// failure half is NOT this change's business - it already lives above
// (failUpstream, paul-kinlan-me-e805/0elw): the dependency returns { error }
// rather than throwing, and logging the object would leak the bearer token.
export const MAX_QUERY_CHARS = 512;
const ALLOWED_METHODS = "GET, POST";
const DEFAULT_QUERY = "What are web intents?";

const reject = (res, status, error) => res.status(status).send({ error });

export default async function (req, res) {
  res.contentType = "application/json";

  const method = typeof req.method === "string" ? req.method.toUpperCase() : "";
  if (method !== "GET" && method !== "POST") {
    if (typeof res.setHeader === "function") res.setHeader("Allow", ALLOWED_METHODS);
    return reject(res, 405, `Method ${method || "unknown"} is not allowed. Use ${ALLOWED_METHODS}.`);
  }

  let p = new Polymath({
    apiKey: process.env.OPENAI_API_KEY,
    pinecone: {
      namespace: process.env.PINECONE_NAMESPACE,
    },
    completionOptions: {
      model: "gpt-3.5-turbo",
    },
  });

  // Dispatch on the SAME upper-cased value the gate checked: testing raw
  // req.method here meant a case-variant POST ("post"/"Post") passed the gate
  // and then fell into the GET completion branch (paul-kinlan-me-1kgg).
  if (method === "POST") {
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

    const otherOptions = pickPermittedOptions(fields, POLYMATH_ASK_OPTION_KEYS);

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
    // A repeated ?query= arrives as an array; anything else that is not a string
    // is not a query, and an over-long one is refused rather than embedded
    // (paul-kinlan-me-et2t: the GET branch had no bound at all).
    const raw = Array.isArray(req.query?.query) ? req.query.query[0] : req.query?.query;
    if (raw !== undefined && typeof raw !== "string") {
      return reject(res, 400, "query must be a single string.");
    }
    const query = raw === undefined ? DEFAULT_QUERY : raw;
    if (query.length > MAX_QUERY_CHARS) {
      return reject(res, 400, `query must be at most ${MAX_QUERY_CHARS} characters.`);
    }
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
