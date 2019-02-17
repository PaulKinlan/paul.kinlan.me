---
slug: EmscriptenscompiledWebAssemblyusedminimally-DEVCommunity
date: 2018-07-11T21:05:59.091Z
title: Emscripten's compiled Web Assembly, used minimally
link: https://dev.to/samthor/emscriptens-compiled-web-assembly-used-minimally-4fd4
tags: ['link', 'wasm']
---
Dev.to மீது சாம் தோராயோட் எழுதுகிறார்,

> Why did I write this post? Emscripten is a wonderful tool, but it has a long history (for asm.js), and isn't perfect. I think it errs too much on the side of "magic", and many posts rave about how it's so easy to EM_ASM_ or use binding-fu, but this all comes at a cost, and can introduce huge amounts of inadvertent overhead&#x2014;think copying huge memory buffers around because we're trying to make them immutable or easily exposed.
> 
> Every language that is being compiled to Web Assembly needs a runtime&#x2014;whether it be Go, or Rust, or C/C++ as we have here. I don't believe that we'll ever really be able to directly import Web Assembly via ES2015 modules, at least not without changes on the JS side. But it behooves us to write the smallest one we possibly can.


[முழு இடுகையைப் படிக்கவும்](https://dev.to/samthor/emscriptens-compiled-web-assembly-used-minimally-4fd4).

நான் எல்லோரும் நாகரீகத்தின் திறனைக் காண்கிறேன் என்று நினைக்கிறேன், பல வலைத் தளங்களில் இப்போது பல வலைப்பக்கங்களைப் பிடிக்க முடிந்திருக்கிறது, எங்களுக்கு வலைப்பக்கத்திற்கு முற்றிலும் மாறுபட்டுள்ளன, நாங்கள் உண்மையில் அந்த கருவிகளைக் கற்க வேண்டும், அவற்றின் டெவலப்பர் அனுபவத்தை மேம்படுத்த வேண்டும் மற்றும் imo முன்மொழியப்பட்ட நூலகங்கள் 'பாரம்பரிய வலை பிம்பங்கள்' பயன்படுத்தலாம்.
