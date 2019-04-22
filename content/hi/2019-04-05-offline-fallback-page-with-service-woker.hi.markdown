---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
वर्षों पहले, मैंने कुछ शोध किया कि कैसे नेटवर्क्स कनेक्टिविटी ने नेटवर्क कनेक्टिविटी की कमी का जवाब दिया। जब तक मैंने विश्लेषण के लिंक को खो दिया है (मैं यह Google+ पर शपथ ले सकता था), ओवररचिंग कथा यह थी कि कई देशी अनुप्रयोगों को इंटरनेट से अटैच किया जाता है कि वे सीधे कार्य करने से इनकार करते हैं। बहुत सारे वेब ऐप की तरह लगता है, जो चीज़ उन्हें वेब से अलग करती है, हालांकि यह अनुभव अभी भी &#39;ऑन-ब्रांड&#39; है, बार्ट सिम्पसन आपको बताएगा कि आपको ऑनलाइन (उदाहरण के लिए) होने की आवश्यकता है, और अभी तक अधिकांश वेब अनुभव आपको एक &#39;डिनो&#39; (क्रोम: // डिनो देखें) मिलते हैं।

हम लंबे समय से सेवा कार्यकर्ता पर काम कर रहे हैं, और जब तक हम देख रहे हैं कि अधिक से अधिक साइटों में सेवा कार्यकर्ता द्वारा नियंत्रित पृष्ठ हैं, तो अधिकांश साइटों के पास तब भी बुनियादी कमी नहीं होती है जब नेटवर्क नहीं होता उपलब्ध।

मैंने अपने अच्छे चुम जेक से पूछा कि क्या हम इस बात पर कोई दोषी हैं कि इस धारणा पर एक जेनेरिक फॉल-बैक पेज कैसे बनाया जाए जिसे आप पूरी तरह से ऑफ़लाइन-पहला अनुभव नहीं बनाना चाहते हैं, और 10 मिनट के भीतर उन्होंने इसे बनाया था। [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) ।

संक्षिप्तता के लिए, मैंने नीचे दिए गए कोड को चिपकाया है क्योंकि यह केवल लगभग 20 लाइनें लंबी है। यह ऑफ़लाइन संपत्तियों को कैश करता है, और फिर प्रत्येक भ्रूण के लिए जो एक &#39;नेविगेशन&#39; भ्रूण है, यह देखेगा कि क्या यह त्रुटि (नेटवर्क के कारण) है और फिर मूल सामग्री के स्थान पर ऑफ़लाइन पृष्ठ को प्रस्तुत करेगा।

```JavaScript
addEventListener('install', (event) => {
  event.waitUntil(async function() {
    const cache = await caches.open('static-v1');
    await cache.addAll(['offline.html', 'styles.css']);
  }());
});

// See https://developers.google.com/web/updates/2017/02/navigation-preload#activating_navigation_preload
addEventListener('activate', event => {
  event.waitUntil(async function() {
    // Feature-detect
    if (self.registration.navigationPreload) {
      // Enable navigation preloads!
      await self.registration.navigationPreload.enable();
    }
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
      // See https://developers.google.com/web/updates/2017/02/navigation-preload#using_the_preloaded_response
      const response = await event.preloadResponse;
      if (response) return response;

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

बस इतना ही। जब उपयोगकर्ता ऑनलाइन होगा तो उन्हें डिफ़ॉल्ट अनुभव दिखाई देगा।

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

और जब उपयोगकर्ता ऑफ़लाइन होगा, तो उन्हें फ़ॉलबैक पेज मिलेगा।

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

मुझे यह सरल स्क्रिप्ट अविश्वसनीय रूप से शक्तिशाली लगती है, और हाँ, जबकि यह अभी भी सुधार किया जा सकता है, मुझे विश्वास है कि जिस तरह से नेटवर्क के साथ एक समस्या है, हम अपने उपयोगकर्ताओं से बात करने के तरीके में भी एक साधारण बदलाव करते हैं, जिसमें मौलिक रूप से सुधार करने की क्षमता है दुनिया भर के उपयोगकर्ताओं के लिए वेब की धारणा।

** अद्यतन ** जेफरी पॉस्निक किल्डी ने मुझे नेविगेशन प्रीलोड का उपयोग करने के बारे में याद दिलाया कि सभी अनुरोधों के लिए SW बूट पर इंतजार नहीं करना होगा, यह विशेष रूप से महत्वपूर्ण है यदि आप केवल _failed_ नेटवर्क अनुरोधों को नियंत्रित कर रहे हैं।
