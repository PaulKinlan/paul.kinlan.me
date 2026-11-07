// The ask-paul edge page (api/ask-paul.ts) renders <main aria-busy="true"> and
// lets this asset flip it once the answer is in the document. Kept as an
// external script so the /ask-paul CSP can drop 'unsafe-inline': the page
// renders third-party model output, so its policy allows only first-party
// scripts (paul-kinlan-me-f4y2).
const main = document.getElementById('ask-paul-main');
if (main) main.setAttribute('aria-busy', 'false');
