---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
I recently returned from a trip to India to attend the [Google4India](https://twitter.com/hashtag/google4india) event (report soon) and to meet with a lot of businesses and developers. One of the most interesting changes discussed was the push for more content in the language of the users in the country, and it was particularly apparent across all of Google's products which ranged from making it easier to search in the users language, to find content, and also to read it back to users in either text or voice form.

The entire trip got me thinking. My blog is built with Hugo. Hugo now supports content in written in multiple languages. Hugo is entirely static, so creating new content is matter of just making a new file and letting the build system do it's magic. So maybe I can build something that will make my content more available to more people by running my static content through a translation tool because human translation of content is very expensive. 

A couple of hours before my flight back to the UK I created a little script that will take my markdown files and run them through the [Google Cloud Translate](https://cloud.google.com/translate/) to create a quick translation of the page that I can then quickly host. The entire solution is presented below. It's a relatively basic processor, it ignores the Hugo preamble it ignores 'code' and it ignores pull quotes - my assumption was to that these are always meant to be left as the way they were written.

Note: It looks like our learning software for translations uses so it's important to [mark up your page so the learning tools don't use Google Translated content as input to it's algorithms](https://cloud.google.com/translate/markup).

> 

[Read full post](https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js).

```
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
Overall, I am very happy with the process. I understand that the machine translation is not perfect but my thinking is that I can increase the reach of my content to people who might be searching in their own languages and not in English I can increase the discovery surface area of my content and hopefully help more people.

It will take a while to see if this actually helps people, so I will report back when I have more data.... Now to run my script across more of my site :)
