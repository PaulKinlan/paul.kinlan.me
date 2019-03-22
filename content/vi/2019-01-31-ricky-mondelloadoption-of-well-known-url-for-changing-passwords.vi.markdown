---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello trên nhóm Safari vừa mới chia sẻ một lưu ý về cách Twitter sử dụng thông số ./well- Unknown / exchange -password.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

Tính năng này hoàn toàn vượt qua tôi nhưng đó là một ý tưởng gọn gàng: được cung cấp một tệp ở một vị trí nổi tiếng, trình duyệt có thể cung cấp giao diện người dùng cho người dùng cho phép họ nhanh chóng đặt lại mật khẩu mà không phải điều hướng giao diện người dùng phức tạp ..

Thông số kỹ thuật rất đơn giản: tệp nổi tiếng chỉ chứa URL để hướng người dùng đến khi họ muốn thực hiện hành động. Điều này dẫn tôi đến suy nghĩ, chúng ta có thể cung cấp nhiều tính năng hơn không:

* Một vị trí nổi tiếng cho các mô hình chấp thuận dựa trên GDPR (đồng ý cookie) - chủ sở hữu trang web có thể cung cấp liên kết đến trang nơi người dùng có thể quản lý và có khả năng thu hồi tất cả cookie và các mục đồng ý dữ liệu khác.
* Một vị trí nổi tiếng để quản lý quyền trình duyệt - chủ sở hữu trang web có thể cung cấp một nơi nhanh chóng để người dùng có thể thu hồi quyền đối với những thứ như vị trí địa lý, thông báo và các nguyên thủy khác.
* Một đường dẫn nổi tiếng để xóa tài khoản và thay đổi
* Một đường dẫn nổi tiếng để quản lý đăng ký danh sách gửi thư

Danh sách này tiếp tục .... Tôi thực sự thích ý tưởng cho các tệp chuyển hướng đơn giản để giúp người dùng khám phá các hành động phổ biến của người dùng và để một cách để trình duyệt hiển thị nó.

* Cập nhật: * Tôi đã thêm một [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .