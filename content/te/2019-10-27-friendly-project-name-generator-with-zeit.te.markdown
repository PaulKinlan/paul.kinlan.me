---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

వెబ్‌లో సైట్‌లను సృష్టించడం సులభతరం చేసే ప్రాజెక్ట్‌ల కోసం నాకు కొన్ని ఆలోచనలు వచ్చాయి - ఆలోచనలలో ఒకటి <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> ఆధారిత ప్రాజెక్ట్‌ల కోసం <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> (నాకు zeit అంటే ఇష్టం, కానీ అమలు చేయడానికి చిన్న క్లి మ్యాజిక్ అవసరం).

ఈ పోస్ట్ పజిల్ యొక్క ఒక చిన్న భాగాన్ని మాత్రమే కవర్ చేస్తుంది: ప్రాజెక్ట్ పేర్లను సృష్టించడం.

<a href="https://glitch.com/">Glitch</a> is a good example of this, when you create a project it gives it a whimsical randomly generated name. The team also created a <a href="https://github.com/FogCreek/friendly-words">good dictionary of fairly safe words</a> that combine well (and if you want they have a simple server to host).

కాబట్టి, ఈ ఆదివారం సైడ్ ప్రాజెక్ట్ జీట్ యొక్క <a <span class="notranslate">href=&quot;https://zeit.co/docs/v2/advanced/concepts/serverless-functions/&quot; &gt;serverless-functions</a> ఉపయోగించి యాదృచ్ఛిక ప్రాజెక్ట్ పేర్లను రూపొందించడానికి సరళమైన సూక్ష్మ సేవను సృష్టించడం. మరియు గ్లిచ్ నుండి నిఘంటువు.

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

మీరు దీన్ని నేరుగా మీ ప్రాజెక్ట్‌లో చేర్చకూడదనుకుంటే, https: // friendly-project-name కు వెబ్ అభ్యర్థన చేయడం ద్వారా యాదృచ్ఛిక ప్రాజెక్ట్ పేర్లను (&quot;XY&quot; రూపంలో) రూపొందించడానికి మీరు HTTP ఎండ్ పాయింట్‌ను ఉపయోగించవచ్చు. kinlan.now.sh/api/names, ఇది కిందివాటిని తిరిగి ఇస్తుంది.

```javascript
["momentous-professor"]
```

<i>కౌంట్ = x</i> యొక్క ప్రశ్న-స్ట్రింగ్ పరామితితో ఎన్ని పేర్లను ఉత్పత్తి చేయాలో కూడా మీరు నియంత్రించవచ్చు, ఉదా. Https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

సెపరేటర్ యొక్క ప్రశ్న-స్ట్రింగ్ పరామితితో మీరు సెపరేటర్‌ను నియంత్రించవచ్చు. అనగా, సెపరేటర్ = @, ఉదా. https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

ఈ ప్రాజెక్ట్ యొక్క చాలా ఉపయోగకరమైన అంశం ఏమిటంటే, పదాల కలయిక అప్రియమైనదిగా ఉంటే, గ్లిచ్ రెపోను మళ్లీ జరగకుండా చూసుకోవడం సులభం.

ప్రాజెక్ట్ హోస్టింగ్ చాలా ఖరీదైనది కాదని uming హిస్తే నేను సేవను కొనసాగిస్తాను, కానీ మీరు ఎప్పుడైనా ఇలాంటి సూక్ష్మ సేవను సృష్టించాలనుకుంటే దాన్ని మీరే క్లోన్ చేసుకోండి.

### ప్రత్యక్ష ఉదాహరణ

చర్యలో ఉన్న API యొక్క సూపర్ శీఘ్ర ఉదాహరణ క్రిందిది.

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

#### ఒకే ప్రతిస్పందన
<pre id="basic"></pre>

#### చాలా స్పందనలు
<pre id="many"></pre>

#### కస్టమ్ సెపరేటర్లు
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

addEventListener (&#39;లోడ్&#39;, () =&gt; re రెండర్ (పొందడం (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;ప్రాథమిక&quot;); రెండర్ (పొందడం (&quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; many &quot;); రెండర్ (పొందండి (&quot; https://friendly-project-name.kinlan.now.sh/ api / names? సెపరేటర్ = @ &quot;),&quot; సెపరేటర్ &quot;);});
</script>

{{&lt;/ raw-html&gt;}}
