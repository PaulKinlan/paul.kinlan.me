---
slug: onappinstalled
date: 2018-04-13T13:20:31.000Z
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


சமீபத்தில் Chrome (குறைந்தது [2017](https://crbug.com/621393)) என்ற சாளரத்தில் `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled) இல் செயல்படுத்தப்பட்டது. ஒரு பயனர் முற்போக்கான வலை பயன்பாட்டை நிறுவும் போது, ​​Homescreen ஏபிஐ ('onbeforeinstallprompt' நிகழ்வை வழியாக வழங்கப்படும் நிகழ்வில் உடனடி () செயல்பாடு வழியாக _or_ இப்போது முக்கியமாக கையேடு முறையை வீட்டுக்கு அனுப்பவும்.

இது மிகவும் பயனுள்ள கூடுதலாகும், ஏனென்றால் முற்போக்கான வலை பயன்பாட்டை நிறுவ கணினி பதாகைகள் அல்லது மெனு பொத்தான்களைப் பயன்படுத்தும் உடனடி நபர்களிடம் நீங்கள் ஈடுபடுவதை பார்க்க அனுமதிக்கிறது.

நான் அதை [Airhorner](https://airhorner.com) இல் சேர்த்துள்ளேன், எனவே DevTools இணைக்கப்பட்டுள்ளால் அதை நீங்கள் நடவடிக்கை எடுக்கலாம். 'Onbeforeststromprompt` மற்றும் `onappinstalled` ஆகியவற்றை நிர்வகிக்கும் கீழே உள்ள குறியீடு கீழே உள்ளது - இந்த வழக்கில் நான் தனிபயன் பொத்தானை நிறுவு வரியில் தடுக்க, onbeforeinstallprompt ஐ பயன்படுத்தவும் மற்றும் UI ஐ சுத்தம் செய்ய மற்றும் சில அடிப்படை பகுப்பாய்வு செய்ய` onappinstalled`.


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

