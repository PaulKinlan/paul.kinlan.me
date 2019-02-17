---
slug: goodbye-jekyll-hello-hugo
date: 2015-07-31
title: "Goodbye Jekyll, Hello Hugo"
description: "Ruby frustrations and performance have frustrated me for a long time. Experimented with Hugo and ported blog in about 3 hours"
image_header: /images/hellogoodbye.png
---


Tôi thích Jekyll. Nó đã giúp tôi trở lại viết blog và tôi [chọn nó như là công nghệ](https://github.com/Google/WebFundamentals/) để xây dựng [Google Web Fundamentals](https://developers.google.com/web/fundamentals/) với nó.

Một cái gì đó là sai lầm nghiêm trọng mặc dù: ** Hiệu suất **.

Thời gian xây dựng cho blog cá nhân của tôi (khoảng 400 trang) mất khoảng 45 giây. Các nguyên tắc cơ bản về web thậm chí còn tồi tệ hơn, thường mất nhiều phút để xây dựng chỉ một gói ngôn ngữ và chúng tôi hỗ trợ 13 ngôn ngữ. Vấn đề hiệu suất này ảnh hưởng nghiêm trọng đến nhóm của chúng tôi và nhóm viết của chúng tôi vì những thay đổi đơn lẻ trong môi trường dàn dựng địa phương mất tối đa 40 giây để hiển thị trong trình duyệt.


* Có lẽ * chúng tôi có thể cải thiện nó, nhưng tôi chắc chắn như heck không thể làm việc ra làm thế nào để làm điều đó. Tôi không thể sử dụng nó và chúng tôi liên tục gặp vấn đề với Ruby (chúng tôi không phải là nhà phát triển Ruby) đặc biệt xung quanh phiên bản của Gems và cập nhật thời gian chạy.

Chúng tôi có rất nhiều nợ kỹ thuật với trang web và nó đang đưa tôi và đội bóng rất nhiều thời gian chỉ để giữ cho mọi thứ chạy cho một trang web tĩnh. Tôi có linh cảm là động cơ templating và Ruby. Nhưng đây chỉ là tôi đoán.

Tôi đang tìm kiếm các trình tạo trang web tĩnh nhanh và một vài người trong nhóm rộng hơn đã gợi ý rằng [Hugo](http://gohugo.io/) (viết bằng chữ Go) là tốt, được cấu trúc tốt và cũng nhanh.

Tôi sẽ không đi vào Hugo nhiều. Nó là một trình tạo trang tĩnh có thể nhập các tệp Markdown (như Jekyll) và nhổ ra một trang web có cấu trúc dựa trên các mẫu mà bạn xác định.

Tôi sẽ đi qua một số điểm nhanh:


* Xây dựng Jekyll của tôi được sử dụng để mất 45 giây +, toàn bộ trang web Hugo xây dựng là 300-450ms. 2 đơn đặt hàng của cường độ nhanh hơn.
* Templating thông qua ngôn ngữ templating Go mất một chút nhận được sử dụng để nhưng nó là * sạch hơn nhiều * so với chất lỏng.
* Việc phân trang khá dễ dàng để tích hợp mặc dù tôi gặp rắc rối với tài liệu.
* Các tài liệu khá mạnh, có một số ví dụ về các trang mà bạn mong đợi có liên quan không phải lúc nào cũng gây nhầm lẫn.
* Hướng dẫn di chuyển Jekyll, cho một bản xây dựng Jekyll đơn giản giúp tôi có được nhiều nhất.
* Hugo không hỗ trợ cú pháp đặt tên tệp Jekyll (YYYY-MM-DD-title) để đặt hàng các bài đăng và tôi phải viết kịch bản di chuyển để thêm thuộc tính `date` vào mọi trang đánh dấu và cũng là một` slug` thuộc tính.
* Tôi đã có nhiều tệp HTML dường như không được đưa vào mảng .Site.Pages. Một lần nữa tôi đã phải chuyển đổi tất cả chúng với một kịch bản dòng lệnh đơn giản.

Tuy nhiên, hiệu suất là rực rỡ và blog của tôi là nhanh hơn rất nhiều và không có phụ thuộc Ruby.

Tôi không thể nói rằng chúng tôi sẽ chuyển các nguyên tắc cơ bản về web cho Hugo, đó là một công việc lớn. Tôi rất hài lòng với việc xây dựng và triển khai tại địa phương được thiết lập mà tôi hiện có bây giờ.

Tín dụng hình ảnh tiêu đề: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg