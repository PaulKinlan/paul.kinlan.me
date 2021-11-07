---
slug: web-share-target-api
date: 2018-04-15T13:20:31.000Z
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


Saya selalu khawatir bahwa pada platform web kami menciptakan [silo yang tidak diinginkan](/unintended-silos) dengan membuat lebih sulit untuk memasukkan data dari dan ke situs web dan aplikasi, yang lebih penting saya khawatir bahwa data hanya mengalir satu arah: dari web ke aplikasi, karena aplikasi dapat berada di semua tempat yang diharapkan pengguna untuk berada di perangkat mereka.

Saya sangat senang bahwa Chrome mulai bekerja [di Web Share Target API](/breaking-down-silos-with-share-target-api) yang melengkapi pekerjaan pada [navigator.share](/navigator.share). Di mana `navigator.share` memungkinkan Anda membagikan informasi dari situs web Anda ke aplikasi apa pun di perangkat pengguna yang dapat menerima 'share' (` Intent.ACTION_SEND` dalam bahasa Android), Web Share Target memungkinkan situs web Anda (atau PWA ) katakan 'Saya ingin bermain di game itu juga'.

Saya cukup senang mengatakan bahwa pekerjaan ini sekarang tersedia di Chrome Canary di Android.

Web Share Target API adalah API kecil yang Anda tentukan di Manifest Aplikasi Web Anda. Jika Anda pernah menggunakan `registerProtocolHandler`, Anda akan melihat bahwa itu tidak sejuta mil jauhnya & mdash; Anda menentukan template URL yang memiliki sejumlah variabel yang akan diganti ketika pengguna memanggil tindakan.

Pertama Anda membuat properti 'objek' yang disebut `share_target` yang berisi satu properti bernama` url_template` yang memiliki jalur yang harus dibuka ketika pengguna memilih layanan kami. Di Android, Anda dapat menggunakan tiga nama substitusi yang disebut: * `{title}` - setara dengan `.title` pada navigator.share API, atau` Intent.EXTRA_SUBJECT` dari Intent Android. * `{text}` - ekuivalen dengan `.text` pada navigator.share API, atau` Intent.EXTRA_TEXT` dari Intent Android. * `{url}` - setara dengan `.url` pada navigator.share API, atau data mentah dari Intent Android.

Anda dapat mencoba ini hari ini dengan menginstal [PWA Twitter](https://mobile.twitter.com/). [Manifes Twitter ada di bawah](https://mobile.twitter.com/manifest.json):


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


Saat ini ada beberapa batasan:

* Anda hanya dapat memiliki satu per manifes, itu berarti dalam kasus Twitter mereka tidak dapat memiliki 'Bagikan ke DM'. * Ada beberapa ekstensi yang diusulkan seperti acara pekerja layanan yang disebut `navigator.actions` yang akan dipicu tanpa harus membuka permukaan UI, tetapi mereka belum diimplementasikan. * Anda hanya dapat membagikan 'teks', yang berarti jika Anda ingin berbagi Blob data yang Anda butuhkan untuk menyimpannya dengan URL yang kemudian akan dibagikan. * Ini hanya berfungsi di Android. * Anda harus menginstal PWA, sehingga Anda tidak dapat melakukan drive dengan registrasi target share. Ketika Chrome menghasilkan 'Web APK' sekarang terlihat di `share_target` untuk melihat apakah Chrome harus mendaftarkan` `intent-filter``. * Ini belum terstandarisasi sebagai bagian dari spesifikasi nyata. : / oh - dan itu juga [mungkin berubah](https://github.com/w3ctag/design-reviews/issues/221#issuecomment-376717885).

Keterbatasan samping, ini adalah tambahan yang cukup luar biasa untuk platform web yang merupakan awal dari memecahkan hambatan besar yang dimiliki web berkaitan dengan integrasi pada platform host.

Jika Anda ingin melacak pembaruan untuk API ini, periksa [Chrome Status](https://www.chromestatus.com/feature/5662315307335680).
