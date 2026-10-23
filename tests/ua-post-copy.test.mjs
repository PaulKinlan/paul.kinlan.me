// The front matter of content/2024-11-06-user-agents-hitting-my-site.md is the page
// description: layouts/partials/head.html falls back to `.Summary` and renders it as
// <meta name="description">, og:description, twitter:description and the JSON-LD
// description. When the admission quota landed (paul-kinlan-me-cu3, ADR 7wx) the body
// copy was corrected to "Recently admitted user agents" with a sampling notice, but the
// front matter kept promising "It logs every request" - false precisely during the bot
// spray the post is about, and the first thing a search engine or social card shows
// (paul-kinlan-me-5px). It had already been closed once on the wrong premise
// (paul-kinlan-me-1gb), so the sentence is pinned here rather than re-read by eye.
//
// Structural only: reads two files, runs no build and no browser, milliseconds.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const postPath = join(repoRoot, 'content', '2024-11-06-user-agents-hitting-my-site.md');
const post = readFileSync(postPath, 'utf8');

const frontMatter = post.match(/^---\n([\s\S]*?)\n---\n/);
assert.ok(frontMatter, 'the post must have YAML front matter');
const frontMatterBody = frontMatter[1];
const postBody = post.slice(frontMatter[0].length);

// The summary is written as a wrapped YAML block scalar: `summary:` then indented lines.
function yamlBlock(yaml, key) {
  const lines = yaml.split('\n');
  const start = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (start === -1) return null;
  const collected = [lines[start].slice(key.length + 1).trim()];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '') break;
    if (!/^\s+\S/.test(line)) break; // a new top-level key
    collected.push(line.trim());
  }
  return collected.join(' ').replace(/\s+/g, ' ').trim();
}

const summary = yamlBlock(frontMatterBody, 'summary');

test('the post summary describes the admitted sample, not every request', () => {
  assert.ok(summary && summary.length > 0, 'the post must keep a summary: it is the page description');

  // The defect this pins. "logs every request" / "all requests" stopped being true once
  // middleware.ts capped admissions at MAX_NEW_UA_PER_MINUTE.
  assert.doesNotMatch(summary, /\b(every|all)\s+(single\s+)?requests?\b/i, 'the summary must not promise every request');
  assert.doesNotMatch(summary, /\blogs?\s+(of\s+)?every\b/i, 'a blanket "logs every ..." claim is no longer true');

  // What replaced it has to be the actual behaviour: newest admissions only, a bounded
  // sample, per-agent counts in a 60-second window (ADR 7wx).
  assert.match(summary, /\bsample\b/i, 'the summary must say the table is a sample');
  assert.match(summary, /\bup to\s+100\b|\b100\b/i, 'the summary must state the 100-agent bound');
  assert.match(summary, /\b60[- ]second|\b60s\b/i, 'the summary must state the 60-second count window');
  assert.match(summary, /\badmit(ted|s)?\b/i, 'the summary must describe admission rather than unconditional logging');
});

test('the summary still describes my live demo, and stays short enough to be a description', () => {
  // Paul's demo is the point of the post; the fix is copy, never removing the live table.
  assert.match(summary, /live table/i, 'the summary still advertises the live table');
  assert.match(summary, /refresh(es|ing)?\s+every\s+minute/i, 'the table still refreshes every minute');
  assert.match(summary, /github/i, 'the summary keeps the code link');
  assert.ok(summary.length <= 320, `the description should stay short (got ${summary.length} chars)`);
});

test('the post body keeps the live demo and the sampling notice', () => {
  assert.match(postBody, /<tbody id="user-agents">/, 'the table the demo fills is still there');
  assert.match(postBody, /fetch\('\/api\/user-agents\.ts'\)/, 'the demo still fetches the live endpoint');
  assert.match(postBody, /<h4>Recently admitted user agents<\/h4>/, 'the heading still says admitted, not every');
  assert.match(postBody, /id="sampling-notice"/, 'the sampling notice element is still rendered');
  assert.match(postBody, /x-sampling-policy/, 'the notice is still driven by the API sampling header');
  assert.match(postBody, /bounded-sample-100/, 'the sampling policy name still matches the API');
  assert.doesNotMatch(postBody, /logs every request/i, 'the body copy was corrected with the quota; keep it that way');
  assert.doesNotMatch(postBody, /\buser agent of every request\b/i, 'the body must not promise every request either');
});

test('the page description is derived from this summary', () => {
  // The reason the front matter matters at all: head.html resolves the description from
  // .Summary, and that value is what <meta name="description"> and the social cards use.
  // If the layout ever stops doing that, this suite is being asked the wrong question.
  const head = readFileSync(join(repoRoot, 'layouts', 'partials', 'head.html'), 'utf8');
  assert.match(head, /with \.Summary/, 'head.html still falls back to .Summary for the description');
  assert.match(head, /<meta name="description" content="\{\{ \$description \}\}">/, 'meta description still comes from it');
  assert.match(head, /<meta property="og:description" content="\{\{ \$description \}\}" \/>/, 'og:description still comes from it');
});
