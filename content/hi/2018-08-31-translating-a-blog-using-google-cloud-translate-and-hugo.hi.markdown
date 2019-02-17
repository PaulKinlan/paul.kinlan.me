---
slug: translating-a-blog-using-google-cloud-translate-and-hugo
date: 2018-08-31T12:51:51.745Z
title: 'Translating a blog using Google Cloud Translate and Hugo'
link: https://github.com/PaulKinlan/paul.kinlan.me/blob/master/translate.js
tags: [links, hugo, cloud, translate]
---
मैं हाल ही में [Google4 इंडिया](https://twitter.com/hashtag/google4india) ईवेंट (जल्द ही रिपोर्ट) में भाग लेने और कई व्यवसायों और डेवलपर्स से मिलने के लिए भारत की यात्रा से लौट आया। चर्चा में सबसे दिलचस्प परिवर्तनों में से एक देश में उपयोगकर्ताओं की भाषा में अधिक सामग्री के लिए धक्का था, और यह विशेष रूप से Google के सभी उत्पादों में स्पष्ट था जो उपयोगकर्ताओं की भाषा में खोजना आसान बनाने, सामग्री खोजने के लिए, और इसे टेक्स्ट या वॉइस फॉर्म में उपयोगकर्ताओं को वापस पढ़ने के लिए भी।

पूरी यात्रा ने मुझे सोच लिया। मेरा ब्लॉग ह्यूगो के साथ बनाया गया है। ह्यूगो अब कई भाषाओं में लिखित सामग्री का समर्थन करता है। ह्यूगो पूरी तरह स्थिर है, इसलिए नई सामग्री बनाना सिर्फ एक नई फाइल बनाने और बिल्ड सिस्टम को जादू करने की बात है। तो शायद मैं कुछ ऐसा निर्माण कर सकता हूं जो मेरी सामग्री को एक अनुवाद उपकरण के माध्यम से मेरी स्थिर सामग्री चलाकर अधिक लोगों के लिए अधिक उपलब्ध कराएगा क्योंकि सामग्री का मानव अनुवाद बहुत महंगा है।

यूके में वापस आने से कुछ घंटे पहले मैंने एक छोटी सी लिपि बनाई जो मेरी मार्कडाउन फाइलें ले लेगा और उन्हें त्वरित बनाने के लिए [Google क्लाउड अनुवाद](https://cloud.google.com/translate/) के माध्यम से चलाएगा उस पृष्ठ का अनुवाद जिसे मैं तुरंत होस्ट कर सकता हूं। पूरा समाधान नीचे प्रस्तुत किया गया है। यह एक अपेक्षाकृत बुनियादी प्रोसेसर है, यह हूगो प्रमोबल को अनदेखा करता है, यह 'कोड' को अनदेखा करता है और यह पुल उद्धरणों को अनदेखा करता है - मेरी धारणा यह थी कि इन्हें हमेशा लिखे जाने के तरीके के रूप में छोड़ा जाना चाहिए।

नोट: यह अनुवादों के उपयोग के लिए हमारे सीखने के सॉफ्टवेयर की तरह दिखता है, इसलिए यह महत्वपूर्ण है कि [अपने पृष्ठ को चिह्नित करें ताकि सीखने के उपकरण Google अनुवादित सामग्री का उपयोग इसके एल्गोरिदम में इनपुट के रूप में न करें](https://cloud.google.com/translate/ मार्कअप)।




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
कुल मिलाकर, मैं प्रक्रिया से बहुत खुश हूं। मैं समझता हूं कि मशीन अनुवाद सही नहीं है लेकिन मेरी सोच यह है कि मैं अपनी सामग्री की पहुंच को उन लोगों तक बढ़ा सकता हूं जो अपनी भाषा में खोज रहे हों, न कि अंग्रेजी में, मैं अपनी सामग्री की खोज सतह क्षेत्र को बढ़ा सकता हूं और उम्मीद करता हूं कि और अधिक मदद करें लोग।

यह देखने में कुछ समय लगेगा कि यह वास्तव में लोगों की मदद करता है, इसलिए जब मैं अधिक डेटा प्राप्त करता हूं तो मैं वापस रिपोर्ट करूंगा .... अब मेरी स्क्रिप्ट को मेरी साइट पर चलाने के लिए :)
