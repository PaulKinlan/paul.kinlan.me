---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Tôi thực sự thích [EditorJS](https://editorjs.io/) . Nó cho phép tôi tạo một giao diện lưu trữ web rất đơn giản cho blog Hugo tĩnh của mình.

EditorJS có hầu hết những gì tôi cần trong một trình soạn thảo dựa trên khối đơn giản. Nó có một plugin cho các tiêu đề, mã và thậm chí là một cách đơn giản để thêm hình ảnh vào trình chỉnh sửa mà không yêu cầu cơ sở hạ tầng lưu trữ. Cho đến bây giờ, không có cách đơn giản nào để thêm video vào trình chỉnh sửa.

Tôi đã [simple-image](https://github.com/editor-js/simple-image) kho plugin và thay đổi nó lên (chỉ một chút) để tạo ra một [simple-video](https://github.com/PaulKinlan/simple-video) plugin ( [npm module](https://www.npmjs.com/package/simple-video-editorjs) ). Bây giờ tôi có thể bao gồm các video dễ dàng trong blog này.

Nếu bạn quen thuộc với EditorJS, việc đưa vào các dự án của bạn khá đơn giản. Chỉ cần cài đặt nó như sau

```
npm i simple-video-editorjs
```

Và sau đó chỉ cần đưa nó vào dự án của bạn khi bạn thấy phù hợp.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

Trình chỉnh sửa có một số tùy chọn đơn giản cho phép bạn định cấu hình cách lưu trữ video trong trang:

1. Tự động phát - video sẽ tự động phát khi tải trang
1. tắt tiếng - theo mặc định, video sẽ không có âm thanh (cần thiết cho tự động phát)
1. điều khiển - video sẽ có các điều khiển HTML mặc định.

Dưới đây là một ví dụ nhanh về video được nhúng (và hiển thị một số tùy chọn).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

Dù sao, tôi đã rất vui khi tạo plugin nhỏ này - không quá khó để tạo và điều duy nhất tôi đã làm là trì hoãn việc chuyển đổi sang base64 mà hình ảnh đơn giản sử dụng và thay vào đó chỉ sử dụng URL Blob.