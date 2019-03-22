---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

வலை பயன்பாடுகளுக்கு பயன்பாடுகளில் உலகில் திறம்பட போட்டியிட, பயனர்கள் பயன்பாடுகளை எதிர்பார்க்கும் எல்லா இடங்களுக்கும் ஒருங்கிணைக்கப்பட வேண்டும் என்று அடிக்கடி நான் சொன்னேன். இணைய பயன்பாட்டிற்கான தகவல்தொடர்பு வலைத் தளத்தின் முக்கிய காணப்படாத துண்டுகளில் ஒன்றாகும், குறிப்பாக முக்கிய பிரதான அம்சங்களில் ஒன்று இயல்பு நிலை நிலை பகிர்வு ஆகும்: வலை பயன்பாடுகள் [data out of their silo](/unintended-silos/) மற்றும் பிற வலைத்தளங்கள் மற்றும் பயன்பாடுகளில் பெற முடியும்; பிற சொந்த பயன்பாடுகள் மற்றும் தளங்களில் இருந்து தரவைப் பெற முடியும்.

கோப்புப் பகிர்வு இலக்கு ஏபிஐ என்பது இப்போது Chrome கேனரி மொழியில் இருக்கும் ஏபிஐ ஒரு விளையாட்டு-சேஞ்ச் ஆகும். பயன்பாடுகள் மற்றும் தளங்கள் எளிமையான இணைப்புகள் மற்றும் வலைப்பக்கங்களுக்கான அமைப்புகளை பகிர்வு செயல்பாடுகளில் ஒருங்கிணைப்பதன் மூலம் ஒருங்கிணைக்க [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) ஐ நீட்டிக்கிறது.

இந்த நிலையான கோப்பு வலைப்பதிவு இணைய பகிர்வு இலக்கு ஏபிஐ பயன்படுத்துகிறது, அதனால் நான் விரைவாக [share links](/web-share-target-api/) ஐ எந்த Android பயன்பாட்டிலிருந்தும் சுவாரசியமாகக் காணலாம், கடந்த வாரம் [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . இந்த இடுகை நான் எப்படி செய்தேன் (Jake Archibald இலிருந்து சில குறியீட்டை திருடினார் - [squoosh.app](https://squoosh.app/) அவர் [squoosh.app](https://squoosh.app/) செய்து வருகின்ற ஒரு ஒருங்கிணைப்புக்கு நிறைய பிழைகள் செய்தார்).

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) என்பது மிகவும் புதுமையான ஏபிஐ ஆகும், அது முழுமையாக முற்போக்கானது. உங்கள் விண்ணப்ப படிவம் `POST` கோரிக்கைகளை கையாள முடியும் என்றால், இந்த API உடன் எளிதாக ஒருங்கிணைக்க முடியும். அடிப்படை ஓட்டம்: பயனர் உங்கள் சொந்த பயன்பாட்டிலிருந்து தேர்வு செய்யும் போது, Chrome உங்கள் சர்வரில் ஒரு படிவத்தை `POST` கோரிக்கையை அனுப்பும், இது உங்களுடன் என்ன செய்வது (சேவை ஊழியர் அல்லது சேவையகத்தில் கையாள).

உங்கள் வலை பயன்பாட்டில் கோப்புகளை பகிர்ந்து கொள்ள ஆதரவைச் சேர்க்க நீங்கள் இரண்டு காரியங்களைச் செய்ய வேண்டும்:

1. மேனிஃபெஸ்ட் கோப்பின் மூலம் கோப்புகளைப் பகிர்ந்து கொள்வதற்கான ஆதரவை அறிவிக்கவும்,
2. உங்கள் சேவையில் `POST` படிவம் `POST` கோரிக்கையை `POST` .

வலை பயன்பாட்டிற்கு புரவலன் பயன்பாட்டிலிருந்து பகிர்வு எவ்வாறு இடப்பட வேண்டும் என்பதை ஹோஸ்ட் சிஸ்டம் மேனிஃபெஸ்ட் அறிவிக்கிறது. கீழேயுள்ள மேனிஃபெஸ்டில், &quot;ஒரு பயனர் கோப்பு வகை &#39;படத்தை / *&#39; ஒரு படிவத்தை POST கோரிக்கையை &#39;/ share / image /&#39; என்று உருவாக்கி தரவு &#39;கோப்பு&#39; &#39;என பெயரிடுக.

* Manifest.json என்பது *
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

பயனர் உங்கள் வலை பயன்பாட்டில் ஒருமுறை பகிரப்பட்டவுடன், கோப்பை தரவு நிரலால் உங்கள் தளத்திற்கு வலை கோரிக்கையை Chrome உருவாக்கும்.

உங்கள் சேவை ஊழியருக்குள் POST கோரிக்கையை நீங்கள் கையாள வேண்டும் என்று பரிந்துரைக்கப்படுவதால் 1) அது வேகமானது, 2) நெட்வொர்க்கிற்கு எளிதில் கிடைக்காது. இதை நீங்கள் பின்வருமாறு செய்யலாம்:

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

மேலே நடக்கும் சுவாரஸ்யமான இரண்டு விஷயங்கள் உள்ளன, இது விரைவில் சுருக்கமாக விவரிக்கப்படுகிறது:

* `POST` கோரிக்கை விளைவாக திருப்பிச் செலுத்துவதன் மூலம் `POST` .
* `event.request.formData()` வழியாக படிவத்தின்படி சமர்ப்பிக்கப்பட்ட தரவைப் `event.request.formData()`
* திறந்த சாளரத்திற்கு தரவை அனுப்பவும் (இது பயனரின் முதல் கட்டத்தில் நாம் திருப்பி அனுப்பிய UI ஆகும்).

உங்கள் சேவையக ஊழியருக்கு அனுப்பப்பட்ட தரவுடன் நீங்கள் என்ன செய்தாலும், அது என் பயன்பாட்டின் விஷயத்தில் நேரடியாக UI இல் காட்டப்பட வேண்டும், எனவே நான் பயனரைப் பயன்படுத்தும் சாளரத்தையும் `postMessage` அங்கு தரவு.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

அது பற்றி தான். உங்கள் இணைய படிவங்களுக்கு ஏபிஐ முடிச்சு ஏற்கனவே உங்களிடம் இருந்தால், இது உங்கள் தளத்தில் செய்யக்கூடிய ஒரு எளிய, இன்னும் சக்திவாய்ந்த கூடுதலாகும்.

இணைய பகிர்வு இலக்கு ஏபிஐ நம்பமுடியாத சக்தி வாய்ந்த மேடையில் பழமையானது, வலை பயன்பாடுகள் தங்கள் புரவலன் தளங்களில் வைத்திருக்கும் மற்றொரு தடையை உடைக்கிறது.