# THREAT_MODEL.md - paul.kinlan.me

Tracked in-repo threat model (the nightly factory threat-model station reads this file and treats Section 7 as recorded dispositions; do not report Section 7 items as active findings). Bootstrapped from current source. Deterministic ids `ep-N` refer to the scanner's entry points; `paul-kinlan-me-*`/ADR ids refer to in-code notes and beads.

## 1. System Overview & Architecture

A static Hugo site on Vercel plus serverless/edge handlers:

- `middleware.ts` - edge middleware for every path except `/api|/images|/javascripts|/css|/static|favicon.ico|.json` (ep-2). Counts User-Agents into Vercel KV through one atomic Lua `EVAL` admission script (ADR `paul-kinlan-me-7wx`): `ua:v2:<raw-UA>` (EX60) + one `ua:budget:<minute>` key.
- `api/activitypub/*` - single-actor federation. `inbox.ts` verifies HTTP signatures (`lib/http-signature`, `verifyInboxActivity.ts`, ep-3) and writes Follow/Like/Announce/Create/Undo into Firestore; `sendNote.ts` is an hourly cron (`vercel.json`) fan-out gated on `CRON_SECRET`; `actor.ts`, `outbox.ts`, `followers.ts` serve the public collection.
- `api/activitypub-html/render.ts` - `?url=`-keyed embed of stored likes/announces/replies, CDN-cached, admission-budgeted in KV before any Firestore read (ep-12).
- `api/mentions.js` - webmention.io proxy/renderer with `guardedFetch`, LRU + per-instance upstream fetch budget.
- `api/ask-paul.ts` (edge) renders model output; it calls its own `/api/polymath.js` (ep-11) which calls Polymath/OpenAI; `api/polymath/ask.ts` is the Pinecone vector-query route.
- `api/card.tsx` (edge OG image), `api/user-agents.ts` (KV scan + publish), `api/well-known/*`, `api/nodeinfo`.
- Dev/CI-only: `findprevtitle.py` (ep-1), `tools/*` (ep-7, ep-8/9, ep-10), `tests/*`, `.github/workflows/*`.

## 2. Trust Boundaries & Actors

Actors: **Site owner / author** (content + repo, trusted); **developer / lane** (repo tree, local tools, trusted); **anonymous visitor** (untrusted); **federated peer** (untrusted, but authenticated per request by HTTP signature); **webmention.io** (third-party transport, document untrusted); **Polymath/OpenAI/Pinecone** (third-party data and paid egress); **Vercel KV / Firestore** (stateful backends); **CI runner + model credential** (privileged).

Boundaries crossed: internet -> edge functions (unauthenticated); signature header -> verified actor identity -> Firestore; Firestore/federation data -> HTML rendered on this origin; this origin -> peer-controlled URLs (`guardedFetch`); CI -> `GEMINI_API_KEY`.

## 3. Explicitly Trusted (Non-Threats)

Auditors must NOT flag these:

- **Site-authored content** in `content/`, `layouts/`, `data/`: written by the owner, never a runtime injection source.
- **Dev/CI tooling** - `findprevtitle.py` passes a list argv to `subprocess.run(['git','log',...])` with no shell (ep-1); `tools/test-check-factory-gate.py` spawns `sys.executable` with a fixed script (ep-7); `tools/verify-deps-swap.mjs` listens on `127.0.0.1:0` (ep-8/ep-9); `tools/browser-gate/run.mjs` spawns commands from the repo-owned manifest with argv arrays, a detached process group and a hard timeout (ep-10).
- **Static component templates** - `air-horner.js` `innerHTML` assignments are literal CSS/markup with no interpolation (ep-4/ep-5); `share-button.js` builds its shadow DOM from constants, and its one dynamic navigation sink is scheme-gated by `ShareButton.navigationUrl()` (ep-6).
- **KV Lua scripts** - `middleware.ts` (ep-2) and `api/activitypub-html/render.ts` (ep-12) `eval` a module-constant `ADMISSION_SCRIPT`; keys/args are parameterized (no string-built Lua).
- **Guards, not bugs** - the `sha-256` digest regex and `timingSafeEqual` comparison (ep-3), `safeUrl`'s scheme drop, `escapeHtml`'s five-character replace, `BlockedRequestError` refusal paths, and `CRON_SECRET` constant-time check are enforcement.
- Environment secrets, the `file` sink and `runs/`/`findings/` artifacts, and the node:test/browser test suites.

## 4. Untrusted Attack Surfaces

- `/inbox` POST: body, `Signature`/`Digest`/`Date`/`Host` headers, `keyId`, activity shape (ep-3 path).
- `/followers`, `/outbox`, `/paul`, `/nodeinfo`, `/.well-known/*`, `/authorize_interaction`: unauthenticated reads.
- `/api/activitypub-html?url=` (ep-12): caller-controlled storage key + cache key.
- `/api/mentions?url=&count=` + `Referer` header.
- `/api/ask-paul?query=` (ep-11) and `/api/polymath`, `/api/polymath.js` multipart bodies/fields.
- `/api/card?width=&height=&title=`; `/api/user-agents`.
- `User-Agent` header (middleware, quotaless cardinality by design is the thing to watch).
- Remote actor documents, inboxes and key ids (SSRF + egress amplification); webmention.io document; model completion text and vector metadata; npm dependency tree (`@polymath-ai/*`, `multiparty`, `firebase-admin`, `@vercel/og`); GitHub Actions refs.

## 5. Bug-Shape Hints from History

The mined window reports 0 commits/0 beads, so the checked-in fix notes are the record. Recurring shapes and the question each implies:

1. **Unbounded caller-keyed state / read amplification** (`cu3` raw-UA KV keys, `stn4` cold-render Firestore reads, `40ak` whole-collection follower read, `rcvl` Referer-minted mention cache). Ask: does a new path mint a key or a read per caller input, and is the counter key itself bounded?
2. **Unsafe interpolation into third-party HTML** (`dmo`, mentions/activitypub-html/ask-paul XSS lanes). Ask: does every new renderer import `escapeHtml`/`safeUrl` from `lib/escape.js` for every text value and every `href`/`src`?
3. **Header named but not actually covered** (wrong-case `Digest`, digest value swap, missing `(request-target)` `jzm5`, host binding). Ask: is the header's VALUE compared, not merely listed in `headers=`?
4. **Signature proves the sender, not ownership of the row** (`hnk` Undo deleting another actor's Like/Announce). Ask: does every mutation re-check the verified actor against the stored record?
5. **Dependency error objects leaking credentials** (`e805`/`0elw`: openai AxiosError carries `Authorization`). Ask: is an upstream error object ever returned or logged rather than reduced to a status?
6. **Fail-open cache ordering** (`x216`, `6xr`): a cacheable header set before the read succeeds. Ask: are the reads awaited before the first status/header write, and does a storage failure answer no-store?
7. **A fix applied to one copy/sibling only** (`dmo` duplicated escape helpers; `y38y` option allowlist added to the legacy route only). Ask: was the fix applied everywhere the pattern exists? This is the shape behind finding `tm-option-allowlist-missing`.

## 6. Security Invariants for Auditors

1. No `fetch()` on a peer-controlled URL outside `guardedFetch()`/`isSafeFederationUrl()`; https only, no credentials in the URL, every resolved answer global-unicast, address pinned into the TLS connect, redirects refused (`lib/activitypub/utils/guardedFetch.js`).
2. Every third-party value rendered as HTML passes `escapeHtml`; every interpolated `href`/`src` passes `safeUrl` (parsed form emitted, non-http(s) dropped).
3. `/inbox` signatures must cover `(request-target)`, `date`, `digest` and (when required) `host`; the covered digest value is compared with the raw body via `timingSafeEqual`; 5-minute freshness window.
4. Every unauthenticated path that reads a datastore or a paid API has a per-minute admission budget that fails closed (503 + no-store) and commits nothing cacheable before the reads succeed. Currently violated by `api/ask-paul.ts` (no admission budget on paid Polymath/OpenAI egress; the middleware matcher excludes `/api` - tracked by paul-kinlan-me-gjsg) and by `api/user-agents.ts` (unauthenticated KV scan with no per-path admission cap).
5. Caller-controlled field/option NAMES are never forwarded to a dependency; use an allowlist (`api/polymath.js` `ASK_OPTION_KEYS`). Currently violated by `api/polymath/ask.ts`.
6. A caller-influenced value that becomes a storage id must be injective (`/`->`_` is not). Fixed for the interaction records (likes/announces/replies roots and messages, plus the activitypub-html read side) by paul-kinlan-me-je6t; the followers/actors collections remain on the legacy encoding (paul-kinlan-me-001q).
7. Secrets never reach responses or logs; untrusted text in logs only via `logSafeText`/`logSafePeerId`.
8. CI: third-party actions pinned to 40-hex SHAs, `contents: read`, no `secrets.` in a job-level `if`, paid credential gated by `preflight` (`tools/check-factory-gate.py`).

## 7. Explicit Exclusions (Wontfix / Accepted Risks)

- **Site-wide `script-src 'unsafe-inline'` in the global CSP** (`vercel.json` global header rule; deciding bead `paul-kinlan-me-qz62`, disposition bead `paul-kinlan-me-lsus`, accepted 2026-11-12): retained deliberately. First-party authored inline scripts ship in nine posts (goldmark renders them with `unsafe=true`) and in the `/ask-paul` UI; dropping `'unsafe-inline'` broke that authored content (review FAIL on b0d7e164, recorded in `tests/csp-contract.test.mjs`). Mitigations: the routes that render third-party data (`/api/activitypub-html*`, `/api/mentions*`) serve a scoped `default-src 'none'` policy with no script directive at all, pinned by `tests/csp-contract.test.mjs`. Re-open if the inline-script posts are converted to external scripts or a scoped policy regresses. Audit rows for this (rule ids `tm-csp-unsafe-inline*`, `tm-unsafe-inline-csp`) are this accepted risk; suppress them, do not re-report.
- **`/ask-paul` does not use `guardedFetch`** (ADR `9oi`, parked as `xvt`/`n2a`): the edge runtime lacks `node:https`/`node:dns`. Accepted because the target is a literal `https://paul.kinlan.me/api/polymath.js`, built with `URL` + `searchParams` (`lib/ask-paul-request.js`). Re-open if that origin ever becomes caller-influenced.
- **`/followers` publishes every follower actor id**: ActivityPub `OrderedCollectionPage` semantics; bounded to 20/page, 100 pages, edge-cached.
- **Raw User-Agent strings** are stored 60s and published by `/api/user-agents` (<=100 rows, 512-byte labels): the visitor dashboard's accepted design.
- **Federation endpoints carry no CSRF token**: they are authenticated by HTTP signature, not cookies.
- **Content authored in `content/**` is trusted**; a malicious contribution is a repo-integrity/review concern, not a runtime trust boundary.
- **Local dev/CI scripts and loopback test servers** (ep-1, ep-7, ep-8, ep-9, ep-10) are trusted; they never run with untrusted input.
