---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
நான் எம்.எஸ் தொகுதிகள் பற்றி நேற்று செய்ததைப் பற்றிய எண்ணங்கள் கிடைத்தன

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[முழு இடுகையைப் படிக்கவும்](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6es-modules/).

நான் அசல் கட்டுரையில் முயற்சி மற்றும் வெளிப்படையாக வேண்டும் என்று விஷயங்களை ஒன்று ஆனால் நான் வெளியே இழுக்க முடிவு என்று முனை சுற்றுச்சூழல் குறிப்பாக குறியீடு என்று ஒரு பெரிய அளவு இல்லை என்று குறிப்பாக அந்த நோட் per se ஆனால் இறுக்கமாக இணைந்த வருகிறது பொது ஜஸ் மற்றும் பிற மிகவும் குறிப்பிட்ட முனைய API வழியாக (முள், பழைய URL ஹிப்ரு போன்றவை), அது நம்மை இழுக்க முயற்சிக்க நிறைய முயற்சிகள் எடுக்கப் போகிறது, இதனால் ES Modules எங்கும் பரவுவதற்கு சாத்தியம் மிக வலிமையானதாக இருக்கும், மற்றும் சுற்றுச்சூழல் மாற்றங்கள் நாம் மாற்று கருவிகள் மற்றும் பண்ட்லர்களை நிறைய பயன்படுத்த வேண்டும் போகிறது பல தளங்களில் (வலை / சர்வர்) முழுவதும் குறியீடு பகிர்ந்து கொள்ள முடியும்.

நாம் எங்கே இருக்கிறோம், இணையத்தில் ஒரு இறக்குமதி கதை இல்லை, நாம் நாட் அறிமுகப்படுத்தியது மற்றும் பல இப்போது de-facto மேடையில் தேவைகளை கருத்தில் இப்போது என்ன primitives ஒரு குவியல் இல்லை, அதனால் நான் ஒரு விமர்சனத்தை விட நிலைமையை ஒப்புக் கொள்ளுதல்.

'Mjs' ஐ ஒரு கோப்பு நீட்டிப்பாக பயன்படுத்த ஒரு நகர் உள்ளது. நான் இதை முழுமையாக வசதியாக உணர்கிறேன், எனினும். Msj எந்த உள்கட்டமைப்பு இன்னும் 'உரை / ஜாவாஸ்கிரிப்ட்' என அங்கீகரிக்கிறது என்று ஒரு கோப்பு இல்லை மற்றும் நான் அதை தானாகவே கிரகத்தில் ஒவ்வொரு வலை சர்வர் மூலம் ஊடுருவி அதனால் தான் வரிசைப்படுத்தப்பட்ட வருகிறது, என் சேவை உள்கட்டமைப்பிற்கு இன்னும் அதிகமான மாற்றங்களை நான் பயன்படுத்த வேண்டியதில்லை.

மேலே வேடிக்கை நிறைய நேரம், நான் வலை நிறைய செயல்பாடு கொண்டு முடியும் எதிர்பார்த்து நான்.
