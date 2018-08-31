---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Ich bin vor kurzem von einer Reise nach Indien zurückgekommen, um an der [Google4India](https://twitter.com/hashtag/google4india) Veranstaltung teilzunehmen (Bericht bald) und mich mit vielen Unternehmen und Entwicklern zu treffen. Eine der interessantesten diskutierten Änderungen war die Forderung nach mehr Inhalten in der Sprache der Nutzer in dem Land, und es wurde besonders offensichtlich bei allen Google-Produkten, die von der Erleichterung der Suche in der Benutzersprache, der Suche nach Inhalten, und es auch an die Benutzer in Text- oder Sprachform zurückzulesen.

Die ganze Reise hat mich zum Nachdenken gebracht. Mein Blog ist mit Hugo gebaut. Hugo unterstützt nun Inhalte in mehreren Sprachen. Hugo ist komplett statisch, also ist das Erstellen neuer Inhalte eine Angelegenheit, die nur eine neue Datei erstellt und das Build-System magisch macht. Vielleicht kann ich etwas aufbauen, das meinen Inhalt für mehr Leute verfügbar macht, indem ich meinen statischen Inhalt durch ein Übersetzungstool leite, weil die menschliche Übersetzung von Inhalten sehr teuer ist.

Ein paar Stunden vor meinem Flug zurück nach Großbritannien habe ich ein kleines Skript erstellt, das meine Markdown-Dateien aufnimmt und sie über [Google Cloud Translate](https://cloud.google.com/translate/) durchsucht, um schnell zu erstellen Übersetzung der Seite, die ich dann schnell hosten kann. Die gesamte Lösung wird im Folgenden vorgestellt. Es ist ein relativ grundlegender Prozessor, es ignoriert die Hugo-Präambel, es ignoriert "Code" und es ignoriert Pull-Zitate - meine Annahme war, dass diese immer so belassen werden sollen, wie sie geschrieben wurden.

Hinweis: Es sieht so aus, als ob unsere Lernsoftware für Übersetzungen verwendet wird. Daher ist es wichtig, [Ihre Seite so zu markieren, dass die Google Übersetzer-Inhalte nicht als Eingabe für die Algorithmen verwendet werden](https://cloud.google.com/translate/ Markup).




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
Insgesamt bin ich sehr zufrieden mit dem Prozess. Ich verstehe, dass die maschinelle Übersetzung nicht perfekt ist, aber ich denke, dass ich die Reichweite meiner Inhalte für Menschen erhöhen kann, die möglicherweise in ihren eigenen Sprachen und nicht in Englisch suchen. Ich kann die Suchoberfläche meiner Inhalte vergrößern und hoffentlich mehr helfen Menschen.

Es wird eine Weile dauern, um zu sehen, ob dies den Leuten tatsächlich hilft, also werde ich zurück berichten, wenn ich mehr Daten habe .... Nun, um mein Skript über mehr von meiner Seite laufen zu lassen :)
