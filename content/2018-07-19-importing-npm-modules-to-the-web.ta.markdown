---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


நான் என் நிலையான தளத்தில் உள்ளடக்கம் தள்ள எளிதாக ஒரு வழி வேலை மற்றும் நான் மற்றொரு இடுகையில் இன்னும் பகிர்ந்து என்று ஒரு வேடிக்கை சிறிய உடற்பயிற்சி தான். இந்த இடுகையில், நான் `rollup` கட்டமைப்பைப் பகிர்ந்து கொள்ள விரும்புகிறேன், நான் எந்த npm தொகுதிக்கூடத்தையும் ஜாவாஸ்கிரிப்ட் தொகுதிக்கூறுகளைப் பயன்படுத்தி முன்முயற்சிகளிலிருந்து இறக்குமதி செய்வதற்கு பயன்படுத்தினேன்.

என் திட்டத்தில் ஒரு எளிய தொகுதி `கிடைக்கும்-URL கள்` இறக்குமதி செய்வதற்கு ஒரு விரைவு வழி தேவை. தொகுதி நன்றாக சோதனை மற்றும் நான் தேவை என்ன செய்கிறது ... அது ஜாவா வரிகளை ஒரு ஜோடி செயல்படுத்த மிகவும் எளிது என்று உண்மையில் புறக்கணிக்க. என் பிரச்சனை ES6 இல் கட்டமைக்கப்பட்டுள்ளது, தொகுதிகள் பயன்படுத்துகின்றன மற்றும் நான் CommonJS (`தேவை`) ஐ பயன்படுத்தி கட்டுப்படுத்த விரும்பவில்லை.

நான் இங்கே என்ன செய்ய வேண்டும் என்று பல வழிகாட்டல்களைக் கண்டுபிடிக்க முடியவில்லை, அதனால் நான் அனுபவித்தேன், இந்த தீர்வு முழுவதும் நான் வந்த தீர்வுதான்:

1. நான் தேவை npm தொகுதி இறக்குமதி ஒரு கோப்பு உருவாக்க. `module.exports = தேவை ('get-urls'); இந்த தொகுதி ES6 பாணியில் மாற்றப்படும். 2. ஒரு சுருட்டு கட்டமைப்பை உருவாக்குதல் 1. கணுக்கால்கள் மற்றும் கட்டிகள் ஆகியவற்றை இறக்குமதி செய்கிறது. இந்த தொகுப்பின் எனது பயன்பாட்டிற்கு தேவையான எல்லா npm தொகுதிகளையும் சரிசெய்கிறது. 1. ஜொனோம் தொகுதி வடிவத்தில் இப்போது `commonjs` சொருகி மூலம் முடிவுகளை அனுப்பவும். 1. வெளியீட்டை அழுத்துங்கள், ஏனென்றால் இது மிகப்பெரியது: \ 3. உங்கள் திட்டத்தில் தொகுக்கப்பட்ட கோப்பைச் சேர்த்து மகிழுங்கள்.


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


இதை விட சிறந்த வழிகள் இருப்பதாக நான் நினைக்கிறேன், ஒப்பீட்டளவில் எளிய செயல்பாடு என்ன என்பது பெரியது (70kb) ஆகும், ஆனால் இப்போது npm இலிருந்து நேரடியாக என் பக்கத்தில் இருந்து தொகுதிகள் பயன்படுத்தலாம் என்று அர்த்தம்.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


சுத்தமாகவும் ...
