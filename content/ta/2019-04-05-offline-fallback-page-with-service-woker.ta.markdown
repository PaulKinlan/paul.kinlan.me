---
slug: offline-fallback-page-with-service-worker
date: 2019-04-05T18:17:22.207Z
title: 'Offline fallback page with service worker'
link: 'https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/index.html:6:9'
tags: [links, pwa, offline]
---
பல ஆண்டுகளுக்கு முன்னர், நெட்வொர்க் இணைப்பு இல்லாமைக்குரிய சொந்தப் பயன்பாடுகளுக்கு எப்படி பதிலளித்தேன் என சில ஆராய்ச்சி செய்தேன். பகுப்பாய்விற்கான இணைப்பை நான் இழந்துவிட்டேன் (இது Google+ இல் இருந்தது என்று நான் சத்தியம் செய்ய முடியும்), பரவலான கதை பல இணைய பயன்பாடுகள் பின்தொடர்ந்து இணையாக பிணைக்கப்பட்டுள்ளன, அவை நேரடியாக செயல்பட மறுக்கின்றன. வலை பயன்பாடுகள் நிறைய போன்ற ஒலிகள், எனினும் வலை இருந்து அவர்களை அமைக்க என்று விஷயம் அனுபவம் இன்னும் &#39;பிராண்ட்&#39; என்று, பார்ட் சிம்ப்சன் நீங்கள் ஆன்லைன் (உதாரணமாக) இருக்க வேண்டும் என்று சொல்ல வேண்டும், இன்னும் இன்னும் பெரும்பாலான வலை அனுபவங்களை நீங்கள் ஒரு &#39;டினோ&#39; (chrome: // dino பார்க்கவும்) பெறுவீர்கள்.

நாங்கள் சேவை ஊழியரிடம் நீண்ட காலமாக பணியாற்றி வருகிறோம், மேலும் ஒரு சேவை சேவையாளரால் கட்டுப்படுத்தப்படும் பக்கங்களைக் கொண்டிருக்கும் போது மேலும் பல தளங்களைக் காண்கிறோம், நெட்வொர்க்கில் இல்லாதபோது பெரும்பாலான தளங்கள் கூட அடிப்படை குறைவடையும் அனுபவத்தை கொண்டிருக்கவில்லை கிடைக்கும்.

நீங்கள் முற்றிலும் ஒரு ஆஃப்லைன் முதல் அனுபவத்தை உருவாக்க விரும்பவில்லை என்ற ஊகத்தின் மீது ஒரு பொது வீழ்ச்சியடைந்த பக்கத்தை எவ்வாறு கட்டியெழுப்ப வேண்டும் என்பதில் எந்த வழிகாட்டியும் இருந்தால் 10 நிமிடங்களுக்குள் அதை உருவாக்கியிருப்பேன் என்று என் நல்ல குரல் ஜேக் கேட்டேன். [Check it out](https://glitch.com/edit/#!/static-misc?path=sw-fallback-page/sw.js:6:9) .

இது 20 கோடுகள் நீளமாக இருப்பதால், நான் கீழே உள்ள குறியீட்டை ஒட்டி விட்டேன். இது ஆஃப்லைன் சொத்துக்களைப் பின்தொடர்கிறது, பின்னர் ஒரு &#39;வழிசெலுத்தலை&#39; பெறும் ஒவ்வொரு பிழையானது பிழைகள் (நெட்வொர்க்கின் காரணமாக) அதைப் பார்த்தால் அசல் உள்ளடக்கத்திற்கு பதிலாக ஆஃப்லைன் பக்கத்தை வழங்கவும் கிடைக்கும்.

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

அவ்வளவு தான். பயனர் ஆன்லைனில் இருக்கும்போது, இயல்புநிலை அனுபவத்தைப் பார்ப்பார்கள்.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-0.jpeg"></figure>

பயனர் ஆஃப்லைனில் இருக்கும்போது, அவர்கள் வீழ்ச்சிப் பக்கத்தைப் பெறுவார்கள்.

<figure><img src="/images/2019-04-05-offline-fallback-page-with-service-worker-1.jpeg"></figure>

இந்த எளிமையான ஸ்கிரிப்ட் நம்பமுடியாத சக்தி வாய்ந்ததாக இருக்கிறது, ஆமாம், அது இன்னும் மேம்படுத்தப்படலாம், பிணையத்துடன் ஒரு சிக்கல் இருக்கும்போது நாங்கள் எங்களது பயனர்களிடம் பேசுவதற்கு ஒரு எளிய மாற்றம் கூட அடிப்படையில் மேம்படுத்தலாம் என்று நம்புகிறேன் உலகம் முழுவதிலுமுள்ள பயனர்களுக்கான வலை உணர்தல்.

** புதுப்பிப்பு ** ஜெஃப்ரி போஸ்னிக் கின்ல்டி அனைத்து கோரிக்கைகளுக்கும் SW துவக்கத்தில் காத்திருக்க வேண்டியது இல்லை.
