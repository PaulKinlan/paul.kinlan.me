---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
Tôi yêu [FFMPEG.js](https://github.com/Kagami/ffmpeg.js), nó là một công cụ gọn gàng được biên dịch với asm.js` và nó cho phép tôi xây dựng các ứng dụng web JS có thể chỉnh sửa video nhanh chóng. FFMPEG.js cũng hoạt động với các nhân viên web để bạn có thể mã hóa video mà không chặn luồng chính.

Tôi cũng yêu [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink cho phép tôi dễ dàng tương tác với các nhân viên web bằng cách trưng ra các hàm và các lớp mà không cần phải xử lý một máy trạng thái `postMessage` phức tạp.

Gần đây tôi đã kết hợp cả hai. Tôi đã [thử nghiệm lấy FFMPEG xuất ra Web Assembly](https://github.com/PaulKinlan/ffmpeg.js/tree/wasm) (nó hoạt động - yay) và tôi muốn dọn sạch tất cả công việc postMessage trong dự án FFMPEG.js hiện tại. Dưới đây là những gì mã bây giờ trông giống như - Tôi nghĩ rằng nó khá gọn gàng. Chúng tôi có một công nhân nhập khẩu ffmpeg.js và comlink và nó đơn giản cho thấy giao diện ffmpeg, và sau đó chúng tôi có trang web tải nhân viên và sau đó sử dụng comlink để tạo proxy cho API ffmpeg.

Khéo léo.

#### worker.js
```javascript
importScripts('https://cdn.jsdelivr.net/npm/comlinkjs@3.0.2/umd/comlink.js');
importScripts('../ffmpeg-webm.js'); 
Comlink.expose(ffmpegjs, self);
```
#### client.html
```javascript
let ffmpegjs = await Comlink.proxy(worker);
let result = await ffmpegjs({
   arguments: ['-y','-i', file.name, 'output.webm'],
   MEMFS: [{name: file.name, data: data}],
   stdin: Comlink.proxyValue(() => {}),
   onfilesready: Comlink.proxyValue((e) => {
     let data = e.MEMFS[0].data;
     output.src = URL.createObjectURL(new Blob([data]))
     console.log('ready', e)
   }),
   print: Comlink.proxyValue(function(data) { console.log(data); stdout += data + "\n"; }),
   printErr: Comlink.proxyValue(function(data) { console.log('error', data); stderr += data + "\n"; }),
   postRun: Comlink.proxyValue(function(result) { console.log('DONE', result); }),
   onExit: Comlink.proxyValue(function(code) {
     console.log("Process exited with code " + code);
     console.log(stdout);
   }),
});
```
Tôi thực sự thích cách Comlink, Worker và WASM biên dịch các mô-đun có thể chơi cùng nhau. Tôi nhận được JavaScript thành ngữ tương tác trực tiếp với mô-đun WASM và nó chạy ra khỏi luồng chính.

[Đọc toàn bộ bài đăng](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
