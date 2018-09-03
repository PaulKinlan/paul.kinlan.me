---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Je suis récemment rentré d'un voyage en Inde pour assister à l'événement [Google4India](https://twitter.com/hashtag/google4india) (rapport prochainement) et rencontrer de nombreuses entreprises et développeurs. L'un des changements les plus intéressants abordés concernait la demande de contenu dans la langue des utilisateurs du pays et était particulièrement visible dans tous les produits de Google, allant de la recherche dans la langue de l'utilisateur à la recherche de contenu, et aussi de le lire aux utilisateurs sous forme de texte ou de voix.

Tout le voyage m'a fait réfléchir. Mon blog est construit avec Hugo. Hugo prend désormais en charge le contenu écrit en plusieurs langues. Hugo est entièrement statique, la création de nouveaux contenus consiste donc simplement à créer un nouveau fichier et à laisser le système de compilation faire de la magie. Alors peut-être que je peux créer quelque chose qui rendra mon contenu plus accessible à davantage de personnes en exécutant mon contenu statique via un outil de traduction, car la traduction humaine de contenu est très coûteuse.

Quelques heures avant mon retour au Royaume-Uni, j'ai créé un petit script qui prendra mes fichiers de démarques et les exécutera via [Google Cloud Translate](https://cloud.google.com/translate/) pour créer rapidement un fichier. traduction de la page que je peux ensuite héberger rapidement. La solution complète est présentée ci-dessous. C'est un processeur relativement basique, il ignore le préambule d'Hugo, il ignore le «code» et ignore les guillemets - mon hypothèse était que ceux-ci sont toujours destinés à rester tels qu'ils ont été écrits.

Remarque: il semble que notre logiciel d'apprentissage pour les traductions soit important, il est donc important de [marquer votre page pour que les outils d'apprentissage n'utilisent pas le contenu Google Translated comme entrée dans ses algorithmes](https://cloud.google.com/translate/ balisage).




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
Dans l'ensemble, je suis très content du processus. Je comprends que la traduction automatique n'est pas parfaite mais je pense que je peux étendre la portée de mon contenu aux personnes qui pourraient chercher dans leur propre langue et non en anglais. Je peux augmenter la surface de découverte de mon contenu et, espérons-le, aider davantage gens.

Il faudra un certain temps pour voir si cela aide réellement les gens, alors je vais rapporter quand j'ai plus de données .... Maintenant, pour exécuter mon script sur plus de mon site :)
