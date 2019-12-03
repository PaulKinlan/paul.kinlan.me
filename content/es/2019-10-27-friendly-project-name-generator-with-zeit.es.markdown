---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Tengo algunas ideas para proyectos que facilitan la creación de sitios en la web, una de las ideas es hacer un [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) para proyectos basados en [zeit](https://zeit.co/) (me gusta zeit pero requiere un poco de cli magic para implementar).

Esta publicación cubre solo una pequeña pieza del rompecabezas: crear nombres de proyectos.

[Glitch](https://glitch.com/) es un buen ejemplo de esto, cuando crea un proyecto le da un nombre caprichoso generado aleatoriamente. El equipo también creó un [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) que combina bien (y si lo desea, tienen un servidor simple para alojar).

Por lo tanto, el proyecto paralelo de este domingo fue crear un [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) simple para generar nombres de proyectos aleatorios usando las [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) de Zeit y el diccionario de Glitch.

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), es bastante corto y no demasiado complejo.

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

Si no desea incluirlo directamente en su proyecto, puede usar el punto final HTTP para generar nombres de proyecto aleatorios (en forma de &quot;XY&quot;) haciendo una solicitud web a https: // nombre-proyecto-amigable. kinlan.now.sh/api/names, que devolverá algo como lo siguiente.

```javascript
["momentous-professor"]
```

También puede controlar cuántos nombres generar con un parámetro de cadena de consulta de <i>count = x</i> , por ejemplo, https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Puede controlar el separador con el parámetro de cadena de consulta del separador. es decir, separador = @, por ejemplo, https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Un aspecto muy útil de este proyecto es que si una combinación de palabras tiende a ser ofensiva, es fácil actualizar el repositorio de Glitch para garantizar que no vuelva a suceder.

Suponiendo que el alojamiento del proyecto no sea demasiado caro, mantendré el servicio en funcionamiento, pero siéntase libre de clonarlo si alguna vez desea crear un microservicio similar.

### Ejemplo en vivo

Lo que sigue es un ejemplo súper rápido de la API en acción.

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

#### Respuesta única
<pre id="basic"></pre>

#### Muchas respuestas
<pre id="many"></pre>

#### Separadores personalizados
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
