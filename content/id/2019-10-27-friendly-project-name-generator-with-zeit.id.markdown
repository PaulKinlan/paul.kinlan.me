---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Saya punya beberapa ide untuk proyek yang membuatnya lebih mudah untuk membuat situs di web - salah satu idenya adalah membuat [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) untuk proyek-proyek berbasis [zeit](https://zeit.co/) (saya suka zeit tetapi membutuhkan sedikit cli magic untuk digunakan).

Posting ini hanya mencakup satu bagian kecil dari teka-teki: membuat nama proyek.

[Glitch](https://glitch.com/) adalah contoh yang bagus untuk hal ini, ketika Anda membuat proyek, itu memberikannya nama acak yang dibuat secara aneh. Tim juga menciptakan [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) yang menggabungkan dengan baik (dan jika Anda ingin mereka memiliki server sederhana untuk di-host).

Jadi, proyek sampingan hari Minggu ini adalah untuk membuat layanan mikro sederhana untuk menghasilkan nama proyek acak menggunakan Zeit&#39;s [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) dan kamus dari Glitch.

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), cukup pendek dan tidak terlalu rumit.

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

Jika Anda tidak ingin memasukkannya dalam proyek Anda secara langsung, Anda dapat menggunakan titik akhir HTTP untuk menghasilkan nama proyek acak (dalam bentuk &quot;XY&quot;) dengan membuat permintaan web ke https: // friendly-project-name. kinlan.now.sh/api/names, yang akan mengembalikan sesuatu seperti berikut ini.

```javascript
["momentous-professor"]
```

Anda juga dapat mengontrol berapa banyak nama yang akan dihasilkan dengan parameter string-string <i>count = x</i> , mis. Https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Anda dapat mengontrol pemisah dengan parameter pemisah kueri-string. yaitu, separator = @, mis. https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Aspek yang sangat berguna dari proyek ini adalah bahwa jika kombinasi kata-kata cenderung menyinggung, mudah untuk memperbarui repo Glitch untuk memastikan bahwa itu tidak terjadi lagi.

Dengan asumsi bahwa proyek hosting tidak menjadi terlalu mahal, saya akan terus meningkatkan layanan, tetapi merasa bebas untuk mengkloningnya sendiri jika Anda ingin membuat layanan mikro serupa.

### Contoh langsung

Berikut ini adalah contoh super cepat dari API yang sedang beraksi.

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

#### Respons tunggal
<pre id="basic"></pre>

#### Banyak resposnses
<pre id="many"></pre>

#### Pemisah khusus
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
