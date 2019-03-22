---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
Tôi đã chơi rất nhiều với [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) trong Chrome rất nhiều và tôi thực sự thích tiềm năng của nó, ví dụ như một [QRCode detector](https://qrsnapper.com) rất đơn giản tôi đã viết cách đây rất lâu có một polyfill JS, nhưng sử dụng API `new BarcodeDetector()` nếu có.

Bạn có thể thấy một số bản demo khác mà tôi đã tạo ở đây bằng cách sử dụng các khả năng khác của API phát hiện hình dạng: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) và [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

Tôi đã rất ngạc nhiên khi tôi tình cờ gặp [Jeeliz](https://jeeliz.com) vào cuối tuần và tôi vô cùng ấn tượng với hiệu suất của bộ công cụ của họ - với điều kiện tôi đang sử dụng Pixel3 XL, nhưng việc phát hiện khuôn mặt có vẻ nhanh hơn đáng kể so với API `FaceDetector` .

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Nó khiến tôi suy nghĩ rất nhiều. Bộ công cụ này để phát hiện đối tượng (và những công cụ tương tự) sử dụng API có sẵn rộng rãi trên Web cụ thể là Truy cập máy ảnh, WebGL và WASM, không giống như API phát hiện hình dạng của Chrome (chỉ có trong Chrome và không nhất quán trên tất cả các nền tảng mà Chrome đang hoạt động ) có thể được sử dụng để xây dựng trải nghiệm phong phú dễ dàng và tiếp cận hàng tỷ người dùng với trải nghiệm nhất quán trên tất cả các nền tảng.

Mở rộng là nơi thú vị (và thực sự là những gì tôi muốn thể hiện trong bài đăng này) và là nơi bạn cần thư viện phần mềm trung gian hiện đang đến với nền tảng, chúng tôi có thể xây dựng các ứng dụng lọc khuôn mặt snapchat-esque thú vị mà không cần người dùng cài đặt ứng dụng MASSIVE thu hoạch lượng dữ liệu khổng lồ từ thiết bị người dùng (vì không có quyền truy cập cơ bản vào hệ thống).

Ngoài các bản demo vui nhộn, có thể giải quyết các trường hợp sử dụng rất tiên tiến một cách nhanh chóng và đơn giản cho người dùng, chẳng hạn như:

* Lựa chọn văn bản trực tiếp từ máy ảnh hoặc ảnh từ người dùng
* Dịch trực tiếp các ngôn ngữ từ máy ảnh
* Phát hiện QRCode nội tuyến để mọi người không phải mở WeChat mọi lúc :)
* Tự động trích xuất URL trang web hoặc địa chỉ từ một hình ảnh
* Phát hiện thẻ tín dụng và trích xuất số (giúp người dùng đăng ký vào trang web của bạn nhanh hơn)
* Tìm kiếm sản phẩm trực quan trong ứng dụng web của cửa hàng của bạn.
* Tra cứu mã vạch để biết thêm chi tiết sản phẩm trong ứng dụng web của cửa hàng của bạn.
* Cắt nhanh ảnh hồ sơ trên khuôn mặt của mọi người.
* Các tính năng A11Y đơn giản để cho phép người dùng nghe văn bản tìm thấy trong hình ảnh.

Tôi mới dành 5 phút để suy nghĩ về các trường hợp sử dụng này - tôi biết còn nhiều điều nữa - nhưng tôi nhận ra rằng chúng ta không thấy nhiều trang web hoặc ứng dụng web sử dụng máy ảnh, thay vào đó chúng ta thấy rất nhiều trang web hỏi họ người dùng tải xuống một ứng dụng và tôi không nghĩ chúng ta cần phải làm điều đó nữa.

** Cập nhật ** Thomas Steiner trong nhóm của chúng tôi đã đề cập trong nhóm của chúng tôi Trò chuyện rằng có vẻ như tôi không thích API `ShapeDetection` hiện tại. Tôi thích thực tế rằng API này cho phép chúng tôi truy cập vào các triển khai vận chuyển riêng của từng hệ thống tương ứng, tuy nhiên như tôi đã viết trong [The Lumpy Web](/the-lumpy-web/) , Nhà phát triển web khao khát sự nhất quán trong nền tảng và có một số vấn đề với API phát hiện hình dạng có thể được tóm tắt là:

1. API chỉ có trong Chrome 2. API trong Chrome rất khác nhau trên mọi nền tảng vì các triển khai cơ bản của chúng là khác nhau. Android chỉ có điểm cho các điểm mốc như miệng và mắt, nơi macOS có đường viền. Trên Android, `TextDetector` trả về văn bản được phát hiện, trong đó trên macOS, nó trả về chỉ báo &#39;Hiện diện văn bản&#39; ... Đây không phải là đề cập đến tất cả các lỗi mà Surma tìm thấy.

Web với tư cách là một nền tảng để phân phối có ý nghĩa rất lớn đối với những trải nghiệm như thế này đến nỗi tôi nghĩ rằng chúng ta sẽ không làm điều đó, nhưng hai nhóm vấn đề nêu trên khiến tôi đặt câu hỏi về nhu cầu lâu dài để thực hiện mọi tính năng trên nền tảng web thực sự, khi chúng ta có thể triển khai các giải pháp tốt trong gói được vận chuyển bằng các tính năng của nền tảng hiện nay như WebGL, WASM và trong GPU Web trong tương lai.

Dù sao, tôi thích thực tế là chúng ta có thể làm điều này trên web và tôi đang tìm kiếm để thấy các trang web giao hàng với họ.