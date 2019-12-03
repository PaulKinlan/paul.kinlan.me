---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
గూగుల్ IO తర్వాత నాకు కొంచెం సమయం ఉంది మరియు నేను కలిగి ఉన్న దీర్ఘకాలిక దురదను గీయాలని అనుకున్నాను. బ్రౌజర్‌లోని చిత్రాల లోపల ఉన్న వచనాన్ని కాపీ చేయగలుగుతున్నాను. అంతే. ఇది ప్రతి ఒక్కరికీ చక్కని లక్షణంగా ఉంటుందని నేను భావిస్తున్నాను.

కార్యాచరణను నేరుగా Chrome లోకి జోడించడం అంత సులభం కాదు, కానీ నేను Android లోని ఉద్దేశ్య వ్యవస్థను సద్వినియోగం చేసుకోగలనని నాకు తెలుసు మరియు నేను ఇప్పుడు వెబ్‌తో (లేదా Android లో కనీసం Chrome) దీన్ని చేయగలను.

వెబ్ ప్లాట్‌ఫారమ్‌కు రెండు కొత్త చేర్పులు - షేర్ టార్గెట్ స్థాయి 2 (లేదా నేను దానిని ఫైల్ షేర్ అని `TextDetector` ) మరియు షేప్ డిటెక్షన్ API - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

ప్రాథమిక అమలు సాపేక్షంగా సూటిగా ముందుకు ఉంటుంది, మీరు సేవా వర్కర్‌లో షేర్ టార్గెట్ మరియు హ్యాండ్లర్‌ను సృష్టిస్తారు, ఆపై వినియోగదారు పంచుకున్న చిత్రం మీకు `TextDetector` మీరు దానిపై `TextDetector` ను అమలు చేస్తారు.

`Share Target API` మీ వెబ్ అప్లికేషన్‌ను స్థానిక షేరింగ్ ఉప వ్యవస్థలో భాగం `Share Target API` అనుమతిస్తుంది, మరియు ఈ సందర్భంలో మీరు మీ `Web App Manifest` ఈ క్రింది విధంగా ప్రకటించడం ద్వారా అన్ని `image/*` రకాలను నిర్వహించడానికి నమోదు చేసుకోవచ్చు.

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

మీ PWA వ్యవస్థాపించబడినప్పుడు, మీరు చిత్రాలను పంచుకునే అన్ని ప్రదేశాలలో ఈ క్రింది విధంగా చూస్తారు:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` API ఫైల్‌లను ఫారమ్ పోస్ట్ లాగా భాగస్వామ్యం చేస్తుంది. ఫైల్ వెబ్ అనువర్తనానికి భాగస్వామ్యం చేయబడినప్పుడు, సేవా కార్మికుడు సక్రియం చేయబడితే, `fetch` హ్యాండ్లర్ ఫైల్ డేటాతో ప్రారంభించబడుతుంది. డేటా ఇప్పుడు సర్వీస్ వర్కర్ లోపల ఉంది, కానీ ప్రస్తుత విండోలో నాకు ఇది అవసరం, తద్వారా నేను దీన్ని ప్రాసెస్ చేయగలను, ఏ విండో అభ్యర్థనను ప్రవేశపెట్టిందో సేవకు తెలుసు, కాబట్టి మీరు క్లయింట్‌ను సులభంగా లక్ష్యంగా చేసుకొని డేటాను పంపవచ్చు.

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

చిత్రం వినియోగదారు ఇంటర్‌ఫేస్‌లో ఉన్నప్పుడు, నేను దానిని టెక్స్ట్ డిటెక్షన్ API తో ప్రాసెస్ చేస్తాను.

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

అతిపెద్ద సమస్య ఏమిటంటే బ్రౌజర్ సహజంగా చిత్రాన్ని తిప్పడం లేదు (మీరు క్రింద చూడగలిగినట్లు), మరియు ఆకృతి గుర్తింపు API కి సరైన పఠన ధోరణిలో ఉండటానికి టెక్స్ట్ అవసరం.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

భ్రమణాన్ని గుర్తించడానికి నేను [EXIF-Js library](https://github.com/exif-js/exif-js) ను ఉపయోగించడం చాలా సులభం, ఆపై చిత్రాన్ని తిరిగి [EXIF-Js library](https://github.com/exif-js/exif-js) చేయడానికి కొన్ని ప్రాథమిక కాన్వాస్ మానిప్యులేషన్ [EXIF-Js library](https://github.com/exif-js/exif-js) .

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

మరియు వోయిలా, మీరు అనువర్తనానికి ఒక చిత్రాన్ని భాగస్వామ్యం చేస్తే అది చిత్రాన్ని తిప్పేస్తుంది మరియు అది కనుగొన్న టెక్స్ట్ యొక్క అవుట్పుట్ను తిరిగి ఇస్తుంది.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

ఈ చిన్న ప్రయోగాన్ని సృష్టించడం చాలా సరదాగా ఉంది మరియు ఇది నాకు వెంటనే ఉపయోగపడింది. అయితే, ఇది [inconsistency of the web platform](/the-lumpy-web/) హైలైట్ చేస్తుంది. ఈ API లు అన్ని బ్రౌజర్‌లలో అందుబాటులో లేవు, అవి Chrome యొక్క అన్ని వెర్షన్లలో కూడా అందుబాటులో లేవు - దీని అర్థం నేను ఈ కథనాన్ని Chrome OS వ్రాసేటప్పుడు, నేను అనువర్తనాన్ని ఉపయోగించలేను, కానీ అదే సమయంలో, నేను ఉపయోగించినప్పుడు ... OMG, చాలా బాగుంది.

