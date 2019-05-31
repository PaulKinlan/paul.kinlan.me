---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
నేను గూగుల్ IO తర్వాత కొంచెం తక్కువ సమయాన్ని కలిగి ఉన్నాను మరియు నేను కలిగి ఉన్న దీర్ఘకాలిక దురదను గీసేందుకు ఇష్టపడ్డాను. నేను బ్రౌజర్లో చిత్రాల లోపల ఉంచే వచనాన్ని కాపీ చేయాలనుకుంటున్నాను. అది అంతా. నేను ప్రతి ఒక్కరికీ చక్కని లక్షణం అని అనుకుంటున్నాను.

నేరుగా Chrome లోకి కార్యాచరణను జోడించడం సులభం కాదు, కానీ నేను Android లో ఉద్దేశిత వ్యవస్థ యొక్క ప్రయోజనాన్ని పొందగలదని నాకు తెలుసు మరియు నేను ఇప్పుడు వెబ్తో (లేదా Android లో కనీసం Chrome) చేయగలను.

వెబ్ వేదిక రెండు కొత్త చేర్పులు - భాగస్వామ్యం టార్గెట్ స్థాయి 2 (లేదా నేను దాన్ని ఫైల్ భాగస్వామ్యం పిలవాలని ఇష్టపడే) మరియు `TextDetector` ఆకారం డిటెక్షన్ API లో - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

ప్రాథమిక అమలు సాపేక్షంగా నేరుగా ముందుకు ఉంది, మీరు షేర్ టార్గెట్ను మరియు సర్వీస్ వర్కర్లో ఒక హ్యాండ్లర్ను సృష్టించి, ఆపై మీరు యూజర్ భాగస్వామ్యం చేసిన చిత్రం మీరు దానిపై `TextDetector` ను అమలు చేస్తారు.

`Share Target API` మీ వెబ్ అప్లికేషన్ స్థానిక భాగస్వామ్య ఉప వ్యవస్థలో భాగం `Share Target API` అనుమతిస్తుంది, మరియు ఈ సందర్భంలో, మీరు అన్ని `image/*` రకాలను నిర్వహించడానికి మీ `Web App Manifest` లోపలే దాన్ని ప్రకటించడం ద్వారా ఇప్పుడు నమోదు చేయవచ్చు.

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

మీ PWA వ్యవస్థాపించినప్పుడు, మీరు క్రింది చిత్రాల నుండి మీరు భాగస్వామ్యం చేసిన ప్రదేశాలలో ఇది కనిపిస్తుంది:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` API ఫారమ్ పోస్ట్ వంటి ఫైళ్లను భాగస్వామ్యం చేస్తుంది. ఫైల్ వెబ్ అప్లికేషన్ కు భాగస్వామ్యం చేసినప్పుడు, సేవ `fetch` సక్రియం `fetch` హ్యాండ్లర్ ఫైల్ డేటాతో ఉపయోగించబడుతుంది. డేటా ఇప్పుడు సర్వీస్ వర్కర్ లోపల ఉంది కానీ నేను ప్రస్తుత విండోలో అవసరం కాబట్టి నేను ప్రాసెస్ చేయవచ్చు, సేవ ఏ విండో అభ్యర్థన ఆదేశించింది తెలుసు, కాబట్టి మీరు సులభంగా క్లయింట్ లక్ష్యంగా మరియు డేటా పంపవచ్చు.

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

చిత్రం యూజర్ ఇంటర్ఫేస్ లో ఒకసారి, నేను టెక్స్ట్ గుర్తింపును API తో దీన్ని ప్రాసెస్.

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

అతిపెద్ద సమస్య ఏమిటంటే, బ్రౌజర్ సహజంగా రొటేట్ చేయనిది కాదు (మీరు క్రింద చూడవచ్చు), మరియు ఆకారం డిటెక్షన్ API సరైన రీడింగ్ ధోరణిలో టెక్స్ట్ అవసరం.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

భ్రమణాన్ని గుర్తించడానికి [EXIF-Js library](https://github.com/exif-js/exif-js) ను ఉపయోగించడం కోసం నేను ఉపయోగించడం చాలా సులభమైనది, ఆపై చిత్రం తిరిగి నిర్దేశించడానికి కొన్ని ప్రాథమిక కాన్వాస్ తారుమారు చేయండి.

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

మరియు Voila, మీరు అనువర్తనం ఒక చిత్రాన్ని భాగస్వామ్యం ఉంటే అది చిత్రం రొటేట్ మరియు అది కనుగొన్న టెక్స్ట్ యొక్క అవుట్పుట్ తిరిగి విశ్లేషిస్తుంది.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

ఇది ఈ చిన్న ప్రయోగం సృష్టించడానికి చాలా సరదాగా ఉంది, మరియు అది నాకు వెంటనే ఉపయోగకరంగా ఉంది. ఇది అయితే, [inconsistency of the web platform](/the-lumpy-web/) హైలైట్ చేస్తుంది. ఈ API లు అన్ని బ్రౌజర్లలో అందుబాటులో లేవు, అవి Chrome యొక్క అన్ని సంస్కరణల్లో కూడా అందుబాటులో లేవు - అంటే నేను ఈ ఆర్టికల్ Chrome OS కి వ్రాస్తున్నప్పుడు, నేను అనువర్తనాన్ని ఉపయోగించలేను, కానీ అదే సమయంలో, ... OMG, చాలా బాగుంది.

