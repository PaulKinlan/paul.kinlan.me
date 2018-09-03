---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA. Aplikasi Web Progresif. Frances Berriman dan Alex Russell menciptakan istilah "aplikasi web progresif" pada tahun 2015 dengan apa yang saya pikir adalah posting mani "[Progressive Web Apps: Escaping Tabs Tanpa Losing Our Soul](https://infrequently.org/2015/06/progressive -apps-escape-tab-tanpa-kehilangan-jiwa-kita /) ".

3 tahun kemudian, kami telah melalui perjalanan panjang. Dari sekumpulan teknologi lepas - Pekerja Layanan, Manifes, Tambah ke Homescreen, Push Web - yang semula hanya diterapkan di satu mesin browser, hingga merek yang telah mulai melekat di industri dengan bisnis dan pengembang, dan semua yang utama vendor browser menerapkan mayoritas tumpukan 'PWA'.

Kami sekarang punya [app](https://appsco.pe/) [direktori](https://pwa-directory.appspot.com/), [tools](https://blog.tomayac.com/ 2018/07/09 / progresif-web-apps-in-the-http-archive-143748) yang membantu kita memahami kira-kira berapa banyak PWA yang ada di alam liar, dan sejumlah besar [studi kasus tentang manfaat PWA](https://developers.google.com/web/showcase/). Tapi apa yang mendefinisikan PWA? Frances dan Alex memunculkan daftar sifat-sifat ini:

> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> to fit any form factor  
> **Connectivity independent**: Progressively-enhanced with [Service 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> to let them work offline  
> **App-like-interactions**: Adopt a Shell + Content application model to create 
> appy navigations & interactions  
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> process  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Discoverable**: Are identifiable as "applications" thanks to 
> [W3C](https://w3c.github.io/manifest/) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> and Service Worker registration scope allowing search engines to find them  
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> to the home screen through browser-provided 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> allowing users to "keep" apps they find most useful without the hassle of an 
> app store  
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> The social [power of
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> _matters_.


Yang penting, deskripsi ini menandai momen di mana kami semua sedikit lebih jelas tentang bagaimana kami ingin melihat web dan kami punya [alat](https://developers.google.com/web/tools/lighthouse/) yang membantu kami memahami jika situs kami adalah 'PWA' atau tidak. Alex bahkan melangkah lebih jauh dan mendefinisikan beberapa [aspek teknis yang membuat 'PWA' sebuah PWA](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ).

Dengan hiperbola dari posting ini, mengapa tidak semua orang membangun hal-hal ini? [Yah, itu bisa sulit. Sangat sulit](/ tantangan untuk pengembang web /). Kami meminta pengembang dan bisnis untuk melakukan banyak hal. Dalam beberapa kasus yang berfokus pada AppShell dapat berupa arsitektur ulang lengkap dari sebuah situs, dalam kasus lain ['AppShell' bukanlah arsitektur yang benar](/ progresif-progresif-web-apps /). Dan dalam banyak kasus, nilai atau narasi tidak selalu jelas.

Saya cukup beruntung dapat berbicara langsung dengan bisnis dan pengembang tentang kekhawatiran mereka di web, khususnya hal-hal yang telah saya dengar bisnis dan pengembang katakan tentang PWA, adalah:

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Menarik. Apakah mereka berbeda? Seringkali tidak, tapi PWA adalah 'hal' yang mereka dengar dan itu produk lain untuk diluncurkan. Mirip seperti situs m * adalah versi mobile dari situs desktop, PWA dapat menjadi hal lain yang harus mereka luncurkan.

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


Wah. Itu bukan PWA, itu hanya menggunakan teknologi yang dimiliki oleh aplikasi asli.

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


Hmmm. Ini adalah kasus yang jelas bahwa kami belum dapat mengartikulasikan mengapa penting bagi situs konten untuk melakukan perpindahan.

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


Hah. Orang mengaitkan App dengan instal, dan pemikiran bahwa situs atau pengalaman harus bertindak seperti pemasangan Aplikasi akan membuat sebagian orang lepas dari konsep secara keseluruhan. Pada 2015 ada diskusi yang sangat menarik tentang [wortel](https://trib.tv/2015/10/11/progressive-apps/) yang saya sarankan agar Anda singkirkan.

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


Baik. Itu sangat jelas. Nilai untuk pengguna atau bisnis tidak ada, dan itu cukup untuk menghentikan bisnis yang memprioritaskan sifat-sifat PWA.

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


Sebenarnya saya mendengar ini banyak dari banyak pengembang web yang hebat.

Saya mendorong Anda untuk memeriksa tulisan-tulisan [Jeremy Keith](https://adactio.com/) yang untuk sementara telah mendorong 'PW' dalam PWA untuk waktu yang lama dan dalam pembicaraan baru-baru ini mengatakan sesuatu yang serupa:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Perasaan pribadi saya adalah bahwa setiap orang benar-benar terpaku pada A dalam PWA: 'App'. Keberhasilan dan kegagalan merek konsep; 'Aplikasi' ada dalam nama, 'Aplikasi' ada dalam kesadaran banyak pengguna dan bisnis, jadi asosiasi cukup jelas.

Agar benar-benar jelas, saya dan banyak orang lain di seluruh tim kami mendorong keras istilah 'Aplikasi' dalam konteks PWA, khususnya dalam kaitannya dengan bersaing dengan pengalaman asli Mobile. [Andrew Betts 'posting](https://trib.tv/2016/06/05/progressively-less-progressive/) memiliki ringkasan yang baik terhadap posisi asli kami, dan sementara saya tidak berpikir kami salah, kami melakukan kehilangan kesempatan untuk membantu cerita yang lebih luas khususnya di sekitar faktor-faktor bentuk yang tidak begitu mobile sentris.

Saya sering bertanya kepada pemirsa ini ketika kami berbicara tentang Toko Web Chrome. Apakah Gmail merupakan aplikasi atau situs? Aplikasi, itu Mudah. Apakah Twitter merupakan aplikasi atau situs? Aplikasi .. apakah itu? Jika saya hanya membaca konten, itu masih terasa seperti situs web. Apakah Wikipedia adalah sebuah aplikasi atau situs? Sebuah situs, tentu saja; apakah itu? Sebagai editor, ini terasa seperti alat.

Pada akhirnya, saya pikir itu tidak terlalu penting jika situs adalah aplikasi atau aplikasi adalah sebuah situs. Orang dapat dan memang membuat segala sesuatu di web: 'aplikasi', game, kumparan VR, toko ritel atau hanya 'situs' tradisional, dan itu bisa untuk kasus penggunaan tertentu - media, hiburan, penerbitan, utilitas, perdagangan ...

Jika Anda mengesampingkan definisi asli PWA, dengan pengecualian 'installability' (lihat 'bag of carrots'), saya tidak berpikir ada yang bisa membantah bahwa jika pengembang meningkatkan situs mereka di salah satu poin yang direferensikan Alex pengguna mendapatkan pengalaman yang lebih baik, dan ketika pengguna mendapatkan pengalaman yang lebih baik, mereka menghargai web semakin banyak orang yang memiliki keterlibatan yang berarti dengan web dan tetap menggunakan web. Jadi bagaimana kita bisa menerapkan narasi PWA dengan cara yang setiap bisnis dan pengembang tahu apa yang harus mereka fokuskan?

---

Saya telah memikirkan pivot kecil berdasarkan tantangan yang kami lihat di industri, dan saya sudah mencoba memprioritaskan pentingnya di mana pengembang dan bisnis dapat memfokuskan upaya mereka. (Catatan: Saya mungkin menyalurkan [BizKin](https://twitter.com/business_kinlan))

Kami ingin bisnis dan pengembang sukses dengan memanfaatkan kemampuan unik web yang memungkinkan mereka untuk: Menjangkau sebagian besar pengguna mereka dengan mengklik tombol; Pertahankan pengguna mereka dengan menghadirkan pengalaman terbaik mereka di perangkat dengan satu set kode; dan untuk terlibat secara berarti dengan pengguna mereka dengan membangun hubungan langsung dan memiliki dengan mereka.

Saya sudah mencoba mengartikulasikan ini sebagai seperangkat prinsip yang harus dirasakan pengguna saat menggunakan web. Pengalaman Anda seharusnya: DITEMUKAN, AMAN, CEPAT, HALUS, DAPAT DIANDALKAN, BERARTI

Jadikan Dapat Ditemukan: Memungkinkan pengguna menemukan pengalaman Anda. Web terbuat dari tautan dan halaman. Idealnya setiap halaman dan negara harus memiliki tautan dalam sehingga siapa pun dapat dikirim ke situs mana pun, baik itu agregator, pesan, email, atau papan iklan. Konten harus disajikan sehingga perender apa pun dapat membacanya.

Jadikan Aman: Pengguna dan pemilik konten dapat mempercayai pengalaman yang dibangun di web, melindungi identitas, kerahasiaan, dan integritas data.

Jadikan Cepat: Setelah pengguna memiliki tautan ke situs Anda, maka pada saat mereka mengetuknya, mereka berada dalam pengalaman Anda dan dapat mulai menggunakannya terlepas dari jaringan atau perangkat yang dimiliki pengguna.

Jadikan Halus: Ketika pengguna berada di situs Anda, pengalaman tersebut responsif dan interaktif untuk semua gerakan pengguna. Animasi terasa halus dan tajam, umpan balik instan, menggulir lembut, navigasi instan. Idealnya jika Anda memikirkan kinerja web dalam hal [RAIL](https://developers.google.com/web/fundamentals/performance/rail), Anda berfokus pada 'RAI'.

Jadikan Itu Dapat Dipercaya: Pengguna situs Anda merasakan beberapa gangguan mungkin saat dihadapkan dengan jaringan atau perangkat yang tidak dapat diandalkan. Pengalaman harus berfungsi dan responsif di mana pun pengguna berada.

Jadikan itu Bermakna: Anda harus memberikan nilai dan memenuhi kebutuhan pengguna Anda melalui pengalaman berkualitas tinggi yang memberikan nilai. Ini dapat terlihat sangat mengembang, tetapi [Dion Almaer menggambarkannya dengan baik](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411). Fokusnya adalah benar-benar tentang situs Anda yang memenuhi kebutuhan pengguna, baik itu hiburan, menghaluskan pembelian, kemajuan pengetahuan atau penyelesaian tugas yang cepat. Ini semua tentang UX.

Pengalaman modern yang memenuhi tujuan utama ini ** cepat, andal, aman, dan lancar **. Ini menjadi semakin lebih ** mampu ** menggunakan API modern dan sangat ** ditemukan ** dengan memanfaatkan jangkauan web terbuka dan inti dari itu. PWA secara alamiah harus memenuhi masing-masing "tujuan prinsip" ini berdasarkan harapan pengguna dan terus membangun pengalaman karena semakin banyak teknologi dan kemampuan yang masuk. Namun demikian seharusnya pengalaman modern di web saat ini ....

<span><span id=name>Aplikasi</span> <span id='pw'>Web Progresif</span></span> - Web Progresif Semua-hal.

Di sinilah saya ingin mendorong PWA selama tahun depan. Apa yang kamu pikirkan?

_Terima kasih kepada Harleen Batra._

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}