---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Tenho algumas idéias para projetos que facilitam a criação de sites na web - uma das idéias é criar um <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> para <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> projetos baseados em <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> (eu gosto de zeit, mas requer um pouquinho de magia cli para implantar).

Este post aborda apenas uma pequena parte do quebra-cabeça: a criação de nomes de projetos.

<a href="https://glitch.com/">Glitch</a> is a good example of this, when you create a project it gives it a whimsical randomly generated name. The team also created a <a href="https://github.com/FogCreek/friendly-words">good dictionary of fairly safe words</a> that combine well (and if you want they have a simple server to host).

Portanto, o projeto paralelo neste domingo foi criar um microsserviço simples para gerar nomes aleatórios de projetos usando as <a <span class="notranslate">href=&quot;https://zeit.co/docs/v2/advanced/concepts/serverless-functions/&quot; &gt;serverless-functions</a> e o dicionário da Glitch.

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

Se você não quiser incluí-lo diretamente no seu projeto, poderá usar o terminal HTTP para gerar nomes de projetos aleatórios (na forma de &quot;XY&quot;) fazendo uma solicitação da Web para https: // friendly-project-name. kinlan.now.sh/api/names, que retornará algo como o seguinte.

```javascript
["momentous-professor"]
```

Você também pode controlar quantos nomes serão gerados com o parâmetro de string de consulta de <i>count = x</i> , por exemplo, https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Você pode controlar o separador com o parâmetro de uma string de consulta do separador. por exemplo, separator = @, por exemplo, https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Um aspecto muito útil deste projeto é que, se uma combinação de palavras tende a ser ofensiva, é fácil atualizar o repositório Glitch para garantir que isso não ocorra novamente.

Supondo que a hospedagem do projeto não fique muito cara, eu continuarei com o serviço, mas sinta-se à vontade para cloná-lo se desejar criar um microsserviço semelhante.

### Exemplo ao vivo

A seguir, é apresentado um exemplo super rápido da API em ação.

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

#### Resposta única
<pre id="basic"></pre>

#### Muitas respostas
<pre id="many"></pre>

#### personalizados
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

addEventListener (&#39;load&#39;, () =&gt; {render (buscar (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;basic&quot;); render (buscar (&quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; many &quot;); render (fetch (&quot; https://friendly-project-name.kinlan.now.sh/ api / names? separator = @ &quot;),&quot; separator &quot;);});
</script>

{{&lt;/ raw-html&gt;}}
