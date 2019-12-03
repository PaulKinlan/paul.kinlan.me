---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Blog saya adalah situs yang sepenuhnya statis, dibangun dengan Hugo dan di-host dengan Zeit. Ini adalah solusi yang bagus untuk saya, sebuah blog sederhana memiliki proses penyebaran yang cukup sederhana dan memuat sangat cepat.

Situs yang dihasilkan secara statis memang memiliki beberapa kelemahan, yang terbesar adalah ketika Anda membutuhkan sesuatu yang dinamis untuk diintegrasikan ke dalam halaman Anda (misalnya komentar). Tidak dapat meng-host konten dinamis dengan mudah berarti Anda akhirnya mengandalkan JavaScript pihak ketiga yang kemudian akan mendapatkan akses penuh ke halaman Anda dan Anda tidak akan tahu apa yang dilakukannya - itu bisa melacak pengguna Anda atau memperlambat halaman Anda beban.

Saya baru-baru ini mengambil widget komentar saya saat ini (Disqus) dari jalur render kritis dengan hanya memuatnya ketika pengguna menggulir ke komentar (menggunakan `IntersectionObserver` ) dan sementara ini adalah solusi yang masuk akal untuk kinerja beban dan masalah pelacakan, saya sebenarnya ingin menghapus Disqus semuanya.

Masukkan <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> Spesifikasi <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> . Webmention adalah spesifikasi yang menjelaskan bagaimana penulis situs dapat dihubungi ketika situs lain &#39;menyebutkan&#39; (atau suka) konten di situs Anda. Ini pada akhirnya memungkinkan metode desentralisasi untuk menemukan konten yang menautkan ke situs Anda, semoga memberikan nilai dan wawasan.

Webmention spec tidak menjelaskan format data apa pun yang harus digunakan untuk mengkomunikasikan apa yang dikatakan &#39;situs menyebutkan&#39;, yang diserahkan kepada Anda untuk diurai menggunakan mikroformats standar atau mekanisme lain untuk memahami konten halaman. Ini bagus, namun saya percaya ini mengarah ke layanan terpusat seperti <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> menyediakan infrastruktur yang sangat dibutuhkan untuk mendapatkan makna dari halaman.

Saya menyukai gagasan menggunakan Webmention, tetapi memerlukan pengaturan sisi server untuk mendapatkan (dan mungkin menyimpan) pemberitahuan ketika seseorang menyebutkan situs Anda, ini tidak selalu memungkinkan dengan pembangun statis seperti yang saya miliki di situs saya. Sisa dari posting ini akan dengan cepat menjelaskan bagaimana saya mendapat suka, sebutan dan repost yang di-host di Zeit-host Hugo build saya.

### Langkah pertama - cari hub webmention

Saya menemukan webmention.io dan itu berhasil. Ini menangani pingback masuk dan menyebutkan, itu juga akan memvalidasi bahwa situs panggilan benar-benar menghubungkan ke konten Anda dan akhirnya akan mem-parsing data dari halaman sehingga Anda memiliki pemahaman tentang konteksnya.

Webmention.io akan memvalidasi bahwa Anda memiliki situs tersebut melalui proses autentikasi terbuka (sudah rapi ia mencari rel = saya yang menunjuk ke penyedia auth)

### Langkah dua - beri tahu halaman yang bisa Anda tangani menyebutkan

Ini sesederhana menambahkan dua tag `link` berikut

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Langkah ketiga - mengintegrasikan API webmention.io ke situs Anda

Anda memiliki dua opsi di sini, Anda dapat menambahkan widget ke halaman Anda yang akan memanggil API webmention.io, atau Anda dapat mengintegrasikan API webmention.io ke dalam langkah pembuatan Anda. Saya ingin sesedikit mungkin pihak ketiga menyelenggarakan JS, jadi saya memilih yang terakhir. Saya mengintegrasikan webmentions ke proses penyebaran saya.

Saya menggunakan Hugo karena pembuatannya cepat, dan dengan itu dalam pikiran, saya harus mencari cara untuk mengintegrasikan API webmention ke dalam Hugo secara optimal. Kendala yang sulit adalah untuk tidak memanggil titik akhir API untuk setiap halaman di situs saya, saya punya banyak halaman, dan belum banyak komentar.

Untungnya situs Webmention.io menyediakan titik akhir berguna yang memungkinkan Anda menerima semua sebutan untuk domain Anda. Bagian yang kurang beruntung adalah file ini berisi satu entri untuk setiap tindakan yang telah dilakukan terhadap situs Anda.

Hugo juga memiliki gagasan tentang file data yang dapat ditarik langsung ke templat untuk setiap halaman tertentu, jadi Anda harus memetakan file data Webmention ke struktur baru yang membuatnya mudah dibaca di dalam templat Hugo.

Proses yang saya pilih adalah di bawah ini, tetapi ringkasannya adalah saya mengubah array dari daftar tindakan ke kamus URL yang masing-masing berisi tindakan yang diekspos oleh API (seperti, kirim ulang dan balas), dan langkah terakhir adalah untuk pisahkan kamus URL menjadi file individual yang dinamai hash md5 dari url.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Setelah data diuraikan dan disimpan dengan benar, itu adalah proses cepat mengatur template sehingga dapat dibaca ke dalam atribut Data dari template.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Jika semuanya berjalan dengan baik, Anda akan melihat beberapa ikon di bagian bawah halaman yang merupakan orang-orang nyata yang berinteraksi dengan situs tersebut.

### Langkah 4 - menerbitkan situs ketika komentar terjadi

Sementara langkah-langkah di atas akan membiarkan saya mengagregasi penyebutan dan membuat mereka dalam output situs, saya masih harus memastikan bahwa situs tersebut dibangun kembali secara teratur sehingga komentar muncul secara publik.

Saya memilih untuk menggunakan layanan cron sederhana yang akan memanggil API penyebaran Zeit untuk memaksakan pembongkaran ulang situs setiap jam atau lebih.
