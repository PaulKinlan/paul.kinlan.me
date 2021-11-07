---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31.000Z
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


Dalam [proyek terbaru](https://webgdedeck.com/), saya ingin berbagi logika sebanyak mungkin antara server, pekerja layanan, dan klien. Proyek ini pada dasarnya adalah RSS feed reader sederhana, ia mengambil RSS feed, mem-parsing data dan menggabungkannya ke dalam kumpulan kolom yang bagus (seperti TweetDeck), dan juga daftar gabungan tunggal.

Karena saya mengambil RSS feed dan menampilkan di halaman saya, saya harus yakin bahwa itu tidak melakukan sesuatu yang jahat. Saya dapat membersihkan input sebanyak yang saya inginkan, namun saya tahu kemampuan saya sendiri, dan saya orang-orang tertentu dapat memanipulasi umpan RSS sedemikian rupa sehingga saya akhirnya akan menjalankan skrip, mengimpor gambar atau pihak ketiga lainnya di konteks situs saya.

Platform web menawarkan kemampuan untuk mengunci situs melalui Content-Security-Policy (CSP). CSP dapat mengunci sumber eksternal dari mana kita dapat meminta konteks seperti skrip, gaya, gambar, dll. Anda bahkan dapat mengunci kemampuan laman untuk menjalankan skrip in-line - yang dapat mencegah semua manor jenis serangan XSS.

Itu cukup mudah untuk menambahkannya ke aplikasi.


```
`default-src 'self';`
```


Namun .... saya punya sejumlah masalah.

1. Saya membuat styles inline pada halaman dan dengan demikian saya perlu menjalankan skrip inline. 2. Saya perlu menyertakan Google Analytics yang mengharuskan skrip sebaris dijalankan di halaman.

CSP memungkinkan Anda menjalankan skrip dan styles inline dengan membiarkan Anda mengaktifkan opsi yang disebut `unsafe-eval` skrip, namun ini cukup banyak dengan melewatkan perlindungan apa pun yang diberikan CSP.

Untuk menjalankan skrip sebaris dan masih memiliki perlindungan CSP, CSP menawarkan beberapa alat. Yang saya gunakan disebut 'nonce'. Nonce adalah id acak yang Anda tetapkan pada tajuk HTTP CSP dan yang Anda hubungkan dengan skrip sebaris terkait.

** CSP string pada HTTP Header **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Skrip sebaris menggunakan nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


Kode di atas berfungsi dengan baik dan membuatnya mudah untuk membuat analitik berfungsi dengan benar ketika kami mengamankan situs dengan CSP.

Untuk setiap permintaan web tunggal, Anda harus memiliki nilai 'nonce' yang unik dan saya melakukan ini melalui `{nonce.analytics}` yang merupakan nilai yang saya hasilkan di server dan berlaku melalui template. Jika Anda menggunakan kembali nilai tidak aktif, browser akan menolak untuk mengeksekusi konten dalam skrip.

Saya memiliki sedikit masalah menghasilkan nilai-nilai nonce. Saya membutuhkan sesuatu yang akan menciptakan nilai unik yang tidak akan digunakan kembali oleh pengguna yang sama. Saya merasa bahwa nilai nonce dari format '[sumber] - [date.now + request-count]' akan mencukupi.

'Sumber' memungkinkan saya untuk menambahkan namespace ke nonce, dan date.now () + jumlah permintaan yang terus meningkat memberi saya nilai-nilai yang relatif tidak dapat diulang yang stabil.

Saya menghasilkan nonce menggunakan fungsi berikut:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


Kelihatan bagus. Namun, saya menyimpan semua halaman saya di layanan pekerja, yang berarti bahwa jika saya hanya melayani konten dari cache, nilai-nilai nonce akan digunakan kembali dan dengan demikian tidak dieksekusi.

Untungnya, saya berbagi logika antara server dan pekerja layanan saya, yang memungkinkan saya menghasilkan apa pun yang saya perlukan di satu tempat utama kode saya. Saya menggunakan parameter 'source' dalam fungsi `generateIncrementalNonce` saya untuk menambahkan 'server' atau 'service-worker' ke nilai nonce dan saya melakukan ini di setiap penangan permintaan baik di server dan pekerja layanan. Menggunakan parameter sumber ini berarti bahwa saya dapat menjamin nilai nonce yang dihasilkan melalui server tidak akan pernah berbenturan dengan halaman yang dimuat melalui pekerja layanan.

Pola ini telah melayaniku dengan baik. Ini memungkinkan saya mengizinkan skrip sebaris yang diperlukan untuk Google Analytics sementara menghentikan pihak ketiga mana pun dari menyuntikkan atau menjalankan kode tidak tepercaya di halaman saya.

Di bawah ini adalah kode yang saya gunakan dalam proyek. Ada sejumlah tempat berbeda di halaman saya yang saya perlukan nilai-nilai tidak aktif, saya menghasilkan mereka untuk setiap permintaan dan kemudian menerapkannya ke fungsi templating saya dan header HTTP pada saat yang sama.

#### common.js - logika bersama


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - fetch handler


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - permintaan penangan


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```