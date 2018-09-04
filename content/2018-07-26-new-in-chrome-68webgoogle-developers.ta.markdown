---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Chrome இல் Homescreen இல் சேர்வதற்கு முக்கியமான மாற்றங்கள் பற்றி Pete LePage எழுதுகிறார்

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[முழு இடுகையைப் படிக்கவும்](https://developers.google.com/web/updates/2018/07/nic68).

பலர் முன்னர் 'முன்முடிவில்லாத பிரச்சனை` நிகழ்வைக் கையாளவில்லை என்பதால் முதலில் இது பற்றி கலவையான உணர்ச்சிகள் இருந்தன, அது திடீரென்று வலை APK இன் நிறுவல்களின் எண்ணிக்கையானது மிகவும் குறிப்பிடத்தக்க அளவுக்கு வீழ்ச்சியடையும் என்று நான் நினைக்கிறேன், ஆனால் உண்மையில் இதைச் செய்ய சரியானது என்று நினைக்கிறேன்.

இலக்கானது இணையத்தில் நடக்கும் எரிச்சலூட்டும் வேண்டுகோளின் எண்ணிக்கையை குறைப்பதாகும், மற்றும் பயனர் ஒரு PWA ஐ நிறுவ விரும்புவதாக நினைக்கும் போது, ​​நாம் எதிர்பார்க்கும் தொழில் நுட்பத்தில் தேவைப்படும் கடைசி விஷயம் என்னவென்றால், ஒரு PWA ஐ நிறுவ விரும்பும் போது எப்போது, ​​எப்போது வேண்டுமானாலும் ** நீங்கள் ** ஒரு நிறுவலுக்கு கேட்க வேண்டும் மற்றும் நீங்கள் பயனர்-சைகைக்கு பதில் செய்ய வேண்டும்.

சுமாரான விஷயம் என்னவென்றால், நாம் (Chrome) பயனர் அனுபவத்தை நிறுவ முடியும் என்பதை அறிந்திருப்பது மிகவும் சுலபமான வழிகளை அறிமுகப்படுத்துகிறது, இப்போது அது முதல் சுழலில் தோன்றும் சிறிய அடி பட்டை தான், மேலும் வட்டம் எதிர்காலத்தில் நாம் ஆராயலாம் அவர்கள் நடவடிக்கை எடுக்க முடியும் என்று பயனர் விடாமல் இன்னும் நுட்பமான வழிகள்.
