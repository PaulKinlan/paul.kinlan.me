---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### Pembaruan: 8 Oktober - Masalah signifikan dengan dokumen ini.

Saya terjebak dengan [Jake Archibald](https://jakearchibald.com/) tentang pos ini karena saya pikir saya memiliki sesuatu yang baru, selama percakapan kami menemukan banyak hal yang membuat beberapa pos ini tidak valid, dan saya juga belajar banyak dalam proses yang menurut saya sebagian besar pengembang tidak tahu.

* Memanggil `.append()` dan `.appendChild()` mengadopsi node. Ini membuat penggunaan `adoptNode` dalam contoh ini menjadi tidak berguna karena append Algoritma memastikan bahwa node diadopsi. Ini tidak disebutkan dalam dokumen MDN, tetapi dalam [spec](https://dom.spec.whatwg.org/#concept-node-append) . Saya perlu kembali dan berolahraga mengapa saya memiliki masalah sebelumnya, tetapi saya curiga itu karena saya pada awalnya mencoba untuk menambahkan `DocumentFragment` . Ini berarti bahwa baik `w.document.body.appendChild(document.adoptNode(airhornerIframe));` dan `w.document.body.appendChild(airhornerIframe);` akan memiliki efek yang sama.
* Sementara elemen DOM akan mempertahankan statusnya (periksa elemen khusus), jika iframe dipindahkan di DOM, ia dimuat kembali. Periode. Ini berarti bahwa memindahkannya di antara iframe tidak akan membuat status seperti yang saya uji sebelumnya, saya percaya ini karena fakta bahwa SW memuat halaman dengan sangat cepat. Portal API mungkin tidak terpengaruh oleh ini - jadi di masa depan pengalaman ini akan bekerja :)

Konsep elemen bergerak antar dokumen masih valid dan menarik, tetapi manfaat untuk iframe tidak ada. Saya perhatikan bahwa elemen video diatur ulang ketika dipindahkan antara windows dan saya seharusnya lebih rajin memverifikasi iframe tidak benar-benar mengatur ulang keadaannya.

Seperti biasa, Anda dapat melihat [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Posting asli Ketika saya bergabung dengan Google pada tahun 2010 saya menemukan sebuah dokumen yang menyebutkan konsep dalam gmail yang disebut &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39;, ia memiliki nama keren dan konsepnya adalah novel.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Konsepnya adalah bahwa banyak aplikasi harus memuat banyak JavaScript kompleks bahkan untuk &#39;komponen kecil&#39; seperti jendela penulisan di gmail, Anda dapat meminta komponen aplikasi dimuat dalam `iframe` yang dapat berinteraksi dengan pengguna di jendela utama, Anda kemudian dapat &#39;merobek&#39; dan pindah ke jendela baru ketika menggunakan klik &#39;buat di jendela baru&#39; tombol. Saya tidak cukup percaya diri untuk berbicara dengan penulis (dan saya masih belum, saya juga belum melihat sumber untuk gmail untuk melihat apakah itu pernah benar-benar digunakan) tetapi itu tetap ada dalam pikiran saya sebagian besar karena nama itu membingungkan .

Naik 10 tahun ke depan dan saya sedang dalam perjalanan kereta api yang panjang dan mulai menyelidiki area yang saya tidak tahu banyak tentang `adoptNode` API. Saya bermain dengan [lot of ideas](https://nifty-meadowlark.glitch.me/) dan saya menyadari bahwa mungkin untuk memindahkan elemen DOM, keadaan mereka saat ini dan event handler yang terlampir ke windows baru. Ini mengingatkan saya pada &#39;iframe ajaib&#39; dan akhirnya mengarah pada gagasan bahwa Anda dapat membuat pop-out iframe (Sebuah iframe pop-out adalah Picture in Picture video tetapi untuk elemen iframe)

Kode untuk iframe pop-out cukup sederhana:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` memungkinkan Anda untuk memindahkan elemen DOM dengan `adoptNode` saat ini sambil mempertahankan penangan event terikat yang ada, di antara dokumen di browser - yang bisa menjadi DOM baru di dalam jendela saat ini, atau seperti dalam kasus demo ini bisa memindahkan yang sudah memuat `iframe` ke jendela lain yang memiliki asal yang sama. (Lihat pembaruan di atas).

Memindahkan iframe menarik karena itu berarti Anda tidak perlu me-reboot konten iframe, instance hanya dipindahkan. Ada beberapa kelemahan:

1. URL tetap pada asal saat ini dan bukan asal iframe, meskipun ini mungkin sesuatu yang bisa diselesaikan oleh `<portal>` API.
2. Jika Anda memindahkan elemen khusus, atau sesuatu yang logikanya dihosting pada pembuka - jika Anda menutup pembuka, eksekusi akan berhenti.

Selain kerugian, saya pikir mekanisme IPC tingkat DOM ini sangat sangat menarik. Selamat bermain dengan [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) dan beri tahu saya jika Anda memiliki ide menarik tentang tempat ini dapat digunakan.

