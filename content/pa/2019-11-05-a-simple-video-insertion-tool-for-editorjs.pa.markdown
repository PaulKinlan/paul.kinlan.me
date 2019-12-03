---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

ਮੈਨੂੰ ਅਸਲ ਵਿੱਚ <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . ਇਹ ਮੈਨੂੰ ਮੇਰੇ ਸਥਿਰ ਹਿoਗੋ ਬਲੌਗ ਲਈ ਇੱਕ ਬਹੁਤ ਹੀ ਸਧਾਰਣ ਵੈੱਬ-ਹੋਸਟਡ ਇੰਟਰਫੇਸ ਬਣਾਉਣ ਦਿੰਦਾ ਹੈ.

ਐਡੀਟਰਜੇਐਸ ਕੋਲ ਬਹੁਤਾ ਉਹ ਹੁੰਦਾ ਹੈ ਜਿਸਦੀ ਮੈਨੂੰ ਇੱਕ ਸਧਾਰਣ ਬਲਾਕ-ਅਧਾਰਤ ਸੰਪਾਦਕ ਵਿੱਚ ਜ਼ਰੂਰਤ ਹੁੰਦੀ ਹੈ. ਇਸ ਵਿੱਚ ਸਿਰਲੇਖਾਂ, ਕੋਡ, ਅਤੇ ਹੋਸਟਿੰਗ infrastructureਾਂਚੇ ਦੀ ਜ਼ਰੂਰਤ ਤੋਂ ਬਿਨਾਂ ਸੰਪਾਦਕ ਵਿੱਚ ਚਿੱਤਰ ਜੋੜਨ ਦਾ ਇੱਕ ਸਧਾਰਣ forੰਗ ਲਈ ਇੱਕ ਪਲੱਗਇਨ ਹੈ. ਸੰਪਾਦਕ ਵਿੱਚ ਹੁਣ ਤਕ ਵੀਡੀਓ ਸ਼ਾਮਲ ਕਰਨ ਦਾ ਇਹ ਸਰਲ ਤਰੀਕਾ ਨਹੀਂ ਹੈ.

ਮੈਂ <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> ਪਲੱਗਇਨ ਰਿਪੋਜ਼ਟਰੀ ਲੈ ਲਈ ਅਤੇ ਇਸ ਨੂੰ (ਸਿਰਫ ਇੱਕ ਟੇਡ) ਬਦਲ ਕੇ ਇੱਕ <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ਪਲੱਗਇਨ ( <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ). ਹੁਣ ਮੈਂ ਇਸ ਬਲਾੱਗ ਵਿੱਚ ਅਸਾਨੀ ਨਾਲ ਵੀਡੀਓ ਸ਼ਾਮਲ ਕਰ ਸਕਦਾ ਹਾਂ.

ਜੇ ਤੁਸੀਂ ਐਡੀਟਰ ਜੇ ਐੱਸ ਨਾਲ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਹੋ, ਤਾਂ ਆਪਣੇ ਪ੍ਰੋਜੈਕਟਾਂ ਵਿਚ ਸ਼ਾਮਲ ਕਰਨਾ ਸੌਖਾ ਹੈ. ਹੇਠ ਦਿੱਤੇ ਅਨੁਸਾਰ ਇਸਨੂੰ ਸਥਾਪਤ ਕਰੋ

```
npm i simple-video-editorjs
```

ਅਤੇ ਫਿਰ ਇਸਨੂੰ ਆਪਣੇ ਪ੍ਰੋਜੈਕਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ ਜਿਵੇਂ ਤੁਸੀਂ ਫਿਟ ਦਿਖਾਈ ਦਿੰਦੇ ਹੋ.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

ਸੰਪਾਦਕ ਕੋਲ ਕੁਝ ਸਧਾਰਣ ਵਿਕਲਪ ਹਨ ਜੋ ਤੁਹਾਨੂੰ ਇਹ ਨਿਰਧਾਰਤ ਕਰਨ ਦਿੰਦੇ ਹਨ ਕਿ ਵੀਡੀਓ ਨੂੰ ਪੰਨੇ ਵਿੱਚ ਕਿਸ ਤਰ੍ਹਾਂ ਹੋਸਟ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ:

1. ਆਟੋਪਲੇ - ਪੇਜ ਲੋਡ ਹੋਣ &#39;ਤੇ ਵੀਡੀਓ ਆਪਣੇ ਆਪ ਚਲਾਏ ਜਾਣਗੇ
1. ਮਿutedਟ - ਕੀ ਵੀਡੀਓ ਨੂੰ ਡਿਫੌਲਟ ਰੂਪ ਵਿੱਚ ਆਵਾਜ਼ ਨਹੀਂ ਮਿਲੇਗੀ (ਆਟੋਪਲੇ ਲਈ ਲੋੜੀਂਦਾ ਹੈ)
1. ਨਿਯੰਤਰਣ - ਕੀ ਵੀਡੀਓ ਦੇ ਮੂਲ HTML ਨਿਯੰਤਰਣ ਹੋਣਗੇ.

ਹੇਠਾਂ ਇਕ ਵੀਡੀਓ ਦੀ ਇਕ ਤੇਜ਼ ਉਦਾਹਰਣ ਹੈ ਜੋ ਏਮਬੇਡ ਕੀਤੀ ਗਈ ਹੈ (ਅਤੇ ਕੁਝ ਵਿਕਲਪ ਦਿਖਾਉਂਦੀ ਹੈ).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

ਵੈਸੇ ਵੀ, ਮੈਨੂੰ ਇਸ ਛੋਟੀ ਜਿਹੀ ਪਲੱਗਇਨ ਨੂੰ ਬਣਾਉਣ ਵਿਚ ਮਜ਼ੇ ਆਇਆ - ਇਹ ਬਣਾਉਣਾ ਬਹੁਤ ਮੁਸ਼ਕਲ ਨਹੀਂ ਸੀ ਅਤੇ ਸਿਰਫ ਇਕੋ ਇਕ ਚੀਜ ਜੋ ਮੈਂ ਕੀਤੀ ਉਹ ਅਧਾਰ 64 ਵਿਚ ਤਬਦੀਲੀ ਨੂੰ ਮੁਲਤਵੀ ਕਰ ਰਿਹਾ ਸੀ ਜੋ ਸਰਲ ਚਿੱਤਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ ਅਤੇ ਇਸ ਦੀ ਬਜਾਏ ਸਿਰਫ ਬਲੌਬ ਯੂਆਰਐਲ ਦੀ ਵਰਤੋਂ ਕਰੋ.