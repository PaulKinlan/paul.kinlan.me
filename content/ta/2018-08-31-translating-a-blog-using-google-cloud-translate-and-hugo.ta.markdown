---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
நான் சமீபத்தில் இந்தியாவிற்கு ஒரு பயணம் செய்தேன் [Google4India](https://twitter.com/hashtag/google4india) நிகழ்வு (விரைவில் அறிக்கை) மற்றும் நிறைய வணிகங்கள் மற்றும் டெவலப்பர்கள் சந்திக்க. நாட்டில் உள்ள பயனர்களின் மொழியில் அதிக உள்ளடக்கத்திற்கு விவாதிக்கப்படும் மிகவும் சுவாரஸ்யமான மாற்றங்களில் ஒன்றாகும், மேலும் இது பயனரின் மொழியைத் தேட, உள்ளடக்கத்தைத் தேட, மேலும் உரை அல்லது குரல் வடிவில் பயனர்களுக்கு அதை மீண்டும் படிக்கவும்.

முழு பயணமும் எனக்கு நினைவிருக்கிறது. என் வலைப்பதிவு ஹ்யூகோவுடன் கட்டப்பட்டுள்ளது. ஹூகோ இப்போது பல மொழிகளில் எழுதப்பட்ட உள்ளடக்கத்தை ஆதரிக்கிறது. ஹ்யூகோ முற்றிலும் நிலையானது, எனவே புதிய உள்ளடக்கத்தை உருவாக்குவது ஒரு புதிய கோப்பை உருவாக்குவதும், உருவாக்க அமைப்பை மாயமாக்குவதும் ஆகும். எனவே, என் உள்ளடக்கத்தை ஒரு மொழிபெயர்ப்பின் வழியாக என் நிலையான உள்ளடக்கத்தை இயக்கி, என் உள்ளடக்கத்தை அதிகமான மக்களுக்கு கிடைக்கக்கூடிய ஒன்றை உருவாக்க முடியும், ஏனெனில் உள்ளடக்கத்தின் மனித மொழிபெயர்ப்பு மிகவும் விலையுள்ளது.

என் விமானம் இங்கிலாந்திற்கு திரும்புவதற்கு இரண்டு மணிநேரம் முன்பு நான் ஒரு சிறிய ஸ்கிரிப்ட் ஒன்றை உருவாக்கியது, இது என் மார்க்க்டவுன் கோப்புகளை எடுக்கும், அவற்றை விரைவாக உருவாக்க [Google Cloud Translate](https://cloud.google.com/translate/) மூலம் இயக்கவும் நான் விரைவாக நடத்தக்கூடிய பக்கத்தின் மொழிபெயர்ப்பு. முழு தீர்வு கீழே வழங்கப்படுகிறது. இது ஒப்பீட்டளவில் அடிப்படை செயலியாகும், அது ஹ்யூகோவை 'குறியீடு'வை புறக்கணிக்கும் முன்னுரையை புறக்கணிக்கிறது, அதை இழுக்க மேற்கோள்களை புறக்கணித்து விடுகிறது - அவை எப்பொழுதும் எழுதப்பட்ட வழியிலேயே விட்டு வைக்கப்பட வேண்டும் என்பதே என் கருத்து.

குறிப்பு: மொழிபெயர்ப்பிற்கான எங்கள் கற்றல் மென்பொருளைப் பயன்படுத்துவது மிகவும் முக்கியமானது, எனவே [உங்கள் பக்கத்தை குறிப்பது, அதனால் கம்ப்யூட்டிங் கருவிகள் அதன் மொழிபெயர்ப்பாளர்களுக்கு உள்ளீடு என Google மொழிபெயர்க்கப்பட்ட உள்ளடக்கத்தை பயன்படுத்தாது] [https://cloud.google.com/translate/] மார்க்).




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
ஒட்டுமொத்த, நான் செயல்முறை மிகவும் மகிழ்ச்சியாக இருக்கிறேன். இயந்திர மொழிபெயர்ப்பு சரியானது அல்ல என்பதை நான் புரிந்துகொள்கிறேன், ஆனால் எனது சிந்தனை என்னவென்றால், எனது சொந்த உள்ளடக்கத்தில் தேட விரும்பும் மக்களுக்கு என் உள்ளடக்கத்தை அடைவதற்கு என்னால் முடியும், ஆங்கிலத்தில் அல்ல என் உள்ளடக்கத்தின் கண்டுபிடிப்பு பரப்பு பகுதியை அதிகரிக்க முடியும், மக்கள்.

இது உண்மையில் மக்களுக்கு உதவுகிறதா என பார்க்க சிறிது நேரம் ஆகலாம், மேலும் அதிக தரவு இருக்கும்போது நான் மீண்டும் புகாரளிப்பேன் .... இப்போது எனது ஸ்கிரிப்டை என் தளம் முழுவதும் இயக்கவும் :)
