#! /usr/bin/node
// Imports the Google Cloud client library
const { LanguageServiceClient } = require('@google-cloud/language');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version('0.1.0')
  .option('-s, --source [path]', 'Add in the source file.')
  .parse(process.argv);

// Creates a client
const translate = new LanguageServiceClient({
  projectId: 'html5rocks-hrd'
});

const client = new LanguageServiceClient();

async function analyze(text, to) {
  if(text === ' ') return ' ';

  const output = [];
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Detects the sentiment of the text
  const results = await client.analyzeEntities({document: document})
  const entities = results[0].entities;

  console.log(entities);

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

  // State machine variables.
  let inHeader = false;
  let inCodeTicks = false;
  let inCodeSpaces = false;
  let inQuote = false;
  let headerNeedsParse = true;

  let inHTML = false;

  for (const line of lines) {
    // Don't translate preamble - we are assuming there is a header that ends with just a \n
    if (line.startsWith('---') && inHeader) { headerNeedsParse = false; inHeader = false; output.push(line); continue; }
    if (line.startsWith('---') && headerNeedsParse) { inHeader = true; output.push(line); continue; }
    if (inHeader) { output.push(line); continue; }

    // Don't translate code
    if (inCodeTicks && line.startsWith('```')) { inCodeTicks = false; output.push(line); continue; }
    if (line.startsWith('```')) { inCodeTicks = true; output.push(line); continue; }
    if (inCodeTicks) { output.push(line); continue; }

    // Don't translate code prefixed with spaces
    if (inCodeSpaces && line.startsWith('    ') === false) { inCodeSpaces = false; output.push(line); continue; }
    if (line.startsWith('    ') && !inHTML) { inCodeSpaces = true;  output.push(line); continue; }
    if (inCodeSpaces) { output.push(line); continue; }

    // Don't translate processing directives, but translate previous text
    if (line.startsWith('{# ')) {  output.push(line); continue; }

    // Don't translate processing directives, but translate previous text
    if (line.startsWith('{% ')) {  output.push(line); continue; }

    // Treat empty line as point to translate paragraph
    if (line.charAt(0) === '\n' || line.length === 0) { output.push(line); continue; } 

    // Treat list as paragraphs
    if (line.match(/^[\s]*\*/) !== null) {  }

    output.push(line);
  }


}


const run = async () => {
  try {
    console.log(`Analyzing`)
    let document = await processFile(program.source);
    let results = await analyze(document);
  } catch (ex) {
    console.log(ex)
    process.exit(-1);   
  }
};

run();