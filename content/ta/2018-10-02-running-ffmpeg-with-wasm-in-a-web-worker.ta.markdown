---
slug: running-ffmpeg-with-wasm-in-a-web-worker
date: 2018-10-02T16:17:19.798Z
title: 'Running FFMPEG with WASM in a Web Worker'
link: https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html
tags: [links, ffmpeg, wasm]
---
நான் [FFMPEG.js](https://github.com/Kagami/ffmpeg.js) நேசிக்கிறேன், அது asm.js உடன் தொகுக்கப்பட்டுள்ளது என்று ஒரு சுத்தமான கருவி மற்றும் அது விரைவில் வீடியோக்களை திருத்த முடியும் என்று JS வலை பயன்பாடுகள் உருவாக்க நாம். FFMPEG.js வலைத் தொழிலாளர்களுடன் இணைந்து பணியாற்றுகிறது, இதன் மூலம் நீங்கள் முக்கிய நூலைத் தடுக்காமல் வீடியோக்களை குறியாக்க முடியும்.

நான் நேசிக்கிறேன் [Comlink](https://github.com/GoogleChromeLabs/comlink). Comlink நாம் ஒரு சிக்கலான `postMessage` மாநில இயந்திரம் சமாளிக்க இல்லாமல் செயல்பாடுகளை மற்றும் வகுப்புகள் வெளிப்படுத்த மூலம் வலை தொழிலாளர்கள் எளிதாக தொடர்பு கொள்ளலாம்.

நான் சமீபத்தில் ஒன்றாக இணைக்க வேண்டும். நான் (வெப் சட்டசபைக்கு FFMPEG ஐ ஏற்றுமதி செய்தேன்) (0) (அது வேலை - யாய்) மற்றும் தற்போதைய FFMPEG.js திட்டத்தில் PostMessage வேலை அனைத்தையும் சுத்தம் செய்ய விரும்புகிறேன். கீழே உள்ள குறியீடு இப்போது போல் இருக்கிறது - இது மிகவும் அழகாக இருக்கிறது என்று நான் நினைக்கிறேன். நாம் ffmpeg.js மற்றும் comlink இறக்குமதி செய்யும் ஒரு தொழிலாளி, அது ffmpeg இடைமுகத்தை அம்பலப்படுத்துகிறது, பின்னர் நாம் வேலையைச் சுமக்கும் webpage மற்றும் ffmpeg API க்கு ப்ராக்ஸி உருவாக்க comlink ஐ பயன்படுத்துகிறோம்.

சுத்தமாகவும்.

#### worker.js
```javascript
importScripts('https://cdn.jsdelivr.net/npm/comlinkjs@3.0.2/umd/comlink.js');
importScripts('../ffmpeg-webm.js'); 
Comlink.expose(ffmpegjs, self);
```
#### client.html
```javascript
let ffmpegjs = await Comlink.proxy(worker);
let result = await ffmpegjs({
   arguments: ['-y','-i', file.name, 'output.webm'],
   MEMFS: [{name: file.name, data: data}],
   stdin: Comlink.proxyValue(() => {}),
   onfilesready: Comlink.proxyValue((e) => {
     let data = e.MEMFS[0].data;
     output.src = URL.createObjectURL(new Blob([data]))
     console.log('ready', e)
   }),
   print: Comlink.proxyValue(function(data) { console.log(data); stdout += data + "\n"; }),
   printErr: Comlink.proxyValue(function(data) { console.log('error', data); stderr += data + "\n"; }),
   postRun: Comlink.proxyValue(function(result) { console.log('DONE', result); }),
   onExit: Comlink.proxyValue(function(code) {
     console.log("Process exited with code " + code);
     console.log(stdout);
   }),
});
```
Comlink, தொழிலாளர்கள் மற்றும் WASM தொகுக்கப்பட்ட தொகுதிகள் ஒன்றாக எப்படி விளையாடலாம் என்பதை நான் மிகவும் விரும்புகிறேன். நான் idiomatic ஜாவாவை WASM தொகுதிடன் நேரடியாக தொடர்பு கொள்கிறேன் மற்றும் அது முக்கிய நூலை இயக்கும்.

[முழு இடுகையைப் படிக்கவும்](https://github.com/PaulKinlan/ffmpeg.js/blob/wasm/examples/async.html).
