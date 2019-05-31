---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
கூகிள் IO க்குப் பிறகு சிறிது நேரம் கழித்து நான் ஒரு நீண்ட கால நமைச்சையை நான் விரும்பினேன். உலாவியில் உள்ள படங்களை உள்ளே வைத்திருக்கும் உரையை நகலெடுக்க நான் விரும்புகிறேன். அவ்வளவு தான். நான் எல்லோருக்கும் இது ஒரு சுத்தமான அம்சம் என்று நான் நினைக்கிறேன்.

Chrome இல் நேரடியாக செயல்பாட்டைச் சேர்ப்பது எளிதானது அல்ல, ஆனால் Android இல் உள்ள நோக்கம் அமைப்பை நான் பயன்படுத்திக் கொள்ளலாம் என்று எனக்குத் தெரியும், இப்போது வலை (அல்லது Android இல் குறைந்தபட்சம் Chrome) செய்யலாம்.

வலை தளத்திற்கு இரண்டு புதிய சேர்ப்புகள் - பகிர்வு இலக்கு நிலை 2 (அல்லது கோப்பு `TextDetector` அழைக்க விரும்புகிறேன்) மற்றும் வடிவம் கண்டறிதல் API இல் [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

அடிப்படை செயலாக்கம் ஒப்பீட்டளவில் நேராக முன்னோக்கி உள்ளது, நீங்கள் ஒரு பகிர்வு இலக்கு மற்றும் `TextDetector` தொழிலாளி ஒரு கையாளுதல் உருவாக்க, பின்னர் நீங்கள் பயனர் பகிர்வு என்று படத்தை நீங்கள் அதை `TextDetector` ரன்.

`Share Target API` உங்கள் வலை பயன்பாடு சொந்த பகிர்வு துணை அமைப்பு பகுதியாக இருக்க அனுமதிக்கிறது, இந்த வழக்கில் நீங்கள் இப்போது `image/*` வகைகளை அனைத்து `image/*` வகைகளையும் உங்கள் `Web App Manifest` உள்ளே பிரகடனப்படுத்தி பதிவு செய்யலாம்.

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

உங்கள் PWA நிறுவப்பட்டவுடன், பின்வருமாறு படங்களைப் பகிர்ந்துகொள்ளும் எல்லா இடங்களிலும் நீங்கள் இதைப் பார்ப்பீர்கள்:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` ஏபிஐ ஒரு படிவத்தைப் போன்று கோப்புகளை பகிர்ந்து கொள்ளும். கோப்பு வலை பயன்பாட்டிற்கு பகிரப்படும் போது `fetch` வேலை `fetch` கையாளுபவர் கோப்பிற்கான தரவு மூலம் அழைக்கப்பட்டார். தரவு இப்போது சேவையக வேலையாளருக்குள் உள்ளது, ஆனால் நான் தற்போதைய சாளரத்தில் அதைத் தேவை, அதனால் நான் அதை செயலாக்க முடியும், சேவை எந்த சாளரத்தை கோரிக்கையை அறிமுகப்படுத்தியது என்பது உங்களுக்கு தெரியும், எனவே நீங்கள் கிளையன்ட்டை எளிதில் இலக்காக கொண்டு தரவு அனுப்பலாம்.

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

படம் பயனர் இடைமுகத்தில் இருக்கும்போதே, அதை உரை கண்டறிதல் API உடன் செயலாக்குகிறேன்.

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

மிகப்பெரிய சிக்கல் உலாவி இயற்கையாகவே படத்தை சுழற்றுவது இல்லை (நீங்கள் கீழே பார்க்க முடியும்), மற்றும் வடிவம் கண்டறிதல் ஏபிஐ சரியான வாசிப்பு நோக்குநிலை இருக்கும் உரை வேண்டும்.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

சுழற்சியைக் கண்டறிவதற்கு [EXIF-Js library](https://github.com/exif-js/exif-js) ஐப் பயன்படுத்த [EXIF-Js library](https://github.com/exif-js/exif-js) பயன்படுத்தினேன், பின்னர் சில அடிப்படை கேன்வாஸ் கையாளுதல்கள் படத்தை மீண்டும் நோக்குநிலைக்கு கொண்டுவருகின்றன.

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

மற்றும் Voila, நீங்கள் பயன்பாட்டை ஒரு படத்தை பகிர்ந்து இருந்தால் அதை படத்தை சுழற்ற பின்னர் அது காணப்படும் உரை வெளியீடு திரும்ப ஆய்வு பகுப்பாய்வு.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

இந்த சிறிய பரிசோதனையை உருவாக்க நம்பமுடியாத வேடிக்கையாக இருந்தது, அது எனக்கு உடனடியாக பயனுள்ளதாக இருந்தது. இருப்பினும், அது [inconsistency of the web platform](/the-lumpy-web/) சிறப்பித்துக் காட்டுகிறது. இந்த API இன் எல்லா உலாவிகளில் கிடைக்காது, அவை Chrome இன் எல்லா பதிப்புகளிலும் கிடைக்காது - அதாவது இந்த கட்டுரையை Chrome OS ஐ எழுதுகையில், பயன்பாட்டைப் பயன்படுத்த முடியாது, ஆனால் அதே நேரத்தில், நான் அதைப் பயன்படுத்தும்போது ... OMG, மிகவும் குளிராக.

