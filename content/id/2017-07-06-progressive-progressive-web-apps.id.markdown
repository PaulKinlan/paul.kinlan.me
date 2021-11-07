---
slug: progressive-progressive-web-apps
date: 2017-07-04T13:20:31.000Z
title: "Progressive Progressive Web Apps"
description: "Building Progressive Web Apps progressively is possible. This is how I did it."
image_header: "/images/feeddeck.png"
tags: ['ssr', 'progressive web apps', 'pwa']
toc: true
---


Saya suka [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/). Saya menyukai model yang ia tawarkan untuk bagaimana Anda membangun situs web dan aplikasi yang bagus, kuat, dan dapat diandalkan. Saya suka platform platform API - pekerja layanan - yang memungkinkan model PWA berfungsi.

Salah satu perangkap yang kami terjatuh adalah "[App Shell](https://developers.google.com/web/fundamentals/architecture/app-shell)". Model App Shell mengatakan bahwa situs Anda harus menyajikan cangkang lengkap aplikasi Anda (sehingga mengalami sesuatu bahkan ketika Anda sedang offline) dan Anda kemudian mengontrol bagaimana dan kapan untuk menarik konten.

<figure><img src="/images/app-shell.png"><figcaption> Shell Aplikasi </figcaption></figure>

Model App Shell secara kasar analog dengan "SPA" (Aplikasi Halaman Tunggal) & mdash; Anda memuat shell, maka setiap navigasi selanjutnya ditangani oleh JS langsung di halaman Anda. Ia bekerja dengan baik dalam banyak kasus.

Saya tidak percaya bahwa App Shell adalah * hanya * atau model terbaik, dan selalu pilihan Anda bervariasi dari situasi ke situasi; blog saya sendiri misalnya menggunakan pola "Stale-Whilst-Revalidate" sederhana setiap halaman di-cache saat Anda menjelajahi situs dan pembaruan akan ditampilkan dalam penyegaran nanti; dalam posting ini saya ingin menjelajahi model yang baru-baru ini saya uji.

# Untuk App Shell atau bukan App Shell

Dalam model klasik App Shell hampir tidak mungkin untuk mendukung render progresif dan saya ingin mencapai model "Progresif" yang sesungguhnya untuk membangun situs dengan pekerja layanan yang memiliki properti berikut:


* Ia bekerja tanpa JS
* Ini berfungsi ketika tidak ada dukungan untuk Pekerja Layanan
* Cepat

Saya mulai mendemonstrasikan ini dengan membuat proyek yang selalu ingin saya bangun: Sungai Berita + TweetDeck Hybrid. Untuk koleksi feed RSS yang diberikan, render menjadi mode kolom.

<figure><img src="/images/feeddeck.png"><figcaption> Feed Deck - abaikan styling </figcaption></figure>

The "Feed Deck" adalah pengalaman referensi yang baik untuk bereksperimen dengan Service Worker dan peningkatan progresif. Ini memiliki komponen server yang diberikan, ia memiliki kebutuhan untuk "shell" untuk menunjukkan sesuatu kepada pengguna dengan cepat dan memiliki konten yang dihasilkan secara dinamis yang perlu diperbarui secara berkala. Akhirnya karena ini adalah proyek pribadi saya tidak perlu terlalu banyak infrastruktur server untuk menyimpan konfigurasi dan otentikasi pengguna.

Saya mencapai sebagian besar ini dan saya telah belajar banyak selama proses tersebut. Beberapa hal masih membutuhkan JS, tetapi aplikasi dalam fungsi teori tanpa JS; Saya merindukan NodeJS memiliki lebih banyak kesamaan dengan API DOM; Saya membangunnya sepenuhnya di Chrome OS dengan [Glitch](https://glitch.com/edit/#!/feeddeck?path=public/sw.js) tetapi bagian terakhir ini adalah cerita untuk hari lain.

Saya menetapkan beberapa definisi tentang arti "Pekerjaan" di awal proyek.


* "Ini berfungsi tanpa JS" & mdash; muatan konten di layar dan ada jalur yang jelas untuk semuanya bekerja tanpa JS di masa depan (atau ada pembenaran yang jelas tentang mengapa tidak diaktifkan). Saya tidak bisa mengatakan "nah".
* "Ini berfungsi ketika tidak ada dukungan untuk Pekerja Layanan" & mdash; semuanya harus dimuat, berfungsi, dan cepat, tetapi saya senang jika tidak berfungsi offline di mana saja.

Tapi itu bukan satu-satunya cerita, jika kami memiliki JS dan dukungan untuk pekerja layanan, saya memiliki mandat untuk memastikan:


* Ini dimuat langsung
* Itu dapat diandalkan dan memiliki karakteristik kinerja yang dapat diprediksi
* Ini bekerja sepenuhnya offline

Mea culpa: Jika Anda melihat kode dan Anda menjalankannya di browser yang lebih lama ada kemungkinan besar itu tidak akan berhasil, saya memilih untuk menggunakan ES6, namun ini bukan rintangan yang tidak dapat diatasi.

Jika kita fokus untuk membangun pengalaman yang berfungsi tanpa JavaScript diaktifkan maka kita harus membuat sebanyak mungkin di server.

Akhirnya, saya memiliki tujuan sekunder: Saya ingin menyelidiki bagaimana layaknya membagi logika antara Pekerja Servis Anda dan Server Anda .... Saya berbohong, ini adalah hal yang paling membuat saya bersemangat dan banyak manfaat cerita progresif jatuh dari belakang ini.

# Apa yang terjadi lebih dulu. Server atau Pekerja Layanan?

Itu sekaligus pada saat yang bersamaan. Saya harus merender dari server, tetapi karena pekerja layanan duduk di antara browser dan jaringan saya harus berpikir tentang bagaimana keduanya saling bertukar.

Saya berada dalam posisi beruntung karena saya tidak memiliki banyak logika server yang unik sehingga saya dapat mengatasi masalah secara holistik dan keduanya pada saat yang bersamaan. Prinsip-prinsip yang saya ikuti adalah memikirkan tentang apa yang ingin saya capai dengan render halaman pertama (pengalaman yang setiap pengguna dapatkan) dan render selanjutnya dari halaman (pengalaman yang melibatkan pengguna akan mendapatkan) baik dengan maupun tanpa pekerja layanan.


** Render pertama ** & mdash; tidak akan ada petugas layanan yang tersedia sehingga saya perlu memastikan bahwa render pertama mengandung sebanyak mungkin konten halaman dan membuatnya dihasilkan di server.

Jika pengguna memiliki browser yang mendukung pekerja layanan maka saya dapat melakukan beberapa hal menarik. Saya sudah memiliki logika template yang dibuat di server dan tidak ada yang istimewa tentang mereka, maka mereka harus menjadi templat yang sama persis yang akan saya gunakan langsung pada klien. Pekerja layanan dapat mengambil templat pada waktu `oninstall` dan menyimpannya untuk digunakan nanti.

<figure><img src="/images/wpt-feeddeck-first-load.png"><figcaption> Feed Deck - Beban pertama </figcaption></figure>


** Render kedua tanpa pekerja layanan ** & mdash; Ini harus bertindak persis seperti render pertama. Kami mungkin mendapat manfaat dari Caching HTTP normal, tetapi teorinya sama: membuat pengalaman dengan cepat.


** Render kedua _with_ pekerja layanan ** & mdash; Ini harus bertindak * persis * seperti render server pertama, tetapi, semua di dalam pekerja layanan. Saya tidak memiliki cangkang tradisional. Jika Anda melihat jaringan yang Anda lihat adalah struktur HTML: struktur _and_ yang sepenuhnya dijahit bersama.

{{<figure src = "/ images / devtools-feeddeck-second-load.png" title = "Umpan Dek & mdash; Beban kedua (Pekerja Layanan Terkendali)">}}

### "Render" & mdash; Streaming adalah teman kita

Saya mencoba untuk menjadi progresif mungkin yang berarti bahwa saya harus membuat sebanyak mungkin pada server dengan cepat. Saya memiliki tantangan, jika saya menggabungkan semua data dari semua umpan RSS maka render pertama akan diblokir oleh permintaan jaringan ke umpan RSS dan dengan demikian kami akan memperlambat render pertama.

Saya memilih jalur berikut:


* Tampilkan kepala laman & mdash; itu relatif statis dan mendapatkan ini ke layar dengan cepat pembantu dengan kinerja yang kurang baik.
* Render struktur halaman berdasarkan konfigurasi (kolom) & mdash; untuk pengguna tertentu saat ini statis dan membuatnya terlihat dengan cepat penting bagi pengguna.
* Render data kolom ** jika ** kita memiliki konten yang di-cache dan tersedia, kita dapat melakukan ini pada server dan pekerja layanan
* Render footer halaman yang berisi logika untuk secara dinamis memperbarui isi halaman secara berkala.

Dengan batasan-batasan ini dalam pikiran, semuanya perlu asynchronus dan saya perlu untuk menyelesaikan semuanya di jaringan secepat mungkin.

Ada kelangkaan nyata dari perpustakaan template Templat di web. Saya menggunakan [streaming-dot](https://github.com/surma/streaming-dot) oleh teman baik saya dan colleauge Surma yang merupakan port dari kerangka templating [doT](https://github.com/olado/doT) tetapi dengan generator tambahan sehingga dapat menulis ke Node atau DOM Stream dan tidak memblokir seluruh konten tersedia.

Rendering data kolom (yaitu, apa yang ada di feed) adalah bagian yang paling penting dan ini pada saat ini memerlukan JavaScript pada klien untuk beban pertama. Sistem ini diatur untuk dapat membuat segala sesuatu di server untuk beban pertama tetapi saya memilih untuk tidak memblokir di jaringan.

Jika data sudah diambil dan tersedia di pekerja layanan maka kita bisa segera memberikannya kepada pengguna bahkan jika cepat menjadi basi.

Kode untuk merender konten sementara aysnc relatif prosedural dan mengikuti model yang dijelaskan sebelumnya: Kami merender header ke aliran ketika template siap, kemudian merender isi konten ke aliran yang pada gilirannya mungkin menunggu konten yang ketika tersedia juga akan memerah ke aliran dan akhirnya ketika semuanya sudah siap kita tambahkan di footer dan flush ke aliran respon.

Di bawah ini adalah kode yang saya gunakan di server dan pekerja layanan.


```javascript
const root = (dataPath, assetPath) => {
  
  let columnData = loadData(`${dataPath}columns.json`).then(r => r.json());

  let headTemplate = getCompiledTemplate(`${assetPath}templates/head.html`);
  let bodyTemplate = getCompiledTemplate(`${assetPath}templates/body.html`);
  let itemTemplate = getCompiledTemplate(`${assetPath}templates/item.html`);
  
  let jsonFeedData = fetchCachedFeedData(columnData, itemTemplate);
  
  /*
   * Render the head from the cache or network
   * Render the body.
     * Body has template that brings in config to work out what to render
     * If we have data cached let's bring that in.
   * Render the footer - contains JS to data bind client request.
  */
  
  const headStream = headTemplate.then(render => render({ columns: columnData }));
  const bodyStream = jsonFeedData.then(columns => bodyTemplate.then(render => render({ columns: columns })));
  const footStream = loadTemplate(`${assetPath}templates/foot.html`);

  let concatStream = new ConcatStream;
  
  headStream.then(stream => stream.pipeTo(concatStream.writable, { preventClose:true }))
                .then(() => bodyStream)
                .then(stream => stream.pipeTo(concatStream.writable, { preventClose: true }))
                .then(() => footStream)
                .then(stream => stream.pipeTo(concatStream.writable));
  
  return Promise.resolve(new Response(concatStream.readable, { status: "200" }))
}
```


Dengan model ini di tempat, itu sebenarnya relatif mudah untuk mendapatkan kode di atas dan proses bekerja pada server * dan * di pekerja layanan.

## Logika server dan logika pekerja servis terpadu & mdash; lingkaran dan rintangan

Itu tentu tidak mudah untuk mendapatkan basis kode bersama antara server dan klien, Node + NPM ekosistem dan ekosistem Web JS seperti kembar identik secara genetik yang telah tumbuh dengan keluarga yang berbeda dan ketika mereka akhirnya bertemu ada banyak kesamaan dan banyak perbedaan yang perlu diatasi ... Kedengarannya seperti ide bagus untuk sebuah film.

Saya memilih untuk memilih Web di seluruh proyek. Saya memutuskan ini karena saya tidak ingin memaketkan dan memuat kode ke peramban pengguna, tetapi saya dapat mengambil pukulan itu di server (saya dapat mengukurnya, pengguna tidak bisa), jadi jika API tidak t didukung di Node maka saya harus menemukan shim yang kompatibel.

Inilah beberapa tantangan yang saya hadapi.

### Sistem modul rusak

Karena Node dan Web Ecosystem tumbuh, keduanya mengembangkan berbagai cara untuk membuat komponen, melakukan segmentasi, dan mengimpor kode pada waktu desain. Ini adalah masalah nyata ketika saya mencoba membangun proyek ini.

Saya tidak ingin CommonJS di browser. Saya memiliki keinginan yang tidak rasional untuk menjauh dari sebanyak mungkin membangun perkakas dan menambahkan kebencian saya tentang cara kerja bundling, itu membuat saya tidak banyak pilihan.

Solusi saya di browser adalah menggunakan metode datar `importScripts`, tetapi itu tergantung pada urutan file yang sangat spesifik, seperti yang bisa dilihat di pekerja layanan seperti ini:


** sw.js **


```javascript
importScripts(`/scripts/router.js`);
importScripts(`/scripts/dot.js`);
importScripts(`/scripts/platform/web.js`);
importScripts(`/scripts/platform/common.js`);
importScripts(`/scripts/routes/index.js`);
importScripts(`/scripts/routes/root.js`);
importScripts(`/scripts/routes/proxy.js`);
```


Dan kemudian untuk node, saya menggunakan mekanisme pemuatan NormalJS normal dalam file yang sama, tetapi mereka berada di belakang pernyataan `if` sederhana untuk mengimpor modul.


```javascript
if (typeof module !== 'undefined' && module.exports) {
    var doT = require('../dot.js');
    ...
```


Solusi saya bukan solusi terukur, itu berhasil tetapi juga mengotori kode saya, kode sumur yang tidak saya inginkan.

Saya menantikan hari di mana Node mendukung `modules` bahwa browser akan mendukung ... Kita memerlukan sesuatu yang sederhana, waras, dibagikan, dan dapat diskalakan.

Jika Anda memeriksa kode, Anda akan melihat pola ini digunakan di hampir semua file bersama dan dalam banyak kasus itu diperlukan karena saya perlu mengimpor [referensi aliran WHATWG implementasi](https://github.com/whatwg/streams/tree/master/reference-implementation).

### Menyeberangi aliran

Streaming mungkin merupakan primitif paling penting yang kita miliki dalam komputasi (dan mungkin yang paling sedikit dipahami) dan Node dan Web memiliki solusi mereka sendiri yang sepenuhnya berbeda. Itu adalah mimpi buruk yang harus dihadapi dalam proyek ini dan kami benar-benar perlu membuat standar pada solusi terpadu (ideal DOM Streams).

Untungnya ada implementasi penuh dari [API Aliran](https://github.com/whatwg/streams/tree/master/reference-implementation) yang dapat Anda bawa ke Node, dan yang harus Anda lakukan hanyalah menulis beberapa utilitas untuk memetakan dari Aliran Web -> Node Stream dan Node Stream -> Web Aliran.


```javascript
const nodeReadStreamToWHATWGReadableStream = (stream) => {
    
  return new ReadableStream({
    start(controller) {
      stream.on('data', data => {
        controller.enqueue(data)
      });
      stream.on('error', (error) => controller.abort(error))
      stream.on('end', () => {
        controller.close();
      })
    }
  });
};

class FromWHATWGReadableStream extends Readable {
  constructor(options, whatwgStream) {
    super(options);
    const streamReader = whatwgStream.getReader();
    
    pump(this);

    function pump(outStream) {
      return streamReader.read().then(({ value, done }) => {
        if (done) {
          outStream.push(null);
          return;
        }

        outStream.push(value.toString());
        return pump(outStream);
      });
    }
  }
}
```


Kedua fungsi pembantu ini hanya digunakan di sisi Node proyek ini dan mereka digunakan untuk membiarkan saya mendapatkan data ke Node API yang tidak dapat menerima WHATWG Streams dan juga untuk meneruskan data ke API yang kompatibel dengan WHATWG Stream yang tidak memahami Node Streams . Saya secara khusus membutuhkan ini untuk API `fetch` di Node.

Setelah saya memiliki Stream yang disortir, masalah terakhir dan inkonsistensi adalah Routing (kebetulan ini adalah di mana saya paling membutuhkan Stream Utils).

### Perutean bersama

Ekosistem Node, khususnya Express sangat terkenal dan luar biasa tangguh, tetapi kami tidak memiliki model bersama antara klien dan pekerja layanan.

Bertahun-tahun yang lalu saya menulis [LeviRoutes](https://github.com/PaulKinlan/leviroutes), sebuah perpustakaan sisi browser sederhana yang menangani ExpressJS seperti rute dan terhubung ke API Sejarah dan juga API `onhashchange`. Tidak ada yang menggunakannya tetapi saya senang. Saya berhasil untuk debu dari jaring laba-laba (membuat tweak atau dua) dan menyebarkannya di aplikasi ini. Melihat kode di bawah ini Anda dapat melihat bahwa routing saya adalah _nearly_ yang sama.


** server.js **


```javascript
app.get('/', (req, res, next) => {
  routes['root'](dataPath, assetPath)
    .then(response => node.responseToExpressStream(res, response));         
});

app.get('/proxy', (req, res, next) => {
  routes['proxy'](dataPath, assetPath, req)
    .then(response => response.body.pipe(res, {end: true}));
})
```



** sw.js **


```javascript
// The proxy server '/proxy'
router.get(`${self.location.origin}/proxy`, (e) => {
  e.respondWith(routes['proxy'](dataPath, assetPath, e.request));
}, {urlMatchProperty: 'href'});

// The root '/'
router.get(`${self.location.origin}/$`, (e) => {
  e.respondWith(routes['root'](dataPath, assetPath));
}, {urlMatchProperty: 'href'});
```


Saya akan _love_ untuk melihat solusi terpadu yang membawa pekerja layanan `onfetch` API ke Node.

Saya juga akan _love_ untuk melihat "Express" seperti kerangka yang menyatukan Node dan perutean permintaan kode Browser. Hanya ada cukup banyak perbedaan yang berarti saya tidak bisa memiliki sumber yang sama di mana-mana. Kami dapat menangani rute hampir persis sama pada klien dan server, jadi kami tidak terlalu jauh.

### Tidak ada DOM di luar render

Ketika pengguna tidak memiliki pekerja layanan yang tersedia, logika untuk situs ini cukup tradisional, kami membuat situs di server dan kemudian secara bertahap menyegarkan konten di halaman melalui polling AJAX tradisional.

Logika menggunakan API `DOMParser` untuk mengubah umpan RSS menjadi sesuatu yang dapat saya filter dan kueri di halaman.


```javascript
// Get the RSS feed data.
fetch(`/proxy?url=${feedUrl}`)
      .then(feedResponse => feedResponse.text())
      // Convert it in to DOM
      .then(feedText => {
        const parser = new DOMParser();
        return parser.parseFromString(feedText,'application/xml');
      })
      // Find all the news items
      .then(doc => doc.querySelectorAll('item'))
      // Convert to an array
      .then(items => Array.prototype.map.call(items, item => convertRSSItemToJSON(item)))
      // Don't add in items that already exist in the page
      .then(items => items.filter(item => !!!(document.getElementById(item.guid))))
      // DOM Template.
      .then(items => items.map(item => applyTemplate(itemTemplate.cloneNode(true), item)))
      // Add it into the page
      .then(items => items.forEach(item => column.appendChild(item)))
```


Mengakses DOM dari umpan RSS menggunakan API standar di peramban sangat bermanfaat dan itu memungkinkan saya untuk menggunakan mekanisme templating saya sendiri (yang saya banggakan) untuk memperbarui halaman secara dinamis.


```html
<template id='itemTemplate'>
  <div class="item" data-bind_id='guid'>
    <h3><span data-bind_inner-text='title'></span> (<a data-bind_href='link'>#</a>)</h3>
    <div data-bind_inner-text='pubDate'></div>
  </div>
</template>
<script>
  
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKey = node.dataset[bindAttr];
        let bindKey = bindAttr.substr(5);
        node[bindKey] = data[dataKey];
      }
    }
  }

  return element;
};
</script>
```


Saya sangat senang dengan diri saya sendiri sampai saya menyadari bahwa saya tidak bisa menggunakan ini di server atau di pekerja layanan. Satu-satunya solusi yang saya miliki adalah membawa custom [XML parser](https://www.npmjs.com/package/xml-parser) dan memandu itu untuk menghasilkan HTML. Ini menambahkan beberapa komplikasi dan membuat saya mengutuk web.

Dalam jangka panjang, saya ingin melihat lebih banyak lagi DOM API yang dibawa masuk ke pekerja dan juga didukung oleh Node, tetapi solusinya saya berhasil meskipun tidak optimal.

# Apa itu mungkin?

Sebenarnya ada dua pertanyaan dalam posting ini:


* Apakah praktis untuk membangun sistem berbagi server umum dan pekerja layanan?
* Apakah mungkin untuk membangun Progressive Web App progresif sepenuhnya?

## Apakah praktis untuk membangun sistem berbagi server umum dan pekerja layanan?

Adalah mungkin untuk membangun sistem berbagi server umum dan pekerja layanan tetapi apakah itu praktis? Saya suka ide itu, tapi saya pikir itu perlu penelitian lebih lanjut karena jika Anda akan JS sepanjang jalan, maka ada banyak masalah antara Node dan platform Web yang perlu disetrika.

Secara pribadi saya ingin melihat lebih banyak API "Web" di ekosistem Node.

## Apakah mungkin untuk membangun Progressive Web App progresif sepenuhnya?

Iya nih.

Saya sangat senang saya melakukan ini. Bahkan jika Anda tidak menggunakan bahasa yang sama pada klien seperti pada layanan, ada sejumlah hal penting yang menurut saya dapat saya tunjukkan.

1. AppShell bukan satu-satunya model yang dapat Anda ikuti, poin pentingnya adalah bahwa pekerja layanan _you_ mendapatkan kendali atas jaringan dan _you_ dapat memutuskan apa yang terbaik untuk kasus penggunaan Anda. 2. Adalah mungkin untuk membangun pengalaman yang diberikan secara progresif yang menggunakan pekerja layanan untuk menghadirkan kinerja dan ketahanan (serta perasaan terpasang jika Anda suka). Anda perlu berpikir secara holistik, Anda harus mulai dengan rendering sebanyak yang Anda bisa di server terlebih dahulu dan kemudian mengambil kendali di klien. 3. Adalah mungkin untuk berpikir tentang pengalaman yang dibangun "trisomorphic" (saya masih berpikir istilah isomorphic adalah yang terbaik) dengan basis kode yang umum, struktur routing umum dan logika umum yang dibagikan di antara klien, pekerja layanan dan server.

Saya meninggalkan ini sebagai pemikiran akhir: Kita perlu menyelidiki lebih lanjut tentang bagaimana kita ingin membangun aplikasi web progresif dan kita perlu terus mendorong pada pola yang memungkinkan kita sampai di sana. AppShell adalah awal yang baik, bukan akhirnya. Perenderan dan peningkatan progresif adalah kunci keberhasilan jangka panjang web, tidak ada media lain yang dapat melakukan ini sebaik web.

Jika Anda tertarik pada kode, [lihat di Github](https://github.com/PaulKinlan/streaming-server-sw-demo) tetapi Anda juga dapat bermain dengannya [langsung dan remix pada kesalahan](https://glitch.com/edit/#!/feeddeck)
