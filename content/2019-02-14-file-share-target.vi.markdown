---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Tôi thường nói rằng để các ứng dụng web cạnh tranh hiệu quả trong thế giới ứng dụng, chúng cần được tích hợp vào tất cả các địa điểm mà người dùng mong đợi ứng dụng. Giao tiếp giữa các ứng dụng là một trong những phần bị thiếu chính của nền tảng web và cụ thể một trong những tính năng bị thiếu chính cuối cùng là chia sẻ cấp độ bản địa: Các ứng dụng web cần có thể có được [data out of their silo](/unintended-silos/) và vào các trang web và ứng dụng khác; họ cũng cần có khả năng nhận dữ liệu từ các ứng dụng và trang web gốc khác.

API mục tiêu chia sẻ tệp là một công cụ thay đổi trò chơi của API hiện có trong Chrome Canary. API mở rộng [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) cho phép các ứng dụng và trang web chia sẻ các liên kết và văn bản đơn giản đến các trang web bằng cách tích hợp chúng vào chức năng chia sẻ hệ thống.

Blog tệp rất tĩnh này sử dụng API mục tiêu chia sẻ web để tôi có thể nhanh chóng [share links](/web-share-target-api/) mà tôi thấy thú vị với nó từ bất kỳ ứng dụng Android nào và kể từ tuần trước [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . Bài đăng này là tất cả về cách tôi đã thực hiện (và đã đánh cắp một số mã từ Jake Archibald - tbf anh ấy đã tìm ra rất nhiều lỗi cho một tích hợp mà họ đang thực hiện trong [squoosh.app](https://squoosh.app/) .)

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) là một API rất mới trong đó nó hoàn toàn tiến bộ. Nếu ứng dụng của bạn có thể xử lý các yêu cầu Mẫu `POST` thì bạn có thể tích hợp dễ dàng với API này. Luồng cơ bản là: khi người dùng chọn ứng dụng của bạn từ trình chọn gốc, Chrome sẽ gửi yêu cầu Mẫu `POST` đến máy chủ của bạn, tùy thuộc vào bạn làm gì với nó (xử lý trong nhân viên dịch vụ hoặc trên máy chủ).

Để thêm hỗ trợ chia sẻ tệp vào ứng dụng web của bạn, bạn cần thực hiện hai điều:

1. Khai báo hỗ trợ để chia sẻ tệp qua tệp kê khai, 2. Xử lý yêu cầu Mẫu `POST` trong Công nhân dịch vụ của bạn.

Tệp kê khai tuyên bố với hệ thống máy chủ cách chia sẻ nên được ánh xạ từ ứng dụng máy chủ sang ứng dụng web. Trong bảng kê khai bên dưới có ghi &quot;Khi người dùng chia sẻ tệp loại &#39;image / *&#39;, hãy tạo một yêu cầu POST mẫu thành &#39;/ share / image /&#39; và đặt tên cho dữ liệu là &#39;tệp&#39;&quot;.

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Khi người dùng chia sẻ với ứng dụng web của bạn, Chrome sẽ gửi yêu cầu web đến trang web của bạn với dữ liệu tệp dưới dạng tải trọng.

Bạn nên xử lý yêu cầu POST bên trong nhân viên dịch vụ của mình để 1) nhanh, 2) có khả năng phục hồi với mạng không khả dụng. Bạn có thể làm điều này như sau:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Có một vài điều thú vị xảy ra ở trên, có thể nhanh chóng tóm tắt là:

* Kết xuất giao diện người dùng như là kết quả của yêu cầu `POST` bằng cách thực hiện chuyển hướng.
* Đọc dữ liệu được gửi qua biểu mẫu qua `event.request.formData()`
* Gửi dữ liệu đến cửa sổ mở (đây sẽ là giao diện người dùng mà chúng tôi đã chuyển hướng người dùng đến điểm đầu tiên).

Bạn hoàn toàn phụ thuộc vào những gì bạn làm với dữ liệu đã được đăng cho nhân viên dịch vụ của bạn, nhưng trong trường hợp Ứng dụng của tôi, tôi cần hiển thị trực tiếp trong UI để tôi phải tìm cửa sổ mà người dùng đang sử dụng và `postMessage` Dữ liệu ở đó.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

Và đó là về nó. Nếu bạn đã có điểm cuối API cho biểu mẫu web của mình, thì đây là một bổ sung đơn giản nhưng mạnh mẽ mà bạn có thể thực hiện cho trang web của mình.

API mục tiêu chia sẻ nền tảng Web cực kỳ mạnh mẽ phá vỡ một rào cản khác mà các ứng dụng web đã có trên nền tảng máy chủ của chúng.