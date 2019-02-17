---
slug: web-share-target-api
date: 2018-04-15T13:20:31+01:00
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


Tôi liên tục lo lắng rằng trên nền tảng web, chúng tôi đang tạo [silo ngoài ý muốn](/unintended-silos) bằng cách làm cho dữ liệu vào và ra khỏi trang web trở nên khó khăn hơn, quan trọng hơn là dữ liệu chỉ chảy một chiều: từ web cho ứng dụng vì ứng dụng có thể ở tất cả các địa điểm mà người dùng mong đợi trên thiết bị của họ.

Tôi rất hài lòng khi Chrome bắt đầu làm việc [trên API mục tiêu chia sẻ trên web](/breaking-down-silos-with-share-target-api) bổ sung cho công việc trên [navigator.share](/navigator.share). Nơi `navigator.share` cho phép bạn chia sẻ thông tin ra khỏi trang web của bạn với bất kỳ ứng dụng nào trên thiết bị người dùng có thể nhận 'chia sẻ' (` Intent.ACTION_SEND` trong ngôn ngữ Android), Mục tiêu chia sẻ web cho phép trang web của bạn (hoặc PWA ) nói 'Tôi cũng muốn chơi trong trò chơi đó'.

Tôi rất vui khi nói rằng tác phẩm này hiện đã có trong Chrome Canary trên Android.

API mục tiêu chia sẻ trên web là một API nhỏ mà bạn xác định trong Tệp kê khai ứng dụng web của mình. Nếu bạn đã từng sử dụng 'registerProtocolHandler` bạn sẽ thấy rằng nó không phải là một triệu dặm & mdash; bạn xác định một mẫu URL có một số biến trong đó sẽ được thay thế khi người dùng gọi hành động.

Trước tiên, bạn tạo thuộc tính 'object' được gọi là `share_target` có chứa một thuộc tính được gọi là` url_template` có đường dẫn sẽ được mở khi người dùng chọn dịch vụ của chúng tôi. Trên Android, bạn có thể sử dụng ba tên thay thế được gọi là: * `{title}` - tương đương với `.title` trên navigator.share API hoặc` Intent.EXTRA_SUBJECT` từ Mục đích Android. * `{text}` - tương đương với `.text` trên navigator.share API hoặc` Intent.EXTRA_TEXT` từ Mục đích Android. * `{url}` - tương đương với `.url` trên navigator.share API hoặc dữ liệu thô từ Mục đích Android.

Bạn có thể thử điều này ngay hôm nay bằng cách cài đặt [PWA của Twitter](https://mobile.twitter.com/). [Biểu hiện của Twitter ở bên dưới](https://mobile.twitter.com/manifest.json):


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


Ngay bây giờ có một số hạn chế:

* Bạn chỉ có thể có một tệp kê khai, có nghĩa là trong trường hợp của Twitter, họ không thể có 'Chia sẻ với DM'. * Có một số tiện ích mở rộng được đề xuất như sự kiện công nhân dịch vụ có tên là `navigator.actions` sẽ được kích hoạt mà không cần phải mở một bề mặt giao diện người dùng, nhưng chúng chưa được triển khai. * Bạn chỉ có thể chia sẻ 'văn bản', có nghĩa là nếu bạn muốn chia sẻ một Blob dữ liệu bạn cần lưu với một URL mà sau đó sẽ được chia sẻ. * Nó chỉ hoạt động trên Android. * Bạn phải cài đặt PWA, vì vậy bạn không thể thực hiện một ổ đĩa bằng cách đăng ký mục tiêu chia sẻ. Khi Chrome tạo 'APK Web', bây giờ, nó nhìn vào `share_target` để xem liệu nó có nên đăng ký bản gốc` <intent-filter> `hay không. * Nó chưa được tiêu chuẩn hóa như là một phần của thông số biểu hiện. : / oh - và nó cũng [có thể thay đổi](https://github.com/w3ctag/design-reviews/issues/221#issuecomment-376717885).

Hạn chế sang một bên, đây là một bổ sung khá tuyệt vời cho nền tảng web đó là sự khởi đầu của phá vỡ các rào cản lớn mà web có liên quan đến hội nhập trên nền tảng máy chủ.

Nếu bạn muốn theo dõi cập nhật cho API này, hãy xem [Trạng thái Chrome](https://www.chromestatus.com/feature/5662315307335680).
