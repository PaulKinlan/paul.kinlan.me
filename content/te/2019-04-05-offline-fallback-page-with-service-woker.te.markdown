---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
సంవత్సరాల క్రితం, నేను స్థానిక అప్లికేషన్లు నెట్వర్క్ కనెక్టివిటీ లేకపోవడం స్పందించింది ఎలా కొన్ని పరిశోధన చేసింది. విశ్లేషణకు లింక్ను నేను కోల్పోయాను (ఇది Google+ లోనే ఉంది), విస్తృతమైన వ్యాఖ్యానం అనేక స్థానిక అనువర్తనాలు అవి నేరుగా పనిచేయకుండా తిరస్కరించే ఇంటర్నెట్కు ముడిపడి ఉన్నాయి. వెబ్ అనువర్తనాలు చాలా వంటివి ధ్వనులు, అయినప్పటికీ వాటిని వెబ్ నుండి వేరు చేసే విషయం అనుభవం ఇప్పటికీ &#39;బ్రాండ్&#39;గా ఉంది, బార్ట్ సింప్సన్ మీరు ఆన్లైన్ (ఉదాహరణకు) గా ఉండాలని, మరియు ఇంకా మెజారిటీ వెబ్ అనుభవాలు మీరు &#39;డినో&#39; ను పొందుతారు (chrome: // dino చూడండి).

మేము ఇప్పుడు చాలాకాలం సేవా వర్కర్ మీద పని చేస్తున్నాము, మరియు ఒక సేవా వర్కర్చే పేజీలను నియంత్రించటానికి చాలా ఎక్కువ సైట్లు ఉన్నాయని మేము చూసినప్పుడు, నెట్వర్క్కు కానప్పుడు చాలా మెజారిటీ సైట్లు కూడా ఒక ప్రాథమిక ఫాల్బ్యాక్ అనుభవాన్ని కలిగి లేవు అందుబాటులో.

మేము ఒక పూర్తిగా పతనం-వెనుక పేజీని ఎలా నిర్మించాలో, మీరు పూర్తిగా ఆఫ్ లైన్-ఫస్ట్ అనుభవాన్ని సృష్టించకూడదని ఊహించి, మరియు 10 నిమిషాల్లో అతను దానిని సృష్టించాడని ఎలాంటి గైడెన్స్ ఉంటే నా మంచి చమ్ జేక్ని నేను అడిగాను. [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

బ్రీవిటి కోసం, నేను ఈ కోడ్ను అతికించారు ఎందుకంటే ఇది కేవలం 20 లైన్లు మాత్రమే. ఇది ఆఫ్లైన్ ఆస్తులను కాష్ చేసి, ఆపై ప్రతి &#39;నావిగేషన్&#39; పొందడం కోసం అది లోపాలు (నెట్వర్క్ కారణంగా) చూస్తే ఆపై అసలు కంటెంట్ స్థానంలో ఆఫ్లైన్ పేజీని అందిస్తుంది.

```JavaScript
addEventListener('install', (event) => ; {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['offline.html', 'styles.css']);
  }());
});

addEventListener('fetch', (event) => {
  const { request } = event;

  // Always bypass for range requests, due to browser bugs
  if (request.headers.has('range')) return;
  event.respondWith(async function() {
    // Try to get from the cache:
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    try {
      // Otherwise, get from the network
      return await fetch(request);
    } catch (err) {
      // If this was a navigation, show the offline page:
      if (request.mode === 'navigate') {
        return caches.match('offline.html');
      }

      // Otherwise throw
      throw err;
    }
  }());
});
```

అది అంతా. యూజర్ ఆన్లైన్లో ఉన్నప్పుడు వారు డిఫాల్ట్ అనుభవాన్ని చూస్తారు.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-woker.jpeg"></figure>

మరియు యూజర్ ఆఫ్లైన్లో ఉన్నప్పుడు, వారు ఫాల్బ్యాక్ పేజీని పొందుతారు.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

ఈ సరళమైన స్క్రిప్ట్ చాలా శక్తివంతమైనది, మరియు అవును, అది ఇంకా మెరుగుపరుచుకున్నప్పుడు, నెట్వర్క్తో సమస్య ఉన్నప్పుడు మా వినియోగదారులకు మాట్లాడే విధంగా కూడా ఒక చిన్న మార్పు కూడా ప్రాథమికంగా మెరుగుపడగలదని నేను నమ్ముతున్నాను ప్రపంచవ్యాప్తంగా వినియోగదారుల కోసం వెబ్ యొక్క అవగాహన.


