---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

ਮੇਰੇ ਕੋਲ ਪ੍ਰੋਜੈਕਟਾਂ ਲਈ ਕੁਝ ਵਿਚਾਰ ਹਨ ਜੋ ਵੈੱਬ ਤੇ ਸਾਈਟਾਂ ਬਣਾਉਣਾ ਸੌਖਾ ਬਣਾਉਂਦੇ ਹਨ - ਵਿਚਾਰਾਂ ਵਿਚੋਂ ਇਕ ਹੈ [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) [zeit](https://zeit.co/) ਅਧਾਰਤ ਪ੍ਰਾਜੈਕਟਾਂ ਲਈ ਇਕ [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) ਬਣਾਉਣਾ (ਮੈਨੂੰ ਜ਼ੀਇਟ ਪਸੰਦ ਹੈ ਪਰ ਇਸ ਨੂੰ ਲਗਾਉਣ ਲਈ ਥੋੜਾ ਜਿਹਾ ਕਲਾਇਟ ਮੈਜਿਕ ਦੀ ਜ਼ਰੂਰਤ ਹੈ).

ਇਹ ਪੋਸਟ ਬੁਝਾਰਤ ਦੇ ਸਿਰਫ ਇੱਕ ਛੋਟੇ ਟੁਕੜੇ ਨੂੰ ਕਵਰ ਕਰਦੀ ਹੈ: ਪ੍ਰੋਜੈਕਟ ਦੇ ਨਾਮ ਬਣਾਉਣਾ.

[Glitch](https://glitch.com/) ਇਸ ਦੀ ਇੱਕ ਚੰਗੀ ਉਦਾਹਰਣ ਹੈ, ਜਦੋਂ ਤੁਸੀਂ ਇੱਕ ਪ੍ਰੋਜੈਕਟ ਬਣਾਉਂਦੇ ਹੋ ਇਹ ਇਸਨੂੰ ਇੱਕ [Glitch](https://glitch.com/) ਨਾਲ ਪੈਦਾ ਹੋਇਆ ਨਾਮ ਦਿੰਦਾ ਹੈ. ਟੀਮ ਨੇ ਇੱਕ [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) ਵੀ ਬਣਾਇਆ ਜੋ ਚੰਗੀ ਤਰ੍ਹਾਂ ਜੋੜਦਾ ਹੈ (ਅਤੇ ਜੇ ਤੁਸੀਂ ਚਾਹੁੰਦੇ ਹੋ ਤਾਂ ਉਨ੍ਹਾਂ ਦੀ ਮੇਜ਼ਬਾਨੀ ਲਈ ਇੱਕ ਸਧਾਰਨ ਸਰਵਰ ਹੈ).

ਇਸ ਲਈ, ਇਸ ਐਤਵਾਰ ਵਾਲੇ ਪਾਸੇ ਦਾ ਪ੍ਰੋਜੈਕਟ ਜ਼ੀਟ ਦੇ [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) ਅਤੇ [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) ਤੋਂ ਸ਼ਬਦਕੋਸ਼ ਦੀ ਵਰਤੋਂ ਕਰਦਿਆਂ ਬੇਤਰਤੀਬੇ ਪ੍ਰੋਜੈਕਟ ਦੇ ਨਾਮ ਤਿਆਰ ਕਰਨ ਲਈ ਇੱਕ ਸਧਾਰਣ ਮਾਈਕਰੋ-ਸਰਵਿਸ ਤਿਆਰ ਕਰਨਾ ਸੀ.

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), ਇਹ ਬਹੁਤ ਛੋਟਾ ਹੈ ਅਤੇ ਬਹੁਤ ਗੁੰਝਲਦਾਰ ਨਹੀਂ.

```javascript
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

ਜੇ ਤੁਸੀਂ ਇਸ ਨੂੰ ਸਿੱਧਾ ਆਪਣੇ ਪ੍ਰੋਜੈਕਟ ਵਿਚ ਸ਼ਾਮਲ ਨਹੀਂ ਕਰਨਾ ਚਾਹੁੰਦੇ, ਤਾਂ ਤੁਸੀਂ https: // ਦੋਸਤਾਨਾ-ਪ੍ਰੋਜੈਕਟ-ਨਾਮ ਦੀ ਵੈਬ ਬੇਨਤੀ ਕਰਕੇ ਬੇਤਰਤੀਬੇ ਪ੍ਰੋਜੈਕਟ ਦੇ ਨਾਮ (&quot;XY&quot; ਦੇ ਰੂਪ ਵਿਚ) ਬਣਾਉਣ ਲਈ HTTP ਐਂਡ ਪੁਆਇੰਟ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ. kinlan.now.sh/api/names, ਜੋ ਕਿ ਹੇਠਾਂ ਦਿੱਤੀ ਕੁਝ ਵਾਪਸੀ ਕਰੇਗਾ.

```javascript
["momentous-professor"]
```

ਤੁਸੀਂ <i>ਕਾਉਂਟ = x</i> ਦੇ ਕਿ theਰੀ-ਸਤਰ ਪੈਰਾਮੀਟਰ ਦੇ ਨਾਲ ਕਿੰਨੇ ਨਾਮ ਉਤਪੰਨ ਕਰਨ ਲਈ ਨਿਯੰਤਰਿਤ ਕਰ ਸਕਦੇ ਹੋ, ਉਦਾਹਰਣ ਲਈ https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

ਤੁਸੀਂ ਵੱਖਰੇਵੇਂ ਦੇ ਕਿ queryਰੀ-ਸਤਰ ਪੈਰਾਮੀਟਰ ਨਾਲ ਵੱਖਰੇਵੇਂ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰ ਸਕਦੇ ਹੋ. ਭਾਵ, ਵੱਖਰੇਟਰ = @, ਉਦਾਹਰਨ ਲਈ https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

ਇਸ ਪ੍ਰੋਜੈਕਟ ਦਾ ਇੱਕ ਬਹੁਤ ਲਾਭਦਾਇਕ ਪਹਿਲੂ ਇਹ ਹੈ ਕਿ ਜੇ ਸ਼ਬਦਾਂ ਦਾ ਸੁਮੇਲ ਅਪਮਾਨਜਨਕ ਹੋਣ ਵੱਲ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਗਲਿਚ ਰੈਪੋ ਨੂੰ ਅਪਡੇਟ ਕਰਨਾ ਆਸਾਨ ਹੁੰਦਾ ਹੈ ਤਾਂ ਜੋ ਇਹ ਯਕੀਨੀ ਬਣਾਇਆ ਜਾ ਸਕੇ ਕਿ ਇਹ ਦੁਬਾਰਾ ਨਹੀਂ ਵਾਪਰਦਾ.

ਇਹ ਮੰਨਦੇ ਹੋਏ ਕਿ ਪ੍ਰੋਜੈਕਟ ਦੀ ਮੇਜ਼ਬਾਨੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਮਹਿੰਗੀ ਨਹੀਂ ਹੋ ਰਹੀ ਮੈਂ ਸੇਵਾ ਨੂੰ ਜਾਰੀ ਰੱਖਾਂਗਾ, ਪਰ ਇਸ ਨੂੰ ਆਪਣੇ ਆਪ ਨੂੰ ਕਲੋਨ ਕਰਨ ਲਈ ਬੇਝਿਜਕ ਮਹਿਸੂਸ ਕਰੋ ਜੇ ਤੁਸੀਂ ਕਦੇ ਵੀ ਅਜਿਹੀ ਮਾਈਕਰੋ-ਸਰਵਿਸ ਬਣਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ.

### ਲਾਈਵ ਉਦਾਹਰਣ

ਇਸ ਤੋਂ ਬਾਅਦ ਕਾਰਜ ਵਿੱਚ ਏਪੀਆਈ ਦੀ ਇੱਕ ਤੇਜ਼ ਉਦਾਹਰਣ ਹੈ.

```javascript
const render = (promise, elementId) => {
  promise.then(async(response) => {
    const el = document.getElementById(elementId);
    el.innerText = await response.text();
  })
};


onload = () => {
  render(fetch("https://friendly-project-name.kinlan.now.sh/api/names"), "basic");
  render(fetch("https://friendly-project-name.kinlan.now.sh/api/names?count=100"), "many");
  render(fetch("https://friendly-project-name.kinlan.now.sh/api/names?separator=@"), "separator");
}
```

#### ਸਿੰਗਲ ਜਵਾਬ
<pre id="basic"></pre>

#### ਬਹੁਤ ਸਾਰੇ ਰਿਸਪਾਂਸਾਂ
<pre id="many"></pre>

#### ਕਸਟਮ ਵੱਖਰੇਵੇ
<pre id="separator"></pre>

{{&lt;Raw-html&gt;}

<style>
pre {
  overflow: auto;
}
</style>
<script>
const render = (promise, elementId) => {
  promise.then(async(response) => {
    const el = document.getElementById(elementId);
    el.innerText = await response.text();
  })
};

addEventListener (&#39;load&#39;, () =&gt; nder ਪੇਸ਼ ਕਰੋ (ਪ੍ਰਾਪਤ ਕਰੋ (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;ਬੇਸਿਕ&quot;); ਪੇਸ਼ ਕਰੋ (ਪ੍ਰਾਪਤ ਕਰੋ (&quot;https: // ਮਿੱਤਰਤਾਪੂਰਵਕ- ਪ੍ਰੋਜੈਕਟ- ਨਾਮ.ਕਿੰਨੀਨ.ਓਨ.ਸ਼ / ਅਾਪ / ਨਾਮ ?count=100 &quot;),&quot; ਬਹੁਤ ਸਾਰੇ &quot;); ਪੇਸ਼ ਕਰੋ (ਪ੍ਰਾਪਤ ਕਰੋ (&quot; https://friendly-project-name.kinlan.now.sh/ ਏਪੀਆਈ / ਨਾਮ? ਅਲੱਗ ਕਰਨ ਵਾਲੇ = @ &quot;),&quot; ਵੱਖਰੇਟਰ &quot;);});
</script>

{{&lt;/ Raw-html&gt;}
