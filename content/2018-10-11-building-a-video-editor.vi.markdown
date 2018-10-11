---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
---


Bạn sẽ có thể tạo và chỉnh sửa video chỉ bằng cách sử dụng web trong trình duyệt. Bạn có thể cung cấp giao diện người dùng giống như Luồng màn hình cho phép bạn tạo video đầu ra kết hợp nhiều video, hình ảnh và âm thanh thành một video có thể tải lên các dịch vụ như YouTube.

Bài đăng này thực sự chỉ là một tuyên bố về ý định. Tôi sẽ bắt đầu quá trình làm việc lâu dài và không có sẵn trên nền tảng và xem chúng ta có thể đạt được bao xa.

Trong một số suy nghĩ về dự án này, tôi đã có một khoảnh khắc Carl Sagan - vì vậy thay vì phát minh ra vũ trụ để tạo ra một chiếc bánh táo, tôi cần ít nhất tạo ra tất cả các công cụ cần thiết để xây dựng trình biên tập video, đặc biệt là nếu tôi muốn ghi lại quá trình thực hiện nó. Thực tế là bài viết này tồn tại là bởi vì tôi biết tôi có một số các mảnh tại chỗ và sẵn sàng để đi.

Tôi không nghĩ rằng tôi sẽ tạo ra một "biên tập video" khối lượng lớn, có thể là một doanh nghiệp cho người khác, nhưng tôi có kế hoạch cố gắng tìm ra tất cả các phần cần thiết để tôi có thể dễ dàng tạo các video tuyệt vời trên web và hy vọng hiển thị nhiều người có thể trên web.

Dưới đây là kế hoạch dự án một trang thô của tôi:


** Các trường hợp sử dụng mà tôi có: **


* Tôi thường phải ghi lại tất cả các bản trình diễn thiết bị cho Google I / O và Chrome DevSummit và thêm vào các lớp phủ vv Mọi người trong nhóm đều có thể thực hiện việc này.
* Nhóm thường ghi lại các chương trình phát sóng và tôi muốn cho phép họ làm điều đó nhanh chóng từ một trang web đơn giản và có thể làm sạch đầu ra cuối cùng.
* Tôi cần phải xây dựng một số sản phẩm để giữ sắc nét. ;)


**Đầu vào:**


* [p0] Ghi âm từ micrô
* [p0] Quay video từ máy ảnh web [xong - xem bên dưới]
* [p0] Nhúng video bên ngoài được lưu trữ trên web
* [p0] Ghi lại màn hình
* [p1] Ghi lại luồng từ xa
* [p1] Ghi lại & lt; canvas & gt; thành phần
* [p0] Tải tệp từ thiết bị cục bộ
* [p1] Chia sẻ tệp từ thiết bị cục bộ (ý định chia sẻ trên Android)


**Thao tác:**


* [p1] Thêm hình mờ
* [p1] Thêm hiệu ứng bộ lọc vào hình ảnh
* [p0] Thêm hình ảnh tùy chỉnh làm lớp
* [p0] Hàng đợi video và lớp phủ
* [p0] Lớp phủ các bài hát riêng biệt về âm thanh và video
* [p1] Văn bản lớp phủ tại các thời điểm cụ thể
* [p0] Cắt video thành kích thước
* [p0] Bật tính năng định vị và thay đổi kích thước của video
* [p0] Cắt video / âm thanh
* [p0] Video / âm thanh ghép nối


** Đầu ra: **


* [p0] Tệp video ở định dạng webm
* Thông tin về [p1] MTB
* [p1] Tệp video ở định dạng xyz

[Mã cho video này](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) [Bản trình diễn](https://camera-recorder.glitch.me/)


```javascript  
const init = () => {  
  let blobs;  
  let rec;  
  let stream;  
    
  captureBtn.onclick = async () => {  
    stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, 
height: 720 }, audio: true});

    videoElement.srcObject = stream;  
    let opts = {mimeType: 'video/webm; codecs=vp9,opus'};  
    blobs = [];  
    download.style.display = 'none'

    rec = new MediaRecorder(stream, opts);  
    rec.ondataavailable = (e) => blobs.push(e.data);  
    rec.onstop = async () => {  
      let blob = new Blob(blobs, {type: 'video/webm'});  
      let url = window.URL.createObjectURL(blob);  
      download.href = url;  
      download.download = 'test.webm';  
      download.style.display = 'block';  
    };  
    startBtn.disabled = false;  
    captureBtn.disabled = true;  
  };

  startBtn.onclick = () => {  
    startBtn.disabled = true;  
    stopBtn.disabled = false;  
    rec.start();  
  };

  stopBtn.onclick = () => {  
    captureBtn.disabled = false;  
    startBtn.disabled = true;  
    stopBtn.disabled = true;

    rec.stop();  
    stream.getTracks().forEach(s=>s.stop())  
    videoElement.srcObject = null  
    stream = null;  
  };  
};

window.addEventListener('load', init);  
```

