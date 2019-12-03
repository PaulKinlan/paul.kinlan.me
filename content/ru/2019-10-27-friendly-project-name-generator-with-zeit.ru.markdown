---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

У меня есть несколько идей для проектов, которые облегчают создание сайтов в Интернете - одна из идей - сделать <a <span class="notranslate">href=&quot;https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop&quot; &gt;netlify-like drag and drop interface</a> для <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> проектов на основе <a <span class="notranslate">href=&quot;https://zeit.co/&quot; &gt;zeit</a> (мне нравится zeit, но для его развертывания требуется чуть-чуть немного магии Cli).

Этот пост охватывает только один маленький кусочек головоломки: создание названий проектов.

<a href="https://glitch.com/">Glitch</a> is a good example of this, when you create a project it gives it a whimsical randomly generated name. The team also created a <a href="https://github.com/FogCreek/friendly-words">good dictionary of fairly safe words</a> that combine well (and if you want they have a simple server to host).

Итак, сторонним проектом в это воскресенье было создание простого микро-сервиса для генерации случайных имен проектов с использованием Zeit&#39;s <a <span class="notranslate">href=&quot;https://zeit.co/docs/v2/advanced/concepts/serverless-functions/&quot; &gt;serverless-functions</a> и словарь из глюка.

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

Если вы не хотите включать его в свой проект напрямую, вы можете использовать конечную точку HTTP для генерации случайных имен проектов (в форме «XY»), отправив веб-запрос на адрес https: // friendly-project-name. kinlan.now.sh/api/names, который будет возвращать что-то вроде следующего.

```javascript
["momentous-professor"]
```

Вы также можете контролировать количество имен, генерируемых с помощью параметра строки запроса <i>count = x</i> , например, https://friendly-project-name.kinlan.now.sh/api/names?count=100.

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Вы можете управлять разделителем с помощью параметра строки запроса разделителя. т.е. разделитель = @, например, https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Очень полезный аспект этого проекта заключается в том, что если комбинация слов имеет тенденцию быть оскорбительной, легко обновить репозиторий Glitch, чтобы избежать повторения.

Предполагая, что хостинг проекта не станет слишком дорогим, я буду поддерживать сервис, но не стесняйтесь клонировать его самостоятельно, если вы когда-нибудь захотите создать подобный микро-сервис.

### Живой пример

Ниже приведен очень быстрый пример API в действии.

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

#### Один ответ
<pre id="basic"></pre>

#### Многие респонденты
<pre id="many"></pre>

#### Пользовательские разделители
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
