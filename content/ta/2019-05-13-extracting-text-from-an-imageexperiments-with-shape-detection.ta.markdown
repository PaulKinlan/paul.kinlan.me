---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
கூகிள் ஐஓவுக்குப் பிறகு எனக்கு சிறிது நேரம் இருந்தது, நான் வைத்திருந்த நீண்ட கால நமைச்சலைக் கீற விரும்பினேன். உலாவியில் உள்ள படங்களுக்குள் இருக்கும் உரையை நகலெடுக்க நான் விரும்புகிறேன். அவ்வளவு தான். இது அனைவருக்கும் சுத்தமாக இருக்கும் அம்சமாக இருக்கும் என்று நினைக்கிறேன்.

Chrome இல் நேரடியாக செயல்பாட்டைச் சேர்ப்பது எளிதல்ல, ஆனால் Android இல் உள்ள உள்நோக்க அமைப்பை நான் பயன்படுத்திக் கொள்ள முடியும் என்று எனக்குத் தெரியும், இப்போது நான் அதை இணையத்துடன் (அல்லது Android இல் குறைந்தபட்சம் Chrome) செய்ய முடியும்.

இணைய இயங்குதள இரண்டு புதிய சேர்த்தல் - பகிர் இலக்கு நிலை 2 (அல்லது நான் அதை கோப்பு பகிர்ந்து அழைக்க விரும்பும்) மற்றும் `TextDetector` வடிவம் கண்டறிதல் API இல் - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

அடிப்படை செயலாக்கம் ஒப்பீட்டளவில் நேராக முன்னோக்கி உள்ளது, நீங்கள் ஒரு சேவை இலக்கு மற்றும் சேவை பணியாளரில் ஒரு கையாளுபவரை உருவாக்குகிறீர்கள், பின்னர் பயனர் பகிர்ந்த படத்தை நீங்கள் `TextDetector` , அதில் `TextDetector` ஐ இயக்கவும்.

`Share Target API` உங்கள் வலை பயன்பாட்டை சொந்த பகிர்வு துணை அமைப்பின் ஒரு பகுதியாக இருக்க அனுமதிக்கிறது, இந்த விஷயத்தில் நீங்கள் இப்போது உங்கள் `Web App Manifest` வகைகளை பின்வருமாறு அறிவிப்பதன் மூலம் அனைத்து `image/*` வகைகளையும் கையாள பதிவு செய்யலாம்.

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

உங்கள் PWA நிறுவப்பட்டதும் பின்வருமாறு படங்களை பகிரும் எல்லா இடங்களிலும் அதைப் பார்ப்பீர்கள்:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` API ஒரு படிவ இடுகையைப் போன்ற கோப்புகளைப் பகிர்வதைக் கருதுகிறது. வலை பயன்பாட்டில் கோப்பு பகிரப்படும்போது, சேவை பணியாளர் செயல்படுத்தப்படுகிறார், `fetch` கையாளுநர் கோப்பு தரவுடன் செயல்படுத்தப்படுகிறார். தரவு இப்போது சேவை பணியாளருக்குள் உள்ளது, ஆனால் தற்போதைய சாளரத்தில் எனக்கு இது தேவைப்படுகிறது, அதனால் நான் அதைச் செயலாக்க முடியும், எந்த சாளரம் கோரிக்கையைச் செயல்படுத்தியது என்பது சேவைக்குத் தெரியும், எனவே நீங்கள் கிளையண்டை எளிதாக குறிவைத்து தரவை அனுப்பலாம்.

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

படம் பயனர் இடைமுகத்தில் இருந்தவுடன், அதை உரை கண்டறிதல் API உடன் செயலாக்குகிறேன்.

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

மிகப்பெரிய பிரச்சினை என்னவென்றால், உலாவி இயல்பாகவே படத்தை சுழற்றுவதில்லை (நீங்கள் கீழே காணலாம்), மற்றும் வடிவம் கண்டறிதல் API க்கு உரை சரியான வாசிப்பு நோக்குநிலையில் இருக்க வேண்டும்.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

சுழற்சியைக் கண்டறிய [EXIF-Js library](https://github.com/exif-js/exif-js) ஐப் பயன்படுத்துவதை நான் எளிதாகப் பயன்படுத்தினேன், பின்னர் படத்தை மீண்டும் திசைதிருப்ப சில அடிப்படை கேன்வாஸ் கையாளுதல்களைச் செய்தேன்.

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

மேலும் வோய்லா, நீங்கள் ஒரு படத்தை பயன்பாட்டிற்குப் பகிர்ந்தால், அது படத்தை சுழற்றி, பின்னர் அது கண்டறிந்த உரையின் வெளியீட்டை திருப்பித் தரும்.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

இந்த சிறிய பரிசோதனையை உருவாக்குவது நம்பமுடியாத வேடிக்கையாக இருந்தது, அது எனக்கு உடனடியாக பயனுள்ளதாக இருந்தது. இருப்பினும், இது [inconsistency of the web platform](/the-lumpy-web/) முன்னிலைப்படுத்துகிறது. இந்த API கள் எல்லா உலாவிகளிலும் கிடைக்கவில்லை, அவை Chrome இன் எல்லா பதிப்பிலும் கூட கிடைக்கவில்லை - இதன் பொருள் நான் இந்த கட்டுரையை Chrome OS ஐ எழுதும்போது, பயன்பாட்டைப் பயன்படுத்த முடியாது, ஆனால் அதே நேரத்தில், நான் அதைப் பயன்படுத்தும்போது ... ஓஎம்ஜி, மிகவும் குளிராக இருக்கிறது.

