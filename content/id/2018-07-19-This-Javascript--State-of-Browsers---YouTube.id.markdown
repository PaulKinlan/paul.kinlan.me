---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee dari Dot ini mengatur streaming langsung yang cukup rapi yang membawa banyak vendor browser untuk memberikan ikhtisar tentang apa yang sedang mereka kerjakan:

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder


[Baca posting lengkap](https://www.youtube.com/watch?v=67etFbKTOFA).

Saya benar-benar menikmati streaming langsung dan senang mendengar apa yang semua orang lakukan. Saya juga menyukai visi yang Beaker Browser miliki untuk web terdistribusi, mereka telah melakukan banyak pekerjaan sejak terakhir kali kami bertemu.

Saya mendorong Anda untuk menonton video yang ditautkan, Edge telah memiliki sejumlah besar pembaruan termasuk dukungan penuh Layanan Pekerja, font variabel dan juga mereka memperkenalkan WebP. Mozilla memiliki fokus besar pada Perakitan Web dan perkakas pengembang, Beaker melakukan hal-hal luar biasa dengan dat: dan komputasi terdistribusi dan Brave telah bergerak bersama BAT.

Saya fokus pada pekerjaan yang dilakukan tim kami saat ini, dan itu secara luas di sekitar Penemuan, Kecepatan dan Kehandalan, Respon UI, UX - Selesaikan pekerjaan, Keamanan dan Privasi. Sedikit lebih konkret:

* Penemuan - kami benar-benar perlu mempermudah pengembang untuk membuat situs dengan JS yang ditampilkan dalam layanan tanpa kepala seperti pengindeks dan penyematan. Itu berarti kita perlu fokus pada mendidik pengembang bagaimana cara kerja pengindeks dan bagaimana menguji terhadap mereka, dan juga bagaimana membangun pengalaman SSR yang baik. * Kecepatan dan Keandalan - Semua situs harus memiliki TTI <5 ​​pada jaringan 3g pada perangkat Median (MotoG 4/5) dan Anda harus mengoptimalkan FID Anda (penundaan masukan pertama). FID adalah metrik baru, jadi penting untuk memahami bahwa ini dimaksudkan untuk mewakili bagaimana pengguna Anda mengalami situs Anda di alam liar, di mana TTI telah sulit diukur, FID seharusnya lebih mudah. Ada [polyfill di sini yang dapat Anda gunakan untuk menguji FID](github.com/GoogleChromeLabs/first-input-delay) * Responsif UI - Kami ingin web menjadi 60fps di mana-mana dan memudahkan para pengembang untuk mencapai, jadi kami sedang mengerjakan pembuatan & # x2018; FLIP & # x2019; lebih mudah dimengerti, membangun Houdini sehingga kami dapat memberikan pengembang lebih banyak kontrol atas render enging dan akhirnya mencoba untuk memindahkan sebanyak mungkin pekerjaan 'off-main-thread' melalui hal-hal seperti img.decode dan alat seperti comlink untuk membuat pekerja lebih mudah digunakan. * UX - Selesaikan pekerjaan - Kami benar-benar ingin mengubah cara kami berbicara tentang fitur baru yang datang ke platform, khususnya kami ingin menunjukkan di mana teknologi harus digunakan secara efektif untuk meningkatkan pengalaman pengguna untuk membantu mereka menyelesaikan pekerjaan dengan cepat dengan sedikit gangguan mungkin. * Keamanan dan Privasi - Saya pikir pencegahan Intelligent Tracking Apple akan memiliki dampak jangka panjang di web dan pengembang harus mulai memikirkan lebih lanjut tentang membangun privasi yang mendukung pengalaman web. Jika ada GDPR menjadikan web sebagai pengalaman 'menarik' di UE.

Akhirnya, itu merendahkan dan menghangatkan hati untuk mendengar bahwa semua orang ingin membawa kembali [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) :)
