---
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
date: 2018-10-23T09:53:10.359Z
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
tags: [links, performance, qrcode]
---
Tôi đã ở Trung Quốc vài tuần trước cho Ngày nhà phát triển của Google và tôi đã hiển thị cho mọi người [Trình quét QRCode] của tôi (0), nó hoạt động tốt cho đến khi tôi ngoại tuyến. Khi người dùng ngoại tuyến (hoặc được kết nối một phần) máy ảnh sẽ không khởi động, điều đó có nghĩa là bạn không thể chụp mã QR. Nó đã cho tôi một tuổi để làm việc ra những gì đang xảy ra, và nó chỉ ra tôi đã nhầm lẫn bắt đầu máy ảnh trong sự kiện `onload` của tôi và yêu cầu Google Analytics sẽ treo và không giải quyết một cách kịp thời. Đó là [cam kết cố định nó](https://qrsnapper.com).

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.


[Đọc toàn bộ bài đăng](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/).

Tôi khuyến khích bạn đọc bài đăng vì có rất nhiều thông tin chi tiết tuyệt vời.
