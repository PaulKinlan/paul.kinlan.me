---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Google डेवलपर के वेब अपडेट पर एरिक बिडलमैन लिखते हैं:

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


[पूर्ण पोस्ट पढ़ें](https://developers.google.com/web/updates/2018/06/feature-policy)।

मुझे यह देखने में दिलचस्पी है कि यह भूमि कैसे है। मुझे चिंता है कि डेवलपर्स इस पर ध्यान नहीं देंगे, या वे दबाव डाले जाएंगे। जैसा कि मैंने कहा [ट्विटर पर](https://twitter.com/Paul_Kinlan/status/1016445358401040386), मुझे प्रोत्साहनों की चिंता है और हमें इस तथ्य को गठबंधन करने की आवश्यकता है कि यह सुविधा डेवलपर्स को उपलब्ध सुविधाओं की एक बड़ी संख्या को नियंत्रित करने देगी या तो मेमोरी ले लो, पेज को धीमा कर सकते हैं, या अनजाने में तीसरे पक्ष के लिए उपयोगकर्ता-गोपनीयता को लीक कर सकते हैं, जो डेवलपर्स अपने व्यवसाय में बेच सकते हैं। एक उदाहरण यह हो सकता है कि ** यदि ** Play Store हमेशा पीडब्लूए की सूची में था तो वे ऐप लॉन्च होने पर स्वचालित रूप से लागू नीतियों के एक सेट के साथ आ सकते थे, और आप डेवलपर के रूप में इसमें शामिल होने के लाभ के लिए सहमत होंगे दुकान।

मैं यह देखने के लिए उत्साहित हूं कि इस एपीआई के साथ क्या होता है, और मैं इसे अपनाया जाने के लिए उत्सुक हूं, भले ही इसका उपयोग केवल डेवलपर्स द्वारा किया जाता है ताकि यह सुनिश्चित किया जा सके कि उनकी टीम वापस नहीं आती है।
