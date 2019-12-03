---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

मुझे उन परियोजनाओं के लिए कुछ विचार मिले हैं जो वेब पर साइटें बनाना आसान बनाते हैं - विचारों में से एक है [zeit](https://zeit.co/) आधारित परियोजनाओं के लिए एक [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) बनाना।

इस पोस्ट में पहेली के सिर्फ एक छोटे से टुकड़े को शामिल किया गया है: प्रोजेक्ट नाम बनाना।

[Glitch](https://glitch.com/) इसका एक अच्छा उदाहरण है, जब आप एक परियोजना बनाते हैं तो यह इसे एक अनियमित यादृच्छिक रूप से उत्पन्न नाम देता है। टीम ने एक [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) भी बनाया जो अच्छी तरह से संयोजित होता है (और यदि आप चाहते हैं कि उनके पास होस्ट करने के लिए एक सरल सर्वर हो)।

इसलिए, इस रविवार को साइड प्रोजेक्ट था, [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) और ग्लिच के शब्दकोश का उपयोग करके यादृच्छिक परियोजना के नाम उत्पन्न करने के लिए एक सरल माइक्रो-सर्विस बनाना।

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), यह बहुत छोटा है और बहुत जटिल नहीं है।

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

यदि आप इसे सीधे अपने प्रोजेक्ट में शामिल नहीं करना चाहते हैं, तो आप https: // friendly-project-name के लिए वेब अनुरोध करके यादृच्छिक प्रोजेक्ट नाम (&quot;XY&quot; के रूप में) उत्पन्न करने के लिए HTTP समापन बिंदु का उपयोग कर सकते हैं। kinlan.now.sh/api/names, जो निम्नलिखित की तरह कुछ लौटाएगा।

```javascript
["momentous-professor"]
```

आप यह भी नियंत्रित कर सकते हैं कि <i>गणना = x के</i> क्वेरी-स्ट्रिंग पैरामीटर के साथ कितने नाम उत्पन्न किए जा सकते हैं, उदाहरण के लिए https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

आप विभाजक के क्वेरी-स्ट्रिंग पैरामीटर के साथ विभाजक को नियंत्रित कर सकते हैं। अर्थात, विभाजक = @, उदा। https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

इस परियोजना का एक बहुत उपयोगी पहलू यह है कि यदि शब्दों का संयोजन आक्रामक होने की ओर जाता है, तो यह सुनिश्चित करना आसान है कि यह फिर से न हो जाए।

यह मानते हुए कि प्रोजेक्ट होस्टिंग बहुत महंगी नहीं है, मैं इस सेवा को बनाए रखूंगा, लेकिन यदि आप कभी भी एक समान माइक्रो-सर्विस बनाना चाहते हैं, तो इसे अपने आप को क्लोन करने के लिए स्वतंत्र महसूस करें।

### लाइव उदाहरण

कार्रवाई में एपीआई का एक सुपर त्वरित उदाहरण निम्नानुसार है।

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

#### एकल प्रतिक्रिया
<pre id="basic"></pre>

#### कई प्रतिक्रियाएँ
<pre id="many"></pre>

#### कस्टम विभाजक
<pre id="separator"></pre>

{{&lt;कच्चे एचटीएमएल&gt;}}

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

addEventListener (&#39;लोड&#39;, () =&gt; {रेंडर (fetch (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;बेसिक&quot;); रेंडर (fetch) (https:) //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; कई &quot;); रेंडर करें (प्राप्त करें (&quot; https://friendly-project-name.kinlan.now.sh/) एपीआई / नाम; विभाजक = @ &quot;),&quot; विभाजक &quot;);});
</script>

{{&lt;/ raw-html&gt;}
