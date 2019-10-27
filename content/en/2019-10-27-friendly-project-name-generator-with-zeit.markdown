---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

I've got some ideas for projects that make it easier to create sites on the web - one of the ideas is to make a <a href="https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop">netlify-like drag and drop interface</a> for <a href="https://zeit.co/">zeit</a> based projects (I like zeit but it requires a tiny bit of cli magic to deploy).

This post covers just one small piece of the puzzle: creating project names.

<a href="https://glitch.com/">Glitch</a> is a good example of this, when you create a project it gives it a whimsical randomly generated name. The team also created a <a href="https://github.com/FogCreek/friendly-words">good dictionary of fairly safe words</a> that combine well (and if you want they have a simple server to host).

So, the side project this Sunday was to create a simple micro-service to generate random project names using Zeit's <a href="https://zeit.co/docs/v2/advanced/concepts/serverless-functions/">serverless-functions</a>&nbsp;and the dictionary from Glitch.

<a href="https://friendly-project-name.kinlan.now.sh/">And here it is</a> (<a href="https://github.com/PaulKinlan/friendly-project-name-generator">code</a>), it's pretty short and not too complex.

```
const words = require("friendly-words");

function generate(count = 1, separator = "-") {
  const { predicates, objects } = words;
  const pCount = predicates.length;
  const oCount = objects.length;
  const output = [];

  for (let i = 0; i < count; i++) {
    const pair = [predicates[Math.floor(Math.random() * pCount)], objects[Math.floor(Math.random() * oCount)]];
    output.push(pair.join(separator));
  }

  return output;
}

module.exports = { generate }
```

If you don't want to include it in your project directly, you can use the HTTP endpoint to generate random project names (in the form of "X-Y") by making a web request to&nbsp;https://friendly-project-name.kinlan.now.sh/api/names, which will return something like the following.

```
["momentous-professor"]
```

You can also control how many names to generate with the a query-string parameter of&nbsp;<i>count=x</i>, e.g.&nbsp;https://friendly-project-name.kinlan.now.sh/api/names?count=100

```
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

You can control separator with the a query-string parameter of&nbsp;separator. i.e, separator=@&nbsp;, e.g. https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

A very useful aspect of this project is that if a combination of words tends towards being offensive, it is easy to update the Glitch repo to ensure that it doesn't happen again.

Assuming that the project hosting doesn't get too expensive I will keep the service up, but feel free to clone it yourselves if you ever want to create a similar micro-service.

