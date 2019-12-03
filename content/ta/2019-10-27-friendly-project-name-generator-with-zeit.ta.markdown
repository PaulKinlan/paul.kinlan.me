---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

வலையில் தளங்களை உருவாக்குவதை எளிதாக்கும் திட்டங்களுக்கான சில யோசனைகளை நான் பெற்றுள்ளேன் - யோசனைகளில் ஒன்று ஒரு <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> அடிப்படையிலான திட்டங்களுக்கான <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> (நான் zeit ஐ விரும்புகிறேன், ஆனால் அதற்கு ஒரு சிறிய பிட் மேஜிக் தேவைப்படுகிறது).

இந்த இடுகை புதிரின் ஒரு சிறிய பகுதியை மட்டுமே உள்ளடக்கியது: திட்ட பெயர்களை உருவாக்குதல்.

<a href="https://glitch.com/">Glitch</a> is a good example of this, when you create a project it gives it a whimsical randomly generated name. The team also created a <a href="https://github.com/FogCreek/friendly-words">good dictionary of fairly safe words</a> that combine well (and if you want they have a simple server to host).

எனவே, இந்த ஞாயிற்றுக்கிழமை பக்க திட்டம் <a <span class="notranslate">href=&quot;https://zeit.co/docs/v2/advanced/concepts/serverless-functions/&quot; &gt;serverless-functions</a> பயன்படுத்தி சீரற்ற திட்ட பெயர்களை உருவாக்க எளிய மைக்ரோ சேவையை உருவாக்குவதாகும். மற்றும் கிளிட்சிலிருந்து அகராதி.

<a href="https://friendly-project-name.kinlan.now.sh/">And here it is</a> (<a href="https://github.com/PaulKinlan/friendly-project-name-generator">code</a>), it's pretty short and not too complex.

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

உங்கள் திட்டத்தில் இதை நேரடியாக சேர்க்க விரும்பவில்லை எனில், https: // friendly-project-name க்கு ஒரு வலை கோரிக்கையை விடுப்பதன் மூலம் சீரற்ற திட்ட பெயர்களை (&quot;XY&quot; வடிவத்தில்) உருவாக்க HTTP இறுதிப்புள்ளியைப் பயன்படுத்தலாம். kinlan.now.sh/api/names, இது பின்வருவனவற்றைத் தரும்.

```javascript
["momentous-professor"]
```

<i>எண்ணிக்கை = x</i> இன் வினவல்-சரம் அளவுருவுடன் எத்தனை பெயர்களை உருவாக்குவது என்பதையும் நீங்கள் கட்டுப்படுத்தலாம், எ.கா. https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

பிரிப்பானின் வினவல்-சரம் அளவுருவுடன் நீங்கள் பிரிப்பானைக் கட்டுப்படுத்தலாம். அதாவது, பிரிப்பான் = @, எ.கா. https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

இந்த திட்டத்தின் மிகவும் பயனுள்ள அம்சம் என்னவென்றால், சொற்களின் கலவையானது ஆபத்தானதாக இருந்தால், கிளிட்ச் ரெப்போவை மீண்டும் நிகழாமல் பார்த்துக் கொள்வது எளிது.

திட்ட ஹோஸ்டிங் மிகவும் விலை உயர்ந்ததல்ல என்று கருதி நான் சேவையை தொடர்ந்து வைத்திருப்பேன், ஆனால் நீங்கள் எப்போதாவது இதேபோன்ற மைக்ரோ சேவையை உருவாக்க விரும்பினால் அதை நீங்களே குளோன் செய்யுங்கள்.

### நேரடி உதாரணம்

பின்வருவது செயல்பாட்டில் உள்ள API இன் மிக விரைவான எடுத்துக்காட்டு.

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

#### ஒற்றை பதில்
<pre id="basic"></pre>

#### பல மறுமொழிகள்
<pre id="many"></pre>

#### தனிப்பயன் பிரிப்பான்கள்
<pre id="separator"></pre>

{{&lt;raw-html&gt;}}

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

addEventListener (&#39;சுமை&#39;, () =&gt; {வழங்க (பெறுதல் (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;அடிப்படை&quot;); வழங்க (பெறுதல் (&quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; பல &quot;); ரெண்டர் (பெறு (&quot; https://friendly-project-name.kinlan.now.sh/ api / names? பிரிப்பான் = @ &quot;),&quot; பிரிப்பான் &quot;);});
</script>

{{&lt;/ raw-html&gt;}}
