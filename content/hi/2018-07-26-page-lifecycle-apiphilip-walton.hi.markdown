---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
फिलिप वाल्टन के पास एक नई एपीआई में एक शानदार गहरी गोता है, जो क्रोम टीम आपको (डेवलपर) नियंत्रण देने के लिए काम कर रही है जब ब्राउज़र आपके टैब को अनलोड करता है।

> Application lifecycle is a key way that modern operating systems manage resources. On Android, iOS, and recent Windows versions, apps can be started and stopped at any time by the OS. This allows these platforms to streamline and reallocate resources where they best benefit the user.
> 
> On the web, there has historically been no such lifecycle, and apps can be kept alive indefinitely. With large numbers of web pages running, critical system resources such as memory, CPU, battery, and network can be oversubscribed, leading to a bad end-user experience.
> 
> While the web platform has long had events that related to lifecycle states &#x2014; like load, unload, and visibilitychange &#x2014; these events only allow developers to respond to user-initiated lifecycle state changes. For the web to work reliably on low-powered devices (and be more resource conscious in general on all platforms) browsers need a way to proactively reclaim and re-allocate system resources.
> 
> In fact, browsers today already do take active measures to conserve resources for pages in background tabs, and many browsers (especially Chrome) would like to do a lot more of this &#x2014; to lessen their overall resource footprint.
> 
> The problem is developers currently have no way to prepare for these types of system-initiated interventions or even know that they're happening. This means browsers need to be conservative or risk breaking web pages.
> 
> The Page Lifecycle API attempts to solve this problem by:
> 
> * Introducing and standardizing the concept of lifecycle states on the web.
> * Defining new, system-initiated states that allow browsers to limit the resources that can be consumed by hidden or inactive tabs.
> * Creating new APIs and events that allow web developers to respond to transitions to and from these new system-initiated states.
> * This solution provides the predictability web developers need to build applications resilient to system interventions, and it allows browsers to more aggressively optimize system resources, ultimately benefiting all web users.
> 
> The rest of this post will introduce the new Page Lifecycle features shipping in Chrome 68 and explore how they relate to all the existing web platform states and events. It will also give recommendations and best-practices for the types of work developers should (and should not) be doing in each state.


[पूर्ण पोस्ट पढ़ें](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)।

मेरी पहली टिप्पणी यह ​​है कि आपको फिलिप्स पोस्ट पढ़ना चाहिए। यह विस्मयकरी है।

मोबाइल पर, जब उपयोगकर्ता इसका उपयोग नहीं कर रहा है, तो संसाधनों को संरक्षित करने के लिए क्रोम पृष्ठभूमि (फ्रीजिंग या डिसकॉर्डिंग) पर बहुत आक्रामक हो सकता है (उदाहरण के लिए, जब आप टैब को स्वैप करते हैं या एंड्रॉइड पर क्रोम ऐप से ले जाते हैं), जब ब्राउजर पृष्ठभूमि करता है एक डेवलपर के रूप में पृष्ठ जिसे आप परंपरागत रूप से नहीं जानते हैं, जब ऐसा होता है तो आप आसानी से राज्य को जारी नहीं रख सकते हैं या खुले संसाधनों को भी बंद नहीं कर सकते हैं और उतना ही महत्वपूर्ण है जब आप ऐप वापस राज्य को फिर से हाइड्रेट कर सकते हैं। जब डेवलपर्स का नियंत्रण होता है तो वे अधिक सूचित विकल्प बना सकते हैं, जिसका अर्थ यह भी है कि ब्राउज़र भविष्य में संसाधनों को संरक्षित करने में अधिक आक्रामक हो सकता है बिना उपयोगकर्ता या डेवलपर अनुभव को गंभीर रूप से प्रभावित करता है।

अंत में, नीचे दिए गए आरेख में यह सब बहुत अच्छी तरह से अच्छी तरह से बताता है।

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">पेज लाइफसाइक्ल एपीआई</a> </figcaption></figure>


