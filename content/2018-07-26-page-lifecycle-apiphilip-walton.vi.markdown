---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
Philip Walton có một cái nhìn sâu sắc tuyệt vời vào một API mới mà nhóm Chrome đã làm việc để cung cấp cho bạn (nhà phát triển) kiểm soát cách phản hồi khi trình duyệt tải các tab của bạn xuống.

> Application lifecycle is a key way that modern operating systems manage resources. On Android, iOS, and recent Windows versions, apps can be started and stopped at any time by the OS. This allows these platforms to streamline and reallocate resources where they best benefit the user.
> 
> On the web, there has historically been no such lifecycle, and apps can be kept alive indefinitely. With large numbers of web pages running, critical system resources such as memory, CPU, battery, and network can be oversubscribed, leading to a bad end-user experience.
> 
> While the web platform has long had events that related to lifecycle states &#x2014; like load, unload, and visibilitychange &#x2014; these events only allow developers to respond to user-initiated lifecycle state changes. For the web to work reliably on low-powered devices (and be more resource conscious in general on all platforms) browsers need a way to proactively reclaim and re-allocate system resources.
> 
> In fact, browsers today already do take active measures to conserve resources for pages in background tabs, and many browsers (especially Chrome) would like to do a lot more of this &#x2014; to lessen their overall resource footprint.
> 
> The problem is developers currently have no way to prepare for these types of system-initiated interventions or even know that they're happening. This means browsers need to be conservative or risk breaking web pages.
> 
> The Page Lifecycle API attempts to solve this problem by:
> 
> * Introducing and standardizing the concept of lifecycle states on the web.
> * Defining new, system-initiated states that allow browsers to limit the resources that can be consumed by hidden or inactive tabs.
> * Creating new APIs and events that allow web developers to respond to transitions to and from these new system-initiated states.
> * This solution provides the predictability web developers need to build applications resilient to system interventions, and it allows browsers to more aggressively optimize system resources, ultimately benefiting all web users.
> 
> The rest of this post will introduce the new Page Lifecycle features shipping in Chrome 68 and explore how they relate to all the existing web platform states and events. It will also give recommendations and best-practices for the types of work developers should (and should not) be doing in each state.


[Đọc toàn bộ bài đăng](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

Nhận xét đầu tiên của tôi là bạn nên đọc bài đăng của Philips. Không thể tin được.

Trên thiết bị di động, Chrome có thể khá tích cực khi chạy nền (đóng băng hoặc hủy) trang để tiết kiệm tài nguyên khi người dùng không sử dụng (ví dụ: khi bạn trao đổi tab hoặc di chuyển từ ứng dụng Chrome trên Android), khi trình duyệt khởi động trang như một nhà phát triển bạn theo truyền thống không có kiến ​​thức về thời điểm điều này xảy ra, do đó bạn không thể dễ dàng duy trì trạng thái hoặc thậm chí đóng tài nguyên mở và cũng quan trọng khi ứng dụng của bạn trở lại trạng thái sạch sẽ. Khi nhà phát triển có quyền kiểm soát họ có thể đưa ra nhiều lựa chọn sáng suốt hơn, điều này cũng có nghĩa là trình duyệt có thể tích cực hơn trong việc bảo tồn tài nguyên trong tương lai mà không ảnh hưởng nghiêm trọng đến trải nghiệm người dùng hoặc nhà phát triển.

Cuối cùng, sơ đồ dưới đây giải thích tất cả đều khá tốt.

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">API vòng đời trang</a> </figcaption></figure>


