---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
सफारी टीम पर रिकी मोंडेलो ने हाल ही में एक नोट साझा किया था कि ट्विटर कैसे ./well-ogn/change-password कल्पना का उपयोग कर रहा है।

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) ।

फीचर ने मुझे पूरी तरह से पास कर दिया, लेकिन यह एक अच्छा विचार है: एक प्रसिद्ध स्थान पर एक फ़ाइल दी गई है, क्या ब्राउज़र उपयोगकर्ता को एक यूआई प्रदान कर सकता है जो उन्हें साइटों को जटिल यूआई नेविगेट करने के लिए बिना अपना पासवर्ड रीसेट करने की अनुमति देता है।

कल्पना भ्रामक रूप से सरल है: अच्छी तरह से ज्ञात फ़ाइल में उपयोगकर्ता को निर्देश देने के लिए URL होता है जब वे कार्रवाई करना चाहते हैं। यह मुझे सोच में ले जाता है, क्या हम इनमें से अधिक सुविधाएँ प्रदान कर सकते हैं:

* GDPR- आधारित सहमति मॉडल (कुकी सहमति) के लिए एक प्रसिद्ध स्थान - साइट के मालिक उस पृष्ठ के लिए एक लिंक प्रदान कर सकते हैं जहाँ उपयोगकर्ता सभी कुकीज़ और अन्य डेटा सहमति आइटम को प्रबंधित और संभावित रूप से रद्द कर सकता है।
* ब्राउज़र अनुमति प्रबंधन के लिए एक प्रसिद्ध स्थान - साइट के मालिक उपयोगकर्ताओं को जियो-लोकेशन, नोटिफिकेशन और अन्य प्राइमेटिक्स जैसी चीजों के लिए अनुमति देने में सक्षम होने के लिए एक त्वरित स्थान दे सकते हैं।
* खाता हटाने और परिवर्तनों के लिए एक प्रसिद्ध मार्ग
* मेल सदस्यता सूची प्रबंधन के लिए एक प्रसिद्ध मार्ग

सूची आगे बढ़ती है .... मुझे वास्तव में उपयोगकर्ताओं को सामान्य उपयोगकर्ता कार्यों की खोज करने में मदद करने के लिए सरल पुनर्निर्देशित फ़ाइलों के लिए विचार पसंद है, और ब्राउज़र के लिए एक तरह से इसे सतह के लिए।

* अद्यतन: * मैंने एक [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) जोड़ा [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) ।