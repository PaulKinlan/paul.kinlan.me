---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage menulis tentang perubahan penting pada Tambahkan ke Homescreen di Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Baca pos lengkap](https://developers.google.com/web/updates/2018/07/nic68).

Saya memiliki perasaan campur aduk tentang ini awalnya karena begitu banyak orang tidak menangani event `beforeinstallprompt` itu berarti bahwa tiba-tiba jumlah pemasangan Web APK akan turun cukup signifikan, tapi saya pikir itu sebenarnya adalah hal yang benar untuk dilakukan.

Tujuannya adalah untuk mengurangi jumlah permintaan yang mengganggu yang terjadi di web, dan hal terakhir yang kita butuhkan dalam industri ini adalah untuk prompt yang relatif besar untuk muncul ketika kita berpikir pengguna mungkin ingin menginstal PWA, bukan Anda sekarang perlu pikirkan di mana dan kapan ** Anda ** ingin meminta pemasangan dan Anda harus melakukannya sebagai tanggapan atas sikap pengguna.

Hal yang rapi adalah bahwa kami (Chrome) memperkenalkan cara yang lebih ambient untuk memberi tahu pengguna bahwa pengalaman dapat dipasang, saat ini adalah bilah bawah kecil yang muncul pada pemuatan pertama, dan semoga di masa mendatang kami dapat menjelajahi cara yang lebih halus untuk memberi tahu pengguna bahwa mereka dapat mengambil tindakan.
