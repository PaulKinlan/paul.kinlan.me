---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello di tim Safari baru-baru ini membagikan catatan tentang bagaimana Twitter menggunakan spesifikasi ./well-known/change-password.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

Fitur ini benar-benar melewati saya tetapi ini adalah ide yang rapi: diberikan file di lokasi yang terkenal, dapatkah browser menawarkan UI kepada pengguna yang memungkinkan mereka untuk dengan cepat mengatur ulang kata sandi mereka tanpa harus menavigasi situs UI yang kompleks ..

Spesifikasinya tampak sederhana: file terkenal hanya berisi URL untuk mengarahkan pengguna ketika mereka ingin melakukan tindakan. Ini membuat saya berpikir, dapatkah kami menawarkan lebih banyak fitur ini:

* Lokasi terkenal untuk model persetujuan berbasis GDPR (izin cookie) - pemilik situs dapat menawarkan tautan ke halaman tempat pengguna dapat mengelola dan berpotensi mencabut semua cookie dan item persetujuan data lainnya.
* Lokasi yang terkenal untuk manajemen izin browser - pemilik situs dapat menawarkan tempat cepat bagi pengguna untuk dapat mencabut izin untuk hal-hal seperti lokasi geografis, pemberitahuan dan primitif lainnya.
* Jalur yang terkenal untuk penghapusan dan perubahan akun
* Jalur yang terkenal untuk manajemen berlangganan milis

Daftar ini terus berjalan .... Saya sangat menyukai ide untuk file pengalihan sederhana untuk membantu pengguna menemukan tindakan umum pengguna, dan untuk cara browser memunculkannya.

* Pembaruan: * Saya menambahkan [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .