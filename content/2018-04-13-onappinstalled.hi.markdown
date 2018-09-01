---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


क्रोम हाल ही में (कम से कम [2017] में (https://crbug.com/621393)) लागू 'window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web / एपीआई / खिड़की / onappinstalled)। यह तब ट्रिगर होता है जब कोई उपयोगकर्ता 'ऑनबेयरइंस्टॉलप्रोम्प्ट' ईवेंट के माध्यम से दिए गए ईवेंट पर होमस्क्रीन एपीआई (प्रॉम्प्ट () फ़ंक्शन) के माध्यम से एक प्रगतिशील वेब ऐप इंस्टॉल करता है। _Or_ अब होमस्क्रीन में जोड़ने की मैन्युअल विधि के माध्यम से अधिक महत्वपूर्ण है।

यह एक बहुत ही उपयोगी जोड़ है क्योंकि यह आपको प्रगतिशील वेब ऐप इंस्टॉल करने के लिए सिस्टम बैनर या मेनू बटन का उपयोग करने वाले त्वरित बनाम लोगों पर जुड़ाव देखने की अनुमति देता है।

मैंने इसे [एयरहोर्नर](https://airhorner.com) में जोड़ा है ताकि यदि DevTools संलग्न हो तो आप इसे क्रिया में देख सकते हैं। कोड नीचे है जो 'onbeforeinstallprompt` और' onappinstalled 'प्रबंधित करता है - इस मामले में मैं एक कस्टम बटन पर इंस्टॉल प्रॉम्प्ट को डिफॉल्ट करने के लिए onforeforeprompt का उपयोग करता हूं, और यूआई को साफ करने और कुछ बुनियादी विश्लेषण करने के लिए' onappinstalled` का उपयोग करता हूं।


```javascript
const Installer = function(root) {
  let promptEvent;

  const install = function(e) {
    if(promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice
        .then(function(choiceResult) {
          // The user actioned the prompt (good or bad).
          // good is handled in 
          promptEvent = null;
          ga('send', 'event', 'install', choiceResult);
          root.classList.remove('available');
        })
        .catch(function(installError) {
          // Boo. update the UI.
          promptEvent = null;
          ga('send', 'event', 'install', 'errored');
          root.classList.remove('available');
        });
    }
  };

  const installed = function(e) {
    promptEvent = null;
    // This fires after onbeforinstallprompt OR after manual add to homescreen.
    ga('send', 'event', 'install', 'installed');
    root.classList.remove('available');
  };

  const beforeinstallprompt = function(e) {
    promptEvent = e;
    promptEvent.preventDefault();
    ga('send', 'event', 'install', 'available');
    root.classList.add('available');
    return false;
  };

  window.addEventListener('beforeinstallprompt', beforeinstallprompt);
  window.addEventListener('appinstalled', installed);

  root.addEventListener('click', install.bind(this));
  root.addEventListener('touchend', install.bind(this));
};
```

