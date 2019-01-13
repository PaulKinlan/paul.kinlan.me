---
slug: registering-as-a-share-target-with-the-web-share-target-api
date: 2018-12-07T05:42:30.968Z
title: 'Registering as a Share Target with the Web Share Target API'
link: https://developers.google.com/web/updates/2018/12/web-share-target?utm_source=feed&utm_medium=feed&utm_campaign=updates_feed
tags: [links, web intents, share, progressive web apps]
---
Pete LePage giới thiệu API mục tiêu chia sẻ web và tính khả dụng trong Chrome thông qua bản dùng thử gốc

> Until now, only native apps could register as a share target. The Web Share Target API allows installed web apps to register with the underlying OS as a share target to receive shared content from either the Web Share API or system events, like the OS-level share button.

[Read full post](https://developers.google.com/web/updates/2018/12/web-share-target?utm_source=feed&utm_medium=feed&utm_campaign=updates_feed) .

API này là một công cụ thay đổi trò chơi trên web, nó mở web lên một thứ chỉ có sẵn cho các ứng dụng gốc: Chia sẻ gốc. Các ứng dụng là silo, chúng hút tất cả dữ liệu và làm cho nó khó truy cập trên các nền tảng. Chia sẻ mục tiêu bắt đầu san bằng sân chơi để web có thể chơi trong cùng một trò chơi.

Trải nghiệm Twitter Mobile có Chia sẻ mục tiêu [already enabled](https://mobile.twitter.com/manifest.json) . Bài đăng này được tạo bằng cách sử dụng Mục tiêu chia sẻ mà tôi đã xác định trong bảng điều khiển quản trị trang &#39; [manifest.json](https://paul.kinlan.me/share/share-manifest.json) - nó hoạt động khá tốt và ngay khi họ hỗ trợ tệp, tôi sẽ có thể đăng bất kỳ hình ảnh hoặc blob nào trên thiết bị của mình lên blog.

Thời gian rất thú vị.

Đọc bài đăng được liên kết để tìm hiểu thêm về dòng thời gian khi API này được phát hành và cách sử dụng API.
