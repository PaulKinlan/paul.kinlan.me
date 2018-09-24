#! /usr/bin/node
// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.1.0')
  .option('-s, --source [path]', 'Add in the source file.')
  .option('-t, --target <lang>', 'Add target language.')
  .parse(process.argv);

// Creates a client
const translate = new Translate({
  projectId: 'html5rocks-hrd'
});

const targets = program.target.split(',')

async function translateLines(text, to) {
  if(text === ' ') return ' ';
  const links = [];

  // Find markdown links and replace URL.
  text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, p1, p2, offset, str) => {
    links.push(p2);
    return `[${p1}](${links.length-1})`;
  });

  console.log(text, links);

  const output = [];
  let results = await translate.translate(text, {to});

  let translations = results[0];
  translations = Array.isArray(translations)
    ? translations
    : [translations];

  // Note these fixes are not sustainable
  translations.forEach((translation, i) => {
    // Find markdown links that are broken () [] => ()[]
    translation = translation.replace(/\[([^\]]+)\] \(([^\)]+)\)/g,'[$1]($2)');
    // Find markdown links where the target has spaces in the wrong place [](/ ERROR /)
    translation = translation.replace(/\[([^\]]+)\]\(\/( ([^\)]+) )\/\)/g,'[$1]($3)');
    translation = translation.replace(/\[([^\]]+)\]\u{FF08}([^\u{FF09}]+)\u{FF09}/gu,'[$1]($2)');

    // Remap all links
    translation = translation.replace(/\[([^\]]+)\]\((\d+)\)/g, (match, p1, p2, offset, str) => {
      return `[${p1}](${links.shift()})`
    });

    output.push(translation);
  });

  return output.join('\n');
};

// Translates the text into the target language. "text" can be a string for
// translating a single piece of text, or an array of strings for translating
// multiple texts.
async function processFile(filePath, target) {

  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');
  const output = [];
  let translateBlock = [];

  // Statemachine variables.
  let inHeader = false;
  let inCode = false;
  let inQuote = false;
  let headerNeedsParse = true;
  for (const line of lines) {
    // Don't translate preampble
    if (line.startsWith('---') && inHeader) { headerNeedsParse = false; inHeader = false; output.push(line); continue; }
    if (line.startsWith('---') && headerNeedsParse) { inHeader = true; output.push(line); continue; }
    if (inHeader) { output.push(line); continue; }

    // Don't translate code
    if (line.startsWith('```') && inCode) { inCode = false; output.push(line); continue; }
    if (line.startsWith('```')) { inCode = true; output.push(await translateLines(translateBlock.join(' '), target)); translateBlock = []; output.push(line); continue; }
    if (inCode) { output.push(line); continue; }

    // Dont translate quotes
    if (inQuote && line.startsWith('>') === false) { inQuote = false; }
    if (line.startsWith('>')) { inQuote = true; if(translateBlock.length > 0) output.push(await translateLines(translateBlock.join(' '), target)); translateBlock = []; output.push(line); continue; }
    if (inQuote) { output.push(line); continue; }

    if (line.charAt(0) === '\n' || line.length === 0) { output.push(await translateLines(translateBlock.join(' '), target)); output.push(line); translateBlock = []; continue;} 

    translateBlock.push(line);
  }

  if(translateBlock.length > 0) output.push(await translateLines(translateBlock.join(' '), target))

  const result = output.join('\n');
  const newFileName = path.parse(filePath);
  fs.writeFileSync(`content/${newFileName.name}.${target}${newFileName.ext}`, result);
  console.log(`Translation written to 'content/${newFileName.name}.${target}${newFileName.ext}'`);
}

targets.forEach((target) => {
  processFile(program.source, target);
})
