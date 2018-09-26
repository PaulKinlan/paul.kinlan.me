---
slug: unintended-silos
date: 2017-07-25T13:20:31+01:00
title: "Web sites as unintended silos: The problem with getting data in and out of the web client"
description: "It's nearly impossible to get consistent get data in and out of a web app on the client"
tags: ["intents"]
---


Sebelum Anda membaca, berikut adalah sejumlah bug yang saya ingin Anda beri bintang yang muncul dari bagian belakang artikel ini.


* [Tidak dapat menempatkan file ke clipboard di event 'oncopy' dan tidak dapat menempel ke OS](https://crbug.com/860563)
* [Tidak dapat melampirkan file ke clipboardData dalam acara 'oncopy' dan tidak dapat menempelkannya kembali ke aplikasi web yang sama.](https://crbug.com/860562)
* [Tidak dapat membaca file dari clipboard di Chrome OS (saat Google Docs bisa.)](https://crbug.com/860560)
* [Tidak dapat menyeret gumpalan yang dibuat secara dinamis dari halaman ke aplikasi File (UnduhURL tidak didukung)](https://crbug.com/860558)
* [Tidak dapat menyeret file dari halaman ke aplikasi File (UnduhURL tidak didukung)](https://crbug.com/860557)
* [Drag and Drop - setData dengan URL Unduhan tidak berfungsi untuk gumpalan.](https://crbug.com/741785)
* [Drag and Drop - setData dengan URL Download mem-bypass pekerja layanan.](https://crbug.com/741778)

Web sebagai platform terbuka dan interoperable telah mengubah dunia. Hal ini memungkinkan kita untuk melihat, berinteraksi dan pertukaran informasi dengan satu set API teknologi terbuka, terutama Link, HTTP dan HTML. Dengan alat-alat sederhana ini kita dapat membuat aplikasi dan layanan yang kompleks yang dapat interopperable antara server ke server dan dari server ke pengguna menggunakan browser.

Setelah situs dimuat ke peramban pengguna, data yang dihasilkan oleh pengguna dan disimpan dalam peramban akan dikunci kecuali jika didorong kembali ke server, dan saya pikir ini adalah masalah tersembunyi untuk web.

[Web Intents](https://paul.kinlan.me/what-happened-to-web-intents/) adalah teknologi yang siap untuk memastikan bahwa situs web pada klien memiliki kemampuan untuk berinteraksi dengan dunia di sekitarnya: situs lain dan aplikasi yang berinteraksi dengan pengguna di perangkat mereka. Web Intents adalah jalan buntu, tetapi masalahnya masih ada dan kami secara tidak sengaja menciptakan silo yang terkunci di belakang login pengguna dan penyimpanan data lokal.

Saya masih bersemangat untuk mendapatkan data masuk dan keluar dari aplikasi web sepenuhnya di klien dan kami memiliki sejumlah alat yang kami miliki, tetapi izinkan saya memberi tahu Anda, kami membuatnya sangat sulit untuk dilakukan.

Saya suka fakta bahwa setiap situs web di browser pengguna adalah sandbox aman miliknya, tetapi satu hal yang saya ingin lihat di web adalah perubahan langkah dalam antarmuka tentang cara mendapatkan data dari sistem pengguna ke dalam kotak pasir dan melalui antarmuka yang ditetapkan menarik data dari sandbox kembali ke sistem pengguna.

Saya memulai posting ini setelah melihat bahwa iOS 11 akan mendukung drag and drop API di web dan setelah menonton posting baik teman saya dan kolega Sam Thorogood di Drag and Drop (check it out), saya ingin menjelajahi ruang ini lebih banyak.

{{<youtube y1BsexcSW8o>}}
** Intro untuk drag dan drop **

Untuk beberapa konteks, saya ingin membuat aplikasi yang berfungsi seperti papan gores dan menempelkan bin, yaitu Anda dapat menjatuhkan bagian konten apa pun ke halaman web dan kemudian mengembalikannya di kemudian hari dan posting ini mendokumentasikan beberapa masalah yang saya temukan di sepanjang jalan.

Ada banyak cara untuk memasukkan data ke kotak pasir situs web dari sistem operasi host dan ada sejumlah cara untuk mendapatkan data yang dihosting dan dihasilkan kembali ke sistem host. Masalahnya adalah itu sangat [kental](/the-lumpy-web/) dan tidak konsisten di semua platform yang membuatnya cukup membuat frustrasi.

# Interaksi yang tersedia

Mari mulai dengan cara mendapatkan data dari perangkat klien ke situs web:


* ` <input type=file> `
* Tempel dari clipboard di gerakan tempel pengguna
* Seret dari luar browser
* Buka halaman web dari host

Mendapatkan data dari situs web kembali ke klien


* ` <a download>`</a>
* Tambahkan data ke clipboard pada gerakan salin pengguna
* Seret dari browser ke klien

## Unggah melalui pemilih

Saya tidak akan terlalu detail tapi ` <input type=file> `bekerja sangat baik hanya sebagai pemilih file biasa.

Anda dapat membatasi pemilih ke jenis file ` <input type="file" accept="image/png" /> `.

Anda dapat membiarkan pengguna memilih lebih dari satu file ` <input type="file" multiple /> `.

Anda juga dapat berintegrasi dengan pemilih khusus seperti kamera ` <input type="file" captuaccept="image/*" capture> `.

The ` <input> Elemen `bahkan memiliki antarmuka yang memungkinkan Anda untuk memeriksa file yang dipilih. Sangat mudah untuk mendapatkan file ke dalam kotak pasir browser jika pengguna memilihnya.


** Soal 1 **: Setelah Anda memiliki file itu, Anda tidak dapat menyimpan perubahan kembali ke file yang sama pada host, Anda sebenarnya berurusan dengan salinan file.


** Soal 2 **: Jika host memperbarui file sementara Anda memegang salinan, Anda tidak akan melihat pembaruan.

## Unduh file ke OS host

Kita dapat mengunduh sumber daya jarak jauh hanya dengan menggunakan atribut `download` seperti:` <a href="someurl.html" download="output.html">Unduh</a> `.

Kami juga dapat menghasilkan konten secara dinamis di klien dan mengunduhnya ke host sebagai berikut:


```javascript
function download() {
  var url = URL.createObjectURL(new Blob(['hello world at ', Date.now()], {'type': 'text/plain'}));
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'hello.txt';
  a.click();
  URL.revokeObjectURL(url);
}

download();
```


Ini sederhana dan efektif dan mendapatkan dukungan di Safari sekarang juga.


** Soal 1 **: Tidak ada kemampuan untuk mengintegrasikan dengan sistem 'Save As' yang berarti bahwa pengguna tidak dapat memilih di mana file akan mendarat di luar direktori unduhan browser.


** Masalah 2 **: Tidak ada kemampuan untuk menulis kembali ke file setelah diunduh dan di perangkat pengguna, setelah diunduh hilang.

## Menggunakan clipboard untuk menempelkan data ke halaman web

Hal ini dimungkinkan untuk mencegat acara `onpaste` yang dipicu ketika pengguna di halaman memanggil isyarat sisipkan sistem dan kemudian melakukan sihir.


```javascript
document.body.addEventListener("paste", function(e) {
  // You need to own it.
  e.preventDefault();

  // get all the types of things on the clipboard
  let types = e.clipboardData.types;

  // Get the text on the clipboard
  e.clipboardData.getData("text/plain"); 

  // Get a itterable list of items (Not on Safari)
  e.clipboardData.items
  
  // Get access to a file on the clipboard
  e.clipboardData.files[0]
});
```


API ini tampaknya relatif konsisten di sejumlah browser (.item samping)

Secara umum, untuk mendapatkan Data ke dalam aplikasi web Anda, API ini bekerja cukup baik, Anda bisa mendapatkan akses ke file dan teks di clipboard dan menggunakannya dan itu aman dalam arti bahwa pengguna harus memulai tindakan sisipkan sistem agar Anda dapat untuk mendapatkan akses ke data ini. Orang bertanya-tanya apakah suatu situs bisa mendengarkan untuk acara pasta dan membaca data bahwa pengguna tidak pernah sepintas akan terbaca ....


** Masalah 1 **: sangat sulit untuk debug, konsol penebangan `clipboardData` tidak akan menunjukkan data yang benar, Anda harus breakpoint dalam.

## Menggunakan clipboard untuk menyalin data khusus dari halaman web

Anda dapat mencegat peristiwa `oncut` dan` oncopy` yang dipicu saat pengguna di halaman memanggil salinan sistem dan memotong isyarat lalu menambahkan konten kustom Anda sendiri ke clipboard sistem.


```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Set some custom data on 
  e.clipboardData.setData("text/plain", "Hello World");

  // Add a user generated file to the clipboard
  e.clipboardData.items.add(new File(["Hello World"], "test.txt", {type: "text/plain"}));
});
```


Sepintas ini luar biasa, saya harus bisa apa saja yang saya perlukan ke clipboard, namun ada sejumlah masalah.


** Soal 1 **: Menambahkan file ke clipboard tidak mungkin.


```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Add a user generated file to the clipboard
  e.clipboardData.items.add(new File(["Hello World"], "test.txt", {type: "text/plain"}));
});
```


API ada, tetapi tidak berfungsi di mana pun tampaknya. Jika Anda mencoba dan menempel pada halaman yang sama yang menambahkan data ke objek `clipboardData`, properti` clipboardData.files` kosong. Jika Anda mencoba dan menempel hasilnya ke sistem file, tidak ada yang terjadi. Namun jika Anda menempel ke bidang teks, nama file * * disisipkan. Saya tidak tahu apakah ini adalah fitur keamanan, tetapi tidak didokumentasikan dengan cara & mdash; Saya mempertanyakan seluruh keberadaan API jika ini kasusnya.


** Soal 2 **: Anda diharapkan untuk melakukan semua clipboard Anda memanipulasi secara bersamaan dalam acara, ini berarti bahwa tidak mungkin untuk menambahkan data ke clipboard yang disimpan dalam db yang diindeks.


```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Add a user generated file to the clipboard (Promise)
  getData.then(file => e.clipboardData.items.add(file));
});
```


Sepertinya Anda harus memutasi clipboard di tick yang sama dengan kejadian dan ini sangat membatasi kemampuan API.

## Seret dari host ke halaman web

Drag and drop API memiliki banyak kesamaan dengan API clipboard sehingga secara teori tidaklah luar biasa kompleks untuk memulai.

Untuk membawa data dari lingkungan host, Anda harus mengelola acara drop. Pertama Anda memastikan bahwa Anda mengesampingkan aksi default browser (yang menampilkan file) dan kemudian Anda bisa mendapatkan akses ke data yang ada di acara.

Seperti clipboard, Anda memiliki `item` dan Anda juga memiliki` file` sehingga Anda dapat melihat semua hal yang telah diseret dari host ke halaman.


```javascript
element.addEventListener('drop', e => {
  // Own it. nuff said.
  e.preventDefault();

  // Get the text on the clipboard
  e.dataTransfer.getData("text/plain"); 

  // Get a itterable list of items (Not on Safari)
  e.dataTransfer.items
  
  // Get access to a file on the clipboard
  e.dataTransfer.files[0]
});
```


Ini sebenarnya semua tampaknya cukup baik.

## Seret dari halaman web ke host

Drag and drop API memiliki banyak kesamaan dengan API clipboard sehingga secara teori tidaklah luar biasa kompleks untuk memulai.

Ada "mime-type" non-standar yang disebut `UnduhURL`. Ini tampaknya tidak didukung di Firefox atau iOS, didukung di Chrome. Anda memberi browser url untuk mengambil dan itu akan memulai unduhan setelah diseret di luar browser.


```javascript
element.addEventListener('dragstart', e => {
  // Own it. nuff said.
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  e.dataTransfer.effectAllowed = "all";
  e.dataTransfer.setData("DownloadURL", `image/png:test.png:${$fileURL.href}`)
});
```


Ini adalah satu-satunya cara yang diketahui untuk menyeret file keluar dari browser dan ke host host OS.


** Masalah 1 **: `UnduhURL` benar-benar tidak standar dan hanya berfungsi di Chrome.


** Masalah 2 **: `UnduhURL` tampaknya tidak bekerja dengan URL Blob, ini berarti file yang dibuat di browser tidak dapat diseret keluar.


** Masalah 3 **: Permintaan yang dikelola melalui `UnduhURL` tidak ditangani oleh Pekerja Layanan.


** Soal 4 **: `dataTransfer` memiliki objek` file` seperti `clipboardData`, dan sangat mirip dengan` clipboardData` antarmuka, menambahkan file ke itu tidak melakukan apa pun untuk operasi drag.


** Soal 5 **: Sekali lagi, mirip dengan `clipboardData` API, Anda harus mem-mutasi objek` dataTransfer` secara serentak dalam kejadian tersebut. Ini tidak memungkinkan untuk berinteraksi dengan datastore async.

# Perubahan pada platform web yang ingin saya lihat

Saya pikir ada beberapa perubahan mendasar yang dapat kita buat ke platform web untuk membuatnya lebih sederhana dan lebih mudah untuk mendapatkan data masuk dan keluar dari aplikasi web pada klien.

## Standarisasi UnduhURL untuk drag dan drop

Sepertinya hal yang wajar untuk dilakukan. Tidak ada referensi nol untuk desain di mana saja di web, dan referensi apa pun pada daftar spesifikasi tampaknya telah hilang ke waktu.

Rasanya seperti cara browser mengelola ` <a download>` mirip dengan cara `DownloadURL` bekerja hari ini sehingga bisa menjadi awal yang baik.</a>

## Izinkan file yang akan ditambahkan ke Clipboard dan Drag and Drop operations

Saya menganggap ada alasan mengapa itu tidak bekerja di mana saja, tapi saya berharap untuk dapat `dataTransfer.files.add ([File])` dan untuk itu menjadi hal yang ada di clipboard dan dijatuhkan ketika gerakan pengguna selesai.

## Buat DOM Peristiwa yang mengubah acara berfungsi dengan baik dengan operasi asynchronous

Ada banyak peristiwa yang terjadi di dalam peramban yang memungkinkan Anda mengubah tindakan default dan kemudian memutasi beberapa keadaan pada acara (lihat di atas). Tampaknya data yang diadakan di acara ini hanya dapat diubah ketika acara sedang dieksekusi dan bukan sebagai hasil dari operasi asynchronous yang dibuat oleh acara tersebut.

Saya ingin melihat acara ini memanfaatkan [`ExtendableEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent) sehingga kita bisa mendapatkan akses ke` waitUntil` (atau yang serupa). Karena web bergerak asnyc untuk operasi penyimpanan data, rasanya seperti cara kita berinteraksi dengan acara juga.

## Introduce Persistent File API

Kami tidak memiliki cara yang waras untuk mendapatkan referensi ke file dan menyimpan referensi itu sehingga dapat dengan mudah dimanipulasi. Kami dapat melakukannya dalam konteks "aplikasi web" & mdash kami; bertahan file ke IndexedDB tidak terlalu rumit & mdash; tetapi kami membanjiri semua data kami di dalam aplikasi dan tidak memungkinkan mereka untuk dengan mudah terhubung dengan host di sekitarnya.

# Permainan panjang

Ada beberapa untaian pengembangan yang terjadi di ekosistem browser saat ini, di satu sisi kita memiliki ras menuju Appiness dan paritas asli, dan di sisi lain kita memiliki gerakan untuk kesetiaan konten - memperkenalkan API seperti Grid, font dan alat kinerja untuk memastikan bahwa kami dapat mengirimkan konten dengan cepat dan berkualitas tinggi.

Banyak yang saya bicarakan hari ini sepertinya fokus pada "mari kita membuat web sebuah platform aplikasi", dan tentu saja itu adalah bagian dari cerita. Jika kita ingin paritas dengan pengalaman asli browser dan situs-situs di browser harus bertindak seperti mereka termasuk sebagai bagian dari sistem. Tapi saya pikir ada yang lebih dari itu.

Saya ingin melihat web di mana interkoneksi antar situs tidak hanya ditentukan oleh tautan dan permintaan HTTP ke server, tetapi kami memungkinkan interaksi antar situs secara langsung pada klien. Kami harus dapat menemukan layanan dan kemampuan dari situs yang digunakan pengguna dan berinteraksi dengan mereka dengan lancar sambil memastikan idiom dari platform host tersedia untuk semua konten di web.

Saya khawatir bahwa dalam jangka panjang bahwa bahkan jika kita memiliki URL, kita akan memiliki web di mana mudah untuk mendapatkan data ke dalam kotak pasir, tetapi tidak mungkin untuk keluar ke sistem host atau bahkan di antara situs lain di web .