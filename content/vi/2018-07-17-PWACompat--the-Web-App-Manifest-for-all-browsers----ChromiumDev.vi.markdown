---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor) từ nhóm của chúng tôi viết:

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[Đọc toàn bộ bài đăng](https://developers.google.com/web/updates/2018/07/pwacompat).

Tôi đã rất ngạc nhiên bởi thư viện này, và tôi rất vui khi thấy nó nhận được nhiều sự chú ý hơn một chút. Đây là lần đầu tiên tôi thực sự thấy Splash Screen trên iOS hoạt động trong 5 năm qua và anh ấy tạo ra chúng một cách thực sự gọn gàng - anh ấy tạo ra hình ảnh trên bay dựa trên kích thước màn hình chính xác của thiết bị và base64 mã hóa hình ảnh ... nó cũng lấp đầy rất nhiều khoảng trống còn lại trong câu chuyện Safari Add To Homescreen.

Nếu bạn đang xây dựng một PWA tôi sẽ bao gồm nó.
