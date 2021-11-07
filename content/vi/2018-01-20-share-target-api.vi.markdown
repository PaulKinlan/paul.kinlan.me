---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31.000Z
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
Bài viết này đã trễ hơn một năm. Nó đã bị mắc kẹt trong các bản nháp của tôi trong một thời gian dài, nhưng tôi nghĩ ý tưởng là thứ chúng ta cần giải quyết vào năm 2018. Nó cũng chỉ ra rằng các vấn đề khác đã nảy sinh trong năm qua khiến nó có liên quan hơn một chút.

Tôi đã ở Indonesia trước đó vào năm 2016 một cách nhàn nhã trò chuyện với các nhà phát triển và nó đã đưa ra trong cuộc trò chuyện rằng web là hơi say (họ là những từ ngữ). Điểm mấu chốt của vấn đề là người dùng ngày nay, và đặc biệt là những người dùng trực tuyến lần đầu tiên, đang tạo nội dung bên trong các silo. Trong một số trường hợp, các silo [trông và cảm thấy giống như web](/ tăng-of-the-meta-platform /) nhưng nội dung chỉ có sẵn trên các nền tảng đó nhưng nó được duy trì bởi thực tế là mọi ứng dụng gốc đều có khả năng tích cực tham gia vào mọi tương tác mà người dùng có trên thiết bị máy tính của họ, nhưng trang web thì không và đó là kẻ giết người. Không thể đưa nội dung vào trải nghiệm web, nhưng sẽ dễ dàng hơn để đưa nội dung ra ngoài.

Cụ thể hơn, có một số kịch bản mà chúng tôi đã thảo luận.

1. Bạn chụp ảnh trên ứng dụng máy ảnh của mình và bạn muốn chia sẻ hình ảnh. Bạn nhấn chia sẻ nhưng chỉ các ứng dụng gốc xuất hiện trong danh sách. Web không phải là một phần của sự lựa chọn cho người dùng, do đó, web không bao giờ có thể nắm bắt được giá trị đó. 2. Bạn muốn chia sẻ trang hiện tại trong trình duyệt. Bạn nhấn chia sẻ nhưng chỉ các ứng dụng gốc xuất hiện trong danh sách. Hành động chia sẻ thông tin có nghĩa là chúng tôi đang mất người dùng từ web đến trải nghiệm gốc 3. Bạn tạo một số nội dung trực tiếp bên trong trang web và bạn muốn chia sẻ nội dung đó, tùy chọn duy nhất của bạn là bao gồm tiện ích chia sẻ.

Vào đầu năm 2017, chúng tôi đã thấy sự ra mắt của [navigator.share](/ navigator.share /) mang lại khả năng chia sẻ bản địa lên web (ít nhất, người dùng Chrome ít nhất). Điều trớ trêu là API `navigator.share` làm kéo dài luồng người dùng bằng ứng dụng gốc.

Vào năm 2018, tôi muốn web trở nên hiệu quả hơn trong việc phá vỡ các silo được duy trì trên nền tảng gốc. Web cần có khả năng tham gia vào mọi tương tác chính mà người dùng có với thiết bị của họ.

Cuối năm 2017, "Đã thêm màn hình chính được cải thiện" được khởi chạy trong Chrome trên Android. Điều này có nghĩa là mỗi khi người dùng cài đặt `Progressive Web App`, APK thực tế sẽ được tạo cho người dùng. APK trên Android có nghĩa là đối với tất cả ý định và mục đích ứng dụng web của bạn được coi là ứng dụng gốc. Trong lần lặp đầu tiên của "Cải thiện thêm vào màn hình chủ" tất cả những gì nó có nghĩa là mọi điều hướng đến một url bên trong phạm vi PWA của bạn sẽ mở trực tiếp trong PWA.

Tương lai là một chút sáng hơn mặc dù. Chrome đang làm việc trên [Chia sẻ API mục tiêu](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) cho phép bạn tuyên bố rằng trang web của bạn sẽ tham gia vào việc nhận của "cổ phiếu". Điều đó có nghĩa là mỗi lần người dùng chia sẻ liên kết, PWA của bạn sẽ có thể được liệt kê.

Tôi khá vui mừng bởi sự phát triển này bởi vì nó có nghĩa là các trang web lớn như [Twitter Lite](https://lite.twitter.com) bây giờ sẽ có thể được chia sẻ mà không cần người dùng sử dụng ứng dụng Gốc, nhưng nó cũng có nghĩa là các trang web thích hợp nhỏ mà chỉ một số ít người dùng có thể sử dụng cũng có thể là một phần của cùng một hệ sinh thái.

API không thể xử lý hình ảnh và dữ liệu nhị phân, nhưng nhìn vào hệ sinh thái Android, ý định ACTION_SEND là mục đích được sử dụng nhiều nhất và chủ yếu chỉ để chia sẻ văn bản và liên kết.

Đó là một sự khởi đầu. Web đang phá vỡ một silo tại một thời điểm.
