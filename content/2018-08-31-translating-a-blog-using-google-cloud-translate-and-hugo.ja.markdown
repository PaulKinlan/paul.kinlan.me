---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
私は最近、[Google4India](https://twitter.com/hashtag/google4india)イベント(近いうちに報告)に出席し、多くの企業や開発者と出会うためにインドへの旅行から帰ってきました。議論された最も興味深い変更の1つは、その国のユーザーの言葉によるより多くのコンテンツへの押し込みであり、特に、ユーザーの言語で検索しやすくすること、コンテンツを見つけること、テキストまたは音声形式でユーザにそれを読み戻すことができます。

旅行全体が私に考えさせてくれました。私のブログはHugoで構築されています。 Hugoは現在、複数の言語で書かれたコンテンツをサポートしています。 Hugoは完全に静的なので、新しいコンテンツを作成することは、新しいファイルを作成してビルドシステムに魔法をかけることの問題です。翻訳ツールを使用して静的コンテンツを実行することで、より多くの人がコンテンツを利用できるようにすることができます。なぜなら、コンテンツの翻訳者は非常に高額なためです。

私の飛行前にイギリスに帰国する数時間前に、自分のマークダウンファイルを取得し、[Google Cloud Translate](https://cloud.google.com/translate/)で実行してクイック検索を作成するスクリプトを作成しました私はすぐにホストすることができますページの翻訳。ソリューション全体を以下に示します。これは比較的基本的なプロセッサーで、「コード」を無視したHugoプリアンブルを無視し、プル・クォートを無視しています。これらは常に書かれたままにしておくことを前提としていました。

注：翻訳用のラーニングソフトウェアのように見えるので、学習ツールでGoogle Translatedコンテンツをアルゴリズムの入力として使用しないようにページをマークアップすることが重要です(https://cloud.google.com/translate/markup)。




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
全体として、私はそのプロセスに非常に満足しています。機械翻訳は完璧ではないと私は考えていますが、英語ではなく自分の言語で検索している可能性のあるユーザーにコンテンツのリーチを広げることができると私は思っています。人。

これが実際に人々に役立つかどうかを確認するにはしばらく時間がかかりますので、データが増えたときに報告します。
