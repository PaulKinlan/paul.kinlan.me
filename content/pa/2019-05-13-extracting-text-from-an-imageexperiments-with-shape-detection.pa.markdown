---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
ਗੂਗਲ ਆਈਓ ਤੋਂ ਬਾਅਦ ਮੈਂ ਥੋੜਾ ਸਮਾਂ ਸੀ ਅਤੇ ਮੈਂ ਚਾਹੁੰਦਾ ਸੀ ਕਿ ਮੇਰੇ ਕੋਲ ਇਕ ਲੰਬੀ ਮਿਆਦ ਦੀ ਖੁਜਲੀ ਹੋਵੇ. ਮੈਂ ਬਸ ਟੈਕਸਟ ਨੂੰ ਕਾਪੀ ਕਰਨ ਦੇ ਯੋਗ ਹੋਣਾ ਚਾਹੁੰਦਾ ਹਾਂ ਜੋ ਬਰਾਊਜ਼ਰ ਵਿਚ ਤਸਵੀਰਾਂ ਵਿਚ ਹੁੰਦਾ ਹੈ. ਬਸ ਇੰਨਾ ਹੀ. ਮੈਨੂੰ ਲਗਦਾ ਹੈ ਕਿ ਇਹ ਹਰ ਕਿਸੇ ਲਈ ਇੱਕ ਸੁੰਦਰ ਫੀਚਰ ਹੋਵੇਗਾ

ਇਹ ਸਿੱਧੇ ਰੂਪ ਵਿੱਚ Chrome ਵਿੱਚ ਕਾਰਜਕੁਸ਼ਲਤਾ ਜੋੜਨਾ ਅਸਾਨ ਨਹੀਂ ਹੈ, ਪਰ ਮੈਨੂੰ ਪਤਾ ਹੈ ਕਿ ਮੈਂ ਐਂਡ੍ਰਾਇਡ ਤੇ ਇਰਾਦੇ ਸਿਸਟਮ ਦਾ ਫਾਇਦਾ ਲੈ ਸਕਦਾ ਹਾਂ ਅਤੇ ਹੁਣ ਮੈਂ ਵੈਬ (ਜਾਂ ਘੱਟ ਤੋਂ ਘੱਟ Android ਤੇ Chrome) ਨਾਲ ਇਹ ਕਰ ਸਕਦਾ ਹਾਂ.

ਵੈਬ ਪਲੇਟਫਾਰਮ ਵਿਚ ਦੋ ਨਵੇਂ ਜੋੜ - ਸ਼ੇਅਰ ਟਾਰਗਿਟ ਲੈਵਲ 2 (ਜਾਂ ਜਿਵੇਂ ਮੈਂ ਇਸ ਨੂੰ ਫਾਇਲ ਸ਼ੇਅਰ ਕਰਨਾ ਪਸੰਦ ਕਰਦਾ ਹਾਂ) ਅਤੇ `TextDetector` API ਵਿਚ [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

ਬੁਨਿਆਦੀ ਲਾਗੂ ਕਰਨਾ ਸਿੱਧੇ ਤੌਰ ਤੇ ਸਿੱਧਾ ਅੱਗੇ ਵਧਦਾ ਹੈ, ਤੁਸੀਂ ਸਰਵਿਸ ਵਰਕਰ ਵਿਚ ਇੱਕ ਸ਼ੇਅਰ ਟਾਰਗੇਟ ਅਤੇ ਹੈਂਡਲਰ ਬਣਾਉਂਦੇ ਹੋ, ਅਤੇ ਫਿਰ ਜਦੋਂ ਤੁਹਾਡੇ ਕੋਲ ਉਹ ਚਿੱਤਰ ਹੁੰਦਾ ਹੈ ਜਿਸ ਨੇ ਯੂਜ਼ਰ ਨੇ ਤੁਹਾਨੂੰ ਇਸ ਉੱਤੇ `TextDetector` ਚਲਾਇਆ ਹੈ.

`Share Target API` ਤੁਹਾਡੀ ਵੈਬ ਐਪਲੀਕੇਸ਼ਨ ਨੂੰ ਨੇਟਿਵ ਸ਼ੇਅਰਿੰਗ ਉਪ-ਪ੍ਰਣਾਲੀ ਦਾ ਹਿੱਸਾ ਬਣਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ, ਅਤੇ ਇਸ ਸਥਿਤੀ ਵਿੱਚ ਤੁਸੀਂ ਹੁਣ ਸਾਰੇ `image/*` ਕਿਸਮਾਂ ਨੂੰ ਆਪਣੇ `Web App Manifest` ਅੰਦਰ ਇਸ ਨੂੰ ਘੋਸ਼ਿਤ ਕਰਕੇ ਰਜਿਸਟਰ ਕਰ ਸਕਦੇ ਹੋ.

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

ਜਦੋਂ ਤੁਹਾਡਾ PWA ਸਥਾਪਿਤ ਹੁੰਦਾ ਹੈ ਤਾਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਸਾਰੇ ਸਥਾਨਾਂ ਤੇ ਵੇਖ ਸਕਦੇ ਹੋ ਜਿੱਥੇ ਤੁਸੀਂ ਹੇਠਾਂ ਦਿੱਤੇ ਚਿੱਤਰਾਂ ਨੂੰ ਸਾਂਝਾ ਕਰਦੇ ਹੋ:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` API ਇੱਕ ਫੌਰਮ ਪੋਸਟ ਦੀ ਤਰਾਂ ਫਾਈਲਾਂ ਸ਼ੇਅਰ ਕਰਨ ਦਾ `Share Target` . ਜਦੋਂ ਫਾਇਲ ਨੂੰ ਵੈਬ ਐਪ ਨਾਲ ਸਾਂਝਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਤਾਂ ਸਰਵਿਸ ਵਰਕਰ ਨੂੰ ਸਰਗਰਮ ਕੀਤਾ ਜਾਂਦਾ ਹੈ `fetch` ਹੈਂਡਲਰ ਨੂੰ ਫਾਈਲ ਡਾਟਾ ਨਾਲ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ. ਡੇਟਾ ਹੁਣ ਸੇਵਾ ਵਰਕਰ ਦੇ ਅੰਦਰ ਹੈ ਪਰ ਮੈਨੂੰ ਇਸ ਦੀ ਮੌਜੂਦਾ ਵਿੰਡੋ ਵਿੱਚ ਲੋੜ ਹੈ ਤਾਂ ਜੋ ਮੈਂ ਇਸਨੂੰ ਪ੍ਰਕਿਰਿਆ ਕਰ ਸਕਾਂ, ਸੇਵਾ ਜਾਣਦਾ ਹੈ ਕਿ ਕਿਹੜਾ ਖਿੜਕੀ ਅਨੁਰੋਧ ਕਰਦੀ ਹੈ, ਇਸ ਲਈ ਤੁਸੀਂ ਗਾਹਕ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਨਿਸ਼ਾਨਾ ਬਣਾ ਸਕਦੇ ਹੋ ਅਤੇ ਇਸਨੂੰ ਡਾਟਾ ਭੇਜ ਸਕਦੇ ਹੋ.

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

ਇੱਕ ਵਾਰ ਜਦੋਂ ਚਿੱਤਰ ਉਪਭੋਗਤਾ ਇੰਟਰਫੇਸ ਵਿੱਚ ਹੁੰਦਾ ਹੈ, ਮੈਂ ਫਿਰ ਇਸਨੂੰ ਪਾਠ ਖੋਜ API ਦੇ ਨਾਲ ਸੰਸਾਧਿਤ ਕਰਦਾ ਹਾਂ.

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

ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਦਾ ਇਹ ਹੈ ਕਿ ਬ੍ਰਾਉਜ਼ਰ ਚਿੱਤਰ ਨੂੰ ਕੁਦਰਤੀ ਤੌਰ ਤੇ ਨਹੀਂ ਘੁੰਮਾਉਂਦਾ ਹੈ (ਜਿਵੇਂ ਕਿ ਤੁਸੀਂ ਹੇਠਾਂ ਵੇਖ ਸਕਦੇ ਹੋ), ਅਤੇ ਸ਼ੈਲ ਡੀਟੈੱਕਸ਼ਨ API ਨੂੰ ਪਾਠ ਨੂੰ ਸਹੀ ਰੀਡਿੰਗ ਸਥਿਤੀ ਵਿਚ ਹੋਣ ਦੀ ਲੋੜ ਹੈ.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

ਮੈਂ ਰੋਟੇਸ਼ਨ ਨੂੰ ਖੋਜਣ ਲਈ [EXIF-Js library](https://github.com/exif-js/exif-js) ਵਰਤੋਂ ਕਰਨ ਲਈ ਅਸਾਨ ਸੌਖੀ ਵਰਤਦਾ ਸੀ ਅਤੇ ਫਿਰ ਚਿੱਤਰ ਨੂੰ ਮੁੜ-ਅਨੁਕੂਲ ਬਣਾਉਣ ਲਈ ਕੁਝ ਬੁਨਿਆਦੀ ਕੈਨਵਸ ਹੇਰਾਫੇਰੀ ਕਰਦਾ ਹਾਂ.

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

ਅਤੇ ਵੋਇਲ੍ਹਾ, ਜੇ ਤੁਸੀਂ ਐਪ ਨੂੰ ਕਿਸੇ ਚਿੱਤਰ ਨੂੰ ਸਾਂਝਾ ਕਰਦੇ ਹੋ ਤਾਂ ਇਹ ਚਿੱਤਰ ਨੂੰ ਘੁੰਮਾ ਦੇਵੇਗਾ ਅਤੇ ਫਿਰ ਉਸ ਦੁਆਰਾ ਲੱਭੇ ਗਏ ਟੈਕਸਟ ਦੀ ਆਊਟਪੁੱਟ ਨੂੰ ਵਾਪਸ ਕਰਨ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੇਗਾ.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

ਇਹ ਬਹੁਤ ਘੱਟ ਤਜਰਬਾ ਬਣਾਉਣ ਲਈ ਇਹ ਬਹੁਤ ਮਜ਼ੇਦਾਰ ਸੀ, ਅਤੇ ਇਹ ਮੇਰੇ ਲਈ ਤੁਰੰਤ ਲਾਭਦਾਇਕ ਰਿਹਾ ਹੈ ਹਾਲਾਂਕਿ, ਇਹ [inconsistency of the web platform](/the-lumpy-web/) ਉਜਾਗਰ ਕਰਦਾ ਹੈ. ਇਹ API ਦੇ ਸਾਰੇ ਬ੍ਰਾਉਜ਼ਰ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ ਹਨ, ਉਹ ਵੀ Chrome ਦੇ ਸਾਰੇ ਸੰਸਕਰਣ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ ਹਨ - ਇਸਦਾ ਮਤਲਬ ਇਹ ਹੈ ਕਿ ਜਿਵੇਂ ਮੈਂ ਇਸ ਲੇਖ ਨੂੰ Chrome OS ਲਿਖਦਾ ਹਾਂ, ਮੈਂ ਐਪ ਨੂੰ ਨਹੀਂ ਵਰਤ ਸਕਦਾ, ਪਰ ਉਸੇ ਵੇਲੇ, ਜਦੋਂ ਮੈਂ ਇਸਨੂੰ ਵਰਤ ਸਕਦਾ ਹਾਂ ... ਓ.ਐਮ.ਜੀ., ਇੰਨੀ ਕੂਲ.

