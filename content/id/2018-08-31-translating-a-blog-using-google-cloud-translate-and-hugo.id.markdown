---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Baru-baru ini saya kembali dari perjalanan ke India untuk menghadiri acara [Google4India](https://twitter.com/hashtag/google4india) (segera laporkan) dan untuk bertemu dengan banyak bisnis dan pengembang. Salah satu perubahan paling menarik yang dibahas adalah dorongan untuk lebih banyak konten dalam bahasa pengguna di negara tersebut, dan itu sangat jelas di semua produk Google yang berkisar dari membuatnya lebih mudah untuk mencari dalam bahasa pengguna, untuk menemukan konten, dan juga untuk membacanya kembali ke pengguna baik dalam bentuk teks atau suara.

Seluruh perjalanan membuatku berpikir. Blog saya dibangun dengan Hugo. Hugo sekarang mendukung konten secara tertulis dalam berbagai bahasa. Hugo sepenuhnya statis, sehingga membuat konten baru adalah masalah hanya membuat file baru dan membiarkan sistem build melakukan sihirnya. Jadi mungkin saya bisa membangun sesuatu yang akan membuat konten saya lebih tersedia bagi lebih banyak orang dengan menjalankan konten statis saya melalui alat terjemahan karena terjemahan konten manusia sangat mahal.

Beberapa jam sebelum penerbangan saya kembali ke Inggris saya membuat skrip kecil yang akan mengambil file penurunan harga saya dan menjalankannya melalui [Google Cloud Translate](https://cloud.google.com/translate/) untuk membuat terjemahan halaman yang kemudian dapat saya host dengan cepat. Seluruh solusi disajikan di bawah ini. Ini adalah prosesor yang relatif dasar, mengabaikan Hugo preamble itu mengabaikan 'kode' dan mengabaikan tanda kutip - asumsi saya adalah bahwa ini selalu dimaksudkan untuk ditinggalkan seperti cara mereka ditulis.

Catatan: Sepertinya perangkat lunak pembelajaran kami untuk terjemahan menggunakan sehingga penting untuk [menandai halaman Anda sehingga alat pembelajaran tidak menggunakan konten Google Terjemahan sebagai masukan ke algoritme ita](https://cloud.google.com/translate/ markup).




```Javascript
// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.1.0')
  .option('-s, --source [path]', 'Add in the source file.')
  .option('-t, --target [lang]', 'Add target language.')
  .parse(process.argv);

// Creates a client
const translate = new Translate({
  projectId: 'html5rocks-hrd'
});

const options = {
  to:  program.target,
};

async function translateLines(text) {
  if(text === ' ') return ' ';
  const output = [];
  let results = await translate.translate(text, options);

  let translations = results[0];
  translations = Array.isArray(translations)
    ? translations
    : [translations];

  translations.forEach((translation, i) => {
    output.push(translation)
  });

  return output.join('\n');
};

// Translates the text into the target language. "text" can be a string for
// translating a single piece of text, or an array of strings for translating
// multiple texts.
(async function (filePath, target) {

  const text = fs.readFileSync(filePath, 'utf8');

  const lines = text.split('\n');
  let translateBlock = [];
  const output = [];

  let inHeader = false;
  let inCode = false;
  let inQuote = false;
  for (const line of lines) {
    // Don't translate preampble
    if (line.startsWith('---') && inHeader) { inHeader = false; output.push(line); continue; }
    if (line.startsWith('---')) { inHeader = true; output.push(line); continue; }
    if (inHeader) { output.push(line); continue; }

    // Don't translate code
    if (line.startsWith('```') && inCode) { inCode = false; output.push(line); continue; }
    if (line.startsWith('```')) { inCode = true; output.push(await translateLines(translateBlock.join(' '))); translateBlock = []; output.push(line); continue; }
    if (inCode) { output.push(line); continue; }

    // Dont translate quotes
    if (inQuote && line.startsWith('>') === false) { inQuote = false; }
    if (line.startsWith('>')) { inQuote = true; output.push(await translateLines(translateBlock.join(' '))); translateBlock = []; output.push(line); }
    if (inQuote) { output.push(line); continue; }

    if (line.charAt(0) === '\n' || line.length === 0) { output.push(await translateLines(translateBlock.join(' '))); output.push(line); translateBlock = []; continue;} 

    translateBlock.push(line);
  }

  if(translateBlock.length > 0) output.push(await translateLines(translateBlock.join(' ')))

  const result = output.join('\n');
  const newFileName = path.parse(filePath);
  fs.writeFileSync(`content/${newFileName.name}.${target}${newFileName.ext}`, result);

})(program.source, program.target);
```
Secara keseluruhan, saya sangat senang dengan prosesnya. Saya memahami bahwa terjemahan mesin tidak sempurna tetapi pemikiran saya adalah bahwa saya dapat meningkatkan jangkauan konten saya kepada orang-orang yang mungkin mencari dalam bahasa mereka sendiri dan tidak dalam bahasa Inggris saya dapat meningkatkan luas permukaan penemuan konten saya dan semoga membantu lebih banyak orang-orang.

Ini akan memakan waktu cukup lama untuk melihat apakah ini benar-benar membantu orang, jadi saya akan melaporkan kembali ketika saya memiliki lebih banyak data .... Sekarang untuk menjalankan skrip saya di lebih banyak situs saya :)
