---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
கூகிள் டெவலப்பர் வலை புதுப்பிப்புகளில் எரிக் பிடல்மான் எழுதுகிறார்:

> Building for the web is a rocky adventure. It's hard enough to build a top-notch web app that nails performance and uses all the latest best practices. It's even harder to keep that experience great over time. As your project evolves, developers come on board, new features land, and the codebase grows. That Great Experience &#x2122; you once achieved may begin to deteriorate and UX starts to suffer! Feature Policy is designed to keep you on track.
> 
> With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout your site. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.
> 
> Here are examples of things you can do with Feature Policy:
> 
> * Change the default behavior of autoplay on mobile and third party videos.
> * Restrict a site from using sensitive APIs like camera or microphone.
> * Allow iframes to use the fullscreen API.
> * Block the use of outdated APIs like synchronous XHR and document.write().
> * Ensure images are sized properly (e.g. prevent layout thrashing) and are not too big for the viewport (e.g. waste user's bandwidth).
> 
> Policies are a contract between developer and browser. They inform the browser about what the developer's intent is and thus, help keep us honest when our app tries to go off the rails and do something bad. If the site or embedded third-party content attempts to violate any of the developer's preselected rules, the browser overrides the behavior with better UX or blocks the API altogether.


[முழு இடுகையைப் படிக்கவும்](https://developers.google.com/web/updates/2018/06/feature-policy).

இந்த நிலங்களை எவ்வாறு பார்க்க விரும்புகிறேன். டெவலப்பர்கள் இதைப் பற்றி கவலைப்பட மாட்டார்கள், அல்லது அவர்கள் அழுத்தம் கொடுப்பார்கள் என்று கவலைப்படுகிறேன். நான் [ட்விட்டர் மீது](https://twitter.com/Paul_Kinlan/status/1016445358401040386), நான் ஊக்கங்கள் பற்றி கவலைப்படுகிறேன் மற்றும் இந்த அம்சம் டெவலப்பர்கள் கிடைக்கும் என்று அம்சங்களை ஒரு பெரிய எண் கட்டுப்படுத்த அனுமதிக்க வேண்டும் என்று இணைக்க வேண்டும் நினைவகத்தை எடுத்துக் கொள்ளுங்கள், பக்கத்தை மெதுவாக நகர்த்தலாம் அல்லது தேவையற்ற முறையில் மூன்றாம் தரப்பினருக்கு உட்பொதிந்த பயனர் தனியுரிமையை கையாளலாம், உருவாக்குநர்கள் தங்கள் வியாபாரத்திற்கு விற்க முடியும். ஒரு உதாரணம் ** Play Store ஆனது PWA பட்டியலிடப்பட்டிருந்தால், பின்னர் பயன்பாட்டை தொடங்கும்போது தானாகவே பயன்படுத்தப்படும் கொள்கைகள் கொண்ட தொகுப்புடன் வரலாம், மேலும் நீங்கள் ஒரு டெவெலபர் எனில், கடை.

இந்த ஏபிஐ என்ன நடக்கிறது என்று பார்க்க நான் மிகவும் மகிழ்ச்சியடைகிறேன், அது மட்டுமே தங்கள் குழுக்கள் திருப்தி இல்லை என்பதை உறுதி செய்ய டெவலப்பர்கள் பயன்படுத்தப்படுகிறது கூட, அதை ஏற்று பார்க்க ஆர்வமாக இருக்கிறேன்.
