---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee từ This Dot đã tổ chức một luồng trực tiếp khá gọn gàng đã mang lại nhiều nhà cung cấp trình duyệt để cung cấp tổng quan về những gì họ đang làm việc:

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder


[Đọc toàn bộ bài đăng](https://www.youtube.com/watch?v=67etFbKTOFA).

Tôi hoàn toàn thích thú với luồng trực tiếp và thật tuyệt khi nghe mọi người đang làm gì. Tôi cũng thích tầm nhìn mà Beaker Browser có cho một trang web phân tán, họ đã thực hiện rất nhiều công việc kể từ lần cuối cùng chúng tôi gặp nhau.

Tôi khuyến khích bạn xem video được liên kết, Edge đã có một số lượng lớn các bản cập nhật bao gồm hỗ trợ đầy đủ Dịch vụ công nhân, các phông chữ thay đổi và cũng có thể chúng đang giới thiệu WebP. Mozilla tập trung rất lớn vào Web Assembly và công cụ phát triển, Beaker đang làm những điều tuyệt vời với dat: và tính toán phân tán và Brave đã di chuyển rất nhiều trên BAT.

Tôi tập trung vào công việc mà nhóm của chúng tôi đang thực hiện tại thời điểm này và rộng rãi xung quanh Discovery, Tốc độ và Độ tin cậy, Giao diện người dùng, UX - Hoàn thành công việc, Bảo mật và quyền riêng tư. Cụ thể hơn một chút:

* Khám phá - chúng tôi thực sự cần phải giúp các nhà phát triển xây dựng các trang web với JS dễ dàng hơn khi hiển thị trong các dịch vụ không đầu như trình lập chỉ mục và trình nhúng. Điều đó có nghĩa là chúng ta cần tập trung vào việc giáo dục các nhà phát triển về cách các nhà lập chỉ mục hoạt động và cách kiểm thử chúng, và cũng làm thế nào để xây dựng các trải nghiệm SSR vững chắc tốt. * Tốc độ và độ tin cậy - Tất cả các trang web phải có TTI <5s trên mạng 3G trên thiết bị Median (MotoG 4/5) và bạn nên tối ưu hóa FID (độ trễ đầu vào đầu tiên). FID là một chỉ số mới, vì vậy điều quan trọng là phải hiểu rằng nó có nghĩa là đại diện cho cách người dùng của bạn trải nghiệm trang web của bạn một cách hoang dã, nơi mà TTI khó đo lường, FID sẽ dễ dàng hơn. Có một [polyfill ở đây mà bạn có thể sử dụng để kiểm tra FID](github.com/GoogleChromeLabs/first-input-delay) * UI Responsiveness - Chúng tôi muốn trang web ở mức 60fps ở mọi nơi và giúp các nhà phát triển dễ dàng đạt được, vì vậy chúng tôi đang nghiên cứu & # x2018; FLIP & # x2019; dễ hiểu hơn, xây dựng Houdini để chúng tôi có thể giúp các nhà phát triển kiểm soát nhiều hơn việc tạo dựng hình ảnh và cuối cùng cố gắng di chuyển càng nhiều công việc càng tốt 'ngoài chủ đề' thông qua những thứ như img.decode và các công cụ như liên kết để tạo công nhân dễ sử dụng hơn. * UX - Hoàn thành công việc - Chúng tôi thực sự muốn thay đổi cách chúng ta nói về các tính năng mới sắp tới, đặc biệt chúng tôi muốn giới thiệu công nghệ được sử dụng hiệu quả để cải thiện trải nghiệm người dùng nhằm giúp họ hoàn thành công việc nhanh chóng với sự gián đoạn ít nhất có thể. * Bảo mật và quyền riêng tư - Tôi nghĩ phòng chống theo dõi thông minh của Apple sẽ có ảnh hưởng lâu dài trên web và các nhà phát triển cần phải bắt đầu suy nghĩ nhiều hơn về việc xây dựng trải nghiệm web hỗ trợ riêng tư. Nếu bất cứ điều gì GDPR làm cho trang web trở thành một trải nghiệm 'thú vị' ở EU.

Cuối cùng, nó đã khiêm nhường và ấm lòng khi nghe rằng mọi người đều muốn mang về [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) :)
