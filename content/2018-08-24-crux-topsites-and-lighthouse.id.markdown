---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


Seperti yang saya sebutkan di [posting sebelumnya] saya (/ skor-mercusuar-untuk-di-domain /), saya mulai merencanakan lebih banyak pekerjaan Hubungan Pengembang di India dan saya ingin mendapatkan pemahaman yang lebih baik tentang bagaimana pengguna di India mengalami web . Dalam posting itu saya memiliki heuristik yang sangat sederhana untuk menentukan situs di India, apakah itu domain '.in'. Saya tahu bahwa ini bukan cara terbaik untuk melihatnya, tetapi rasanya seperti awal yang baik.

Yang benar-benar saya inginkan adalah cara untuk memahami situs-situs yang dikunjungi pengguna di India dan kemudian mendapatkan peringkat mereka berdasarkan popularitas situs tersebut.

Untungnya [laporan Chrome UX](https://developers.google.com/web/tools/chrome-user-experience-report/) memiliki beberapa data tersebut. Laporan UX Chrome memiliki serangkaian tabel di BigQuery yang berisi daftar banyak asal teratas yang dikunjungi pengguna di India (tabelnya adalah `chrome-ux-report.country_in.20180` & mdash; catat '_in' yang menandakan negara). Laporan UX Chrome memiliki lebih banyak data untuk setiap asal seperti kecepatan gabungan situs untuk pengguna sebenarnya, tetapi saya benar-benar hanya membutuhkan URL.

Menggunakan data dari laporan Chrome UX, dan menggabungkannya dengan tabel peringkat Alexa di Arsip HTTP bersama dengan skor mercusuar HTTPArchive yang disebutkan sebelumnya, kita bisa mendapatkan gambaran yang lebih baik tentang apa yang sebenarnya dilihat pengguna di India.




```sql
SELECT
  url, rank,
  JSON_EXTRACT(report, '$.categories.seo.score') AS seo_score,
  JSON_EXTRACT(report, '$.categories.pwa.score') AS pwa_score,
  JSON_EXTRACT(report, '$.categories.performance.score') AS speed_score,
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS accessibility_score
FROM
  `httparchive.lighthouse.2018_08_01_mobile`
JOIN (
  SELECT
    DISTINCT origin,
    Alexa_rank AS rank
  FROM
    `httparchive.urls.20170315`
  JOIN
    `chrome-ux-report.country_in.201807`
  ON
    NET.REG_DOMAIN(origin) = Alexa_domain) AS crux
  ON
    url = CONCAT(origin, '/')
ORDER BY
  rank ASC, url ASC
```


Menjalankan kueri di atas menghasilkan banyak data, terlalu banyak untuk Google Spreadsheet, jadi saya hanya menganalisis sekitar 16.000 situs teratas (hingga sekitar 7k di Peringkat Alexa). Di bawah ini adalah data yang dikumpulkan tanpa komentar.

#### 7k Teratas

<table><thead><th> Rentang Skor </th><th> Skor SEO </th><th> Skor PWA </th><th> Skor Kecepatan </th><th> Skor A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0,5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0,7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0,8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0,9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Rentang Skor </th><th> Skor SEO </th><th> Skor PWA </th><th> Skor Kecepatan </th><th> Skor A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0,7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0,8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0,9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Rentang Skor </th><th> Skor SEO </th><th> Skor PWA </th><th> Skor Kecepatan </th><th> Skor A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0,7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0,8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0,9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Saya pikir alat pengembang dan bisnis sekarang ada di tangan mereka dapat membuat perbedaan besar pada kemampuan kami untuk membuat keputusan yang beralasan dan berprinsip tentang bagaimana pengguna benar-benar merasakan pengalaman web secara global. Bagi saya, data ini memberi saya garis dasar yang dapat saya lihat untuk melihat apakah strategi kami untuk pekerjaan devuler kami mempengaruhi ekosistem dalam jangka panjang.