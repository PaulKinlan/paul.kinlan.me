// Pin the site's own newsletter template, not author-written content. Hugo will
// happily build if these browser hints or the Buttondown popup wiring disappear.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const template = readFileSync(new URL('../layouts/partials/moi.html', import.meta.url), 'utf8');

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/\s([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)]
      .map(([, name, doubleQuoted, singleQuoted]) => [name.toLowerCase(), doubleQuoted ?? singleQuoted])
  );
}

function checkNewsletter(source) {
  // The partial has a single static form. Keeping its input inside that form
  // prevents a stray attribute elsewhere in the partial satisfying the test.
  const forms = [...source.matchAll(/<form\b[^>]*>[\s\S]*?<\/form\s*>/gi)];
  assert.equal(forms.length, 1, 'newsletter partial must contain one form');
  const form = forms[0][0];
  const formTag = attributes(form.match(/^<form\b[^>]*>/i)[0]);
  assert.equal(formTag.action, 'https://buttondown.email/api/emails/embed-subscribe/paul_kinlan');
  assert.equal(formTag.method?.toLowerCase(), 'post');
  assert.equal(formTag.target, 'popupwindow');
  assert.equal(formTag.onsubmit, "window.open('https://buttondown.email/paul_kinlan', 'popupwindow')");

  const inputs = [...form.matchAll(/<input\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const emailInputs = inputs.filter((input) => input.name === 'email');
  assert.equal(emailInputs.length, 1, 'newsletter form must contain one named email input');
  const email = emailInputs[0];
  assert.equal(email.type, 'email');
  assert.equal(email.autocomplete, 'email');
  assert.equal(email.inputmode, 'email');
  assert.equal(email.enterkeyhint, 'send');
}

test('newsletter input hints and Buttondown popup wiring remain in the form', () => {
  checkNewsletter(template);
});

test('removing each newsletter hint or popup attribute fails the contract', () => {
  for (const [attribute, value] of Object.entries({
    autocomplete: 'email',
    inputmode: 'email',
    enterkeyhint: 'send',
    action: 'https://buttondown.email/api/emails/embed-subscribe/paul_kinlan',
    target: 'popupwindow',
    onsubmit: "window.open('https://buttondown.email/paul_kinlan', 'popupwindow')",
  })) {
    const fragment = `${attribute}="${value}"`;
    assert.ok(template.includes(fragment), `fixture must contain ${attribute}`);
    assert.throws(() => checkNewsletter(template.replace(fragment, '')), { name: 'AssertionError' },
      `dropping ${attribute} must fail the contract`);
  }
});
