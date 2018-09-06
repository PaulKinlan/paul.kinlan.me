---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


Tuần kia tôi đã nói về [Nhận diện khuôn mặt thông qua API hình dạng](/ nhận diện khuôn mặt /) nằm trong kênh Canary trong Chrome. Bây giờ phát hiện mã vạch là trong Chrome Canary quá ([Miguel](https://twitter.com/yellowdoge) là anh hùng của tôi;)

Mã vạch rất lớn! chúng trên hầu hết mọi sản phẩm chúng tôi mua. Thậm chí nhiều mã QRCode [rất lớn bên ngoài Hoa Kỳ và Châu Âu](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). Mã vạch và mã QR cung cấp một cách đơn giản để bạn kết nối thế giới thực và thế giới kỹ thuật số bằng cách chuyển một lượng nhỏ dữ liệu giữa phương tiện và bạn. Điều này có thể không phải là một số lượng lớn sử dụng trong thời đại của máy tính để bàn, trong thời đại của điện thoại di động nó là rất quan trọng. Bạn không bao giờ phải cài đặt ứng dụng chỉ để có quyền truy cập vào dữ liệu này.

API phát hiện hình dạng thú vị vì nó tạo ra một giao diện chuẩn trên đầu trang của một số tính năng phần cứng underlaying trên thiết bị của người dùng và mở ra một bộ khả năng mới cho nền tảng web, chủ yếu là Phát hiện khuôn mặt và phát hiện mã vạch.

API phát hiện mã vạch được xây dựng dựa trên [API phát hiện hình dạng](https://wicg.github.io/shape-detection-api/#introduction) hiện có trong [WICG](https://github.com/ wicg /) có nghĩa là nó đang trong giai đoạn ủ bệnh và thử nghiệm. Trên [Android, bạn có thể phát hiện một số mã vạch 1D và 2D] khác nhau (https://developers.google.com/vision/barcodes-overview):

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


Hơn nữa:

> It automatically parses QR Codes, Data Matrix, PDF-417, and Aztec values, for
> the following supported formats:
>
> * URL
> * Contact information (VCARD, etc.)
> * Calendar event
> * Email
> * Phone
> * SMS
> * ISBN
> * WiFi
> * Geo-location (latitude and longitude)
> * AAMVA driver license/ID


API phát hiện hình dạng hiện có trong Chrome Canary (M57) và bạn cần bật tính năng này thông qua `chrome: // flags / # enable-experiment-web-platform-features`

Giống như phát hiện khuôn mặt, API tương đối đơn giản để sử dụng. Bạn gọi API thông qua `detect` trên API` BarcodeDetector` và bạn lấy lại một lời hứa resovels đến một danh sách các mã vạch được giải mã.


```javascript
var barcodeDetector = new BarcodeDetector();
barcodeDetector.detect(image)
  .then(barcodes => {
    barcodes.forEach(barcode => console.log(barcodes.rawValue))
  })
  .catch((e) => {
    console.error("Boo, BarcodeDetection failed: " + e);
  });
```


Phải mất một đối tượng hình ảnh (hoặc một CanvasImageSource, Blob, ImageData hoặc một ` <img> `element) và sau đó chuyển nó tới API hệ thống bên dưới và nó sẽ trả về một mảng các đối tượng` DetectedBarcode` thực hiện `DetectedObject`, về cơ bản cung cấp cho bạn các giới hạn của mỗi khuôn mặt trong hình ảnh.

Tôi cũng đã [tích hợp](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) nó vào [Ứng dụng Máy quét QRCode] của tôi (https://qrsnapper.appspot.com) nhưng tôi đang đợi một sửa sang đất cho phép tôi vượt qua [Canvas](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) hoặc [ImageData](https://bugs.chromium.org/ p / chromium / issues / detail? id = 670975) đối tượng vào API.

Điều thú vị là bởi vì tôi đã xây dựng ứng dụng này trong JS bằng cách sử dụng [LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode) Tôi có thể phát hiện tính sẵn có của quét mã vạch gốc và nếu nó không có sau đó tôi không quay trở lại thực hiện JS thuần túy.

Dưới đây là một số video hoạt động:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

Tôi đã không đề cập đến nó trong bài viết trước, nhưng điều này cũng nên làm việc trên một chuỗi công nhân (và do đó bên trong một Service Worker). Đối với trường hợp sử dụng của tôi, điều này là tuyệt vời vì nó cho phép tôi ủy quyền logic của tôi trong một luồng khác và giữ mọi thứ cách xa luồng giao diện người dùng.

Tôi nghĩ rằng đó là một bổ sung rất hấp dẫn cho nền tảng web và tôi rất vui khi thấy điều này được sử dụng.