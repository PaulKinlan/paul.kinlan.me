---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
Recientemente volví de un viaje a la India para asistir al evento [Google4India](https://twitter.com/hashtag/google4india) (informe pronto) y para reunirme con una gran cantidad de empresas y desarrolladores. Uno de los cambios más interesantes discutidos fue la promoción de más contenido en el idioma de los usuarios en el país, y fue particularmente evidente en todos los productos de Google, que van desde facilitar la búsqueda en el idioma de los usuarios, hasta encontrar contenido, y también para leerlo a los usuarios en forma de texto o voz.

Todo el viaje me hizo pensar. Mi blog está construido con Hugo. Hugo ahora admite contenido escrito en varios idiomas. Hugo es totalmente estático, por lo que crear contenido nuevo es cuestión de simplemente crear un nuevo archivo y dejar que el sistema de compilación lo haga. Así que tal vez pueda construir algo que haga que mi contenido esté más disponible para más personas ejecutando mi contenido estático a través de una herramienta de traducción porque la traducción humana del contenido es muy costosa.

Un par de horas antes de mi vuelo de regreso al Reino Unido, creé un pequeño script que tomará mis archivos de marcado y los ejecutará a través de [Google Cloud Translate](https://cloud.google.com/translate/) para crear un archivo rápido. traducción de la página que puedo alojar rápidamente. La solución completa se presenta a continuación. Es un procesador relativamente básico, ignora el preámbulo de Hugo que ignora el 'código' e ignora las comillas de extracción - mi suposición era que estas siempre deben dejarse tal como fueron escritas.

Nota: Parece que nuestro software de aprendizaje para traducciones utiliza, por lo que es importante [marque su página para que las herramientas de aprendizaje no usen el contenido traducido de Google como entrada a sus algoritmos](https://cloud.google.com/translate/ margen).




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
En general, estoy muy contento con el proceso. Entiendo que la traducción automática no es perfecta, pero mi pensamiento es que puedo aumentar el alcance de mi contenido a personas que podrían estar buscando en sus propios idiomas y no en inglés. Puedo aumentar el área de superficie de descubrimiento de mi contenido y espero ayudar más. gente.

Tomará un tiempo para ver si esto realmente ayuda a las personas, por lo que informaré cuando tenga más datos ... Ahora para ejecutar mi script en más de mi sitio :)
