---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31.000Z
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


ஒரு [சமீபத்திய திட்டம்](https://webgdedeck.com/) இல், சேவையகம், சேவை ஊழியர் மற்றும் வாடிக்கையாளர் ஆகியவற்றுக்கு இடையேயான தர்க்கம் போன்றவற்றை பகிர்ந்து கொள்ள விரும்புகிறேன். இந்த திட்டம் அடிப்படையில் ஒரு எளிய RSS ஊட்ட வாசகர், அது RSS ஊட்டங்களை எடுக்கும், தரவை பாகுபடுத்துகிறது மற்றும் அவற்றை நெடுவரிசைகளின் ஒரு நல்ல தொகுப்பை (TweetDeck போன்றது) சேர்த்து, ஒரு ஒற்றை இணைக்கப்பட்ட பட்டியலையும் இணைக்கிறது.

ஏனென்றால் நான் ஆர்எஸ்எஸ் ஊட்டங்களை எடுத்து என் பக்கத்தில் காட்டிக் கொண்டிருப்பதால், முடிந்தவரை எந்தவிதமான குறைபாடுமின்றி செயல்படவில்லை என உறுதியாக இருக்க வேண்டும். நான் விரும்பும் அளவுக்கு உள்ளீட்டை நான் சுத்தப்படுத்த முடியும், ஆனால் என் சொந்த திறமைகள் எனக்குத் தெரியும், நான் சில பயனர்கள் ஒரு RSS feed ஐ கையாள முடியும், நான் ஸ்கிரிப்ட்களை இயங்கச் செய்வேன், படங்களை இறக்குமதி செய்வேன் அல்லது வேறு எந்த மூன்றாம் தரப்பு என் தளத்தின் சூழல்.

இணைய-தளம்-உள்ளடக்க-பாதுகாப்பு-கொள்கை (CSP) வழியாக ஒரு தளத்தை பூட்டுவதற்கான திறனை வழங்குகிறது. சிஎஸ்பி போன்ற ஸ்கிரிப்ட், பாணிகள், படங்கள் முதலியவற்றைப் போன்ற உள்ளடக்கத்தை நாங்கள் கோருவதற்கு வெளிப்புற ஆதாரங்களை பூட்ட முடியும். XSS வகைகளின் தாக்குதல்களின் அனைத்து மேனரையும் தடுக்க இது ஒரு வரிக்கான ஸ்கிரிப்ட்ஸை இயக்க ஒரு பக்கத்திற்கான திறனை நீங்கள் பூட்ட முடியும்.

அதை பயன்பாட்டை சேர்க்க அழகான எளிது.


```
`default-src 'self';`
```


எனினும் .... எனக்கு பல சிக்கல்கள் இருந்தன.

1. நான் பக்கம் உள்ள பாணியை இன்லைன் உருவாக்க மற்றும் நான் இன்லைன் ஸ்கிரிப்டை இயக்க வேண்டும். 2. கூகுள் அனலிட்டிக்ஸ் சேர்க்க வேண்டும், அதில் பக்கத்தை இயக்க இன்லைன் ஸ்கிரிப்ட் தேவைப்படுகிறது.

CSP ஸ்கிரிப்டுகள் மற்றும் பாணியை இன்லைன் மூலம் இயக்கலாம், நீங்கள் 'பாதுகாப்பற்ற-eval` என்ற ஸ்கிரிப்ட்டுகள் என்ற விருப்பத்தை இயக்கினால், CSP ஆதரிக்கும் எந்தவொரு பாதுகாப்புகளையும் கடந்து செல்லும்.

இன்லைன் ஸ்கிரிப்ட்ஸை இயக்கவும், இன்னும் சிஎஸ்பி பாதுகாப்பிற்காகவும், சிஎஸ்பி இரண்டு கருவிகளை வழங்குகிறது. நான் பயன்படுத்திய ஒன்று 'ஒரு' என்று அழைக்கப்படுகிறது. Nonce என்பது CSP HTTP தலைப்பு மீது நீங்கள் உருவாக்கிய சீரற்ற ஐடி மற்றும் அதனுடன் தொடர்புடைய இன்லைன் ஸ்கிரிப்ட்டுடன் நீங்கள் கணக்கில் எடுத்துக்கொள்ளும்.

** HTTP தலைப்பில் CSP சரம் **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** இன்லைன் ஸ்கிரிப்ட் ** பயன்படுத்துகிறது


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


மேற்கூறிய குறியீடு நன்றாக வேலை செய்கிறது மற்றும் நாம் CSP உடன் தளத்தை பாதுகாக்கும் போது பகுப்பாய்வு சரியாக வேலை செய்வதை எளிதாக்குகிறது.

ஒவ்வொரு வலை கோரிக்கைக்காக, நீங்கள் ஒரு தனிப்பட்ட 'தேவையற்ற' மதிப்பைக் கொண்டிருக்க வேண்டும் மற்றும் நான் இதை {`nonce.analytics}" வழியாக செய்கிறேன். இது நான் சர்வரில் உருவாக்கும் ஒரு மதிப்பு மற்றும் ஒரு டெம்ப்ளேட்டின் வழியாக விண்ணப்பிக்கிறது. நீங்கள் ஒரு nonce மதிப்பு பயன்படுத்தினால் உலாவி ஸ்கிரிப்ட் உள்ளடக்கத்தை இயக்க மறுக்க முடியாது.

நான் ஒரு சிறிய பிரச்சனையை உருவாக்கியுள்ளேன். ஒரே பயனரால் மீண்டும் பயன்படுத்தக்கூடிய ஒரு தனித்துவமான மதிப்பை உருவாக்கும் ஏதோ தேவை. நான் '[மூல] - [date.now + கோரிக்கை-எண்ணிக்கை]' போதிய அளவு போதிய அளவுக்கான மதிப்பீடு என்று உணர்ந்தேன்.

'மூல' என்னை ஒரு பெயர்வெளியை சேர்க்க, மற்றும் date.now () + எப்போதும் அதிகரித்து வரும் கோரிக்கை எண்ணை எனக்கு ஒப்பீட்டளவில் நிலையான மறுஅளவல்லாத மதிப்புகளை வழங்குகிறது.

நான் பின்வரும் செயல்பாட்டை பயன்படுத்தி nonce உருவாக்க:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


நன்றாக இருக்கிறது. இருப்பினும், ஒரு சேவை ஊழியரில் எனது பக்கங்கள் அனைத்தையும் நான் கேச் செய்தேன், அதாவது நான் வெறுமனே கேச் இருந்து உள்ளடக்கத்தை சேவையிடப்பட்டிருந்தால், அல்லாத மதிப்புகள் மறுபடியும் மறுபடியும் பயன்படுத்தப்படாது, அதனால் செயல்படுத்தப்படாது.

அதிர்ஷ்டவசமாக, என் சேவையகம் மற்றும் சேவையக ஊழியர்களிடையே பகிர்வு தர்க்கம் இருக்கிறது, இது என் குறியீட்டின் ஒரு மைய இடத்தில் எனக்கு தேவையான எதையும் உருவாக்க அனுமதிக்கிறது. சேவையகம் மற்றும் சேவையக ஊழியர்களிடமிருந்து கோரிக்கை ஹேண்டலர்களில் ஒவ்வொன்றிலும் இதைச் செய்தேன் 'சேவையகம்' அல்லது 'சேவை-தொழிலாளி'க்கு நான்' என்ஜினேட் இன்ரெகமென்ட்டல்நியான்ஸ் 'செயல்பாட்டில்' மூல 'அளவுருவைப் பயன்படுத்துகிறேன். இந்த மூல அளவுருவைப் பயன்படுத்துவதால் சேவையகத்தின் மூலம் உருவாக்கப்பட்ட ஒரு nonce மதிப்பு சேவை ஊழியரால் ஏற்றப்பட்ட பக்கத்துடன் மோதியதில்லை என நான் உறுதிபடுத்திக் கொள்ள முடியும்.

இந்த முறை எனக்கு நன்றாக வேலை செய்தது. இது என் அனலிட்டிக்ஸ் தேவைப்படும் இன்லைன் ஸ்கிரிப்ட்களை அனுமதிக்கும்படி அனுமதித்துள்ளது, அதே நேரத்தில் எனது பக்கத்திலுள்ள நம்பகமான குறியீட்டை ஊடுருவி அல்லது இயங்குவதன் மூலம் எந்த மூன்றாம் தரப்பினையும் நிறுத்துகிறது.

நான் திட்டத்தில் பயன்படுத்தப்படும் குறியீடாக இருக்கிறது. என் பக்கங்களில் பல இடங்களில் என்னிடமிருந்து மதிப்புகளை வைத்திருக்கிறேன், ஒவ்வொரு கோரிக்கைக்காகவும் அவற்றை உருவாக்கி, பின்னர் என் மாதிரியாக்கம் மற்றும் HTTP தலைப்புக்கு ஒரே நேரத்தில் பயன்படுத்துகிறேன்.

#### common.js - பகிர்வு தர்க்கம்


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - கையாளுதலை பெறுங்கள்


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - கோரிக்கை கையாளுதல்


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```