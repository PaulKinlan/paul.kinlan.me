---
slug: slice-the-web
date: 2015-08-03
title: "SLICE: The Web"
description: "What are the properties that make the web the web?  How can we keep differentiating from native to stay relevant in a mobile world?"
tags: ["headless", "slice", 'headless chrome', 'the headless web']
image_header: "/images/slice.jpg"
---


Đã có rất nhiều cuộc trò chuyện về tất cả các vấn đề của web trong vài tuần qua và chúng tự nhóm lại thành các danh mục sau:


* Hiệu suất
* [Lumpy](/the-lumpy-web/) trình duyệt không phù hợp
* Nhanh chóng mở rộng tính năng phong cảnh.

Tôi muốn đưa những điều này sang một bên trong vài phút để nhanh chóng nói về một trong những thuật ngữ mà chúng tôi đã sử dụng trong Google để mô tả nhanh các khía cạnh tích cực của web dưới dạng nền tảng cho người dùng và nhà phát triển: ** SLICE **.

Tôi không thể tìm thấy một tài liệu tham khảo ban đầu cho nó, nhưng các điểm cơ bản mà tôi sẽ đi vào được biết đến. ** SLICE ** đã được đề cập ở [Hội nghị thượng đỉnh dành cho nhà phát triển Chrome] đầu tiên (0) bởi Linus Upson trong bài phát biểu năm 2013. Khi Linus nói về các thuộc tính của trang web, nó không đúng thứ tự để đặt tên nhưng tôi khuyến khích bạn xem video này. _Note_: Brett Cannon, một Microsofter (trước đây là một Googler) cũng gần đây đã đề cập đến nó và nó là một [tốt đọc](https://developer.chrome.com/devsummit) và có kết luận tương tự như bài viết của tôi về [Sống với ứng dụng web](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web)

{{<youtube 20fGtfnxJuo>}}

<br> Tôi nghĩ nó bao gồm rất nhiều điểm tốt:


* __S__ecure - Tất cả các tên miền đều được đóng hộp cát từ các trang khác và các trang web được đóng hộp cát từ máy người dùng. Người dùng có thể truy cập bất kỳ trang web nào và biết họ an toàn.
* __L__inkable - Bạn có thể trỏ đến bất kỳ trang hoặc phần nội dung nào chỉ bằng cách chia sẻ một URL
* __I__ndexable - Vì bạn có thể liên kết tới bất kỳ thứ gì, nếu công khai nó có thể được phát hiện bởi bất kỳ người hoặc máy nào có thể lập chỉ mục nó để làm cho mọi người có thể khám phá mọi người.
* __C__omposable - Iframe và JavaScript cho phép chúng tôi nhanh chóng soạn và nhúng các trang web, ứng dụng và dịch vụ mới chỉ bằng cách thả vào một số JS và ghép nối mọi thứ lại với nhau.
* __E__phemeral - Không có gì để cài đặt, bạn vào trang và tương tác với nó, rời khỏi trang và khi bạn làm điều đó ngừng việc chiếm dụng tài nguyên.
** SLICE **.

Như một tập hợp các khả năng mà web đóng gói các nguyên tắc SLICE được biết đến nhiều nhưng thường bị lãng quên khi xem xét sự cạnh tranh của các nền tảng gốc.

Như một thuật ngữ, tôi thấy rằng ** SLICE ** là một cách tuyệt vời để nhanh chóng giải quyết các lợi ích của trang web hiện nay. Nó bỏ lỡ một vài lợi ích chính của web như khả năng triển khai các bản cập nhật ngay lập tức & mdash; ** SLUICE ** không phải là từ viết tắt tuyệt vời & mdash; nhưng đó là ok, ** SLICE ** như một từ viết tắt hoạt động tốt.

Tôi sử dụng mô hình ** SLICE ** làm cơ sở cho nơi chúng tôi đang đi với tương lai * của web * và những thách thức mà chúng tôi phải đối mặt và cần phải vượt qua để đạt được điều đó.


* __S__ecure - Web nên được giữ hộp cát và nó phải được mã hóa đầu cuối. Chúng tôi cũng cần phải tìm ra mô hình là gì để đảm bảo người dùng kiểm soát và nhận thức được quyền truy cập vào API nâng cao .. Ví dụ: gần đây chúng tôi đã bắt đầu gửi [Bluetooth API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en) cách bạn cung cấp cho người dùng sự tự tin rằng nó an toàn và bảo mật để sử dụng.
* __L__inkable - Tôi bắt đầu điều này với Web Intents và mặc dù nó đã kết thúc sớm, tôi tin rằng chúng tôi là do cho một thế hệ liên kết nội dung, trang web, ứng dụng và trải nghiệm bản địa. Một số đòi hỏi công nghệ mới một số đòi hỏi phải có giáo dục.
   * Liên kết đến các ứng dụng web: Tôi sẽ đi sâu vào thời điểm này một lần nữa. TL; DR - trang đích sản phẩm và trang đăng nhập không giúp chúng tôi liên kết đến các ứng dụng web.
   * Liên kết sâu vào phương tiện: trình duyệt trong một thời gian dài đã có thể liên kết đến bất kỳ phần nào của tệp nhưng không ai có thể làm điều đó.
   * Liên kết sâu hơn vào văn bản: Lần đầu tiên tôi thấy đây là blog của Dave Winer, nơi bạn có thể liên kết tới bất kỳ đoạn văn nào, gần đây hơn Trung bình đang cho mọi đoạn liên kết sâu.
   * Liên kết các đối tượng thế giới thực: [Web vật lý](https://google.github.io/physical-web/) để khám phá "những thứ" xung quanh chúng ta, và API mới để nói chuyện với những "thứ" này sẽ làm giảm ma sát trong cuộc sống hàng ngày của chúng ta.
* __I__ndexable - Web không đầu, nghĩa là các trình phân tích cú pháp và các chỉ mục đang nâng cao hơn cho phép chúng tôi hiểu thêm về nội dung trên web, chúng sẽ chạy JS và hiểu trực quan cách trang hiển thị nhưng vẫn còn nhiều vấn đề:
   * Schema.org được nhúng không thể mô tả chính xác ngữ nghĩa (do đó JSON + LD)
   * Phương tiện không có số lượng lớn dữ liệu meta được hiển thị ở định dạng công khai.
   * Ứng dụng: Web Intent's cố gắng là một cách mô tả những gì một ứng dụng web có thể làm. Chúng tôi không còn nữa và chúng tôi đang thiếu một cách lớn để mô tả khả năng của những gì một ứng dụng web có thể làm. Lấy [ứng dụng airhorn](https://airhorner.com/) của tôi làm ví dụ, mặc dù tôi hy vọng không ai cần chức năng sừng trong ứng dụng của họ, không có cách nào tìm ra nó ngoài tìm kiếm siêu dữ liệu và đó là một trong những lý do chúng tôi có các trang đích sản phẩm trên web.
   * Các thiết bị kết nối Internet không được lập chỉ mục và chúng không mô tả những gì chúng có thể làm. Đó là một phần thiếu cho tôi trong câu chuyện Web trong cuộc sống, khám phá các khả năng. Tôi cảm thấy như chúng ta cần một Intents Web cho IoT.
* __C__omposable - Nó sẽ dễ dàng đề cập đến chỉ đề cập đến Thành phần Web, nhưng thực sự chúng ta đang nói về hệ sinh thái rộng lớn hơn của các công cụ, thư viện và khung công cụ có thể tái sử dụng:
    * Có những vấn đề lớn của interop tại thời điểm này như là khuôn khổ cố gắng sở hữu toàn bộ ngăn xếp.
    * Chúng tôi cần giải quyết chức năng được ủy quyền phía máy khách. Web Intents đã cố gắng điều này, nhưng phần lớn trong số đó là có thể vẫn còn trên web ngày hôm nay nhưng chúng tôi không làm điều đó. tức là, tôi đã tạo một ứng dụng web mã QR, tại sao bạn cần xây dựng một ứng dụng để tích hợp nó vào ứng dụng của riêng bạn, chỉ cần sử dụng dịch vụ của tôi hoặc bất kỳ dịch vụ có sẵn nào khác.
* __E__phemeral - Hai từ: Service Worker.
  * Khả năng cài đặt là sự phản đối của Emphemerality. Bởi nó rất định nghĩa, khi bạn cài đặt một cái gì đó nó sẽ trở thành một phần chạy dài và tích hợp của thiết bị. Nhân viên dịch vụ có thể tận dụng tối đa cả hai thế giới: nền tảng trung gian cho phép bạn chọn cách thức và thời điểm trang web sẽ được tích hợp sâu hơn vào thiết bị. Kết hợp điều này với tệp kê khai và người dùng hiện có tùy chọn cài đặt "ứng dụng web" hoặc giữ nó như một tương tác cần thiết.


** Vì vậy, những gì chúng ta đang mất tích? ** Tôi sẽ để lại cho bạn để cho tôi biết, tôi nghi ngờ tôi đang mất rất nhiều. Tôi có một loạt các bài đăng tiếp theo, nơi tôi sẽ nói về cách các nền tảng tự nhiên lấy mẫu ra khỏi mô hình ** SLICE ** cho chính họ như một cách để gắn kết các ứng dụng gốc vào cuộc sống hàng ngày của người dùng và cách web có thể phân biệt hơn nữa.

Hình ảnh tín dụng: [Justus Hayes](https://commons.wikimedia.org/wiki/File:The_Big_Slice_-_Rome,_Italy.jpg)