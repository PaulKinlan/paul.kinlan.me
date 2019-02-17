---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Недавно я вернулся из поездки в Индию для участия в мероприятии [Google4India](https://twitter.com/hashtag/google4india) (вскоре сообщается) и встретиться с большим количеством компаний и разработчиков. Одной из наиболее интересных изменений стало стремление к большему количеству контента на языке пользователей в стране, и это было особенно очевидно во всех продуктах Google, которые варьировались от упрощения поиска на языке пользователей, поиска контента, а также прочитать его пользователям в текстовой или речевой форме.

Вся поездка заставила меня задуматься. Мой блог построен с Хьюго. Hugo теперь поддерживает контент в письменной форме на нескольких языках. Hugo полностью статичен, поэтому создание нового контента - это вопрос только создания нового файла и создания системы сборки. Поэтому, возможно, я смогу создать что-то, что сделает мой контент более доступным для большего количества людей, запустив мой статический контент с помощью инструмента перевода, потому что человеческий перевод содержимого очень дорог.

За пару часов до моего полета обратно в Великобританию я создал небольшой скрипт, который будет брать мои файлы с разметкой и запускать их через [Google Cloud Translate](https://cloud.google.com/translate/), чтобы создать быстрый перевод страницы, которую я могу быстро разместить. Полное решение представлено ниже. Это относительно базовый процессор, он игнорирует преамбулу Хьюго, он игнорирует «код», и он игнорирует кавычки тяги - мое предположение заключалось в том, что они всегда должны быть оставлены так, как они были написаны.

Примечание. Похоже, наше учебное программное обеспечение для переводов используется, поэтому важно [пометить свою страницу, чтобы учебные инструменты не использовали контент Google Translated в качестве входных данных для его алгоритмов](https://cloud.google.com/translate/ разметки).




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
В целом, я очень доволен процессом. Я понимаю, что машинный перевод не идеален, но я думаю, что я могу увеличить доступ к моему контенту людям, которые могут искать их на своих языках, а не на английском. Я могу увеличить площадь поверхности моего контента и, надеюсь, поможет больше люди.

Понадобится некоторое время, чтобы узнать, действительно ли это помогает людям, поэтому я буду отчитываться, когда у меня будет больше данных ... Теперь, чтобы запустить мой скрипт на более моем сайте :)
