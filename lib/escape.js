// HTML-injection primitives for the API functions that render data they do not
// control - in /ask-paul that is model output and vector-store metadata from the
// Polymath API. api/mentions.js applies the same two rules to webmention.io
// content with its own copy of these functions; this module is where a shared
// implementation can live when that file is next touched.
//
// Two rules, and every renderer that interpolates third-party data follows them:
//   1. escapeHtml every interpolated value - all five HTML-significant
//      characters, replaced globally;
//   2. safeUrl anything that becomes an href or src, dropping every scheme
//      except http(s), so `javascript:` and `data:` URLs render inert instead
//      of becoming executable anchors.
//
// A plain .js module rather than .ts on purpose: the node:test suite imports the
// exact code production runs, and Node cannot load a .ts under a plain
// `node --test` without a type-stripping flag.
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
};

export const safeUrl = (value) => {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return '';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
  // Emit the parsed form, so what the browser resolves is exactly what was
  // validated above - never the raw string that was handed to us.
  return escapeHtml(parsed.href);
};
