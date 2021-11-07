---
slug: progressive-progressive-web-apps
date: 2017-07-04T13:20:31.000Z
title: "Progressive Progressive Web Apps"
description: "Building Progressive Web Apps progressively is possible. This is how I did it."
image_header: "/images/feeddeck.png"
tags: ['ssr', 'progressive web apps', 'pwa']
toc: true
---


Tôi thích [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/). Tôi thích mô hình nó cung cấp cho cách bạn xây dựng các trang web và ứng dụng tốt, vững chắc, đáng tin cậy. Tôi thích API nền tảng nguyên tắc - nhân viên dịch vụ - cho phép mô hình PWA hoạt động.

Một trong những cái bẫy mà chúng tôi đã rơi vào là "[App Shell](https://developers.google.com/web/fundamentals/architecture/app-shell)". Mô hình App Shell nói rằng trang web của bạn nên trình bày một trình bao hoàn chỉnh của ứng dụng của bạn (để trải nghiệm điều gì đó ngay cả khi bạn đang ngoại tuyến) và sau đó bạn kiểm soát cách thức và thời điểm để lấy nội dung.

<figure><img src="/images/app-shell.png"><figcaption> App Shell </figcaption></figure>

Mô hình App Shell gần giống với một "SPA" (Single Page App) & mdash; bạn tải trình bao, sau đó mọi điều hướng tiếp theo được JS xử lý trực tiếp trong trang của bạn. Nó hoạt động tốt trong nhiều trường hợp.

Tôi không tin rằng App Shell là * chỉ * cũng không phải là mô hình tốt nhất, và như mọi khi lựa chọn của bạn thay đổi từ tình huống này sang tình huống khác; ví dụ blog của tôi sử dụng mẫu "Stale-Whilst-Revalidate" đơn giản, mỗi trang được lưu trong bộ nhớ cache khi bạn điều hướng xung quanh trang web và các bản cập nhật sẽ được hiển thị trong lần làm mới sau; trong bài viết này tôi muốn khám phá một mô hình mà tôi đã thử nghiệm gần đây.

# Tới App Shell hoặc không phải App Shell

Trong mô hình cổ điển của App Shell, gần như không thể hỗ trợ quá trình hiển thị lũy tiến và tôi muốn đạt được mô hình "Tiến bộ" thực sự để xây dựng trang web với nhân viên dịch vụ chứa các thuộc tính sau:


* Nó hoạt động mà không cần JS
* Nó hoạt động khi không có hỗ trợ cho một nhân viên dịch vụ
* Nó nhanh

Tôi đặt ra để chứng minh điều này bằng cách tạo ra một dự án mà tôi đã luôn luôn muốn xây dựng: Một dòng sông của Tin tức + TweetDeck Hybrid. Đối với tập hợp các nguồn cấp dữ liệu RSS đã cho, chúng sẽ hiển thị theo kiểu cột.

<figure><img src="/images/feeddeck.png"><figcaption> Feed Deck - vui lòng bỏ qua kiểu dáng </figcaption></figure>

"Feed Deck" là một trải nghiệm tham khảo tốt để thử nghiệm với Service Worker và nâng cao tiến bộ. Nó có một thành phần máy chủ trả lại, nó có nhu cầu cho một "vỏ" để hiển thị một cái gì đó cho người dùng một cách nhanh chóng và nó có nội dung động được tạo ra mà cần phải được cập nhật thường xuyên. Cuối cùng bởi vì nó là một dự án cá nhân, tôi không cần quá nhiều cơ sở hạ tầng máy chủ để lưu cấu hình và xác thực người dùng.

Tôi đã đạt được hầu hết điều này và tôi đã học được rất nhiều trong quá trình này. Một số thứ vẫn yêu cầu JS, nhưng ứng dụng trong các hàm lý thuyết không có JS; Tôi muốn NodeJS có nhiều điểm chung với các API DOM; Tôi đã xây dựng nó hoàn toàn trên Chrome OS với [Glitch](https://glitch.com/edit/#!/feeddeck?path=public/sw.js) nhưng phần cuối cùng này là một câu chuyện cho một ngày khác.

Tôi đặt một số định nghĩa về "Tác phẩm" có nghĩa là sớm trong dự án.


* "Nó hoạt động mà không có JS" & mdash; nội dung tải trên màn hình và có một con đường rõ ràng cho nó cho tất cả mọi thứ làm việc mà không có JS trong tương lai (hoặc có một lý giải rõ ràng về lý do tại sao nó không được kích hoạt). Tôi không thể nói "nah".
* "Nó hoạt động khi không có hỗ trợ cho một Service Worker" & mdash; tất cả mọi thứ nên tải, chức năng và được blazingly nhanh nhưng tôi hạnh phúc nếu nó không hoạt động offline ở khắp mọi nơi.

Nhưng đó không phải là câu chuyện duy nhất, nếu chúng tôi có JS và hỗ trợ cho một nhân viên phục vụ, tôi đã có một nhiệm vụ để đảm bảo:


* Nó được nạp ngay lập tức
* Đó là đáng tin cậy và có đặc điểm hiệu suất dự đoán được
* Nó hoạt động hoàn toàn ngoại tuyến

Mea culpa: Nếu bạn nhìn vào mã và chạy nó trong một trình duyệt cũ thì có khả năng nó sẽ không hoạt động, tôi đã chọn sử dụng ES6, tuy nhiên đây không phải là một rào cản không thể vượt qua.

Nếu chúng ta tập trung xây dựng một trải nghiệm có chức năng mà không kích hoạt JavaScript thì nó giữ rằng chúng ta nên render càng nhiều càng tốt trên máy chủ.

Cuối cùng, tôi đã có một mục tiêu thứ cấp: Tôi muốn khám phá xem khả năng chia sẻ logic giữa Công nhân dịch vụ và Máy chủ của bạn như thế nào .... Tôi nói dối, đây là điều làm tôi phấn khích nhất và nhiều lợi ích của câu chuyện tiến bộ rơi ra khỏi mặt sau của điều này.

# Cái gì đến trước. Server hoặc Service Worker?

Đó là cả hai cùng một lúc. Tôi phải render từ máy chủ, nhưng vì nhân viên dịch vụ nằm giữa trình duyệt và mạng tôi phải nghĩ về cách hai người này tương tác với nhau.

Tôi đã ở một vị trí may mắn trong đó tôi không có nhiều logic máy chủ duy nhất để tôi có thể giải quyết vấn đề một cách tổng thể và cả hai cùng một lúc. Các nguyên tắc mà tôi theo dõi là suy nghĩ về những gì tôi muốn đạt được với bản dựng đầu tiên của trang (trải nghiệm mà mọi người dùng sẽ nhận được) và hiển thị trang tiếp theo (trải nghiệm mà người dùng tương tác sẽ nhận được) cả khi có và không có nhân viên phục vụ.


** Kết xuất đầu tiên ** & mdash; sẽ không có nhân viên phục vụ có sẵn vì vậy tôi cần đảm bảo rằng lần hiển thị đầu tiên chứa nhiều nội dung trang nhất có thể và được tạo ra trên máy chủ.

Nếu người dùng có trình duyệt hỗ trợ nhân viên dịch vụ thì tôi có thể thực hiện một vài điều thú vị. Tôi đã có logic mẫu được tạo trên máy chủ và không có bất kỳ điều gì đặc biệt về chúng, sau đó chúng phải là các mẫu chính xác mà tôi sẽ sử dụng trực tiếp trên máy khách. Nhân viên dịch vụ có thể lấy các mẫu tại thời gian `oninstall` và lưu trữ chúng để sử dụng sau này.

<figure><img src="/images/wpt-feeddeck-first-load.png"><figcaption> Feed Deck - Lần tải đầu tiên </figcaption></figure>


** Thứ hai hiển thị mà không có nhân viên dịch vụ ** & mdash; Nó sẽ hoạt động chính xác như một render đầu tiên. Chúng ta có thể hưởng lợi từ HTTP Caching bình thường, nhưng lý thuyết là như nhau: làm cho trải nghiệm nhanh chóng.


** Thứ hai render _with_ service worker ** & mdash; Nó sẽ hoạt động * chính xác * như một máy chủ đầu tiên hiển thị, nhưng, tất cả bên trong nhân viên dịch vụ. Tôi không có vỏ truyền thống. Nếu bạn nhìn vào mạng, tất cả những gì bạn thấy là hoàn toàn được ghép với nhau HTML: cấu trúc _and_ content.

{{<figure src = "/ images / devtools-feeddeck-second-load.png" title = "Feed Deck & mdash; Tải thứ hai (Điều khiển công nhân dịch vụ)">}}

### "Kết xuất" & mdash; Phát trực tuyến là bạn của chúng tôi

Tôi đã cố gắng để được tiến bộ nhất có thể có nghĩa là tôi cần phải làm càng nhiều càng tốt trên máy chủ một cách nhanh chóng. Tôi đã có một thách thức, nếu tôi hợp nhất tất cả dữ liệu từ tất cả các nguồn cấp dữ liệu RSS thì lần hiển thị đầu tiên sẽ bị chặn bởi các yêu cầu mạng tới nguồn cấp dữ liệu RSS và do đó chúng tôi sẽ làm chậm quá trình hiển thị đầu tiên.

Tôi đã chọn đường dẫn sau:


* Hiển thị phần đầu của trang & mdash; nó tương đối tĩnh và nhận được điều này để màn hình nhanh chóng trợ giúp với hiệu suất percieved.
* Render cấu trúc của trang dựa trên cấu hình (các cột) & mdash; cho một người dùng nhất định, hiện tại là tĩnh và việc hiển thị nó nhanh chóng là điều quan trọng đối với người dùng.
* Hiển thị dữ liệu cột ** nếu ** chúng tôi có nội dung được lưu trong bộ nhớ cache và có sẵn, chúng tôi có thể thực hiện việc này trên cả máy chủ và nhân viên dịch vụ
* Hiển thị chân trang của trang chứa logic để tự động cập nhật nội dung của trang theo định kỳ.

Với những ràng buộc này trong tâm trí, mọi thứ cần phải là không đồng bộ và tôi cần phải có mọi thứ trên mạng càng nhanh càng tốt.

Có một sự thiếu hụt thực sự của các thư viện tạo khuôn mẫu trực tuyến trên web. Tôi đã sử dụng [streaming-dot](https://github.com/surma/streaming-dot) bởi người bạn tốt của tôi và Surma colleauge là cổng của khuôn khổ templating [doT](https://github.com/olado/doT) nhưng với các trình tạo thêm để nó có thể ghi vào một Node hoặc DOM Stream và không chặn toàn bộ nội dung có sẵn.

Hiển thị dữ liệu cột (ví dụ: nội dung trong nguồn cấp dữ liệu) là phần quan trọng nhất và điều này tại thời điểm này yêu cầu JavaScript trên ứng dụng cho lần tải đầu tiên. Hệ thống được thiết lập để có thể hiển thị mọi thứ trên máy chủ cho lần tải đầu tiên nhưng tôi đã chọn không chặn trên mạng.

Nếu dữ liệu đã được tìm nạp và nó có sẵn trong nhân viên dịch vụ thì chúng ta có thể nhanh chóng đưa nó ra cho người dùng ngay cả khi nó có thể nhanh chóng trở nên cũ.

Mã để hiển thị nội dung trong khi là aysnc là tương đối thủ tục và tuân theo mô hình được mô tả trước đó: Chúng tôi hiển thị tiêu đề cho luồng khi mẫu sẵn sàng, sau đó hiển thị nội dung của luồng đó. có sẵn cũng sẽ được flushed vào dòng và cuối cùng khi tất cả mọi thứ đã sẵn sàng, chúng tôi thêm vào footer và tuôn ra cho dòng phản ứng.

Dưới đây là mã tôi sử dụng trên máy chủ và nhân viên dịch vụ.


```javascript
const root = (dataPath, assetPath) => {
  
  let columnData = loadData(`${dataPath}columns.json`).then(r => r.json());

  let headTemplate = getCompiledTemplate(`${assetPath}templates/head.html`);
  let bodyTemplate = getCompiledTemplate(`${assetPath}templates/body.html`);
  let itemTemplate = getCompiledTemplate(`${assetPath}templates/item.html`);
  
  let jsonFeedData = fetchCachedFeedData(columnData, itemTemplate);
  
  /*
   * Render the head from the cache or network
   * Render the body.
     * Body has template that brings in config to work out what to render
     * If we have data cached let's bring that in.
   * Render the footer - contains JS to data bind client request.
  */
  
  const headStream = headTemplate.then(render => render({ columns: columnData }));
  const bodyStream = jsonFeedData.then(columns => bodyTemplate.then(render => render({ columns: columns })));
  const footStream = loadTemplate(`${assetPath}templates/foot.html`);

  let concatStream = new ConcatStream;
  
  headStream.then(stream => stream.pipeTo(concatStream.writable, { preventClose:true }))
                .then(() => bodyStream)
                .then(stream => stream.pipeTo(concatStream.writable, { preventClose: true }))
                .then(() => footStream)
                .then(stream => stream.pipeTo(concatStream.writable));
  
  return Promise.resolve(new Response(concatStream.readable, { status: "200" }))
}
```


Với mô hình này tại chỗ, nó thực sự là tương đối đơn giản để có được mã trên và quá trình làm việc trên máy chủ * và * trong công nhân dịch vụ.

## Máy chủ logic hợp nhất và logic của nhân viên dịch vụ & mdash; hoops và rào cản

Nó không phải là dễ dàng để có được một cơ sở mã chia sẻ giữa máy chủ và máy khách, hệ sinh thái Node + NPM và hệ sinh thái Web JS giống như cặp song sinh di truyền giống hệt nhau đã lớn lên với các gia đình khác nhau và khi họ gặp nhau có nhiều điểm tương đồng và nhiều những khác biệt cần phải vượt qua ... Nghe có vẻ như một ý tưởng tuyệt vời cho một bộ phim.

Tôi đã chọn để thích Web trên toàn bộ dự án. Tôi đã từ chối điều này vì tôi không muốn gói và tải mã vào trình duyệt của người dùng, nhưng thay vào đó tôi có thể thực hiện việc đó trên máy chủ (tôi có thể mở rộng quy mô này, người dùng không thể), vì vậy nếu API không được ' t hỗ trợ trong Node sau đó tôi sẽ phải tìm một shim tương thích.

Dưới đây là một số thách thức tôi phải đối mặt.

### Hệ thống mô-đun bị hỏng

Khi cả Hệ thống nút và Hệ sinh thái Web đều tăng lên, cả hai đều phát triển các cách khác nhau để tổng hợp, phân đoạn và nhập mã tại thời điểm thiết kế. Đây là một vấn đề thực sự khi tôi cố gắng xây dựng dự án này.

Tôi không muốn CommonJS trong trình duyệt. Tôi có một mong muốn không hợp lý để tránh xa càng nhiều công cụ xây dựng càng tốt và thêm vào sự khinh thường của tôi về cách thức hoạt động của gói, nó khiến tôi không có nhiều lựa chọn.

Giải pháp của tôi trong trình duyệt là sử dụng phương thức `importScripts` phẳng, nó hoạt động nhưng nó phụ thuộc vào thứ tự tệp rất cụ thể, như có thể thấy trong nhân viên dịch vụ như sau:


** sw.js **


```javascript
importScripts(`/scripts/router.js`);
importScripts(`/scripts/dot.js`);
importScripts(`/scripts/platform/web.js`);
importScripts(`/scripts/platform/common.js`);
importScripts(`/scripts/routes/index.js`);
importScripts(`/scripts/routes/root.js`);
importScripts(`/scripts/routes/proxy.js`);
```


Và sau đó cho nút, tôi đã sử dụng cơ chế tải CommonJS bình thường trong cùng một tệp, nhưng chúng được gated đằng sau một câu lệnh `if` đơn giản để nhập khẩu các mô-đun.


```javascript
if (typeof module !== 'undefined' && module.exports) {
    var doT = require('../dot.js');
    ...
```


Giải pháp của tôi không phải là một giải pháp có thể mở rộng, nó hoạt động nhưng cũng rải rác mã của tôi, cũng mã mà tôi không muốn.

Tôi mong đợi ngày mà Node hỗ trợ `module` mà các trình duyệt sẽ hỗ trợ ... Chúng ta cần một cái gì đó đơn giản, sane, chia sẻ và mở rộng.

Nếu bạn kiểm tra mã, bạn sẽ thấy mẫu này được sử dụng trong hầu hết mọi tệp được chia sẻ và trong nhiều trường hợp cần thiết vì tôi cần nhập [WHATWG luồng triển khai tham chiếu](https://github.com/whatwg/streams/tree/master/reference-implementation).

### Luồng chéo

Các luồng có lẽ là nguyên thủy quan trọng nhất mà chúng ta có trong máy tính (và có lẽ ít được hiểu nhất) và cả Node lẫn Web đều có các giải pháp hoàn toàn khác nhau của chúng. Đó là một cơn ác mộng để đối phó trong dự án này và chúng tôi thực sự cần chuẩn hóa một giải pháp thống nhất (lý tưởng là các luồng DOM).

May mắn là có một cài đặt đầy đủ của [Streams API](https://github.com/whatwg/streams/tree/master/reference-implementation) mà bạn có thể mang đến Node, và tất cả những gì bạn phải làm là viết một vài tiện ích để ánh xạ từ Web Stream -> Node Stream và Node Stream -> Web Suối.


```javascript
const nodeReadStreamToWHATWGReadableStream = (stream) => {
    
  return new ReadableStream({
    start(controller) {
      stream.on('data', data => {
        controller.enqueue(data)
      });
      stream.on('error', (error) => controller.abort(error))
      stream.on('end', () => {
        controller.close();
      })
    }
  });
};

class FromWHATWGReadableStream extends Readable {
  constructor(options, whatwgStream) {
    super(options);
    const streamReader = whatwgStream.getReader();
    
    pump(this);

    function pump(outStream) {
      return streamReader.read().then(({ value, done }) => {
        if (done) {
          outStream.push(null);
          return;
        }

        outStream.push(value.toString());
        return pump(outStream);
      });
    }
  }
}
```


Hai hàm trợ giúp này chỉ được sử dụng ở phía Node của dự án này và chúng được sử dụng để cho phép tôi lấy dữ liệu vào API của Node mà không thể chấp nhận WHATWG Streams và tương tự để truyền dữ liệu vào các API tương thích WHATWG Stream không hiểu luồng Node . Tôi đặc biệt cần điều này cho API `fetch` trong Nút.

Một khi tôi đã có Streams được sắp xếp, vấn đề cuối cùng và mâu thuẫn là Routing (tình cờ đây là nơi tôi cần Stream Utils nhiều nhất).

### Định tuyến được chia sẻ

Hệ sinh thái nút, đặc biệt là Express là cực kỳ nổi tiếng và đáng kinh ngạc mạnh mẽ, nhưng chúng tôi không có một mô hình được chia sẻ giữa khách hàng và nhân viên dịch vụ.

Nhiều năm trước, tôi đã viết [LeviRoutes](https://github.com/PaulKinlan/leviroutes), một thư viện bên trình duyệt đơn giản xử lý ExpressJS như các tuyến đường và nối vào API lịch sử cũng như API `onhashchange`. Không ai sử dụng nó nhưng tôi đã hạnh phúc. Tôi quản lý để bụi của mạng nhện (thực hiện một hoặc hai tinh chỉnh) và triển khai nó trong ứng dụng này. Nhìn vào mã bên dưới bạn ca thấy rằng định tuyến của tôi là _nearly_ giống nhau.


** server.js **


```javascript
app.get('/', (req, res, next) => {
  routes['root'](dataPath, assetPath)
    .then(response => node.responseToExpressStream(res, response));         
});

app.get('/proxy', (req, res, next) => {
  routes['proxy'](dataPath, assetPath, req)
    .then(response => response.body.pipe(res, {end: true}));
})
```



** sw.js **


```javascript
// The proxy server '/proxy'
router.get(`${self.location.origin}/proxy`, (e) => {
  e.respondWith(routes['proxy'](dataPath, assetPath, e.request));
}, {urlMatchProperty: 'href'});

// The root '/'
router.get(`${self.location.origin}/$`, (e) => {
  e.respondWith(routes['root'](dataPath, assetPath));
}, {urlMatchProperty: 'href'});
```


Tôi sẽ _love_ để xem một giải pháp thống nhất mang lại cho người phục vụ `onfetch` API vào nút.

Tôi cũng sẽ _love_ để xem một "Express" như khuôn khổ mà thống nhất Node và mã trình duyệt yêu cầu định tuyến. Chỉ có đủ sự khác biệt có nghĩa là tôi không thể có cùng một nguồn ở khắp mọi nơi. Chúng tôi có thể xử lý các tuyến đường gần giống hệt nhau trên máy khách và máy chủ, vì vậy chúng tôi không ở xa lắm.

### Không có DOM bên ngoài kết xuất

Khi người dùng không có nhân viên dịch vụ có sẵn, logic cho trang web khá truyền thống, chúng tôi hiển thị trang web trên máy chủ và sau đó làm mới nội dung trong trang thông qua bỏ phiếu AJAX truyền thống.

Logic sử dụng API `DOMParser` để biến nguồn cấp dữ liệu RSS thành thứ mà tôi có thể lọc và truy vấn trong trang.


```javascript
// Get the RSS feed data.
fetch(`/proxy?url=${feedUrl}`)
      .then(feedResponse => feedResponse.text())
      // Convert it in to DOM
      .then(feedText => {
        const parser = new DOMParser();
        return parser.parseFromString(feedText,'application/xml');
      })
      // Find all the news items
      .then(doc => doc.querySelectorAll('item'))
      // Convert to an array
      .then(items => Array.prototype.map.call(items, item => convertRSSItemToJSON(item)))
      // Don't add in items that already exist in the page
      .then(items => items.filter(item => !!!(document.getElementById(item.guid))))
      // DOM Template.
      .then(items => items.map(item => applyTemplate(itemTemplate.cloneNode(true), item)))
      // Add it into the page
      .then(items => items.forEach(item => column.appendChild(item)))
```


Việc truy cập DOM của nguồn cấp dữ liệu RSS bằng cách sử dụng các API tiêu chuẩn trong trình duyệt là vô cùng hữu ích và nó cho phép tôi sử dụng cơ chế tạo khuôn mẫu của riêng tôi (mà tôi khá tự hào) để cập nhật trang động.


```html
<template id='itemTemplate'>
  <div class="item" data-bind_id='guid'>
    <h3><span data-bind_inner-text='title'></span> (<a data-bind_href='link'>#</a>)</h3>
    <div data-bind_inner-text='pubDate'></div>
  </div>
</template>
<script>
  
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKey = node.dataset[bindAttr];
        let bindKey = bindAttr.substr(5);
        node[bindKey] = data[dataKey];
      }
    }
  }

  return element;
};
</script>
```


Tôi đã rất hài lòng với bản thân mình cho đến khi tôi nhận ra rằng tôi không thể sử dụng bất kỳ điều này trên máy chủ hoặc trong một nhân viên phục vụ. Giải pháp duy nhất mà tôi có là mang theo một [trình phân tích cú pháp XML] tùy chỉnh (0) và đi bộ để tạo ra HTML. Nó thêm một số biến chứng và để lại cho tôi nguyền rủa web.

Về lâu dài, tôi rất thích xem thêm một số API DOM được đưa vào cho người lao động và cũng được hỗ trợ trong Node, nhưng giải pháp mà tôi đã làm việc ngay cả khi nó không phải là tối ưu.

# Có thể không?

Có hai câu hỏi thực sự trong bài đăng này:


* Có thực tế để xây dựng các hệ thống dùng chung máy chủ và nhân viên dịch vụ không?
* Có thể xây dựng một Progressive Web App đầy đủ tiến bộ không?

## Có thực tế để xây dựng các hệ thống chia sẻ một máy chủ và nhân viên dịch vụ phổ biến không?

Có thể xây dựng các hệ thống chia sẻ một máy chủ và nhân viên dịch vụ phổ biến nhưng nó có thực tế không? Tôi thích ý tưởng này, nhưng tôi nghĩ nó cần nhiều nghiên cứu hơn bởi vì nếu bạn đang sử dụng JS, thì có rất nhiều vấn đề giữa nền tảng Node và Web cần được giải quyết.

Cá nhân tôi rất thích xem thêm các API "Web" trong hệ sinh thái Nút.

## Có thể xây dựng một Progressive Web App đầy đủ tiến bộ không?

Vâng.

Tôi rất vui vì tôi đã làm điều này. Ngay cả khi bạn không chia sẻ cùng một ngôn ngữ trên máy khách như trên dịch vụ, có một số điều quan trọng mà tôi nghĩ rằng tôi đã có thể hiển thị.

1. AppShell không phải là mô hình duy nhất mà bạn có thể làm theo, điểm quan trọng là nhân viên dịch vụ _you_ có quyền kiểm soát mạng và _you_ có thể quyết định điều gì là tốt nhất cho trường hợp sử dụng của bạn. 2. Có thể xây dựng trải nghiệm được kết xuất dần dần sử dụng nhân viên dịch vụ để mang lại hiệu suất và khả năng phục hồi (cũng như cảm giác được cài đặt nếu bạn muốn). Bạn cần phải suy nghĩ tổng thể, bạn cần phải bắt đầu với kết xuất nhiều nhất có thể trên máy chủ trước và sau đó kiểm soát trong máy khách. 3. Có thể suy nghĩ về những trải nghiệm được xây dựng "trisomorphically" (tôi vẫn nghĩ thuật ngữ isomorphic là tốt nhất) với cơ sở mã chung, cấu trúc định tuyến chung và logic chung được chia sẻ giữa khách hàng, nhân viên dịch vụ và máy chủ.

Tôi để điều này như một ý nghĩ cuối cùng: Chúng ta cần điều tra thêm về cách chúng ta muốn xây dựng các ứng dụng web tiến bộ và chúng ta cần tiếp tục đẩy mạnh các mẫu cho phép chúng ta đạt được điều đó. AppShell là một khởi đầu tuyệt vời, nó không phải là kết thúc. Hiển thị và nâng cao lũy tiến là chìa khóa cho thành công lâu dài của web, không có phương tiện nào khác có thể thực hiện điều này cũng như trên web.

Nếu bạn quan tâm đến mã, [kiểm tra nó trên Github](https://github.com/PaulKinlan/streaming-server-sw-demo) nhưng bạn cũng có thể chơi với nó [trực tiếp và trộn nó trên trục trặc](https://glitch.com/edit/#!/feeddeck)
