---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake và nhóm đã xây dựng yếu tố tùy chỉnh khá tuyệt vời này để quản lý thu phóng pinch trên bất kỳ bộ HTML nào bên ngoài động lực học pinch-zoom của trình duyệt (nghĩ rằng phóng to khung nhìn di động). Yếu tố này là một trong những thành phần trung tâm mà chúng tôi cần cho ứng dụng [squoosh](https://squoosh.app/) mà chúng tôi đã xây dựng và phát hành tại Chrome Dev Summit (... Tôi nói rằng &#39;được phát hành tại Chrome Dev Summit&#39; - Jake đã hiển thị cho mọi người tại Ngày nhà phát triển Google Trung Quốc mặc dù phần còn lại của đội bị cấm vận;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Tôi vừa thêm nó vào blog của mình (chỉ mất vài phút), bạn có thể kiểm tra nó trên phần &#39; [life](https://paul.kinlan.me/life/img_20170711_063830/) &#39; của tôi nơi tôi chia sẻ ảnh mà tôi đã chụp. Nếu bạn đang sử dụng thiết bị hỗ trợ cảm ứng, bạn có thể nhanh chóng thu nhỏ phần tử, nếu bạn đang sử dụng bàn phím có thể xử lý nhiều đầu vào ngón tay cũng hoạt động.

Yếu tố này là một ví dụ tuyệt vời về lý do tại sao tôi yêu các thành phần web như một mô hình để tạo các thành phần giao diện người dùng. Phần tử `pinch-zoom` chỉ dưới 3kb trên dây (không nén) và phụ thuộc tối thiểu để xây dựng và nó chỉ thực hiện một công việc đặc biệt tốt, mà không cần sử dụng logic cấp độ ứng dụng tùy chỉnh nào khiến nó khó sử dụng (Tôi có một số suy nghĩ về logic UI vs các thành phần logic ứng dụng mà tôi sẽ chia sẻ dựa trên việc học của tôi từ ứng dụng Squoosh).

Tôi rất thích thấy các yếu tố như thế này nhận được nhiều nhận thức và sử dụng hơn, ví dụ tôi có thể tưởng tượng rằng yếu tố này có thể thay thế hoặc tiêu chuẩn hóa chức năng thu phóng hình ảnh mà bạn thấy trên nhiều trang web thương mại và mãi mãi lấy đi nỗi đau đó từ các nhà phát triển.
