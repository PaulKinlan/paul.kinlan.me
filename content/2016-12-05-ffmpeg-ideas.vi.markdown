---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


Gần đây tôi đã xây dựng một ứng dụng Web Progressive để lấy [screencast từ thiết bị Android của bạn và sau đó kết thúc video trong một khung thiết bị](https://paulkinlan.github.io/deviceframe.es/) bằng cách sử dụng [FFMPEG.js](https : //github.com/Kagami/ffmpeg.js) như sau:

{{<youtube E_U6zvjW8so>}} Tôi cũng đã quản lý để sắp xếp [xây dựng ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/) để dễ dàng hơn, tạo các bản dựng ffmpeg được tối ưu hóa tùy chỉnh và chạy nó trong trình duyệt.

Hai điều cùng nhau tôi nghĩ hiện nay có rất nhiều cơ hội để xây dựng một số ứng dụng Web tiến bộ nhỏ mới tuyệt vời thúc đẩy những gì chúng tôi nghĩ rằng web có khả năng liên quan đến thao tác âm thanh và video.

Có rất nhiều tiện ích video dựa trên web trên web, nhưng trong mắt tôi, nhiều tiện ích được xây dựng giống như trang web cũ và không tận dụng lợi thế của những tiến bộ trong xử lý phía khách hàng, họ rất giàu quảng cáo và không thể làm việc ngoại tuyến .

Tôi cũng rất quan tâm đến triết lý Unix của ["Làm một điều và làm tốt"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well) vì vậy thay vì xây dựng một ứng dụng chỉnh sửa video đơn khối ồ ạt, tôi nghĩ rằng có rất nhiều ứng dụng web khác nhau có thể được xây dựng dễ dàng và nhanh chóng:

* Cắt một đoạn video (mất 5 giây ra phía trước, 3 tắt phía sau vv) * Bất kỳ định dạng video -> GIF * Rất nhiều hình ảnh -> Bất kỳ định dạng video * Bất kỳ định dạng video -> Bất kỳ định dạng video * Thêm một watermark * Thay đổi kích thước video * Thu nhỏ video * Thêm hình mờ vào video * Lớp phủ video lên nhau * Ghép video cùng nhau * Sân chơi FFMPEG (thả nguồn và tập lệnh) * [Nếu bạn có ý tưởng thêm chúng vào danh sách này](https: // github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

Tôi nghĩ rằng tôi có hầu hết các mã tại chỗ như là một khai thác giao diện người dùng cho điều này với tôi [Thiết bị khung repo trên Github](https://github.com/PaulKinlan/deviceframe.es) và trong nhiều trường hợp nó là một vấn đề của điều chỉnh biểu đồ xử lý ffmpeg và cập nhật giao diện người dùng để cho phép một số cấu hình.

Tôi sẽ tạo ra một vài trong số những tuần tới, nếu có ai muốn tham gia, sau đó liên lạc!