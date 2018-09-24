---
slug: slice-the-web
date: 2015-08-03
title: "SLICE: The Web"
description: "What are the properties that make the web the web?  How can we keep differentiating from native to stay relevant in a mobile world?"
tags: ["headless", "slice", 'headless chrome', 'the headless web']
image_header: "/images/slice.jpg"
---


Ada banyak percakapan tentang semua masalah web selama beberapa minggu terakhir dan mereka secara luas mengelompokkan diri ke dalam kategori berikut:


* Kinerja
* [Lumpy](/the-lumpy-web/) browser tidak konsisten
* Lanskap fitur yang berkembang dengan cepat.

Saya ingin meletakkannya di samping selama beberapa menit untuk membahas salah satu istilah yang kami gunakan di Google dengan cepat untuk menggambarkan aspek positif dari web sebagai platform untuk pengguna dan pengembang: ** SLICE **.

Saya tidak dapat menemukan referensi asli untuk itu, tetapi poin-poin mendasar yang akan saya masuki sudah diketahui dengan baik. ** SLICE ** disebutkan pada [Chrome Dev Summit] pertama (0) oleh Linus Upson pada tahun 2013. Ketika Linus berbicara tentang sifat-sifat web itu bukan dalam urutan yang benar untuk penamaan tapi saya mendorong Anda untuk menonton video ini. _Note_: Brett Cannon, seorang Microsofter (sebelumnya seorang Googler) juga baru-baru ini menyebutkannya dan ini adalah [bacaan yang baik](https://developer.chrome.com/devsummit) dan memiliki kesimpulan yang hampir sama pada posting saya tentang [Living with Web Apps](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web)

{{<youtube 20fGtfnxJuo>}}

<br> Saya pikir ini mencakup banyak hal baik:


* __S__ecure - Semua domain berpasir-pasir dari satu sama lain dan situs-situs pasir jauh dari mesin pengguna. Pengguna dapat membuka situs apa pun dan mengetahui bahwa situs tersebut aman.
* __L__inkable - Anda dapat mengarahkan ke halaman atau bagian konten hanya dengan membagikan URL
* __I__ndexable - Karena Anda dapat menautkan ke apa pun, jika publik dapat ditemukan oleh orang atau mesin apa pun yang dapat mengindeksnya agar dapat ditemukan secara universal oleh semua orang.
* __C__omposable - Iframes dan JavaScript memungkinkan kami dengan cepat membuat dan menyematkan situs, aplikasi, dan layanan baru hanya dengan memasukkan beberapa JS dan mengaitkan semuanya.
* __E__phemeral - Tidak ada yang perlu dipasang, Anda pergi ke halaman dan berinteraksi dengannya, meninggalkan halaman dan ketika Anda melakukannya berhenti mengambil sumber daya.
**MENGIRIS**.

Sebagai satu set kemampuan bahwa web merangkum prinsip SLICE sudah dikenal namun sering dilupakan ketika mempertimbangkan kompetisi platform asli.

Sebagai istilah, saya menemukan bahwa ** SLICE ** adalah cara hebat untuk segera menangani manfaat web hari ini. Ini melewatkan beberapa manfaat utama web seperti kemampuan untuk menerapkan pembaruan secara instan & mdash; ** SLUICE ** bukan akronim & mdash yang hebat; tapi itu tidak apa-apa, ** SLICE ** sebagai akronim bekerja dengan baik.

Saya menggunakan model ** SLICE ** sebagai dasar untuk ke mana kita pergi dengan * masa depan web * dan tantangan yang kita hadapi dan perlu diatasi untuk sampai ke sana.


* __S__ecure - Web harus tetap berpasir dan harus dienkripsi end-to-end. Kami juga perlu mencari tahu apa modelnya untuk memastikan bahwa pengguna memegang kendali dan menyadari bagaimana izin untuk API lanjutan .. Misalnya, kami baru-baru ini mulai mengirimkan [Bluetooth API](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en) bagaimana Anda memberi pengguna kepercayaan diri aman dan aman untuk digunakan.
* __L__inkable - Saya memulainya dengan Web Intents dan meskipun berakhir lebih awal, saya yakin kami memiliki generasi lain untuk menghubungkan konten, situs, aplikasi, dan pengalaman asli. Beberapa di antaranya membutuhkan teknologi baru sebagian membutuhkan pendidikan.
   * Menghubungkan ke Aplikasi Web: Saya akan menyelam ke dalam waktu lain ini. TL; DR - halaman landing produk dan halaman login tidak membantu kami menautkan ke aplikasi web.
   * Deep menghubungkan ke media: browser untuk waktu yang lama telah dapat menghubungkan ke bagian manapun dari file namun tidak ada yang tampaknya melakukannya.
   * Lebih dalam menghubungkan ke teks: Pertama kali saya melihat ini adalah blog Dave Winer di mana Anda dapat menautkan ke paragraf mana pun, baru-baru ini Medium memberikan setiap paragraf tautan dalam.
   * Menghubungkan Objek dunia nyata: [Web fisik](https://google.github.io/physical-web/) untuk menemukan "hal-hal" di sekitar kita, dan API baru untuk berbicara dengan "hal-hal" ini akan mengurangi friksi dalam kehidupan kita sehari-hari.
* __I__ndexable - Web tanpa kepala, yaitu, parser dan pengindeks semakin canggih memungkinkan kita untuk memahami lebih banyak tentang konten yang ada di web, mereka akan menjalankan JS dan memahami secara visual bagaimana halaman menyajikan tetapi masih banyak masalah yang masih ada:
   * Embedded Schema.org tidak dapat menggambarkan semantik dengan tepat (karena itu JSON + LD)
   * Media tidak memiliki meta data dalam jumlah besar yang terpapar dalam format publik.
   * Aplikasi: Intent Web mencoba menjadi cara yang menggambarkan apa yang bisa dilakukan oleh aplikasi web. Kami tidak memiliki itu lagi dan kami kehilangan banyak cara untuk mendeskripsikan kemampuan apa yang dapat dilakukan oleh aplikasi web. Ambil [app airhorn] saya (0) sebagai contoh, meskipun saya tidak mengharapkan ada yang membutuhkan fungsionalitas tanduk di aplikasi mereka, tidak ada cara untuk menemukannya selain untuk mencari meta-data dan itu adalah salah satu alasan mengapa kami memiliki halaman landing produk di web.
   * Perangkat Internet Connected tidak diindeks dan mereka tidak menjelaskan apa yang bisa mereka lakukan. Ini adalah bagian yang hilang untuk saya dalam kisah Web Fisik, menemukan kemampuan. Saya merasa seperti kita membutuhkan Intent Web untuk IoT.
* __C__omposable - Ini akan mudah untuk disebutkan hanya dengan hanya menyebutkan Komponen Web, tetapi sebenarnya kita berbicara tentang ekosistem yang lebih luas dari alat yang dapat digunakan kembali, pustaka dan kerangka kerja:
    * Ada masalah besar interop saat ini ketika kerangka kerja mencoba memiliki seluruh tumpukan.
    * Kita perlu memecahkan fungsi sisi-klien yang didelegasikan. Web Intents mencoba ini, tetapi banyak yang mungkin masih ada di web hari ini tetapi kami tidak melakukannya. yaitu, saya telah membuat aplikasi web snapper kode QR, mengapa Anda perlu membuat sendiri aplikasi untuk mengintegrasikannya ke aplikasi Anda sendiri, cukup gunakan milik saya atau layanan lain yang sudah ada sebelumnya.
* __E__phemeral - Dua kata: Pekerja Dinas.
  * Installabilitas adalah antitesis Emphemerality. Dengan definisi itu, ketika Anda menginstal sesuatu itu menjadi bagian yang berjalan lama dan terintegrasi dari perangkat. Pekerja Jasa dapat memberikan yang terbaik dari kedua dunia: sebuah jalan tengah membiarkan Anda memilih bagaimana dan kapan situs harus diintegrasikan lebih dalam ke perangkat. Gabungkan ini dengan manifes dan pengguna kini memiliki pilihan untuk menginstal "aplikasi web" atau menjaganya sebagai interaksi yang dibutuhkan.


** Jadi apa yang kita lewatkan? ** Saya akan meninggalkan itu untuk Anda untuk memberi tahu saya, saya kira saya kehilangan banyak. Saya memiliki satu set posting tindak lanjut di mana saya akan berbicara tentang bagaimana platform asli mengambil sepotong dari ** SLICE ** model untuk diri mereka sendiri sebagai cara untuk memperkuat aplikasi asli lebih jauh ke dalam kehidupan sehari-hari pengguna dan bagaimana web dapat membedakan lebih jauh.

Kredit Gambar: [Justus Hayes](https://commons.wikimedia.org/wiki/File:The_Big_Slice_-_Rome,_Italy.jpg)