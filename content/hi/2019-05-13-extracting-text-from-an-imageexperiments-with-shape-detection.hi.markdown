---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
मेरे पास Google IO के बाद का समय थोड़ा कम था और मैं अपने द्वारा की गई लंबी अवधि की खुजली को दूर करना चाहता था। मैं बस उस पाठ की प्रतिलिपि बनाना चाहता हूं जो ब्राउज़र में छवियों के अंदर होता है। बस इतना ही। मुझे लगता है कि यह सभी के लिए एक साफ सुथरा फीचर होगा।

सीधे क्रोम में कार्यक्षमता जोड़ना आसान नहीं है, लेकिन मुझे पता है कि मैं एंड्रॉइड पर इरादे प्रणाली का लाभ उठा सकता हूं और अब मैं वेब के साथ (या कम से कम क्रोम एंड्रॉइड पर) कर सकता हूं।

वेब प्लेटफ़ॉर्म में दो नए अतिरिक्त - शेयर लक्ष्य स्तर 2 (या मैं इसे साझा फ़ाइल कॉल करना चाहते रूप में) और `TextDetector` आकार का पता लगाने एपीआई में - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) ।

मूल कार्यान्वयन अपेक्षाकृत सीधे आगे की ओर है, आप सेवा कार्यकर्ता में एक शेयर लक्ष्य और एक हैंडलर बनाते हैं, और फिर एक बार जब आपके पास यह छवि होती है कि उपयोगकर्ता ने आपको साझा किया है तो आप `TextDetector` पर `TextDetector` चलाते हैं।

`Share Target API` आपके वेब एप्लिकेशन को मूल साझाकरण उप-प्रणाली का हिस्सा होने की अनुमति देता है, और इस मामले में अब आप इसे अपने `Web App Manifest` अंदर घोषित करके सभी `image/*` प्रकारों को संभालने के लिए पंजीकरण कर सकते हैं।

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

जब आपका PWA स्थापित हो जाता है, तो आप इसे उन सभी स्थानों पर देखेंगे जहाँ आप निम्न प्रकार से चित्र साझा करते हैं:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

`Share Target` API एक फॉर्म पोस्ट की तरह फाइलों को साझा करने का व्यवहार करता है। जब फ़ाइल को वेब ऐप में साझा किया जाता है, तो सेवा कर्मी को सक्रिय किया जाता है फ़ाइल डेटा के साथ `fetch` हैंडलर लागू किया जाता है। डेटा अब सेवा कार्यकर्ता के अंदर है, लेकिन मुझे इसकी वर्तमान विंडो में आवश्यकता है ताकि मैं इसे संसाधित कर सकूं, सेवा को पता है कि किस विंडो ने अनुरोध किया है, ताकि आप आसानी से ग्राहक को लक्षित कर सकें और उसे डेटा भेज सकें।

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

एक बार जब छवि उपयोगकर्ता इंटरफ़ेस में होती है, तो मैं इसे टेक्स्ट डिटेक्शन एपीआई के साथ संसाधित करता हूं।

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

सबसे बड़ा मुद्दा यह है कि ब्राउज़र स्वाभाविक रूप से छवि को घुमाता नहीं है (जैसा कि आप नीचे देख सकते हैं), और आकृति डिटेक्शन एपीआई को सही रीडिंग ओरिएंटेशन में पाठ की आवश्यकता है।

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

मैंने रोटेशन का पता लगाने के लिए [EXIF-Js library](https://github.com/exif-js/exif-js) का उपयोग करने के बजाय आसान का उपयोग किया और फिर छवि को फिर से उन्मुख करने के लिए कुछ बुनियादी कैनवास हेरफेर किया।

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

और वोइला, यदि आप एक छवि को ऐप में साझा करते हैं तो यह छवि को घुमाएगी और फिर इसे उस पाठ के आउटपुट को वापस करने का विश्लेषण करेगी जो इसे मिला है।

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

इस छोटे से प्रयोग को बनाने में अविश्वसनीय रूप से मज़ा आया, और यह मेरे लिए तुरंत उपयोगी हो गया है। हालाँकि, यह [inconsistency of the web platform](/the-lumpy-web/) उजागर करता है। ये API सभी ब्राउज़रों में उपलब्ध नहीं हैं, वे क्रोम के सभी संस्करण में भी उपलब्ध नहीं हैं - इसका मतलब है कि जैसा कि मैंने इस लेख को क्रोम ओएस लिखा है, मैं ऐप का उपयोग नहीं कर सकता, लेकिन उसी समय, जब मैं इसका उपयोग कर सकता हूं ... OMG, बहुत अच्छा।

