---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### ਅਪਡੇਟ: 8 ਅਕਤੂਬਰ - ਇਸ ਡੌਕ ਨਾਲ ਮਹੱਤਵਪੂਰਨ ਮੁੱਦੇ.

ਮੈਂ ਇਸ ਪੋਸਟ ਬਾਰੇ [Jake Archibald](https://jakearchibald.com/) ਫੜ ਲਿਆ ਕਿਉਂਕਿ ਮੈਂ ਸੋਚਿਆ ਕਿ ਮੇਰੇ ਕੋਲ ਕੁਝ ਨਾਵਲ ਹੈ, ਗੱਲਬਾਤ ਦੌਰਾਨ ਅਸੀਂ ਬਹੁਤ ਸਾਰੀਆਂ ਚੀਜ਼ਾਂ ਦਾ ਪਰਦਾਫਾਸ਼ ਕੀਤਾ ਜੋ ਇਸ ਪੋਸਟ ਨੂੰ ਕੁਝ ਗਲਤ ਕਰ ਦਿੰਦੇ ਹਨ, ਅਤੇ ਮੈਂ ਇਸ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਬਹੁਤ ਕੁਝ ਵੀ ਸਿੱਖਿਆ ਹੈ ਜੋ ਮੈਨੂੰ ਨਹੀਂ ਲਗਦਾ ਕਿ ਜ਼ਿਆਦਾਤਰ ਵਿਕਾਸਕਾਰ ਪਤਾ ਹੈ.

* `.append()` ਅਤੇ `.appendChild()` ਨੂੰ ਕਾਲ `.append()` ਨੋਡ ਨੂੰ ਅਪਣਾਉਂਦਾ ਹੈ. ਇਹ ਇਸ ਉਦਾਹਰਣ ਵਿੱਚ `adoptNode` ਦੀ ਵਰਤੋਂ ਨੂੰ ਬੇਕਾਰ ਕਰ ਦਿੰਦਾ ਹੈ ਕਿਉਂਕਿ `adoptNode` ਐਲਗੋਰਿਦਮ ਇਹ ਸੁਨਿਸ਼ਚਿਤ ਕਰਦਾ ਹੈ ਕਿ ਨੋਡ ਅਪਣਾਇਆ ਗਿਆ ਹੈ. ਇਸ ਦਾ ਜ਼ਿਕਰ ਐਮਡੀਐਨ ਡੌਕਸ ਵਿੱਚ ਨਹੀਂ ਕੀਤਾ ਗਿਆ ਸੀ, ਪਰ ਇਹ [spec](https://dom.spec.whatwg.org/#concept-node-append) . ਮੈਨੂੰ ਵਾਪਸ ਜਾਣ ਅਤੇ ਕਸਰਤ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਹੈ ਕਿ ਪਹਿਲਾਂ ਮੈਨੂੰ ਕੋਈ ਮੁੱਦਾ ਕਿਉਂ ਹੋਇਆ ਸੀ, ਪਰ ਮੈਨੂੰ ਸ਼ੱਕ ਹੈ ਕਿ ਇਹ ਇਸ ਲਈ ਸੀ ਕਿਉਂਕਿ ਮੈਂ ਸਧਾਰਣ ਤੌਰ &#39;ਤੇ ਇੱਕ `DocumentFragment` ਨੂੰ ਜੋੜਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰ ਰਿਹਾ ਸੀ. ਇਸਦਾ ਅਰਥ ਹੈ ਕਿ `w.document.body.appendChild(document.adoptNode(airhornerIframe));` ਅਤੇ `w.document.body.appendChild(airhornerIframe);` `w.document.body.appendChild(document.adoptNode(airhornerIframe));` ਦੋਵਾਂ ਦਾ ਸਮਾਨ ਪ੍ਰਭਾਵ ਹੋਵੇਗਾ.
* ਜਦ ਕਿ ਡੋਮ ਐਲੀਮੈਂਟਸ ਆਪਣਾ ਰਾਜ ਰੱਖ ਸਕਦੇ ਹਨ (ਕਸਟਮ ਐਲੀਮੈਂਟ ਦੀ ਜਾਂਚ ਕਰੋ), ਜੇ ਇੱਕ ਆਈਫਰੇਮ ਡੋਮ ਵਿੱਚ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ ਤਾਂ ਇਹ ਮੁੜ ਲੋਡ ਕੀਤਾ ਜਾਂਦਾ ਹੈ. ਪੀਰੀਅਡ. ਇਸਦਾ ਅਰਥ ਹੈ ਕਿ ਇਸ ਨੂੰ ਇਫਰੇਮੇਸ ਦੇ ਵਿਚਕਾਰ ਹਿਲਾਉਣਾ ਰਾਜ ਨੂੰ ਨਹੀਂ ਰੱਖੇਗਾ ਜਿਵੇਂ ਕਿ ਮੈਂ ਅਸਲ ਵਿੱਚ ਟੈਸਟ ਕੀਤਾ ਸੀ, ਮੇਰਾ ਮੰਨਣਾ ਹੈ ਕਿ ਇਹ ਇਸ ਤੱਥ ਦੇ ਕਾਰਨ ਹੋਇਆ ਸੀ ਕਿ ਐਸਡਬਲਯੂ ਨੇ ਪੇਜ ਨੂੰ ਅਚਾਨਕ ਤੇਜ਼ੀ ਨਾਲ ਲੋਡ ਕੀਤਾ. ਪੋਰਟਲਜ਼ ਏਪੀਆਈ ਸ਼ਾਇਦ ਇਸ ਨਾਲ ਪ੍ਰਭਾਵਤ ਨਾ ਹੋਵੇ - ਇਸ ਲਈ ਭਵਿੱਖ ਵਿੱਚ ਇਹ ਤਜਰਬਾ ਕੰਮ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ :)

ਦਸਤਾਵੇਜ਼ਾਂ ਦਰਮਿਆਨ ਮੂਵਿੰਗ ਐਲੀਮੈਂਟਸ ਦੀ ਧਾਰਣਾ ਅਜੇ ਵੀ ਜਾਇਜ਼ ਅਤੇ ਦਿਲਚਸਪ ਹੈ, ਪਰ iframes ਦਾ ਲਾਭ ਉਥੇ ਨਹੀਂ ਹੈ. ਮੈਂ ਦੇਖਿਆ ਹੈ ਕਿ ਵਿੰਡੋਜ਼ ਦੇ ਵਿਚਕਾਰ ਮੂਵ ਕਰਨ ਵੇਲੇ ਵੀਡੀਓ ਤੱਤ ਰੀਸੈਟ ਹੋ ਗਏ ਸਨ ਅਤੇ ਮੈਨੂੰ ਵਧੇਰੇ ਮਿਹਨਤੀ ਹੋਣਾ ਚਾਹੀਦਾ ਸੀ ਜੇ ਆਈਫਰੇਮ ਅਸਲ ਵਿੱਚ ਇਸਦੀ ਸਥਿਤੀ ਨੂੰ ਰੀਸੈਟ ਨਹੀਂ ਕਰਦਾ.

ਹਮੇਸ਼ਾਂ ਵਾਂਗ, ਤੁਸੀਂ [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) ਨੂੰ ਵੇਖ ਸਕਦੇ ਹੋ.

### ਅਸਲ ਪੋਸਟ ਜਦੋਂ ਮੈਂ 2010 ਵਿਚ ਗੂਗਲ ਵਿਚ ਸ਼ਾਮਲ ਹੋਇਆ ਸੀ ਤਾਂ ਮੈਂ ਇਕ ਦਸਤਾਵੇਜ਼ ਵਿਚ [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) ਜਿਸ ਵਿਚ ਜੀ-ਮੇਲ ਵਿਚ &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39; ਕਹਿੰਦੇ ਇਕ ਸੰਕਲਪ ਦਾ ਜ਼ਿਕਰ ਕੀਤਾ ਗਿਆ, ਇਸਦਾ ਠੰਡਾ ਨਾਮ ਸੀ ਅਤੇ ਸੰਕਲਪ ਨਾਵਲ ਸੀ.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

ਸੰਕਲਪ ਇਹ ਹੈ ਕਿ ਬਹੁਤ ਸਾਰੀਆਂ ਐਪਲੀਕੇਸ਼ਨਾਂ ਨੂੰ ਇੱਕ ਛੋਟੇ ਜਿਹੇ ਹਿੱਸੇ ਲਈ ਵੀ ਜੀਮੇਲ ਵਿੱਚ ਬਹੁਤ ਸਾਰੇ ਗੁੰਝਲਦਾਰ ਜਾਵਾ ਸਕ੍ਰਿਪਟ ਨੂੰ ਲੋਡ ਕਰਨਾ ਪੈਂਦਾ ਹੈ, ਤੁਹਾਡੇ ਕੋਲ ਐਪਲੀਕੇਸ਼ਨ ਦੇ ਭਾਗ ਇੱਕ `iframe` ਵਿੱਚ ਲੋਡ ਹੋ ਸਕਦੇ ਹਨ ਜਿਸ ਨਾਲ ਉਪਭੋਗਤਾ ਮੁੱਖ ਵਿੰਡੋ ਵਿੱਚ ਇੰਟਰੈਕਟ ਕਰ ਸਕਦਾ ਹੈ, ਜਦੋਂ ਤੁਸੀਂ &#39;ਅੱਥਰੂ&#39; ਹੋ ਸਕਦੇ ਹੋ ਅਤੇ ਇੱਕ ਨਵੀਂ ਵਿੰਡੋ ਵਿੱਚ ਜਾ ਸਕਦੇ ਹੋ ਜਦੋਂ ਉਪਯੋਗਤਾ &#39;ਨਵੀਂ ਵਿੰਡੋ ਵਿੱਚ ਲਿਖੋ&#39; ਬਟਨ ਨੂੰ ਦਬਾਉਂਦੀ ਹੈ. ਮੈਨੂੰ ਲੇਖਕ ਨਾਲ ਗੱਲ ਕਰਨ ਦਾ ਪੂਰਾ ਭਰੋਸਾ ਨਹੀਂ ਸੀ (ਅਤੇ ਮੈਂ ਅਜੇ ਵੀ ਨਹੀਂ ਵੇਖਿਆ, ਨਾ ਹੀ ਮੈਂ ਜੀਮੇਲ ਲਈ ਸਰੋਤ ਵੱਲ ਵੇਖਿਆ ਹੈ ਕਿ ਇਹ ਅਸਲ ਵਿਚ ਵਰਤਿਆ ਗਿਆ ਸੀ ਜਾਂ ਨਹੀਂ) ਪਰ ਇਹ ਮੇਰੇ ਦਿਮਾਗ ਵਿਚ ਜ਼ਿਆਦਾਤਰ ਇਸ ਲਈ ਨਹੀਂ ਰਿਹਾ ਕਿਉਂਕਿ ਇਹ ਨਾਮ ਗੁਪਤ ਸੀ. .

ਹੌਪ 10 ਸਾਲ ਅੱਗੇ ਹੈ ਅਤੇ ਮੈਂ ਇਕ ਲੰਬੀ ਰੇਲ ਗੱਡੀ ਵਿਚ ਸਵਾਰ ਸੀ ਅਤੇ ਮੈਂ ਉਸ ਖੇਤਰ ਦੀ ਪੜਤਾਲ ਕਰਨੀ ਸ਼ੁਰੂ ਕੀਤੀ ਸੀ ਜਿਸ ਨੂੰ ਮੈਂ `adoptNode` API ਬਾਰੇ ਜ਼ਿਆਦਾ ਨਹੀਂ ਜਾਣਦਾ. ਮੈਂ ਇੱਕ [lot of ideas](https://nifty-meadowlark.glitch.me/) ਨਾਲ ਖੇਡਿਆ ਅਤੇ ਮੈਨੂੰ ਅਹਿਸਾਸ ਹੋਇਆ ਕਿ DOM ਤੱਤ, ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਸਥਿਤੀ ਅਤੇ ਉਨ੍ਹਾਂ ਨਾਲ ਜੁੜੇ ਇਵੈਂਟ ਹੈਂਡਲਰਾਂ ਨੂੰ ਨਵੀਂ ਵਿੰਡੋਜ਼ ਵਿੱਚ ਲਿਜਾਣਾ ਸੰਭਵ ਹੈ. ਇਹ ਮੈਨੂੰ &#39;ਮੈਜਿਕ ਇਫਰੇਮੇਸ&#39; ਦੀ ਯਾਦ ਦਿਵਾਉਂਦਾ ਹੈ ਅਤੇ ਆਖਰਕਾਰ ਇਸ ਵਿਚਾਰ ਵੱਲ ਜਾਂਦਾ ਹੈ ਕਿ ਤੁਸੀਂ ਪੌਪ-ਆਉਟ iframe ਬਣਾ ਸਕਦੇ ਹੋ (ਪੌਪ-ਆਉਟ iframe ਪਿਕਚਰ ਵੀਡੀਓ ਵਿਚ ਪਿਕਚਰ ਹੈ ਪਰ iframe ਤੱਤਾਂ ਲਈ)

ਪੌਪ-ਆਉਟ iframe ਲਈ ਕੋਡ ਬਹੁਤ ਅਸਾਨ ਹੈ:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` ਤੁਹਾਨੂੰ ਆਪਣੇ ਮੌਜੂਦਾ ਬੌਂਡ ਇਵੈਂਟ ਹੈਂਡਲਰਾਂ ਨੂੰ ਬਰਕਰਾਰ ਰੱਖਣ ਦੌਰਾਨ, ਡੋਮ ਦੇ ਤੱਤ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਮੌਜੂਦਾ ਸਥਿਤੀ ਦੇ ਨਾਲ ਜਾਣ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ, `adoptNode` ਵਿਚਲੇ ਦਸਤਾਵੇਜ਼ਾਂ ਵਿਚਕਾਰ - ਜੋ ਮੌਜੂਦਾ ਵਿੰਡੋ ਦੇ ਅੰਦਰ ਇਕ ਨਵਾਂ ਡੀਓਐਮ ਹੋ ਸਕਦਾ ਹੈ, ਜਾਂ ਜਿਵੇਂ ਕਿ ਇਸ ਡੈਮੋ ਦੀ ਸਥਿਤੀ ਵਿਚ ਇਹ ਪਹਿਲਾਂ ਹੀ ਚਲਦੀ ਜਾ ਸਕਦੀ ਹੈ. ਉਸੇ ਹੀ ਮੂਲ &#39;ਤੇ ਹੈ, ਜੋ ਕਿ ਇੱਕ ਹੋਰ ਵਿੰਡੋ ਵਿੱਚ `iframe` ਲੋਡ ਕੀਤਾ. (ਉੱਪਰ ਅਪਡੇਟ ਵੇਖੋ).

ਇੱਕ ਇਫਰੇਮ ਭੇਜਣਾ ਦਿਲਚਸਪ ਹੈ ਕਿਉਂਕਿ ਇਸਦਾ ਮਤਲਬ ਹੈ ਕਿ ਤੁਹਾਨੂੰ ਇਫਰੇਮ ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਮੁੜ ਚਾਲੂ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਨਹੀਂ ਹੈ, ਉਦਾਹਰਣ ਹੁਣੇ ਹੀ ਮੂਵ ਕੀਤਾ ਗਿਆ ਹੈ. ਇੱਥੇ ਕੁਝ ਉਤਾਰ ਚੜ੍ਹਾਅ ਹਨ:

1. ਯੂਆਰਐਲ ਮੌਜੂਦਾ ਮੂਲ &#39;ਤੇ ਰਹਿੰਦਾ ਹੈ ਨਾ ਕਿ ਇਫਰੇਮ ਮੂਲ&#39; ਤੇ, ਹਾਲਾਂਕਿ ਇਹ ਕੁਝ ਅਜਿਹਾ ਹੋ ਸਕਦਾ ਹੈ ਜਿਸ ਨੂੰ `<portal>` ਏਪੀਏ ਹੱਲ ਕਰ ਸਕਦਾ ਹੈ.
2. ਜੇ ਤੁਸੀਂ ਇੱਕ ਕਸਟਮ ਤੱਤ, ਜਾਂ ਕੁਝ ਅਜਿਹਾ ਖੋਲ੍ਹ ਰਹੇ ਹੋ ਜਿਸਦਾ ਖੁੱਲਾ ਓਪਨਰ &#39;ਤੇ ਮੇਜ਼ਬਾਨੀ ਹੈ - ਜੇ ਤੁਸੀਂ ਓਪਨਰ ਨੂੰ ਬੰਦ ਕਰਦੇ ਹੋ, ਤਾਂ ਚੱਲਣਾ ਬੰਦ ਹੋ ਜਾਵੇਗਾ.

ਨੁਕਸਾਨ ਨੂੰ ਇਕ ਪਾਸੇ ਕਰਦਿਆਂ, ਮੈਂ ਸੋਚਿਆ ਕਿ ਇਹ ਡੋਮ ਪੱਧਰ ਦਾ ਆਈਪੀਸੀ ਵਿਧੀ ਬਹੁਤ ਦਿਲਚਸਪ ਸੀ. ਦੇ ਨਾਲ ਇੱਕ ਖੇਡ ਹੈ [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) ਅਤੇ ਮੈਨੂੰ ਪਤਾ ਹੈ, ਜੇ ਤੁਹਾਨੂੰ, ਜਿੱਥੇ ਇਸ ਨੂੰ ਵਰਤਿਆ ਜਾ ਸਕਦਾ ਹੈ ਦੇ ਲਈ ਕਿਸੇ ਵੀ ਦਿਲਚਸਪ ਵਿਚਾਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ.

