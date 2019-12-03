---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

ਮੇਰਾ ਬਲਾੱਗ ਇਕ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਥਿਰ ਸਾਈਟ ਹੈ ਜੋ ਕਿ ਹਿoਗੋ ਨਾਲ ਬਣਾਈ ਗਈ ਹੈ ਅਤੇ ਜ਼ੀਟ ਨਾਲ ਮੇਜ਼ਬਾਨੀ ਕੀਤੀ ਗਈ ਹੈ. ਇਹ ਮੇਰੇ ਲਈ ਇੱਕ ਵਧੀਆ ਹੱਲ ਹੈ, ਇੱਕ ਸਧਾਰਣ ਬਲਾੱਗ ਵਿੱਚ ਇੱਕ ਬਹੁਤ ਹੀ ਸਧਾਰਣ ਤੈਨਾਤੀ ਪ੍ਰਕਿਰਿਆ ਹੁੰਦੀ ਹੈ ਅਤੇ ਇਹ ਬਹੁਤ ਹੀ ਤੇਜ਼ੀ ਨਾਲ ਲੋਡ ਹੁੰਦਾ ਹੈ.

ਸਟੈਟਿਕਲੀ ਤਿਆਰ ਕੀਤੀਆਂ ਸਾਈਟਾਂ ਵਿੱਚ ਕੁਝ ਕਮੀਆਂ ਹੁੰਦੀਆਂ ਹਨ, ਸਭ ਤੋਂ ਵੱਡੀ ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਤੁਹਾਨੂੰ ਆਪਣੇ ਪੰਨੇ ਵਿੱਚ ਏਕੀਕ੍ਰਿਤ ਕਰਨ ਲਈ ਕਿਸੇ ਗਤੀਸ਼ੀਲ ਚੀਜ਼ ਦੀ ਜ਼ਰੂਰਤ ਹੁੰਦੀ ਹੈ (ਉਦਾਹਰਣ ਲਈ ਟਿੱਪਣੀਆਂ). ਗਤੀਸ਼ੀਲ ਸਮੱਗਰੀ ਨੂੰ ਅਸਾਨੀ ਨਾਲ ਮੇਜ਼ਬਾਨੀ ਕਰਨ ਦੇ ਯੋਗ ਨਾ ਹੋਣ ਦਾ ਅਰਥ ਇਹ ਹੈ ਕਿ ਤੁਸੀਂ ਤੀਜੀ ਧਿਰ ਜਾਵਾ ਸਕ੍ਰਿਪਟ &#39;ਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹੋ ਜੋ ਤੁਹਾਡੇ ਪੇਜ ਤੇ ਪੂਰੀ ਪਹੁੰਚ ਪ੍ਰਾਪਤ ਕਰੇਗਾ ਅਤੇ ਤੁਹਾਨੂੰ ਨਹੀਂ ਪਤਾ ਹੋਵੇਗਾ ਕਿ ਇਹ ਕੀ ਕਰ ਰਿਹਾ ਹੈ - ਇਹ ਤੁਹਾਡੇ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਟਰੈਕ ਕਰ ਰਿਹਾ ਹੈ ਜਾਂ ਤੁਹਾਡੇ ਪੇਜ ਨੂੰ ਹੌਲੀ ਕਰ ਸਕਦਾ ਹੈ. ਲੋਡ.

ਮੈਂ ਹਾਲ ਹੀ ਵਿੱਚ ਆਪਣੇ ਮੌਜੂਦਾ ਟਿੱਪਣੀ ਵਿਦਜੈਟ (ਡਿਸਕੁਸ) ਨੂੰ ਸਿਰਫ ਲੋਡ ਕਰਕੇ ਨਾਜ਼ੁਕ ਰੈਂਡਰ ਮਾਰਗ ਤੋਂ ਹਟਾ ਲਿਆ ਹੈ ਜਦੋਂ ਉਪਯੋਗਕਰਤਾ `IntersectionObserver` ( `IntersectionObserver` ਵਰਤੋਂ `IntersectionObserver` ) ਅਤੇ ਜਦੋਂ ਇਹ ਲੋਡ ਪ੍ਰਦਰਸ਼ਨ ਅਤੇ ਟਰੈਕਿੰਗ ਸਮੱਸਿਆਵਾਂ ਦਾ ਵਾਜਬ ਹੱਲ ਸੀ, ਮੈਂ ਅਸਲ ਵਿੱਚ ਹਟਾਉਣਾ ਚਾਹੁੰਦਾ ਸੀ ਡਿਸਕੁਸ ਸਾਰੇ ਇਕੱਠੇ.

<a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> ਸਪੀਕ ਦਰਜ <a <span class="notranslate">href=&quot;https://webmention.net/draft/&quot; &gt;Webmention</a> . ਵੈਬਮੈਨਸ਼ਨ ਇੱਕ ਨਿਰਧਾਰਨ ਹੈ ਜੋ ਦੱਸਦੀ ਹੈ ਕਿ ਕਿਵੇਂ ਇੱਕ ਸਾਈਟ ਲੇਖਕ ਨਾਲ ਸੰਪਰਕ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ ਜਦੋਂ ਕੋਈ ਹੋਰ ਸਾਈਟ ਤੁਹਾਡੀ ਸਾਈਟ ਤੇ ਸਮੱਗਰੀ ਦਾ &#39;ਜ਼ਿਕਰ&#39; ਕਰਦਾ ਹੈ (ਜਾਂ ਪਸੰਦ ਕਰਦਾ ਹੈ). ਇਹ ਆਖਰਕਾਰ ਸਮਗਰੀ ਦੀ ਖੋਜ ਕਰਨ ਲਈ ਵਿਕੇਂਦਰੀਕਰਣ methodੰਗ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ ਜੋ ਤੁਹਾਡੀ ਸਾਈਟ ਨਾਲ ਲਿੰਕ ਕਰਦਾ ਹੈ, ਉਮੀਦ ਹੈ ਕਿ ਮੁੱਲ ਅਤੇ ਸਮਝ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ.

ਵੈਬਮੈਨਸ਼ਨ ਸਪੀਕ ਕੋਈ ਵੀ ਡੇਟਾ ਫਾਰਮੈਟ ਨਹੀਂ ਦਰਸਾਉਂਦਾ ਜਿਸਦੀ ਵਰਤੋਂ &#39;ਜ਼ਿਕਰ ਕਰਨ ਵਾਲੀ ਸਾਈਟ&#39; ਨੇ ਕੀ ਕਿਹਾ ਹੈ, ਜੋ ਕਿ ਤੁਹਾਨੂੰ ਪੰਨੇ ਦੀ ਸਮਗਰੀ ਨੂੰ ਸਮਝਣ ਲਈ ਸਟੈਂਡਰਡ ਮਾਈਕ੍ਰੋਫੋਰਮੇਟ ਜਾਂ ਹੋਰ ismsਾਂਚੇ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪਾਰਸ ਕਰਨ ਲਈ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ. ਇਹ ਬਹੁਤ ਵਧੀਆ ਹੈ, ਹਾਲਾਂਕਿ ਮੇਰਾ ਮੰਨਣਾ ਹੈ ਕਿ ਇਹ ਕੇਂਦਰੀ ਸੇਵਾਵਾਂ ਜਿਵੇਂ ਕਿ <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> ਨੂੰ ਪੇਜ ਤੋਂ ਅਰਥ <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> ਲਈ ਲੋੜੀਂਦਾ ਬੁਨਿਆਦੀ infrastructure <a <span class="notranslate">href=&quot;https://webmention.io/&quot; &gt;webmention.io</a> ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ.

ਮੈਨੂੰ ਵੈਬਮੈਨਸ਼ਨ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦਾ ਵਿਚਾਰ ਪਸੰਦ ਸੀ, ਪਰੰਤੂ ਜਦੋਂ ਕੋਈ ਤੁਹਾਡੀ ਸਾਈਟ ਦਾ ਜ਼ਿਕਰ ਕਰਦਾ ਹੈ ਤਾਂ ਇਸਦੀ ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ (ਅਤੇ ਸੰਭਾਵਤ ਤੌਰ ਤੇ ਸਟੋਰ ਕਰਨਾ) ਸਰਵਰ ਸਾਈਡ ਸੈਟਅਪ ਦੀ ਜ਼ਰੂਰਤ ਹੁੰਦੀ ਹੈ, ਇਹ ਸਥਿਰ ਨਿਰਮਾਤਾ ਨਾਲ ਹਮੇਸ਼ਾ ਸੰਭਵ ਨਹੀਂ ਹੁੰਦਾ ਜਿਵੇਂ ਮੇਰੀ ਸਾਈਟ ਤੇ ਹੈ. ਬਾਕੀ ਦੀ ਇਹ ਪੋਸਟ ਤੇਜ਼ੀ ਨਾਲ ਵਰਣਨ ਕਰੇਗੀ ਕਿ ਕਿਵੇਂ ਮੇਰੀ ਜ਼ੀਟ ਹੋਸਟ ਕੀਤੀ ਗਈ ਹਿugਗੋ ਬਿਲਡ &#39;ਤੇ ਮੇਜ਼ਬਾਨੀ ਕੀਤੀ ਗਈ, ਪਸੰਦ ਕੀਤੀ ਗਈ ਅਤੇ ਜ਼ਿਕਰ ਕੀਤੀਆਂ ਪੋਸਟਾਂ ਕਿਵੇਂ ਮਿਲੀਆਂ.

### ਕਦਮ - ਇੱਕ ਵੈਬਮੈਨਸ਼ਨ ਹੱਬ ਲੱਭੋ

ਮੈਨੂੰ ਵੈੱਬਮੇਨਸ਼ਨ.ਆਈਓ ਮਿਲਿਆ ਅਤੇ ਇਹ ਚਾਲ ਚਲਦੀ ਹੈ. ਇਹ ਆਉਣ ਵਾਲੀਆਂ ਪਿੰਗਬੈਕਸ ਨੂੰ ਸੰਕੇਤ ਕਰਦਾ ਹੈ ਅਤੇ ਜ਼ਿਕਰ ਕਰਦਾ ਹੈ, ਇਹ ਵੀ ਪ੍ਰਮਾਣਿਤ ਕਰੇਗਾ ਕਿ ਬੁਲਾਉਣ ਵਾਲੀ ਸਾਈਟ ਅਸਲ ਵਿੱਚ ਤੁਹਾਡੀ ਸਮਗਰੀ ਨੂੰ ਜੋੜ ਰਹੀ ਹੈ ਅਤੇ ਅੰਤ ਵਿੱਚ ਇਹ ਪੇਜ ਦੇ ਡੇਟਾ ਨੂੰ ਪਾਰਸ ਕਰੇਗੀ ਤਾਂ ਜੋ ਤੁਹਾਨੂੰ ਪ੍ਰਸੰਗ ਦੀ ਕੁਝ ਸਮਝ ਹੋਏ.

Webmention.io ਪ੍ਰਮਾਣਿਤ ਕਰੇਗਾ ਕਿ ਤੁਸੀਂ ਇੱਕ ਓਪਨ ਪ੍ਰਮਾਣੀਕਰਣ ਪ੍ਰਕਿਰਿਆ ਦੇ ਦੁਆਰਾ ਸਾਈਟ ਦੇ ਮਾਲਕ ਹੋ (ਇਹ ਸਾਫ ਸੀ ਕਿ ਇਹ rel = ਮੈਨੂੰ ਲੱਗਦਾ ਹੈ ਜੋ ਕਿਸੇ ਲੇਖਕ ਪ੍ਰਦਾਤਾ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦਾ ਹੈ)

### ਕਦਮ ਦੋ - ਉਹ ਪੰਨੇ ਦੱਸੋ ਜੋ ਤੁਸੀਂ ਜ਼ਿਕਰ ਕਰ ਸਕਦੇ ਹੋ

ਇਹ ਓਨਾ ਹੀ ਅਸਾਨ ਹੈ ਜਿੰਨੇ ਦੋ ਹੇਠਾਂ ਦਿੱਤੇ `link` ਟੈਗ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### ਕਦਮ ਤਿੰਨ - ਆਪਣੀ ਸਾਈਟ ਵਿੱਚ ਵੈਬਮੇਨਸ਼ਨ.ਆਈਓ ਏਕੀਕਰਣ ਨੂੰ ਏਕੀਕ੍ਰਿਤ ਕਰੋ

ਤੁਹਾਡੇ ਕੋਲ ਇੱਥੇ ਦੋ ਵਿਕਲਪ ਹਨ, ਤੁਸੀਂ ਆਪਣੇ ਪੰਨੇ &#39;ਤੇ ਇਕ ਵਿਜੇਟ ਸ਼ਾਮਲ ਕਰ ਸਕਦੇ ਹੋ ਜੋ ਵੈਬਮੇਨਸ਼ਨ.ਆਈਓ ਏਪੀਆਈ ਨੂੰ ਕਾਲ ਕਰੇਗੀ, ਜਾਂ ਤੁਸੀਂ ਆਪਣੇ ਬਿਲਡ ਸਟੈਪ ਵਿਚ ਵੈਬਮੇਨਸ਼ਨ.ਆਈਓ ਏਪੀਆਈ ਨੂੰ ਏਕੀਕ੍ਰਿਤ ਕਰ ਸਕਦੇ ਹੋ. ਮੈਂ ਚਾਹਾਂਗਾ ਕਿ ਜਿੰਨੀ ਸੰਭਵ ਹੋ ਸਕੇ ਬਹੁਤ ਘੱਟ ਤੀਜੀ ਪਾਰਟੀ ਜੇ ਐਸ ਦੀ ਮੇਜ਼ਬਾਨੀ ਕਰੇ, ਇਸ ਲਈ ਮੈਂ ਬਾਅਦ ਦੀ ਚੋਣ ਕੀਤੀ. ਮੈਂ ਆਪਣੀ ਤੈਨਾਤੀ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਵੈਬਮੇਂਸੰਸ ਨੂੰ ਏਕੀਕ੍ਰਿਤ ਕੀਤਾ.

ਮੈਂ ਹਿugਗੋ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹਾਂ ਕਿਉਂਕਿ ਬਿਲਡ ਤੇਜ਼ ਹੈ, ਅਤੇ ਇਸ ਨੂੰ ਧਿਆਨ ਵਿਚ ਰੱਖਦੇ ਹੋਏ, ਮੈਨੂੰ ਕੰਮ ਕਰਨ ਦੀ ਲੋੜ ਸੀ ਕਿ ਵੈਬਮੈਨਸ਼ਨ ਏਪੀਆਈ ਨੂੰ ਹੁਗੋ ਵਿਚ ਇਕ ਅਨੁਕੂਲ inੰਗ ਨਾਲ ਕਿਵੇਂ ਜੋੜਿਆ ਜਾਏ. ਮੇਰੀ ਸਾਈਟ ਦੇ ਹਰ ਪੰਨੇ ਲਈ ਏਪੀਆਈ ਐਂਡ ਪੁਆਇੰਟ ਨੂੰ ਕਾਲ ਨਾ ਕਰਨਾ ਮੁਸ਼ਕਲ ਸੀ, ਮੇਰੇ ਕੋਲ ਬਹੁਤ ਸਾਰੇ ਪੰਨੇ ਹਨ, ਅਤੇ ਅਜੇ ਵੀ ਬਹੁਤ ਸਾਰੀਆਂ ਟਿੱਪਣੀਆਂ ਨਹੀਂ ਹਨ.

ਖੁਸ਼ਕਿਸਮਤੀ ਨਾਲ Webmention.io ਸਾਈਟ ਇੱਕ ਸੌਖੀ ਅੰਤਮ ਪੁਆਇੰਟ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ ਤੁਹਾਨੂੰ ਤੁਹਾਡੇ ਡੋਮੇਨ ਲਈ ਸਾਰੇ ਜ਼ਿਕਰ ਪ੍ਰਾਪਤ ਕਰਨ ਦੇਵੇਗੀ. ਬਦਕਿਸਮਤੀ ਵਾਲੀ ਗੱਲ ਇਹ ਹੈ ਕਿ ਇਸ ਫਾਈਲ ਵਿਚ ਹਰ ਕਾਰਵਾਈ ਲਈ ਇਕ ਪ੍ਰਵੇਸ਼ ਹੈ ਜੋ ਤੁਹਾਡੀ ਸਾਈਟ ਦੇ ਵਿਰੁੱਧ ਕੀਤਾ ਗਿਆ ਹੈ.

ਹਿugਗੋ ਕੋਲ ਡੇਟਾ ਫਾਈਲਾਂ ਦੀ ਧਾਰਨਾ ਵੀ ਹੈ ਜੋ ਕਿਸੇ ਵੀ ਪੰਨੇ ਲਈ ਸਿੱਧੇ ਤੌਰ &#39;ਤੇ ਨਮੂਨੇ ਵਿਚ ਖਿੱਚੀ ਜਾ ਸਕਦੀ ਹੈ, ਇਸ ਲਈ ਤੁਹਾਨੂੰ ਵੈਬਮੈਨਸ਼ਨ ਡੇਟਾ ਫਾਈਲ ਨੂੰ ਇਕ ਨਵੇਂ structureਾਂਚੇ&#39; ਤੇ ਮੈਪ ਕਰਨਾ ਪਏਗਾ ਜਿਸ ਨਾਲ ਹਿugਗੋ ਟੈਂਪਲੇਟ ਵਿਚ ਪੜ੍ਹਨਾ ਸੌਖਾ ਹੋ ਗਿਆ ਹੈ.

ਪ੍ਰਕਿਰਿਆ ਜੋ ਮੈਂ ਚੁਣੀ ਹੈ ਹੇਠਾਂ ਹੈ, ਪਰ ਸੰਖੇਪ ਇਹ ਹੈ ਕਿ ਮੈਂ ਐਰੇ ਨੂੰ ਕ੍ਰਿਆ ਦੀ ਸੂਚੀ ਤੋਂ ਯੂਆਰਐਲ ਦੇ ਸ਼ਬਦਕੋਸ਼ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹਾਂ ਜਿਸ ਵਿੱਚ ਹਰ ਇੱਕ ਦੁਆਰਾ ਐਕਸਪ੍ਰੈਸ ਕੀਤੀਆਂ ਕਿਰਿਆਵਾਂ ਹੁੰਦੀਆਂ ਹਨ (ਜਿਵੇਂ, ਦੁਬਾਰਾ ਭੇਜੋ ਅਤੇ ਜਵਾਬ ਦਿਓ), ਅਤੇ ਫਿਰ ਅੰਤਮ ਕਦਮ URL ਦੇ ਸ਼ਬਦਕੋਸ਼ ਨੂੰ ਵੱਖਰੀਆਂ ਫਾਈਲਾਂ ਵਿੱਚ ਵੰਡੋ ਜੋ url ਦੇ md5 ਹੈਸ਼ ਦੇ ਨਾਮ ਨਾਲ ਹਨ.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

ਇਕ ਵਾਰ ਡੇਟਾ ਨੂੰ ਪਾਰਸ ਕਰਨ ਅਤੇ ਸਹੀ savedੰਗ ਨਾਲ ਸੁਰੱਖਿਅਤ ਕਰਨ ਤੋਂ ਬਾਅਦ, ਇਹ ਨਮੂਨਾ ਸਥਾਪਤ ਕਰਨ ਦੀ ਇਕ ਤੇਜ਼ ਪ੍ਰਕਿਰਿਆ ਹੈ ਤਾਂ ਜੋ ਇਸ ਨੂੰ ਨਮੂਨੇ ਦੇ ਡੇਟਾ ਗੁਣਾਂ ਵਿਚ ਪੜ੍ਹਿਆ ਜਾ ਸਕੇ.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

ਜੇ ਸਭ ਕੁਝ ਠੀਕ ਹੋ ਰਿਹਾ ਹੈ, ਤੁਹਾਨੂੰ ਪੰਨੇ ਦੇ ਹੇਠਾਂ ਕੁਝ ਆਈਕਾਨ ਵੇਖਣੇ ਚਾਹੀਦੇ ਹਨ ਜੋ ਸਾਈਟ ਨਾਲ ਗੱਲਬਾਤ ਕਰਨ ਵਾਲੇ ਅਸਲ ਲੋਕ ਹਨ.

### ਕਦਮ 4 - ਟਿੱਪਣੀਆਂ ਹੋਣ ਤੇ ਸਾਈਟ ਪ੍ਰਕਾਸ਼ਤ ਕਰੋ

ਜਦੋਂ ਕਿ ਉਪਰੋਕਤ ਕਦਮ ਮੈਨੂੰ ਜ਼ਿਕਰ ਨੂੰ ਇਕੱਤਰ ਕਰਨ ਅਤੇ ਉਨ੍ਹਾਂ ਨੂੰ ਸਾਈਟਾਂ ਦੇ ਆਉਟਪੁੱਟ ਵਿੱਚ ਪੇਸ਼ ਕਰਨ ਦੇਵੇਗਾ, ਮੈਨੂੰ ਅਜੇ ਵੀ ਇਹ ਨਿਸ਼ਚਤ ਕਰਨਾ ਪਏਗਾ ਕਿ ਸਾਈਟ ਨੂੰ ਨਿਯਮਤ ਰੂਪ ਵਿੱਚ ਦੁਬਾਰਾ ਬਣਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਟਿੱਪਣੀਆਂ ਜਨਤਕ ਤੌਰ ਤੇ ਪ੍ਰਦਰਸ਼ਤ ਹੋਣ.

ਮੈਂ ਇਕ ਸਧਾਰਣ ਕਰੋਨ ਸੇਵਾ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਚੋਣ ਕੀਤੀ ਜੋ ਜ਼ੀਟ ਦੀ ਤੈਨਾਤੀ ਏਪੀਆਈ ਨੂੰ ਹਰ ਘੰਟੇ ਜਾਂ ਇਸ ਤੋਂ ਬਾਅਦ ਸਾਈਟ ਦੀ ਮੁੜ-ਡੀਪੋਲੀ ਕਰਨ ਲਈ ਮਜਬੂਰ ਕਰੇਗੀ.
