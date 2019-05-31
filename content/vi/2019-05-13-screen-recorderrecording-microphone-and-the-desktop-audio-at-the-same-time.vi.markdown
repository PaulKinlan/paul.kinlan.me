---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Tôi có một mục tiêu là xây dựng phần mềm ghi màn hình đơn giản nhất thế giới và tôi đã dần dần làm quen với dự án trong vài tháng qua (ý tôi là rất chậm).

Trong các bài viết trước, tôi đã có được [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) bằng cách kết hợp với các luồng từ tất cả các nguồn đầu vào. Một điều khiến tôi nản lòng là tôi không thể tìm ra cách lấy âm thanh từ máy tính để bàn * và * phủ âm thanh từ loa. Cuối cùng tôi đã tìm ra cách để làm điều đó.

Thứ nhất, `getDisplayMedia` trong Chrome hiện cho phép thu âm, có vẻ như có một sự giám sát kỳ lạ trong Spec ở chỗ nó không cho phép bạn chỉ định `audio: true` trong lệnh gọi chức năng, bây giờ bạn có thể.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Thứ hai, ban đầu tôi đã nghĩ rằng bằng cách tạo hai bản nhạc trong luồng âm thanh, tôi sẽ có thể có được những gì tôi muốn, tuy nhiên tôi đã học được rằng API `MediaRecorder` của Chrome chỉ có thể xuất một bản nhạc và thứ 2, dù sao nó cũng không hoạt động vì các bản nhạc giống như các bản nhạc âm thanh đa dạng DVD trong đó mỗi lần chỉ có thể phát một bản nhạc.

Giải pháp có thể đơn giản với nhiều người, nhưng nó mới đối với tôi: Sử dụng Web Audio.

Hóa ra API WebAudio có `createMediaStreamSource` và `createMediaStreamDestination` , cả hai đều là API cần thiết để giải quyết vấn đề. `createMediaStreamSource` có thể nhận các luồng từ âm thanh và micrô trên máy tính để bàn của tôi và bằng cách kết nối hai luồng với nhau vào đối tượng được tạo bởi `createMediaStreamDestination` nó cho tôi khả năng chuyển một luồng này vào API `MediaRecorder` .

```javascript
const mergeAudioStreams = (desktopStream, voiceStream) => {
  const context = new AudioContext();
    
  // Create a couple of sources
  const source1 = context.createMediaStreamSource(desktopStream);
  const source2 = context.createMediaStreamSource(voiceStream);
  const destination = context.createMediaStreamDestination();
  
  const desktopGain = context.createGain();
  const voiceGain = context.createGain();
    
  desktopGain.gain.value = 0.7;
  voiceGain.gain.value = 0.7;
   
  source1.connect(desktopGain).connect(destination);
  // Connect source2
  source2.connect(voiceGain).connect(destination);
    
  return destination.stream.getAudioTracks();
};
```

Đơn giản.

Mã đầy đủ có thể được tìm thấy trên [my glitch](https://glitch.com/edit/#!/screen-record-voice) và có thể tìm thấy bản demo tại đây: https://screen-record-voice.glitch.me/

{{&lt;nhanh-youtube oGIdqcMFKlA&gt;}}

