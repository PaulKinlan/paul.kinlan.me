---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


जैसा कि मैंने अपने [पिछले पोस्ट](/ लाइटहाउस-स्कोर-इन-डोमेन /) में उल्लेख किया है, मैं भारत में अधिक डेवलपर संबंधों की योजना बनाने की योजना बना रहा हूं और मैं बेहतर समझना चाहता हूं कि भारत में उपयोगकर्ता वेब का अनुभव कैसे करते हैं । उस पोस्ट में भारत में एक साइट निर्धारित करने के लिए मेरे पास एक बहुत ही सरल ह्युरिस्टिक था, क्या यह '.in' डोमेन है। मुझे पता था कि यह देखने का सबसे अच्छा तरीका नहीं था, लेकिन यह पहले अच्छा चल रहा था।

जो मैं वास्तव में चाहता था वह उन साइटों को समझने का एक तरीका था जो भारत में उपयोगकर्ता जाते हैं और फिर साइट के लोकप्रियता के आधार पर अपना स्कोर प्राप्त करते हैं।

सौभाग्य से [क्रोम यूएक्स रिपोर्ट](https://developers.google.com/web/tools/chrome-user-experience-report/) में कुछ डेटा है। क्रोम यूएक्स रिपोर्ट में बिगक्वायर में टेबल की एक श्रृंखला है जिसमें भारत के उपयोगकर्ताओं की शीर्ष उत्पत्ति की एक सूची शामिल है (तालिका 'क्रोम-ux-report.country_in.20180` है & mdash;' _in 'को नोट करें जो दर्शाती है देश)। क्रोम यूएक्स रिपोर्ट में वास्तविक उत्पत्ति के लिए साइट की समेकित गति जैसे प्रत्येक मूल के लिए बहुत अधिक डेटा है, लेकिन मुझे वास्तव में केवल यूआरएल की आवश्यकता है।

क्रोम यूएक्स रिपोर्ट से डेटा का उपयोग करना, और पहले से उल्लिखित HTTPArchive लाइटहाउस स्कोर के साथ HTTP पुरालेख में एलेक्सा रैंकिंग तालिका के साथ संयोजन करना हम वास्तव में भारत में उपयोगकर्ताओं के बारे में एक बेहतर तस्वीर प्राप्त कर सकते हैं।




```sql
SELECT
  url, rank,
  JSON_EXTRACT(report, '$.categories.seo.score') AS seo_score,
  JSON_EXTRACT(report, '$.categories.pwa.score') AS pwa_score,
  JSON_EXTRACT(report, '$.categories.performance.score') AS speed_score,
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS accessibility_score
FROM
  `httparchive.lighthouse.2018_08_01_mobile`
JOIN (
  SELECT
    DISTINCT origin,
    Alexa_rank AS rank
  FROM
    `httparchive.urls.20170315`
  JOIN
    `chrome-ux-report.country_in.201807`
  ON
    NET.REG_DOMAIN(origin) = Alexa_domain) AS crux
  ON
    url = CONCAT(origin, '/')
ORDER BY
  rank ASC, url ASC
```


उपर्युक्त क्वेरी चलाने से Google शीट्स के लिए बहुत अधिक डेटा लौटाता है, इसलिए मैंने केवल शीर्ष 16,000 साइटों का विश्लेषण किया (एलेक्सा रैंकिंग में लगभग 7k तक)। नीचे टिप्पणी के बिना समेकित डेटा है।

#### शीर्ष 7k

<table><thead><th> स्कोर रेंज </th><th> एसईओ स्कोर </th><th> पीडब्ल्यूए स्कोर </th><th> स्पीड स्कोर </th><th> ए 11 वाई स्कोर </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12,253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### एलेक्सा टॉप 100

<table><thead><th> स्कोर रेंज </th><th> एसईओ स्कोर </th><th> पीडब्ल्यूए स्कोर </th><th> स्पीड स्कोर </th><th> ए 11 वाई स्कोर </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### एलेक्सा शीर्ष 1000

<table><thead><th> स्कोर रेंज </th><th> एसईओ स्कोर </th><th> पीडब्ल्यूए स्कोर </th><th> स्पीड स्कोर </th><th> ए 11 वाई स्कोर </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

मुझे लगता है कि उपकरण डेवलपर्स और व्यवसायों के पास अब उनके हाथों में तर्कसंगत और सिद्धांतबद्ध निर्णय लेने की हमारी क्षमता में एक बड़ा अंतर हो सकता है कि उपयोगकर्ताओं को वास्तव में वेब पर विश्व के अनुभव का अनुभव कैसे होता है। मेरे लिए, यह डेटा मुझे आधार रेखा देता है कि मैं यह देखने के लिए देख सकता हूं कि हमारे देवता कार्य के लिए हमारी रणनीतियां लंबी अवधि में पारिस्थितिकी तंत्र को प्रभावित करती हैं या नहीं।