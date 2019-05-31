---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
Tôi đã có một chút thời gian sau khi Google IO và tôi muốn gãi ngứa lâu dài. Tôi chỉ muốn có thể sao chép văn bản được lưu giữ bên trong hình ảnh trong trình duyệt. Đó là tất cả. Tôi nghĩ rằng nó sẽ là một tính năng gọn gàng cho tất cả mọi người.

Không dễ để thêm chức năng trực tiếp vào Chrome, nhưng tôi biết tôi có thể tận dụng hệ thống ý định trên Android và bây giờ tôi có thể làm điều đó với Web (hoặc ít nhất là Chrome trên Android).

Hai bổ sung mới cho nền tảng web - Chia sẻ Mục tiêu cấp 2 (hoặc như tôi muốn gọi là Chia sẻ tệp) và `TextDetector` trong API phát hiện hình dạng - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

Việc triển khai cơ bản tương đối đơn giản về phía trước, bạn tạo Mục tiêu chia sẻ và trình xử lý trong Công nhân dịch vụ và sau đó khi bạn có hình ảnh mà người dùng đã chia sẻ, bạn chạy `TextDetector` trên đó.

`Share Target API` cho phép ứng dụng web của bạn là một phần của hệ thống con chia sẻ riêng và trong trường hợp này bạn có thể đăng ký để xử lý tất cả các loại `image/*` bằng cách khai báo bên trong `Web App Manifest` như sau.

```javascript
"share_target": {
  "action": "/index.html",
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
}
```

Khi PWA của bạn được cài đặt thì bạn sẽ thấy nó ở tất cả những nơi bạn chia sẻ hình ảnh như sau:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

API `Share Target` xử lý các tệp chia sẻ như một bài đăng mẫu. Khi tệp được chia sẻ với Ứng dụng web, nhân viên dịch vụ được kích hoạt trình xử lý `fetch` được gọi với dữ liệu tệp. Bây giờ dữ liệu nằm trong Công nhân dịch vụ nhưng tôi cần nó trong cửa sổ hiện tại để tôi có thể xử lý nó, dịch vụ biết cửa sổ nào đã yêu cầu, vì vậy bạn có thể dễ dàng nhắm mục tiêu máy khách và gửi dữ liệu.

```javascript
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(Response.redirect('/index.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const file = data.get('file');
      client.postMessage({ file, action: 'load-image' });
    }());
    
    return;
  }
  ...
  ...
}

```

Khi hình ảnh nằm trong giao diện người dùng, tôi sẽ xử lý nó bằng API phát hiện văn bản.

```javascript
navigator.serviceWorker.onmessage = (event) => {  
  const file = event.data.file;
  const imgEl = document.getElementById('img');
  const outputEl = document.getElementById('output');
  const objUrl = URL.createObjectURL(file);
  imgEl.src = objUrl;
  imgEl.onload = () => {
    const texts = await textDetector.detect(imgEl);
    texts.forEach(text => {
      const textEl = document.createElement('p');
      textEl.textContent = text.rawValue;
      outputEl.appendChild(textEl);
    });
  };
  ...
};
```

Vấn đề lớn nhất là trình duyệt không xoay hình ảnh một cách tự nhiên (như bạn có thể thấy bên dưới) và API phát hiện hình dạng cần văn bản ở hướng đọc chính xác.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

Tôi đã sử dụng [EXIF-Js library](https://github.com/exif-js/exif-js) khá dễ sử dụng để phát hiện xoay và sau đó thực hiện một số thao tác canvas cơ bản để định hướng lại hình ảnh.

```javascript
EXIF.getData(imgEl, async function() {
  // http://sylvana.net/jpegcrop/exif_orientation.html
  const orientation = EXIF.getTag(this, 'Orientation');
  const [width, height] = (orientation > 4) 
                  ? [ imgEl.naturalWidth, imgEl.naturalHeight ]
                  : [ imgEl.naturalHeight, imgEl.naturalWidth ];

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  // We have to get the correct orientation for the image
  // See also https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  switch(orientation) {
    case 2: context.transform(-1, 0, 0, 1, width, 0); break;
    case 3: context.transform(-1, 0, 0, -1, width, height); break;
    case 4: context.transform(1, 0, 0, -1, 0, height); break;
    case 5: context.transform(0, 1, 1, 0, 0, 0); break;
    case 6: context.transform(0, 1, -1, 0, height, 0); break;
    case 7: context.transform(0, -1, -1, 0, height, width); break;
    case 8: context.transform(0, -1, 1, 0, 0, width); break;
  }
  context.drawImage(imgEl, 0, 0);
}
```

Và Voila, nếu bạn chia sẻ một hình ảnh cho ứng dụng, nó sẽ xoay hình ảnh và sau đó phân tích nó trả về đầu ra của văn bản mà nó đã tìm thấy.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

Thật thú vị khi tạo ra thử nghiệm nhỏ này, và nó ngay lập tức hữu ích cho tôi. Tuy nhiên, nó làm nổi bật [inconsistency of the web platform](/the-lumpy-web/) . Các API này không có sẵn trong tất cả các trình duyệt, chúng thậm chí không có sẵn trong tất cả các phiên bản Chrome - điều này có nghĩa là khi tôi viết bài viết này Chrome OS, tôi không thể sử dụng ứng dụng, nhưng đồng thời, khi tôi có thể sử dụng nó ... OMG, thật tuyệt.

