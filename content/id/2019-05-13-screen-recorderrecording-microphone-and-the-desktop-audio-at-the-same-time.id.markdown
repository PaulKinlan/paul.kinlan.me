---
slug: screen-recorderrecording-microphone-and-the-desktop-audio-at-the-same-time
date: 2019-05-13T19:47:24.846Z
title: 'Screen Recorder: recording microphone and the desktop audio at the same time'
link: 'https://screen-record-voice.glitch.me/'
tags: [links, getusermedia, screen record,video editor, webrtc, getdisplaymedia]
---
Saya memiliki tujuan membangun perangkat lunak perekaman layar paling sederhana di dunia dan saya perlahan-lahan mencari-cari proyek selama beberapa bulan terakhir (maksud saya benar-benar lambat).

Dalam posting sebelumnya, saya telah mendapatkan [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) dengan [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) - [screen recording and a voice overlay](/building-a-video-editor-on-the-web-screencasting/) dengan aliran dari semua sumber input. Satu hal yang membuat frustrasi adalah saya tidak dapat menemukan cara mendapatkan audio dari desktop * dan * overlay audio dari speaker. Saya akhirnya berhasil melakukannya.

Pertama, `getDisplayMedia` di Chrome sekarang memungkinkan penangkapan audio, sepertinya ada kekeliruan yang aneh dalam Spec karena itu tidak memungkinkan Anda untuk menentukan `audio: true` dalam pemanggilan fungsi, sekarang Anda bisa.

```javascript
const audio = audioToggle.checked || false;
desktopStream = await navigator.mediaDevices.getDisplayMedia({ video:true, audio: audio });
```

Kedua, saya awalnya berpikir bahwa dengan membuat dua lagu dalam aliran audio saya akan bisa mendapatkan apa yang saya inginkan, namun saya belajar bahwa API `MediaRecorder` Chrome hanya dapat menghasilkan satu lagu, dan ke-2, itu tidak akan berhasil karena track seperti DVD trek audio mutliple di mana hanya satu yang dapat diputar pada satu waktu.

Solusinya mungkin sederhana bagi banyak orang, tetapi itu baru bagi saya: Gunakan Audio Web.

Ternyata WebAudio API memiliki `createMediaStreamSource` dan `createMediaStreamDestination` , keduanya merupakan API yang diperlukan untuk menyelesaikan masalah. `createMediaStreamSource` dapat mengambil stream dari audio dan mikrofon desktop saya, dan dengan menghubungkan keduanya bersama-sama ke objek yang dibuat oleh `createMediaStreamDestination` itu memberi saya kemampuan untuk menyalurkan aliran yang satu ini ke dalam `MediaRecorder` API.

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

Sederhana.

Kode lengkap dapat ditemukan di [my glitch](https://glitch.com/edit/#!/screen-record-voice) , dan demo dapat ditemukan di sini: https://screen-record-voice.glitch.me/

{{&lt;fast-youtube oGIdqcMFKlA&gt;}}

