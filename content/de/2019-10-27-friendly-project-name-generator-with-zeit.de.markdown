---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Ich habe einige Ideen für Projekte, die das Erstellen von Websites im Web erleichtern. Eine der Ideen ist, [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) für [zeit](https://zeit.co/) basierte Projekte zu [zeit](https://zeit.co/) (ich mag zeit, aber die Bereitstellung erfordert ein kleines bisschen Cli-Magie).

Dieser Beitrag behandelt nur einen kleinen Teil des Puzzles: das Erstellen von Projektnamen.

[Glitch](https://glitch.com/) ist ein gutes Beispiel dafür. Wenn Sie ein Projekt erstellen, erhält es einen skurrilen, zufällig generierten Namen. Das Team hat auch ein [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) , das sich gut kombinieren lässt (und wenn Sie möchten, dass es einen einfachen Server zum [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) ).

Also bestand das Nebenprojekt an diesem Sonntag darin, einen einfachen [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) zu erstellen, mit dem mithilfe von Zeits [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) und dem Wörterbuch von Glitch zufällige Projektnamen generiert werden können.

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), es ist ziemlich kurz und nicht zu komplex.

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

Wenn Sie es nicht direkt in Ihr Projekt aufnehmen möchten, können Sie mithilfe des HTTP-Endpunkts zufällige Projektnamen (in Form von &quot;XY&quot;) generieren, indem Sie eine Webanforderung an https: // friendly-project-name senden. kinlan.now.sh/api/names, was ungefähr Folgendes zurückgibt.

```javascript
["momentous-professor"]
```

Sie können auch steuern, wie viele Namen mit dem Abfragezeichenfolgenparameter <i>count = x</i> generiert werden sollen, z. B. https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Sie können das Trennzeichen mit dem Abfragezeichenfolgenparameter separator steuern. dh separator = @, zB https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Ein sehr nützlicher Aspekt dieses Projekts ist, dass es einfach ist, das Glitch-Repo zu aktualisieren, um sicherzustellen, dass es nicht wieder vorkommt, wenn eine Kombination von Wörtern dazu neigt, anstößig zu sein.

Unter der Annahme, dass das Hosting des Projekts nicht zu teuer wird, werde ich den Service aufrechterhalten, aber Sie können ihn auch selbst klonen, wenn Sie jemals einen ähnlichen Mikroservice erstellen möchten.

### Live Beispiel

Was folgt, ist ein superschnelles Beispiel für die API in Aktion.

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

####
<pre id="basic"></pre>

#### Viele Antworten
<pre id="many"></pre>

#### Benutzerdefinierte Trennzeichen
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

addEventListener (&#39;load&#39;, () =&gt; {render (fetch (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;basic&quot;); render (fetch (&quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; many &quot;); render (fetch (&quot; https://friendly-project-name.kinlan.now.sh/ api / names? separator = @ &quot;),&quot; separator &quot;);});
</script>

{{&lt;/ raw-html&gt;}}
