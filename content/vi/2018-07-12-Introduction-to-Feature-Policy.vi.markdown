---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman về cập nhật web của nhà phát triển Google, viết:

> Building for the web is a rocky adventure. It's hard enough to build a top-notch web app that nails performance and uses all the latest best practices. It's even harder to keep that experience great over time. As your project evolves, developers come on board, new features land, and the codebase grows. That Great Experience &#x2122; you once achieved may begin to deteriorate and UX starts to suffer! Feature Policy is designed to keep you on track.
> 
> With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout your site. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.
> 
> Here are examples of things you can do with Feature Policy:
> 
> * Change the default behavior of autoplay on mobile and third party videos.
> * Restrict a site from using sensitive APIs like camera or microphone.
> * Allow iframes to use the fullscreen API.
> * Block the use of outdated APIs like synchronous XHR and document.write().
> * Ensure images are sized properly (e.g. prevent layout thrashing) and are not too big for the viewport (e.g. waste user's bandwidth).
> 
> Policies are a contract between developer and browser. They inform the browser about what the developer's intent is and thus, help keep us honest when our app tries to go off the rails and do something bad. If the site or embedded third-party content attempts to violate any of the developer's preselected rules, the browser overrides the behavior with better UX or blocks the API altogether.


[Đọc toàn bộ bài đăng](https://developers.google.com/web/updates/2018/06/feature-policy).

Tôi thích xem vùng đất này như thế nào. Tôi lo lắng rằng các nhà phát triển sẽ không quan tâm đến điều này, hoặc rằng họ sẽ bị áp lực. Như tôi đã nói [trên Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), tôi lo lắng về các ưu đãi và chúng tôi cần kết hợp thực tế rằng tính năng này sẽ cho phép các nhà phát triển kiểm soát một số lượng lớn các tính năng có sẵn hoặc mất bộ nhớ, có thể làm chậm trang xuống, hoặc vô tình làm rò rỉ sự riêng tư của người dùng cho các bên thứ ba nhúng, với những thứ mà các nhà phát triển có thể bán cho doanh nghiệp của họ. Một ví dụ có thể là ** nếu ** Cửa hàng Play đã từng liệt kê PWA thì họ có thể đi kèm với bộ chính sách được tự động áp dụng khi ứng dụng được khởi chạy và bạn là nhà phát triển đồng ý với điều này vì lợi ích của việc tham gia cửa hàng.

Tôi rất vui khi thấy điều gì xảy ra với API này và tôi muốn xem nó được chấp nhận, ngay cả khi nó chỉ được các nhà phát triển sử dụng để đảm bảo rằng các nhóm của họ không thoái lui.
