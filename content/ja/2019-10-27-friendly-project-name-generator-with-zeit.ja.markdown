---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Webでサイトを簡単に作成できるプロジェクトのアイデアがいくつかあります-アイデアの1つは、 [zeit](https://zeit.co/)ベースのプロジェクトに[netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop)を[zeit](https://zeit.co/)することです（zeitが好きですが、展開するにはちょっとしたcliマジックが必要です）。

この投稿では、プロジェクト名の作成というパズルのほんの一部を取り上げています。

[Glitch](https://glitch.com/)はこの良い例です。プロジェクトを作成すると、ランダムに生成された気まぐれな名前が付けられます。また、チームはうまく組み合わせた[good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words)を作成しました（そして、必要に応じて、ホストする単純なサーバーが必要です）。

そのため、 [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/)日曜日のサイドプロジェクトは、Zeitの[serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/)とGlitchの辞書を使用して、ランダムなプロジェクト名を生成するシンプルなマイクロサービスを作成することでした。

[And here it is](https://friendly-project-name.kinlan.now.sh/) （ [code](https://github.com/PaulKinlan/friendly-project-name-generator) ）、かなり短く、複雑すぎません。

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

プロジェクトに直接含めたくない場合は、HTTPエンドポイントを使用して、https:// friendly-project-nameにWebリクエストを行うことにより、ランダムなプロジェクト名（「XY」の形式）を生成できます。 kinlan.now.sh/api/names。次のようなものを返します。

```javascript
["momentous-professor"]
```

また、https://friendly-project-name.kinlan.now.sh/api/names？ <i>count = 100</i>などの<i>count = xの</i>クエリ文字列パラメーターを使用して、生成する名前の数を制御することもできます。

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

separatorのquery-stringパラメーターを使用して、セパレーターを制御できます。すなわち、separator = @、例えばhttps://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

このプロジェクトの非常に有用な側面は、言葉の組み合わせが不快になる傾向がある場合、Glitchレポを簡単に更新して、再び発生しないようにすることです。

プロジェクトのホスティングが高くなりすぎないと仮定して、サービスを維持しますが、同様のマイクロサービスを作成したい場合は自分でクローンを作成してください。

### ライブの例

以下は、実行中のAPIの非常に簡単な例です。

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

#### シングルレスポンス
<pre id="basic"></pre>

#### 多くの回答
<pre id="many"></pre>

#### カスタムセパレーター
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

addEventListener（ &#39;load&#39;、（）=&gt; {render（fetch（ &quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;）、 &quot;basic&quot;）; render（fetch（ &quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;）、&quot; many &quot;）; render（fetch（&quot; https://friendly-project-name.kinlan.now.sh/ api / names？separator = @ &quot;）、&quot; separator &quot;）;}）;
</script>

{{&lt;/ raw-html&gt;}}
