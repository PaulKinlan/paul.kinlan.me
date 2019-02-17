---
slug: building-a-video-editor-on-the-web-screencasting
date: 2018-10-12T12:00:00Z
title: 'Building a video editor on the web. Part 0.1 - Screencast'
video_url: /videos/video-editor-part-0-1-screen-cast.webm
tags: ['video editor', 'webrtc', 'getusermedia', 'getdisplaymedia', 'pwa']
---


Bạn sẽ có thể tạo và chỉnh sửa video chỉ bằng cách sử dụng web trong trình duyệt. Bạn có thể cung cấp giao diện người dùng giống như Luồng màn hình cho phép bạn tạo video đầu ra kết hợp nhiều video, hình ảnh và âm thanh thành một video có thể tải lên các dịch vụ như YouTube.

Tiếp theo từ [bài viết trước] của tôi (0) mô tả ngắn gọn các yêu cầu của trình chỉnh sửa video, trong bài viết này tôi chỉ muốn nhanh chóng hiển thị trên màn hình cách tôi đã xây dựng máy ghi web cam và cách xây dựng một màn hình máy ghi âm :)

Đó là tất cả khá gọn gàng và nó sử dụng API `navigator.getDisplayMedia` mới cho phép người dùng cấp quyền truy cập vào nội dung màn hình của họ. Mã dưới đây là mọi thứ tôi đã sử dụng để tạo video này.

Video là rất rất thô, có rất nhiều sai lầm bởi vì tại thời điểm này tôi không thể chỉnh sửa video :) mục tiêu của tôi là ở phần cuối của dự án này tôi có thể tạo một video tốt end-to-end.

[Mã cho video này](https://glitch.com/edit/\#!/screen-recorder-voice?path=script.js:1:0) [Bản trình diễn](https://screen-recorder-voice.glitch.me/)


```javascript  
window.onload = () => {
  if('getDisplayMedia' in navigator) warning.style.display = 'none';

  let blobs;
  let blob;
  let rec;
  let stream;
  let voiceStream;
  let desktopStream;

  captureBtn.onclick = async () => {
    download.style.display = 'none';
    
    desktopStream = await navigator.getDisplayMedia({video:true});
    voiceStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
    
    let tracks = [...desktopStream.getTracks(), ...voiceStream.getAudioTracks()]
    console.log('Tracks to add to stream', tracks);
    stream = new MediaStream(tracks);
    videoElement.srcObject = stream;
      
    blobs = [];
  
    rec = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    rec.ondataavailable = (e) => blobs.push(e.data);
    rec.onstop = async () => {
      blob = new Blob(blobs, {type: 'video/webm'});
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
```

