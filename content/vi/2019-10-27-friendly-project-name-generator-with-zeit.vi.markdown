---
slug: friendly-project-name-generator-with-zeit
date: 2019-10-27T20:18:27.244Z
title: Friendly Project Name Generator with Zeit
link: 'https://friendly-project-name.kinlan.now.sh/'
tags: [simple, api, names]
---

Tôi đã có một số ý tưởng cho các dự án mà làm cho nó dễ dàng hơn để tạo ra các trang web trên web - một trong những ý tưởng là để thực hiện một [netlify-like drag and drop interface](https://docs.netlify.com/site-deploys/create-deploys/#drag-and-drop) cho [zeit](https://zeit.co/) dự án dựa (Tôi như Zeit nhưng nó đòi hỏi một chút ma thuật cli để triển khai).

Bài đăng này chỉ bao gồm một phần nhỏ của câu đố: tạo tên dự án.

[Glitch](https://glitch.com/) là một ví dụ tốt về điều này, khi bạn tạo một dự án, nó sẽ đặt cho nó một tên được tạo ngẫu nhiên hay thay đổi. Nhóm cũng tạo ra một [good dictionary of fairly safe words](https://github.com/FogCreek/friendly-words) kết hợp tốt (và nếu bạn muốn họ có một máy chủ đơn giản để lưu trữ).

Vì vậy, dự án phụ vào Chủ nhật tuần này là tạo ra một dịch vụ vi mô đơn giản để tạo tên dự án ngẫu nhiên bằng cách sử dụng [serverless-functions](https://zeit.co/docs/v2/advanced/concepts/serverless-functions/) của Zeit và từ điển từ Glitch.

[And here it is](https://friendly-project-name.kinlan.now.sh/) ( [code](https://github.com/PaulKinlan/friendly-project-name-generator) ), nó khá ngắn và không quá phức tạp.

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

Nếu bạn không muốn đưa nó trực tiếp vào dự án của mình, bạn có thể sử dụng điểm cuối HTTP để tạo tên dự án ngẫu nhiên (dưới dạng &quot;XY&quot;) bằng cách gửi yêu cầu web tới https: // tên thân thiện với dự án. kinlan.now.sh/api/names, sẽ trả lại một cái gì đó như sau.

```javascript
["momentous-professor"]
```

Bạn cũng có thể kiểm soát số lượng tên sẽ tạo với tham số chuỗi truy vấn là <i>Count = x</i> , ví dụ: https://friendly-project-name.kinlan.now.sh/api/names?count=100

```javascript
["melon-tangerine","broad-jury","rebel-hardcover","far-friend","notch-hornet","principled-wildcat","level-pilot","steadfast-bovid","holistic-plant","expensive-ulna","sixth-gear","political-wrench","marred-spatula","aware-weaver","awake-pair","nosy-hub","absorbing-petunia","rhetorical-birth","paint-sprint","stripe-reward","fine-guardian","coconut-jumbo","spangle-eye","sudden-euphonium","familiar-fossa","third-seaplane","workable-cough","hot-light","diligent-ceratonykus","literate-cobalt","tranquil-sandalwood","alabaster-pest","sage-detail","mousy-diascia","burly-food","fern-pie","confusion-capybara","harsh-asterisk","simple-triangle","brindle-collard","destiny-poppy","power-globeflower","ruby-crush","absorbed-trollius","meadow-blackberry","fierce-zipper","coal-mailbox","sponge-language","snow-lawyer","adjoining-bramble","deserted-flower","able-tortoise","equatorial-bugle","neat-evergreen","pointy-quart","occipital-tax","balsam-fork","dear-fairy","polished-produce","darkened-gondola","sugar-pantry","broad-slouch","safe-cormorant","foregoing-ostrich","quasar-mailman","glittery-marble","abalone-titanosaurus","descriptive-arch","nickel-ostrich","historical-candy","mire-mistake","painted-eater","pineapple-sassafras","pastoral-thief","holy-waterlily","mewing-humor","bubbly-cave","pepper-situation","nosy-colony","sprout-aries","cyan-bestseller","humorous-plywood","heavy-beauty","spiral-riverbed","gifted-income","lead-kiwi","pointed-catshark","ninth-ocean","purple-toucan","tundra-cut","coal-geography","icy-lunaria","agate-wildcat","respected-garlic","polar-almandine","periodic-narcissus","carbonated-waiter","lavish-breadfruit","confirmed-brand","repeated-period"]
```

Bạn có thể điều khiển dấu phân cách bằng tham số chuỗi truy vấn của dấu phân cách. tức là, dấu phân cách = @, ví dụ: https://friendly-project-name.kinlan.now.sh/api/names?separator=@

```
["handsomely@asterisk"]
```

Một khía cạnh rất hữu ích của dự án này là nếu sự kết hợp của các từ có xu hướng gây khó chịu, thì có thể dễ dàng cập nhật repo Glitch để đảm bảo rằng nó không xảy ra lần nữa.

Giả sử rằng việc lưu trữ dự án không quá tốn kém, tôi sẽ giữ dịch vụ này, nhưng cứ tự nhiên sao chép nó nếu bạn muốn tạo ra một dịch vụ vi mô tương tự.

Ví dụ trực tiếp ###

Dưới đây là một ví dụ siêu nhanh về API đang hoạt động.

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

#### Phản hồi đơn
<pre id="basic"></pre>

#### Nhiều phản hồi
<pre id="many"></pre>

#### phân cách tùy chỉnh
<pre id="separator"></pre>

{{&lt;thô-html&gt;}}

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

addEventListener (&#39;load&#39;, () =&gt; {render (fetch (&quot;https://friendly-project-name.kinlan.now.sh/api/names&quot;), &quot;basic&quot;); render (fetch (&quot;https: //friendly-project-name.kinlan.now.sh/api/names?count=100 &quot;),&quot; many &quot;); render (fetch (&quot; https://friendly-project-name.kinlan.now.sh/ api / tên? separator = @ &quot;),&quot; separator &quot;);});
</script>

{{&lt;/ raw-html&gt;}}
