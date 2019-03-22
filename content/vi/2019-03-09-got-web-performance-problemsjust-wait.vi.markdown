---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
Tôi đã thấy một tweet của một người bạn tốt và đồng nghiệp, [Mariko](https://twitter.com/kosamari) , về việc thử nghiệm trên một loạt các thiết bị cấp thấp giữ cho bạn thực sự có căn cứ.

Bối cảnh của tweet là chúng tôi đang xem xét Phát triển Web như thế nào khi xây dựng cho người dùng sống hàng ngày trên các lớp thiết bị này.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

Nhóm hiện đang làm rất nhiều việc trong không gian này, nhưng tôi đã dành một ngày để xây dựng một trang web và thật khó để làm bất cứ điều gì hoạt động ở mức độ hợp lý thậm chí hơi hợp lý - đây là một số vấn đề mà tôi gặp phải:

* Chế độ xem kỳ lạ và giới thiệu lại bí ẩn về độ trễ nhấp chuột 300ms (có thể hoạt động xung quanh).
* Việc sơn lại toàn bộ màn hình rất lớn và chậm.
* Mạng chậm
* Bộ nhớ bị hạn chế và các GC tiếp theo khóa luồng chính trong nhiều giây
* Thực thi JS cực kỳ chậm
* Thao tác DOM chậm

Đối với nhiều trang tôi đang xây dựng, ngay cả trên các trang kết nối wifi nhanh cũng mất nhiều giây để tải và các tương tác tiếp theo chỉ đơn giản là chậm. Thật khó khăn, nó liên quan đến việc cố gắng lấy càng nhiều càng tốt khỏi luồng chính, nhưng nó cũng rất hài lòng ở cấp độ kỹ thuật để thấy những thay đổi trong thuật toán và logic mà tôi đã không làm cho tất cả sự phát triển web truyền thống của mình cải thiện lớn về hiệu suất.

Tôi không chắc chắn sẽ làm gì lâu dài, tôi nghi ngờ một lượng lớn các nhà phát triển mà chúng tôi làm việc ở các thị trường phát triển hơn sẽ có phản ứng &#39;Tôi không xây dựng trang web cho người dùng ở [insert country x]&#39; và tại ở cấp độ cao, thật khó để tranh luận với tuyên bố này, nhưng tôi không thể bỏ qua thực tế rằng 10 triệu người dùng mới sẽ đến máy tính mỗi năm và họ sẽ sử dụng các thiết bị này và chúng tôi muốn web trở thành * nền tảng * lựa chọn cho nội dung và ứng dụng vì chúng tôi hài lòng với [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Chúng ta sẽ cần tiếp tục thúc đẩy hiệu suất trong một thời gian dài sắp tới. Chúng tôi sẽ tiếp tục tạo các công cụ và hướng dẫn để giúp các nhà phát triển tải nhanh và có giao diện người dùng mượt mà :)
