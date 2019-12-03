---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
ਗੂਗਲ ਆਈਓ ਦੇ ਬਾਅਦ ਮੇਰੇ ਕੋਲ ਥੋੜਾ ਜਿਹਾ ਸਮਾਂ ਰਿਹਾ ਅਤੇ ਮੈਂ ਲੰਬੇ ਸਮੇਂ ਦੀ ਖਾਰਸ਼ ਨੂੰ ਸਕ੍ਰੈਚ ਕਰਨਾ ਚਾਹੁੰਦਾ ਸੀ ਜੋ ਮੇਰੇ ਕੋਲ ਸੀ. ਮੈਂ ਬੱਸ ਉਸ ਪਾਠ ਦੀ ਨਕਲ ਕਰਨ ਦੇ ਯੋਗ ਹੋਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਜੋ ਬ੍ਰਾ .ਜ਼ਰ ਵਿਚ ਚਿੱਤਰਾਂ ਦੇ ਅੰਦਰ ਰੱਖੇ ਹੋਏ ਹਨ. ਬਸ ਇੰਨਾ ਹੀ. ਮੇਰੇ ਖਿਆਲ ਇਹ ਹਰੇਕ ਲਈ ਇੱਕ ਸਾਫ ਸੁਵਿਧਾ ਹੋਵੇਗੀ.

ਕ੍ਰੋਮ ਵਿਚ ਸਿੱਧੇ ਤੌਰ &#39;ਤੇ ਕਾਰਜਕੁਸ਼ਲਤਾ ਨੂੰ ਜੋੜਨਾ ਆਸਾਨ ਨਹੀਂ ਹੈ, ਪਰ ਮੈਂ ਜਾਣਦਾ ਹਾਂ ਕਿ ਮੈਂ ਐਂਡਰੌਇਡ&#39; ਤੇ ਇਰਾਦੇ ਪ੍ਰਣਾਲੀ ਦਾ ਲਾਭ ਲੈ ਸਕਦਾ ਹਾਂ ਅਤੇ ਮੈਂ ਹੁਣ ਇਹ ਵੈਬ (ਜਾਂ ਘੱਟੋ ਘੱਟ ਐਂਡਰਾਇਡ ਤੇ ਕ੍ਰੋਮ) ਨਾਲ ਕਰ ਸਕਦਾ ਹਾਂ.

ਵੈਬ ਪਲੇਟਫਾਰਮ ਨੂੰ ਦੋ ਨਵ ਹੋਰ - ਨਿਯਤ ਟੀਚੇ ਦਾ ਲੈਵਲ 2 (ਜ ਮੈਨੂੰ ਇਸ ਨੂੰ ਸ਼ੇਅਰ ਫਾਇਲ ਨੂੰ ਕਾਲ ਕਰਨ ਦੀ ਪਸੰਦ ਦੇ ਤੌਰ ਤੇ) ਅਤੇ `TextDetector` ਆਕਾਰ ਖੋਜ API ਵਿਚ - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

ਬੁਨਿਆਦੀ ਸਥਾਪਨਾ ਮੁਕਾਬਲਤਨ ਸਿੱਧੇ ਅੱਗੇ ਹੈ, ਤੁਸੀਂ ਸਰਵਿਸ ਵਰਕਰ ਵਿੱਚ ਇੱਕ ਸ਼ੇਅਰ ਟਾਰਗੇਟ ਅਤੇ ਇੱਕ ਹੈਂਡਲਰ ਤਿਆਰ ਕਰਦੇ ਹੋ, ਅਤੇ ਫਿਰ ਇੱਕ ਵਾਰ ਤੁਹਾਡੇ ਕੋਲ ਇਹ ਚਿੱਤਰ ਹੋ ਜਾਂਦਾ ਹੈ ਕਿ ਉਪਭੋਗਤਾ ਨੇ ਸਾਂਝਾ ਕੀਤਾ ਹੈ ਤਾਂ ਤੁਸੀਂ ਇਸ &#39;ਤੇ `TextDetector` ਚਲਾਉਂਦੇ ਹੋ.

`Share Target API` ਤੁਹਾਡੀ ਵੈਬ ਐਪਲੀਕੇਸ਼ਨ ਨੂੰ ਨੇਟਿਵ ਸ਼ੇਅਰਿੰਗ ਉਪ-ਸਿਸਟਮ ਦਾ ਹਿੱਸਾ ਬਣਨ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ, ਅਤੇ ਇਸ ਸਥਿਤੀ ਵਿੱਚ ਤੁਸੀਂ ਹੁਣ ਹੇਠਾਂ ਦਿੱਤੇ ਆਪਣੇ `Web App Manifest` ਅੰਦਰ ਘੋਸ਼ਿਤ ਕਰਕੇ ਸਾਰੀਆਂ `image/*` ਕਿਸਮਾਂ ਨੂੰ ਸੰਭਾਲਣ ਲਈ ਰਜਿਸਟਰ ਕਰ ਸਕਦੇ ਹੋ.

```javascript
"share_target": {
  "action": "/index.html",
  "method": "POST",
  "enctype": "multipart/form-data",
  "params": {
    "files": [
      {
        "name": "file",
        "accept": ["image/*"]
      }
    ]
  }
}
```

ਜਦੋਂ ਤੁਹਾਡਾ ਪੀਡਬਲਯੂਏ ਸਥਾਪਤ ਹੋ ਜਾਂਦਾ ਹੈ ਤਾਂ ਤੁਸੀਂ ਇਸਨੂੰ ਉਨ੍ਹਾਂ ਸਾਰੀਆਂ ਥਾਵਾਂ &#39;ਤੇ ਦੇਖੋਗੇ ਜਿੱਥੋਂ ਤੁਸੀਂ ਚਿੱਤਰ ਸਾਂਝਾ ਕਰਦੇ ਹੋ:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` ਏਪੀਆਈ ਇੱਕ ਫਾਰਮ ਪੋਸਟ ਵਰਗੀਆਂ ਫਾਈਲਾਂ ਨੂੰ ਸਾਂਝਾ ਕਰਨ ਦਾ ਇਲਾਜ ਕਰਦਾ ਹੈ. ਜਦੋਂ ਫਾਈਲ ਨੂੰ ਵੈਬ ਐਪ ਨਾਲ ਸਾਂਝਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਤਾਂ ਸੇਵਾ ਕਰਮਚਾਰੀ ਸਰਗਰਮ ਹੁੰਦਾ ਹੈ `fetch` ਹੈਂਡਲਰ ਨੂੰ ਫਾਈਲ ਦੇ ਡੇਟਾ ਨਾਲ ਬੁਲਾਇਆ ਜਾਂਦਾ ਹੈ. ਡੇਟਾ ਹੁਣ ਸਰਵਿਸ ਵਰਕਰ ਦੇ ਅੰਦਰ ਹੈ ਪਰ ਮੈਨੂੰ ਮੌਜੂਦਾ ਵਿੰਡੋ ਵਿੱਚ ਇਸਦੀ ਜਰੂਰਤ ਹੈ ਤਾਂ ਜੋ ਮੈਂ ਇਸਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰ ਸਕਾਂ, ਸੇਵਾ ਜਾਣਦੀ ਹੈ ਕਿ ਕਿਹੜੀ ਵਿੰਡੋ ਨੇ ਬੇਨਤੀ ਕੀਤੀ, ਇਸ ਲਈ ਤੁਸੀਂ ਆਸਾਨੀ ਨਾਲ ਗਾਹਕ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾ ਸਕਦੇ ਹੋ ਅਤੇ ਇਸ ਨੂੰ ਡਾਟਾ ਭੇਜ ਸਕਦੇ ਹੋ.

```javascript
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(Response.redirect('/index.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const file = data.get('file');
      client.postMessage({ file, action: 'load-image' });
    }());
    
    return;
  }
  ...
  ...
}

```

ਇਕ ਵਾਰ ਜਦੋਂ ਚਿੱਤਰ ਉਪਭੋਗਤਾ ਦੇ ਇੰਟਰਫੇਸ ਵਿਚ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਮੈਂ ਇਸ ਨੂੰ ਟੈਕਸਟ ਖੋਜ API ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਕਰਦਾ ਹਾਂ.

```javascript
navigator.serviceWorker.onmessage = (event) => {  
  const file = event.data.file;
  const imgEl = document.getElementById('img');
  const outputEl = document.getElementById('output');
  const objUrl = URL.createObjectURL(file);
  imgEl.src = objUrl;
  imgEl.onload = () => {
    const texts = await textDetector.detect(imgEl);
    texts.forEach(text => {
      const textEl = document.createElement('p');
      textEl.textContent = text.rawValue;
      outputEl.appendChild(textEl);
    });
  };
  ...
};
```

ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ ਬ੍ਰਾ browserਜ਼ਰ ਕੁਦਰਤੀ ਤੌਰ &#39;ਤੇ ਚਿੱਤਰ ਨੂੰ ਘੁੰਮਦਾ ਨਹੀਂ ਹੈ (ਜਿਵੇਂ ਕਿ ਤੁਸੀਂ ਹੇਠਾਂ ਵੇਖ ਸਕਦੇ ਹੋ), ਅਤੇ ਸ਼ੈਪ ਡਿਟੈਕਸ਼ਨ ਏਪੀਆਈ ਨੂੰ ਸਹੀ ਪੜ੍ਹਨ ਦੀ ਸਥਿਤੀ ਵਿਚ ਪਾਠ ਦੀ ਜ਼ਰੂਰਤ ਹੈ.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

ਮੈਂ ਘੁੰਮਣ ਦਾ ਪਤਾ ਲਗਾਉਣ ਲਈ [EXIF-Js library](https://github.com/exif-js/exif-js) ਵਰਤੋਂ ਕਰਨ ਦੀ ਬਜਾਏ ਅਸਾਨ ਦੀ ਵਰਤੋਂ ਕੀਤੀ ਅਤੇ ਫਿਰ ਚਿੱਤਰ ਨੂੰ ਮੁੜ [EXIF-Js library](https://github.com/exif-js/exif-js) ਕਰਨ ਲਈ ਕੁਝ [EXIF-Js library](https://github.com/exif-js/exif-js) ਕੈਨਵਸ ਹੇਰਾਫੇਰੀ ਕੀਤੀ.

```javascript
EXIF.getData(imgEl, async function() {
  // http://sylvana.net/jpegcrop/exif_orientation.html
  const orientation = EXIF.getTag(this, 'Orientation');
  const [width, height] = (orientation > 4) 
                  ? [ imgEl.naturalWidth, imgEl.naturalHeight ]
                  : [ imgEl.naturalHeight, imgEl.naturalWidth ];

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  // We have to get the correct orientation for the image
  // See also https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  switch(orientation) {
    case 2: context.transform(-1, 0, 0, 1, width, 0); break;
    case 3: context.transform(-1, 0, 0, -1, width, height); break;
    case 4: context.transform(1, 0, 0, -1, 0, height); break;
    case 5: context.transform(0, 1, 1, 0, 0, 0); break;
    case 6: context.transform(0, 1, -1, 0, height, 0); break;
    case 7: context.transform(0, -1, -1, 0, height, width); break;
    case 8: context.transform(0, -1, 1, 0, 0, width); break;
  }
  context.drawImage(imgEl, 0, 0);
}
```

ਅਤੇ ਵੋਇਲਾ, ਜੇ ਤੁਸੀਂ ਇੱਕ ਚਿੱਤਰ ਐਪਲੀਕੇਸ਼ ਨੂੰ ਸਾਂਝਾ ਕਰਦੇ ਹੋ ਇਹ ਚਿੱਤਰ ਨੂੰ ਘੁੰਮਦੀ ਹੈ ਅਤੇ ਫਿਰ ਇਸਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ ਕਿ ਟੈਕਸਟ ਦੇ ਨਤੀਜੇ ਨੂੰ ਜੋ ਇਸ ਨੇ ਪਾਇਆ ਹੈ.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

ਇਹ ਛੋਟਾ ਜਿਹਾ ਤਜਰਬਾ ਬਣਾਉਣਾ ਬਹੁਤ ਹੀ ਮਜ਼ੇਦਾਰ ਸੀ, ਅਤੇ ਇਹ ਮੇਰੇ ਲਈ ਤੁਰੰਤ ਲਾਭਦਾਇਕ ਰਿਹਾ. ਇਹ ਹਾਲਾਂਕਿ, [inconsistency of the web platform](/the-lumpy-web/) ਉਜਾਗਰ ਕਰਦਾ ਹੈ. ਇਹ ਏਪੀਆਈ ਸਾਰੇ ਬ੍ਰਾsersਜ਼ਰਾਂ ਤੇ ਉਪਲਬਧ ਨਹੀਂ ਹਨ, ਉਹ ਕ੍ਰੋਮ ਦੇ ਸਾਰੇ ਸੰਸਕਰਣ ਵਿੱਚ ਵੀ ਉਪਲਬਧ ਨਹੀਂ ਹਨ - ਇਸਦਾ ਅਰਥ ਇਹ ਹੈ ਕਿ ਜਿਵੇਂ ਮੈਂ ਇਸ ਲੇਖ ਨੂੰ ਲਿਖਦਾ ਹਾਂ Chrome OS, ਮੈਂ ਐਪ ਦੀ ਵਰਤੋਂ ਨਹੀਂ ਕਰ ਸਕਦਾ, ਪਰ ਉਸੇ ਸਮੇਂ, ਜਦੋਂ ਮੈਂ ਇਸ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦਾ ਹਾਂ ... ਓ ਐਮ ਜੀ, ਬਹੁਤ ਵਧੀਆ.

