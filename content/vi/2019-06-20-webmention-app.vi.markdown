---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
Tôi thích ý tưởng của [Webmentions](https://www.w3.org/TR/webmention/) , nhưng tôi chưa có thời gian để thực hiện nó trên trang web của mình. Tại một trang web cấp cao đề cập đến cho phép bạn nhận xét, thích và trả lời nội dung khác trên web và hiển thị nội dung đó mà không bị tập trung với các công cụ như Disqus (mà tôi muốn xóa khỏi trang web của tôi).

Web Mentions được chia thành hai thành phần, người gửi và người nhận. Người nhận là trang web mà tôi đang viết một bài đăng và họ có thể có một cái gì đó trên trang web của họ hiển thị các liên kết hoặc phản ứng gửi đến blog của họ; và người gửi là, tốt, tôi. Tôi cần để trang web từ xa mà tôi đã viết hoặc phản ứng với một số nội dung mà họ đã tạo.

[Remy Sharp](https://remysharp.com) khá tuyệt vời đã tạo ra [webmention.app](https://webmention.app/) để giải quyết một phần của vấn đề: gửi ping. Công cụ của Remy giúp dễ dàng gửi &#39;ping&#39; đến các máy thu tiềm năng mà tôi đã liên kết đến, chỉ bằng cách gọi một tập lệnh CLI.

Tôi lưu trữ blog của mình bằng Zeit bằng Hugo và công cụ xây dựng tĩnh, vì vậy đó là [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Tôi chỉ `npm i webmention` và sau đó gọi phiên bản CLI của công cụ từ tệp `build.sh` của tôi - nó thực sự đơn giản.

Bây giờ khi tôi tạo một bài đăng, nó sẽ gửi một ping nhanh đến tất cả các URL mới mà tôi đã tạo một số nội dung về trang web của họ.

