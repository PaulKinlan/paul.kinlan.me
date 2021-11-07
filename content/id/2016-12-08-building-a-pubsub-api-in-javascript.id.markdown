---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31.000Z
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


Dalam proyek baru-baru ini, membangun layanan [web push](/ mendesain-a-webpush-service /) Saya ingin UI saya menanggapi acara tingkat aplikasi (secara semantis jika Anda mau) karena ada beberapa komponen yang memerlukan informasi dari sistem tetapi tidak tergantung satu sama lain dan saya ingin mereka dapat mengelola diri mereka sendiri terlepas dari 'logika bisnis'.

Saya melihat ke banyak alat yang berbeda untuk membantu saya, tetapi karena saya sering memiliki kasus sindrom NIH yang berat dan fakta bahwa saya pikir orang dapat menerapkan elemen infrastruktur mereka sendiri dengan cukup cepat, saya memutuskan untuk dengan cepat melumpuhkan klien-sederhana layanan PubSub samping & mdash; itu bekerja cukup baik untuk kebutuhan saya.

Saya berdebat apakah saya harus menggunakan DOM `Event` khusus dan menggunakan infrastruktur yang ada yang sudah disediakan oleh DOM untuk pengembang & mdash; kemampuan untuk acara dan acara yang memakan menggunakan `addEventListener` & mdash; tetapi satu-satunya masalah adalah Anda harus menggantung event handler dari Elemen DOM atau jendela karena Anda tidak dapat memiliki model yang mewarisi atau bercampur di `EventTarget`.

_ ** Pikiran: ** memiliki `EventTarget` sebagai objek akan membantu meniadakan kebutuhan untuk membuat sistem PubSub khusus._

Dengan kendala ini dalam pikiran, kemauan untuk mengkodekan sesuatu, dan kecenderungan untuk tidak mengganggu bug yang saya buat sendiri, saya membuat sketsa rencana kasar:


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


Semua ini bukanlah hal baru. Redux dan banyak sistem lain sudah melakukan ini dan dalam banyak kasus mereka juga membantu Anda mengelola negara. Di kepala saya, saya tidak benar-benar memiliki keadaan yang membutuhkan model yang septate ke negara sudah di browser.

Implementasinya cukup sederhana untuk diterapkan dan abstraksinya cukup berguna untuk saya setidaknya.


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
Edit: Menghapus penggunaan janji.

Dan kita ada di sana. Sistem pubsub sederhana yang kemungkinan penuh dengan bug, tetapi saya menyukainya. :) Saya telah meletakkannya di [github](https://github.com/PaulKinlan/EventManager) jika Anda tertarik.