---
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
date: 2018-10-23T09:53:10.359Z
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
tags: [links, performance, qrcode]
---
मैं Google डेवलपर दिवस के लिए कुछ हफ्ते पहले चीन में था और मैं अपने सभी [क्यूआरकोड स्कैनर](https://qrsnapper.com) को दिखा रहा था, जब तक मैं ऑफ़लाइन नहीं जाता तब तक यह बहुत अच्छा काम कर रहा था। जब उपयोगकर्ता ऑफलाइन था (या आंशिक रूप से कनेक्ट) कैमरा शुरू नहीं होगा, जिसका मतलब था कि आप क्यूआर कोड को स्नैप नहीं कर सके। यह हुआ कि काम करने के लिए मुझे उम्र बढ़ गई, और यह पता चला कि मैं गलती से कैमरे को अपने 'ऑनलोड' ईवेंट में शुरू कर रहा था और Google Analytics अनुरोध समय-समय पर हल होगा और हल नहीं होगा। यह [यह प्रतिबद्धता है जो इसे ठीक करता है](https://github.com/PaulKinlan/qrcode/commit/e3b58c6821fd97defcd959f7d7f3de10ea4f4b12#diff-4a23ac1286faa3273c8cdc9b4bb5078dR578)।

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.


[पूर्ण पोस्ट पढ़ें](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/)।

मैं आपको पद पढ़ने के लिए प्रोत्साहित करता हूं क्योंकि बहुत सारी अंतर्दृष्टि है।
