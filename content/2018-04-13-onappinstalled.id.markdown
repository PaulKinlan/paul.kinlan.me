---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Baru-baru ini Chrome (paling tidak pada [2017](https://crbug.com/621393)) menerapkan `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled). Ini dipicu ketika pengguna menginstal aplikasi web progresif baik melalui API Add to Homescreen (fungsi prompt () pada acara yang disampaikan melalui event `onbeforeinstallprompt`) _or_ sekarang lebih penting lagi melalui metode manual Add to Homescreen.

Ini adalah tambahan yang sangat berguna karena memungkinkan Anda melihat keterlibatan pada prompt vs orang-orang yang menggunakan spanduk sistem atau tombol menu untuk memasang aplikasi web progresif.

Saya telah menambahkannya ke [Airhorner](https://airhorner.com) sehingga Anda dapat melihatnya beraksi jika DevTools dilampirkan. Kode di bawah ini yang mengatur `onbeforeinstallprompt` dan` onappinstalled` - dalam hal ini saya menggunakan onbeforeinstallprompt untuk menunda prompt instalasi ke tombol kustom, dan `onappinstalled` untuk membersihkan UI dan melakukan beberapa analisis dasar.


```javascript
const Installer = function(root) {
  let promptEvent;

  const install = function(e) {
    if(promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice
        .then(function(choiceResult) {
          // The user actioned the prompt (good or bad).
          // good is handled in 
          promptEvent = null;
          ga('send', 'event', 'install', choiceResult);
          root.classList.remove('available');
        })
        .catch(function(installError) {
          // Boo. update the UI.
          promptEvent = null;
          ga('send', 'event', 'install', 'errored');
          root.classList.remove('available');
        });
    }
  };

  const installed = function(e) {
    promptEvent = null;
    // This fires after onbeforinstallprompt OR after manual add to homescreen.
    ga('send', 'event', 'install', 'installed');
    root.classList.remove('available');
  };

  const beforeinstallprompt = function(e) {
    promptEvent = e;
    promptEvent.preventDefault();
    ga('send', 'event', 'install', 'available');
    root.classList.add('available');
    return false;
  };

  window.addEventListener('beforeinstallprompt', beforeinstallprompt);
  window.addEventListener('appinstalled', installed);

  root.addEventListener('click', install.bind(this));
  root.addEventListener('touchend', install.bind(this));
};
```

