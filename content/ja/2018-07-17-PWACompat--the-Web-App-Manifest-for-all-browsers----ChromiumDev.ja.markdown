---
slug: pwacompat--the-web-app-manifest-for-all-browsers----chromiumdev
date: 2018-07-17T07:45:28.391Z
title: 'PWACompat: the Web App Manifest for all browsers - @ChromiumDev'
link: https://developers.google.com/web/updates/2018/07/pwacompat
tags: [links, pwa, manifest]
---
[Sam Thorogood](https://dev.to/samthor)からのメッセージ：

> You've designed a webapp, built its code and service worker, and finally added the Web App Manifest to describe how it should behave when 'installed' on a user's device. This includes things like high-resolution icons to use for e.g. a mobile phone's launcher or app switcher, or how your webapp should start when opened from the user's home screen.
> 
> And while many browsers will respect the Web App Manifest, not every browser will load or respect every value you specify. Enter PWACompat, a library that takes your Web App Manifest and automatically inserts relevant meta or link tags for icons of different sizes, the favicon, startup mode, colors etc.


[全文を読む](https://developers.google.com/web/updates/2018/07/pwacompat)

私はこの図書館に驚いていました。もう少し注目を集めることができてうれしいです。私が実際にiOSのスプラッシュスクリーンを見たのは、この5年間で初めてでした。彼はデバイスの正確な画面サイズに基づいてオンザフライで画像を生成し、base64は画像をエンコードします...それはまた、SafariのAdd To Homescreenストーリーのギャップの残りの部分をいっぱいにします。

あなたがPWAを構築しているなら、それを含めるでしょう。
