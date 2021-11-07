---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31.000Z
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com) mengajari saya banyak tentang kemungkinan web. Sebelum bekerja dengan Mike yang saya buat di web dan saya memahami manfaatnya seperti keterkaitan dan penemuan, tetapi saya tidak pernah benar-benar memiliki gambaran lengkap tentang apa yang mungkin terjadi.

Satu hal yang Mike katakan adalah "[Web adalah API saya](http://softwareas.com/cors-scraping-and-microformats/)", di mana dia berbicara tentang kemampuan untuk mengekspos situs Anda dan data Anda di suatu halaman melalui mikroformat dan data terstruktur lainnya dan dapat mengaksesnya secara langsung dari konteks browser lain, menggunakan XMLHttpRequest sederhana dan API CORS:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


Itu sekitar waktu yang sama ketika saya mulai bekerja pada [Web Intents](https://en.wikipedia.org/wiki/Web_Intents), semangat yang mirip & mdash; memberi pengguna akses ke data dan layanan dari asal lain & mdash; tapi itu jauh lebih rumit. Saya ingin mengaktifkan penemuan layanan dan kemudian berinteraksi dengan halaman-halaman itu. Dan Mike ingin memindahkan web untuk menyediakan akses ke data dan layanan. Itu menempel dengan saya. [Bahkan jika saya lupa atribusi asli](https://twitter.com/Paul_Kinlan/status/913000817170534400).

Saya baru-baru ini melakukan pembicaraan untuk Nordic JS di mana saya menyoroti bahwa kami tidak membangun benar-benar membangun layanan yang saling terhubung di web, dan ketika kami melakukannya mengikuti model sebagian besar interaksi server ke server. Itu adalah situs web akan berintegrasi dengan layanan pihak ke-3 dengan mengalihkan semua permintaan API melalui server mereka ke layanan jarak jauh dan mengelola semua kerumitan yang menyertainya.

{{<figure src = "/ images / server-server.png" title = "Server ke Server - seperti membangun terowongan antar layanan">}}

Ia bekerja, kami memiliki seluruh web yang dibangun dengan ini, tetapi bisa sangat rumit ketika Anda mempertimbangkan otentikasi, otorisasi, protokol transportasi dan metode RPC yang berbeda (REST, GraphQL dll). Mike mengusulkan sesuatu yang jauh lebih elegan, bahwa dengan mengaktifkan situs CORS dan sedikit JavaScript, kita dapat berbicara langsung ke layanan jarak jauh dengan menggunakan situs ini.

{{<figure src = "/ images / server-rpc.png" title = "Gambar mengerikan saya yang saya gunakan untuk menggambarkan Klien ke Server">}}

Ada beberapa masalah yang muncul di antaranya. Masalah utamanya adalah bahwa meskipun CORS didukung secara luas di browser, pengembang jarang menggunakannya. CORS adalah perlindungan yang kita butuhkan di web tetapi sulit untuk mengatur dan men-debug, dan "Web sebagai API" tidak terlalu didorong terlalu banyak.

{{<figure src = "/ images / server-rpc-nope.png" title = "CORS mendapat di jalan">}}

Kami pindah ke dunia di mana situs dihasilkan di klien dengan JS dan sesi dan negara untuk pengguna dikelola sepenuhnya pada klien.

Kami masih memerlukan kemampuan untuk berkomunikasi dari situs kami ke layanan jarak jauh, dan saya masih sangat yakin bahwa kami perlu mendesentralisasikan integrasi kami dengan situs dan aplikasi lain, tetapi hal pertama yang perlu kami lakukan adalah menghubungkan situs dan aplikasi kami bersama-sama di jauh yang lebih dari sekadar tautan. Kami membutuhkan situs kami untuk mengekspos kemampuan dan fungsionalitas mereka secara langsung ke jendela lain di sistem pengguna.

Setiap situs web harus dapat mengekspos API yang pemilik situs kontrol, langsung ke klien lain.

{{<figure src = "/ images / client-rpc.png" title = "Klien ke klien">}}

Kabar baiknya adalah bahwa kita sudah bisa melakukannya, kami telah memiliki primitif di platform untuk setidaknya 7 tahun (`postMessage` dan` MessageChannel`), dan selamanya sejak `window.open`, tetapi kami tidak menggunakan alat-alat ini untuk berinteraksi dengan situs untuk alasan yang sama mengapa kami tidak menggunakan CORS: Ini sulit dan hampir tidak mungkin untuk mendefinisikan API waras yang sederhana dan konsisten untuk digunakan dan tidak perlu menarik pustaka pihak ketiga yang besar untuk setiap layanan yang ingin Anda gunakan untuk berinteraksi.

Platform hanya memungkinkan Anda untuk berkomunikasi antar situs menggunakan pengiriman pesan yang berarti bahwa sebagai pemilik layanan jika Anda ingin membuat API, Anda harus membuat mesin negara yang membuat serialisasi pesan ke suatu negara, bereaksi terhadapnya, dan kemudian mengirim mengirim pesan kembali ke klien dan kemudian Anda harus membuat pustaka yang melakukan itu untuk pengembang yang menggunakan layanan Anda. Ini sangat kompleks dan berbelit-belit dan saya percaya adalah salah satu alasan utama mengapa kita belum melihat adopsi lebih dari Pekerja Web dan API sisi klien.

{{<figure src = "/ images / window-dx.png" title = "Jendela pascaPengalaman pengalaman pengembang">}}

Kami memiliki perpustakaan yang membantu: [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink adalah API kecil yang mengabstraksikan API `MessageChannel` dan` postMessage` ke dalam API yang terlihat seperti Anda membuat instance kelas dan fungsi remote dalam konteks lokal. Sebagai contoh:


**Situs web**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



** Web Worker **


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src = "/ images / comlink.png" title = "Comlink">}}

Kami mengekspos API pada layanan, kami mengkonsumsi API di klien melalui proxy.

### Apakah ada contoh yang lebih baik?

Saya membangun [situs yang berlangganan endpoint pubsubhubbub dan ketika menerima ping, ia mengirim pesan JSON](https://rss-to-web-push.glitch.me/) ke titik akhir yang ditentukan pengguna. Saya tidak ingin mengelola infrastruktur notifikasi push untuk aplikasi kecil ini, situs lain yang saya buat ([webpush.rocks](https://webpush.rocks/)) dapat melakukan semua itu, saya hanya ingin menggunakan mengintegrasikan dengan layanan itu ..

Tapi bagaimana cara mendapatkan URL berlangganan (bagian data yang saya perlukan untuk dapat mengirim pemberitahuan) yang diadakan di klien webpush.rocks kembali ke situs saya?

Ketika saya pertama kali membangun situs ini, yang dapat Anda lakukan hanyalah membiarkan pengguna membuka situs dan kemudian salin dan tempelkan URL di antara halaman-halaman itu. Mengapa tidak mengekspos API yang dapat digunakan oleh situs apa pun? Itu yang saya lakukan.

webpush.rocks mendefinisikan API yang disebut `PushManager` yang memiliki satu metode di atasnya` subscriptionId`. Ketika halaman memuat itu mengekspos API ini ke jendela sebagai berikut:


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


API berinteraksi dengan API `PushSubscriptionManager` di DOM dan mengembalikan URL khusus ke situs panggilan. Yang penting di sini adalah karena berjalan secara asinkron, saya dapat menunggu verifikasi pengguna bahwa mereka ingin melakukan tindakan (atau tidak).

Kembali ke situs klien panggilan (aplikasi yang ingin mendapatkan subscriptionId). Ketika seorang pengguna mengklik tautan tersebut, kita memperoleh referensi ke jendela yang baru saja kita buka dan menghubungkan proxy `Comlink` kita ke sana. API layanan sekarang terpapar ke klien kami dan kami dapat memberi contoh API `PushManager` seperti itu adalah layanan lokal, tetapi semuanya berinteraksi dengan layanan instan jarak jauh di jendela lain.


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


Ini adalah video yang sangat cepat tentang apa yang sedang terjadi. Sebuah interaksi yang sangat sederhana dan ringan, ia membuka layanan dan kemudian mendapat ID yang dibutuhkannya.

{{<youtube vTYZXx31EHc>}}

Sebagai penyedia layanan, saya telah mengekspos serangkaian fungsi terbatas yang hanya tersedia di klien ke situs lain dan saya dapat mengamankannya dan meminta persetujuan pengguna pada saat yang sama sebelum saya mengembalikan data kembali ke pengguna, semua dengan sederhana untuk menggunakan API.

_ Web adalah API._

Cukup benar, kami tidak mengizinkan situs memeriksa atau memanipulasi DOM atau negara asal lain, tetapi saya mengandaikan bahwa jika Anda memiliki kontrol atas layanan dan fungsi situs Anda dan bagaimana pengguna terlibat dengannya maka Anda dapat mengekspos informasi yang paling penting dan layanan untuk setiap klien yang ingin menggunakan layanan Anda secara aman (Anda memegang kendali) dan itu memungkinkan Anda untuk:


* Fokus pada apa yang Anda kuasai.
* Transfer data cepat antara situs dan aplikasi karena semuanya ada di klien.
* IPC bahkan saat offline.
* Jalankan kode dalam konteks asal

### Apa yang seharusnya ditampilkan situs API?

Ini adalah sesuatu yang ingin saya jelajahi lebih lanjut. Saya membuka beberapa fungsi dasar ke layanan Push Notifications karena itu adalah maksud dari situs, tetapi bagian penting bagi saya adalah bahwa saya mengendalikan bagian mana dari DOM yang ingin saya berikan kembali kepada pengembang lain.

Saya ingin pergi ke tempat di mana setiap situs dapat mengekspos API yang konsisten kepada pengguna dan cara untuk menemukan fungsi dan layanan lain.

Setiap pemilik situs hanya dapat mengekspos fungsionalitas inti ke layanan mereka sehingga kami dapat melakukan operasi berbasis CRUD. Kita bisa memiliki interaksi yang rumit.

Kami bisa membuka web di mana kami memiliki layanan seperti Unix yang melakukan satu hal dengan baik dan pengguna menyambungkannya semua pada klien.

Setiap situs dapat mengekspos `VDOM` dari subset halaman yang ditentukan oleh pemilik layanan sehingga kami memiliki cara yang konsisten untuk menarik data bergerak berdasarkan DOM antar situs dengan aman.

Saya bisa membayangkan bahwa kita mungkin ingin akses cepat ke semua objek berbasis schema.org atau data terstruktur lainnya di halaman (mereka dapat secara dinamis dihasilkan) seperti yang dilakukan Mike di pos aslinya.

[Comlink](https://github.com/GoogleChromeLabs/comlink) memberi kami cara untuk mengekspos dan menggunakan layanan dengan cepat dan mudah di atas platform primitif yang telah ada selama bertahun-tahun. Kami akhirnya memiliki banyak bagian di tempat yang memungkinkan kami untuk membuat Web API.

_ Web adalah API saya. Jadikan milikmu juga.
