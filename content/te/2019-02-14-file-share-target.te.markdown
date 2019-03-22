---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

నేను వెబ్ అనువర్తనాల కోసం అనువర్తనాల ప్రపంచంలో సమర్థవంతంగా పోటీ పడతానని, వారు వినియోగదారులు అనువర్తనాలను ఆశించే స్థలాలన్నిటిలో విలీనం కావాలి. వెబ్ ప్లాట్ఫారమ్ యొక్క ప్రధాన తప్పిపోయిన ముక్కలలో అంతర్-అనువర్తన సమాచారము ఒకటి, మరియు ప్రత్యేకంగా చివరి ప్రధాన [data out of their silo](/unintended-silos/) లక్షణాలలో ఒకటి స్థానిక స్థాయి భాగస్వామ్యము: వెబ్ అనువర్తనాలు [data out of their silo](/unintended-silos/) మరియు ఇతర వెబ్ సైట్లు మరియు అనువర్తనాలలో పొందవలసి ఉంటుంది; వారు ఇతర స్థానిక అనువర్తనాలు మరియు సైట్ల నుండి డేటాను స్వీకరించగలరు.

ఫైల్ షేర్ టార్గెట్ API ఇప్పుడు Chrome కానరీలో ఉన్న ఒక API యొక్క గేమ్-మారకం. API లను [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) విస్తరించింది, [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) అనువర్తనాలను మరియు సైట్లను సాధారణ లింక్లను మరియు వెబ్ సైట్లకు వచన భాగస్వామ్య కార్యచరణలో వాటిని సమగ్రపరచడానికి అనుమతిస్తుంది.

ఈ చాలా స్థిర ఫైల్ బ్లాగ్ వెబ్ షేర్ టార్గెట్ API ను ఉపయోగించుకుంటుంది, అందుచే నేను త్వరగా [share links](/web-share-target-api/) ను ఏ Android అప్లికేషన్ నుండి అయినా ఆసక్తికరమైనదిగా మరియు గత వారం [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . ఈ పోస్ట్ నేను ఎలా చేసాడో అన్నది (మరియు జేక్ అర్చిబాల్డ్ నుండి కొన్ని కోడ్ను దొంగిలించారు - Tbf అతను [squoosh.app](https://squoosh.app/) లో చేస్తున్న అనుసంధానం కోసం చాలా దోషాలను చేశాడు).

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) అనేది చాలా నవీన API, ఇది పూర్తిగా పురోగమనంగా ఉంది. మీ అనువర్తనం ఫారమ్ `POST` అభ్యర్ధనలను నిర్వహించగలిగితే, మీరు ఈ API తో సులభంగా కలిసిపోతారు. ప్రాథమిక ప్రవాహం: స్థానిక పికర్ నుండి వినియోగదారు మీ అనువర్తనాన్ని ఎంచుకున్నప్పుడు, Chrome మీ సర్వర్కు ఫారమ్ `POST` అభ్యర్థనను పంపుతుంది, మీరు దానితో ఏమి చేస్తున్నారో (సేవ సేవాలో లేదా సర్వర్లో నిర్వహించడం) మీ ఇష్టం.

మీ వెబ్ అనువర్తనానికి ఫైళ్లను భాగస్వామ్యం చెయ్యడానికి మద్దతునివ్వడానికి మీరు రెండు విషయాలు చేయాలి:

1. మానిఫెస్ట్ ఫైల్ ద్వారా ఫైళ్లను భాగస్వామ్యం చేయడానికి మద్దతును ప్రకటించండి,
2. మీ సర్వీస్ వర్కర్లో ఫారమ్ `POST` అభ్యర్ధనను నిర్వహించండి.

మానిఫెస్ట్ వెబ్ అనువర్తనానికి హోస్ట్ అప్లికేషన్ నుండి భాగస్వామ్యం ఎలా మ్యాప్ చెయ్యాలి హోస్ట్ వ్యవస్థకు ప్రకటించింది. దిగువ ఉన్న మానిఫెస్ట్లో ఇది తప్పనిసరిగా &quot;చిత్రం / ఫైల్ &#39;&#39; / &#39;/ రూపం / ఇమేజ్ /&#39; కు ఫారం POST అభ్యర్థనను రూపొందిస్తుంది మరియు డేటా &#39;ఫైల్&#39; అనే పేరును టైప్ చేయండి.

* Manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
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
  },
  "display": "standalone",
  "scope": "/share/"
}
```

వినియోగదారు మీ వెబ్ అప్లికేషన్కు పంచుకున్న తర్వాత, పేలోడ్ ఫైల్ డేటాతో మీ సైట్కు వెబ్ అభ్యర్థనను Chrome చేస్తుంది.

మీ సేవా కార్యకర్త లోపల POST అభ్యర్ధనను మీరు నిర్వహించాలని సిఫార్సు చేయబడింది, తద్వారా 1) ఇది వేగవంతమైనది, 2) నెట్వర్క్కి స్థితిస్థాపకంగా అందుబాటులో ఉండదు. మీరు ఈ క్రింది విధంగా దీన్ని చేయవచ్చు:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

పైన సంభవించే ఆసక్తికరమైన విషయాలు కొన్ని ఉన్నాయి, ఇవి త్వరగా సంగ్రహంగా చెప్పవచ్చు:

* మళ్ళింపును నిర్వహించడం ద్వారా `POST` అభ్యర్థన ఫలితంగా UI ని `POST` .
* `event.request.formData()` ద్వారా ఫారమ్ ద్వారా సమర్పించిన డేటాను చదవండి
* ఓపెన్ విండోకు డేటా పంపండి (ఇది వినియోగదారుని మొదటి బిందువుకు మళ్లించే UI అవుతుంది).

ఇది మీ సేవా కార్మికుడికి పోస్ట్ చేయబడిన డేటాతో మీరు పూర్తిగా చేస్తున్నది, కానీ నా అనువర్తనం విషయంలో నేను నేరుగా UI లో చూపించాల్సిన అవసరం ఉంది, కనుక యూజర్ ఉపయోగించుకుంటుంది విండోను మరియు `postMessage` అక్కడ డేటా.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

మరియు దాని గురించి. మీరు ఇప్పటికే మీ వెబ్ ఫారమ్ల కోసం ఒక API అంతిమ కేంద్రంగా ఉంటే, ఇది మీ సైట్కు మీరు చేసే సులభమైన, ఇంకా శక్తివంతమైన జోడింపు.

వెబ్ భాగస్వామ్యం టార్గెట్ API చాలా శక్తివంతమైన ప్లాట్ఫారమ్ ఆప్టిమైటేడ్, ఇది వెబ్ హోస్ట్స్ వారి హోస్ట్ ప్లాట్ఫారమ్లలో కలిగి ఉన్న మరొక అడ్డంకిని విచ్ఛిన్నం చేస్తుంది.