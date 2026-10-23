// Pin the site's own newsletter template, not author-written content. Hugo will
// happily build if these browser hints or the Buttondown popup wiring disappear.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const template = readFileSync(new URL('../layouts/partials/moi.html', import.meta.url), 'utf8');

// Attribute names are matched case-insensitively, and a name may appear only once
// per tag: WHATWG HTML reports a duplicate-attribute parse error and keeps the
// FIRST occurrence, so a second value never reaches the browser. Folding every
// match through Object.fromEntries (last-wins) read the value the browser ignores
// and kept the contract green on markup that really behaved differently
// (paul-kinlan-me-yhp), so a duplicate fails here instead of being resolved.
function attributes(tag) {
  const attributes = new Map();
  const tagName = tag.match(/^<\s*([a-z0-9-]+)/i)?.[1].toLowerCase() ?? 'tag';
  for (const [, name, doubleQuoted, singleQuoted] of tag.matchAll(
    /\s([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi
  )) {
    const attribute = name.toLowerCase();
    assert.ok(!attributes.has(attribute),
      `duplicate ${tagName} attribute ${attribute}: HTML keeps the first occurrence, ` +
      'so the later value would silently not reach the browser');
    attributes.set(attribute, doubleQuoted ?? singleQuoted);
  }
  return Object.fromEntries(attributes);
}

// The attributes the contract pins, and the value each must have. Defined once so
// the removal and duplication mutation loops can never drift apart.
const CONTRACT_ATTRIBUTES = {
  autocomplete: 'email',
  inputmode: 'email',
  enterkeyhint: 'send',
  action: 'https://buttondown.email/api/emails/embed-subscribe/paul_kinlan',
  target: 'popupwindow',
  onsubmit: "window.open('https://buttondown.email/paul_kinlan', 'popupwindow')",
};

function checkNewsletter(source) {
  // The partial has a single static form. Keeping its input inside that form
  // prevents a stray attribute elsewhere in the partial satisfying the test.
  const forms = [...source.matchAll(/<form\b[^>]*>[\s\S]*?<\/form\s*>/gi)];
  assert.equal(forms.length, 1, 'newsletter partial must contain one form');
  const form = forms[0][0];
  // Sweep every tag in the form, not only the two whose attributes are asserted
  // below: an attribute this test never reads (the submit button's type) still
  // decides what the browser does, so a duplicate there must fail the contract too.
  for (const tag of form.matchAll(/<[a-z][^>]*>/gi)) attributes(tag[0]);
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
  for (const [attribute, value] of Object.entries(CONTRACT_ATTRIBUTES)) {
    const fragment = `${attribute}="${value}"`;
    assert.ok(template.includes(fragment), `fixture must contain ${attribute}`);
    assert.throws(() => checkNewsletter(template.replace(fragment, '')), { name: 'AssertionError' },
      `dropping ${attribute} must fail the contract`);
  }
});

// A decoy placed BEFORE the real attribute is the dangerous shape: the browser
// parses the decoy's value and ignores the real one, which is exactly what a
// last-wins reader got wrong. Every pinned attribute gets the same treatment so a
// new attribute cannot be added to CONTRACT_ATTRIBUTES and left duplicate-blind.
test('duplicating each newsletter attribute fails the contract', () => {
  for (const [attribute, value] of Object.entries(CONTRACT_ATTRIBUTES)) {
    const fragment = `${attribute}="${value}"`;
    assert.ok(template.includes(fragment), `fixture must contain ${attribute}`);
    assert.throws(
      () => checkNewsletter(template.replace(fragment, `${attribute}="__decoy__" ${fragment}`)),
      { name: 'AssertionError' },
      `duplicating ${attribute} must fail the contract`
    );
  }

  // The sweep covers the whole form, so a decoy on a tag whose attributes the
  // assertions above never read (the submit button) fails as well: `type="button"`
  // winning over `type="submit"` stops the form submitting natively, and the
  // contract would otherwise stay green.
  const button = '<button type="submit"';
  assert.ok(template.includes(button), 'fixture must contain the submit button');
  assert.throws(
    () => checkNewsletter(template.replace(button, '<button type="button" type="submit"')),
    { name: 'AssertionError' },
    'duplicating the submit button type must fail the contract'
  );
});

test('newsletter email input maintains visible focus-visible styling and does not strip focus rings', () => {
  const inputs = [...template.matchAll(/<input\b[^>]*>/gi)].map(match => attributes(match[0]));
  const emailInput = inputs.find(input => input.name === 'email');
  assert.ok(emailInput, 'newsletter form must contain email input');
  const classes = emailInput.class || '';
  assert.ok(!classes.includes('focus:outline-none'), 'email input must not strip outline on focus');
  assert.ok(!classes.includes('focus:ring-0'), 'email input must not collapse focus ring to 0');
  assert.ok(classes.includes('focus-visible:outline'), 'email input must include focus-visible outline');
});
