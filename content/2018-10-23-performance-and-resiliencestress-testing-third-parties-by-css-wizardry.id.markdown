---
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
date: 2018-10-23T09:53:10.359Z
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
tags: [links, performance, qrcode]
---
Saya berada di China beberapa minggu yang lalu untuk Hari Pengembang Google dan saya menunjukkan kepada semua orang [QRCode scanner] saya (0), itu berfungsi dengan baik sampai saya offline. Ketika pengguna offline (atau sebagian terhubung) kamera tidak akan mulai, yang berarti Anda tidak bisa mengambil kode QR. Saya butuh waktu lama untuk mengetahui apa yang terjadi, dan ternyata saya keliru memulai kamera di acara `onload` dan permintaan Google Analytics akan hang dan tidak selesai tepat waktu. Itu [ini berkomitmen yang memperbaikinya](https://qrsnapper.com).

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.


[Baca pos lengkap](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/).

Saya mendorong Anda untuk membaca pos karena ada banyak wawasan luar biasa.
