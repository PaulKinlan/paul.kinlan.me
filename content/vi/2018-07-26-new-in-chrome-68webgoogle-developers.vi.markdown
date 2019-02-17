---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage viết về những thay đổi quan trọng đối với Thêm vào màn hình chính trong Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Đọc toàn bộ bài đăng](https://developers.google.com/web/updates/2018/07/nic68).

Tôi có cảm giác lẫn lộn về điều này ban đầu bởi vì rất nhiều người không xử lý sự kiện 'beforeinstallprompt`, điều đó có nghĩa là số lượt cài đặt APK trên web sẽ giảm đáng kể, nhưng tôi nghĩ đó thực sự là điều đúng đắn.

Mục tiêu là giảm số lượng lời nhắc gây phiền nhiễu xảy ra trên web và điều cuối cùng chúng tôi cần trong ngành là một dấu nhắc tương đối lớn xuất hiện khi chúng tôi nghĩ rằng người dùng có thể muốn cài đặt PWA, thay vào đó bạn cần suy nghĩ về nơi và khi nào ** bạn ** muốn nhắc cài đặt và bạn phải thực hiện nó để đáp lại cử chỉ của người dùng.

Điều gọn gàng là chúng tôi (Chrome) đang giới thiệu nhiều cách khác để cho người dùng biết rằng trải nghiệm có thể được cài đặt, ngay bây giờ đó là thanh đáy nhỏ xuất hiện trong lần tải đầu tiên và hy vọng trong tương lai chúng tôi có thể khám phá những cách tinh tế hơn để cho người dùng biết rằng họ có thể hành động.
