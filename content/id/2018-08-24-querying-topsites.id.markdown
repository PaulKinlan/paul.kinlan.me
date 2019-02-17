---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse]
---


Saya akan melakukan perjalanan singkat ke India, dan saya telah memikirkan pekerjaan hubungan pengembang jangka panjang untuk Chrome dan Web di wilayah tersebut. Seperti kebanyakan perjalanan, saya ingin melakukan sedikit riset sebelumnya sehingga saya bisa mendapatkan pemahaman yang lebih baik tentang tampilan web dari perspektif negara yang saya kunjungi.

Saya telah mengikuti banyak pembaruan untuk [HTTPArchive](https://httparchive.org/) selama beberapa bulan terakhir dan sangat menakjubkan melihat peningkatan pada jenis data yang dikumpulkan dan disimpan di [ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) tabel. Salah satu informasi spesifik yang sangat menarik bagi saya adalah data [Lighthouse](https://developers.google.com/web/tools/lighthouse/) yang dihasilkan pada setiap menjalankan HTTPArchive. Dengan data ini saya tertarik untuk melihat apakah saya bisa menggunakannya untuk mendapatkan snapshot data dan mendapatkan pemahaman tingkat tinggi tentang bagaimana orang-orang mungkin mengalami web di negara tersebut.

Kabar baiknya adalah bahwa tidak terlalu sulit untuk menganalisis data Lighthouse di HTTPArchive.

Untuk kebutuhan saya, bagian yang lebih sulit adalah untuk mendapatkan kunci pada apa yang disebut 'situs teratas' di negara mana pun, terutama ketika saya berpikir tentang pekerjaan hubungan pengembang yang dapat dan harus kami lakukan.

Di sini adalah bagaimana saya memecahkan masalah. Di setiap negara ada banyak jenis pengembang yang membangun untuk web dan secara pribadi saya cenderung memasukkan mereka ke dalam 3 grup: Mereka yang target proyeknya saat ini adalah pasar lokal; Mereka yang menargetkan pasar luar negeri (saya membangun untuk ekspor); dan yang menargetkan khalayak global.

Ketika saya memikirkan ketiga kelompok di atas, hampir tidak mungkin untuk memahami maksud dari situs dan orang-orang di belakangnya. Tetapi ada beberapa heuristik yang dapat Anda gunakan untuk setidaknya membantu Anda berpikir dan memahami data.

Untuk analisis saya, saya tidak berpikir saya bisa mendapatkan daftar situs teratas yang dikunjungi oleh pengguna di India, jadi saya membuat asumsi sederhana bahwa domain '.in' * kemungkinan * akan dibuat untuk orang di India. Sensitivitas dan spesifisitas untuk pertanyaan 'situs india' tidak 100% dengan berfokus pada 'domain.' & Mdash; pengguna di seluruh dunia suka menggunakan pengalaman yang tidak hanya terkunci di negara-negara TLD & mdash; tapi sepertinya ukuran yang layak dari negara bagian India sebagai celah pertama.

Jenis analisis ini ternyata sangat mudah. Anda membuka [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) dan menemukan tabel terbaru yang berisi data Lighthouse yang menjalankan [httparchive: mercusuar .2018_08_01_mobile] dalam hal ini dan jalankan kueri berikut.


```sql
SELECT
  url,
  JSON_EXTRACT(report, '$.categories.seo.score') AS [seo_score],
  JSON_EXTRACT(report, '$.categories.pwa.score') AS [pwa_score],
  JSON_EXTRACT(report, '$.categories.performance.score') AS [speed_score],
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS [accessibility_score]
FROM
  [httparchive:lighthouse.2018_08_01_mobile]
WHERE
  url LIKE '%.in/'
```


Kueri di atas difilter di domain yang diakhiri dengan '.in', dan mengembalikan skor Lighthouse untuk setiap kategori pengujian Lighthouse. Data Lighthouse disimpan sebagai objek JSON, yang Anda harus mengekstrak komponen yang diperlukan melalui XPath seperti sintaks untuk JSON.

Jumlah hasil sebenarnya cukup besar dan tidak banyak berguna untuk ditampilkan di sini, tetapi saya melakukan pivot ini menjadi histogram.

<table><thead><th> Rentang Skor </th><th> Skor SEO </th><th> Skor PWA </th><th> Skor Kecepatan </th><th> Skor A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0,5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0,7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0,8 </td><td> 1438 </td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0,9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

Penelusuran lebih lanjut dan analisis data perlu dilakukan, untuk memahami secara tepat isu-isu spesifik mana yang memengaruhi skor, namun dalam beberapa kasus seperti dengan 'Nilai PWA' yang telah saya lihat cukup banyak dari skor situs di masa lalu untuk mengetahui masalah apa yang mempengaruhi skor keseluruhan dan saya dapat melihat beberapa tantangan di depan kita sekarang.

Selanjutnya. Cobalah dan temukan cara untuk mendapatkan situs yang sering digunakan oleh pengguna di India .... Petunjuk, ini [di sini](/ pokok-pokok bahasan-dan-mercusuar-skor-untuk-india /)