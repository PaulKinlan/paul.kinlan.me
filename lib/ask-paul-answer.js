// The answer body of /ask-paul, as markup.
//
// Both halves come from somewhere else: `completion` is text the model wrote and
// `infos` is metadata out of the vector store, so neither is trusted. The page
// that calls this interpolates the result as markup, which is only safe because
// every value here goes through escapeHtml or safeUrl first (lib/escape.js), and
// because nothing an attacker sends can add a tag or an attribute.
import { escapeHtml, safeUrl } from './escape.js';

export const renderAnswer = (payload) => {
  const completion = payload && payload.completion;
  const infos = payload && Array.isArray(payload.infos) ? payload.infos : [];

  const links = infos
    .map((bit) => {
      const url = safeUrl(bit && bit.url);
      const title = escapeHtml(bit && bit.title) || url;
      // A rejected URL (javascript:, data:, malformed) leaves nothing to link
      // to, so the title renders as inert text rather than an empty anchor.
      if (!url) return `<p class="link">${title}</p>`;
      return `<p class="link"><a href="${url}">${title}</a></p>`;
    })
    .join('');

  return `<article class="completion">${escapeHtml(completion)}</article><div class="results"><h2>Links</h2>
          ${links}</div>`;
};
