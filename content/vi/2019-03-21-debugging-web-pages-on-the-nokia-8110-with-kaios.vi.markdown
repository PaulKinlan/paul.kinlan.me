---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Gần đây chúng tôi đã phát triển rất nhiều trên điện thoại tính năng và điều đó thật khó khăn, nhưng thú vị. Điều khó nhất là trên KaiOS, chúng tôi thấy không thể gỡ lỗi các trang web, đặc biệt là trên phần cứng mà chúng tôi có (Nokia 8110). Nokia là một thiết bị tuyệt vời, được xây dựng với KaiOS mà chúng ta biết dựa trên một cái gì đó giống với Firefox 48, nhưng nó bị khóa, không có chế độ nhà phát triển truyền thống như bạn có trên các thiết bị Android khác, có nghĩa là bạn không thể kết nối Firefox Web dễ dàng.

Thông qua việc kết hợp đọc một vài blog và biết một chút về `adb` tôi đã tìm ra cách để làm điều đó. Lưu ý, những người khác có thể đã có thể làm điều đó, nhưng nó không được ghi chép lại ở một nơi sạch sẽ.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(Ảnh trên hiển thị DevTools và cũng là đầu ra của công cụ chụp màn hình)

Dưới đây là các bước:

1. Kết nối cáp USB. Đảm bảo bạn đã cài đặt `adb` trên máy chính của mình. 2. Tải xuống bản sao của [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (đây là bản duy nhất tôi có thể làm việc) 3. Bật &#39;Chế độ nhà phát triển&#39; bằng cách nhập `*#*#33284#*#*` từ điện thoại của bạn (lưu ý, không sử dụng trình quay số). Bạn sẽ thấy một biểu tượng &#39;lỗi&#39; nhỏ trên đỉnh màn hình. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ] 4. Gắn cáp USB của bạn 5. Trên máy phát triển của bạn chạy các lệnh sau 1. `adb start-server` 2. `adb devices` để kiểm tra điện thoại của bạn được kết nối. 3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` này sẽ thiết lập một kênh từ máy của bạn đến một ổ cắm trên điện thoại. Đây là những gì Web IDE sử dụng. 6. Khởi động `Web IDE` bằng cách mở Firefox, đi tới Công cụ và sau đó là Web IDE 7. Web IDE sẽ được mở, nhấp vào &#39;Remote Runtime&#39; và nhấp vào nút mở có &#39;localhost: 6000&#39;. . 8. Mở một trang trên điện thoại và bạn sẽ thấy nó ở bên trái. Voila.
