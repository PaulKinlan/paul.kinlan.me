---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

Tôi yêu Puppeteer - nó cho phép tôi chơi xung quanh với các ý tưởng của <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> - đang chạy web trong trình duyệt không có trình duyệt hiển thị và thậm chí xây dựng các công cụ như <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> (Curl chạy JavaScript). Cụ thể tôi thích kịch bản trình duyệt để cạo, thao tác và tương tác với các trang.

Một bản demo tôi muốn thực hiện được lấy cảm hứng từ Ire&#39;s <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> bài đăng <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> nơi cô ấy chạy một kịch bản múa rối sẽ điều hướng đến nhiều trang và chụp ảnh màn hình. Thay vì đi đến nhiều trang, tôi muốn chụp nhiều ảnh chụp màn hình các yếu tố trên trang.

Vấn đề mà tôi gặp phải với Puppeteer là khổ thơ mở đầu mà bạn cần phải làm bất cứ điều gì. Khởi chạy, tab Mở, điều hướng - nó không phức tạp, nó chỉ đơn giản hơn so với tôi muốn tạo cho các tập lệnh đơn giản. Đó là lý do tại sao tôi đã tạo <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/puppeteer-go&quot; &gt;Puppeteer Go</a> . Đó chỉ là một tập lệnh nhỏ giúp tôi xây dựng các tiện ích CLI dễ dàng mở trình duyệt, điều hướng đến một trang, thực hiện hành động _your_ và sau đó tự dọn sạch.

Kiểm tra nó ra.

```JavaScript
const { go } = require('puppeteer-go');

go('https://paul.kinlan.me', async (page) => {
    const elements = await page.$$("h1");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

Đoạn mã trên sẽ tìm thấy phần tử h1 trong blog của tôi và chụp ảnh màn hình. Đây không phải là nơi tốt như công việc của tôi, nhưng tôi nghĩ thật gọn gàng để xem liệu chúng ta có thể nhanh chóng kéo ảnh chụp màn hình từ canisuse.com trực tiếp từ trang hay không.

```JavaScript
const { go } = require('puppeteer-go');

go('https://caniuse.com/#search=css', async (page) => {
    const elements = await page.$$("article.feature-block.feature-block--feature");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

<figure><img src="/images/2019-12-03-puppeteer-go-0.jpeg" alt="4.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-1.jpeg" alt="3.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-2.jpeg" alt="2.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-3.jpeg" alt="1.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-4.jpeg" alt="0.png"></figure>

Thưởng thức!

