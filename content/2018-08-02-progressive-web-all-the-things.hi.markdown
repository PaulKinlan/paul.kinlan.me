---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA। प्रगतिशील वेब एप्स। फ्रांसिस बेरिमैन और एलेक्स रसेल ने 2015 में "प्रगतिशील वेब ऐप्स" शब्द का निर्माण किया जो मुझे लगता है कि एक मौलिक पोस्ट है "[प्रगतिशील वेब ऐप्स: हमारी आत्मा खोने के बिना टैब से बचें](https://infrequently.org/2015/06/ प्रगतिशील -Apps-भागने-टैब-बिना-हारी-हमारे-आत्मा /) "।

3 साल बाद, हम एक लंबा सफर तय कर चुके हैं। प्रौद्योगिकियों के ढीले संग्रह से - सेवा कर्मचारी, मैनिफेस्ट, होमस्क्रीन में जोड़ें, वेब पुश - जो मूल रूप से केवल एक ब्राउज़र इंजन में लागू किया गया था, एक ऐसे ब्रांड के लिए जो उद्योग और व्यापारियों और डेवलपर्स के साथ उद्योग में रहना शुरू कर चुका है, और सभी प्रमुख 'पीडब्लूए' स्टैक के बहुमत को लागू करने वाले ब्राउज़र विक्रेताओं।

अब हमें [एप] मिला है (https://appsco.pe/) [निर्देशिका](https://pwa-directory.appspot.com/), [टूल्स](https://blog.tomayac.com/ 2018/07/09 / प्रगतिशील-वेब-ऐप-इन-द-http-archive-143748) जो हमें समझने में मदद करता है कि जंगली में कितने पीडब्ल्यूए हैं, और बहुत सारे भयानक [पीडब्लूए के लाभों के बारे में केस स्टडीज](https://developers.google.com/web/showcase/)। लेकिन पीडब्ल्यूए क्या परिभाषित करता है? फ्रांसिस और एलेक्स लक्षणों की इस सूची के साथ आया:


> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 

> to fit any form factor  
> to fit any form factor  

> **Connectivity independent**: Progressively-enhanced with [Service 
> **Connectivity independent**: Progressively-enhanced with [Service 

> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 

> to let them work offline  
> to let them work offline  

> **App-like-interactions**: Adopt a Shell + Content application model to create 
> **App-like-interactions**: Adopt a Shell + Content application model to create 

> appy navigations & interactions  
> appy navigations & interactions  

> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 

> process  
> process  

> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  

> **Discoverable**: Are identifiable as "applications" thanks to 
> **Discoverable**: Are identifiable as "applications" thanks to 

> [W3C](https://w3c.github.io/manifest/) 
> [W3C](https://w3c.github.io/manifest/) 

> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 

> and Service Worker registration scope allowing search engines to find them  
> and Service Worker registration scope allowing search engines to find them  

> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 

> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  

> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 

> to the home screen through browser-provided 
> to the home screen through browser-provided 

> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 

> allowing users to "keep" apps they find most useful without the hassle of an 
> allowing users to "keep" apps they find most useful without the hassle of an 

> app store  
> app store  

> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.

> The social [power of
> The social [power of

> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)

> _matters_.
> _matters_.


महत्वपूर्ण बात यह है कि इस विवरण ने उस क्षण को चिह्नित किया जहां हम वेब को देखना चाहते थे, इसके बारे में हम सब कुछ स्पष्ट थे और हमारे पास [टूल्स](https://developers.google.com/web/tools/lighthouse/) है जो मदद करता है हम समझते हैं कि हमारी साइट 'पीडब्ल्यूए' है या नहीं। एलेक्स आगे भी गए और कुछ [तकनीकी पहलुओं को परिभाषित किया जो 'पीडब्ल्यूए' को पीडब्ल्यूए बनाते हैं](https://infrequently.org/2016/09/what-exactly-makes-something-a- प्रगतिशील-web-app/ )।

इस पोस्ट के हाइपरबोले के रास्ते से, हर कोई इन चीजों का निर्माण क्यों नहीं कर रहा है? [ठीक है, यह मुश्किल हो सकता है। बहुत कठिन](/ चुनौतियों के लिए वेब डेवलपर्स /)। हम डेवलपर्स और व्यवसायों को बहुत कुछ करने के लिए कह रहे हैं। कुछ मामलों में ऐपशेल पर ध्यान केंद्रित करना साइट के पूर्ण पुन: आर्किटेक्चर हो सकता है, अन्य मामलों में ['ऐपशेल' सही आर्किटेक्चर नहीं है](/ प्रगतिशील-प्रगतिशील-वेब-ऐप्स /)। और कई मामलों में मूल्य या कथा हमेशा स्पष्ट नहीं होती है।

मैं भाग्यशाली रहा हूं कि वेब पर निर्माण की चिंताओं के बारे में व्यवसायों और डेवलपर्स से सीधे बात करने में सक्षम होने के लिए, विशेष रूप से जिन चीजों को मैंने व्यवसाय और डेवलपर्स को पीडब्लूए के बारे में बताया है, वे हैं:


> We've got our site... but we are also making a PWA.
> We've got our site... but we are also making a PWA.



> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)
> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


दिलचस्प। क्या वे अलग हैं? अक्सर नहीं, लेकिन पीडब्ल्यूए एक 'चीज' है जिसके बारे में उन्होंने सुना है और यह लॉन्च करने वाला एक और उत्पाद है। एम। * साइट्स की तरह डेस्कटॉप साइट का मोबाइल संस्करण था, पीडब्ल्यूए एक और चीज हो सकती है जिसे उन्हें लॉन्च करना है।


> I've got a PWA. It just does Push notifications.
> I've got a PWA. It just does Push notifications.



> &mdash; Too many people.
> &mdash; Too many people.


वाह। यह एक पीडब्लूए नहीं है, जो सिर्फ मूल तकनीक के एक टुकड़े का उपयोग कर रहा है।


> I'm only building a blog... it's not a PWA
> I'm only building a blog... it's not a PWA



> &mdash; Many bloggers we spoke to.
> &mdash; Many bloggers we spoke to.


हममम। यह एक स्पष्ट मामला है कि हम स्पष्ट नहीं कर पाए हैं कि सामग्री साइटों के लिए कदम क्यों महत्वपूर्ण है।


> I don't care about making it installable.. I don't need a Service Worker.
> I don't care about making it installable.. I don't need a Service Worker.



> &mdash; Many publishers we spoke to.
> &mdash; Many publishers we spoke to.


हुह। लोग ऐप को इंस्टॉलेशन के साथ जोड़ते हैं, और यह विचार कि साइट या अनुभव को ऐप इंस्टॉल की तरह कार्य करना चाहिए, कुछ लोगों को अवधारणा से पूरी तरह से बंद कर देता है। 2015 में [गाजर](https://trib.tv/2015/10/11/progressive-apps/) के बारे में एक बहुत ही रोचक चर्चा हुई थी जिसे मैं आपको अक्षम करने के लिए प्रोत्साहित करता हूं।


> I don't need an app on desktop. I just need users to click 'checkout'
> I don't need an app on desktop. I just need users to click 'checkout'



> &mdash; Many retailers we spoke to.
> &mdash; Many retailers we spoke to.


ठीक। यह बहुत स्पष्ट है। किसी उपयोगकर्ता या व्यवसाय का मूल्य वहां नहीं है, और पीडब्लूए के लक्षणों को प्राथमिकता देने वाले व्यवसाय को रोकने के लिए पर्याप्त है।


> Progressive Web Apps are just better sites.
> Progressive Web Apps are just better sites.



> &mdash; Many developers we speak to.
> &mdash; Many developers we speak to.


दरअसल मैं इसे बहुत सारे महान वेब डेवलपर्स से बहुत कुछ सुनता हूं।

मैं आपको [जेरेमी कीथ](https://adactio.com/) के लेखन की जांच करने के लिए प्रोत्साहित करता हूं, जो थोड़ी देर के लिए पीडब्लूए में 'पीडब्लू' को लंबे समय से दबा रहा है और हाल ही में एक बातचीत में कुछ ऐसा ही कहा गया है:


> There's a common misconception that making a Progressive Web App means
> There's a common misconception that making a Progressive Web App means

> creating a Single Page App with an app-shell architecture. But the truth is
> creating a Single Page App with an app-shell architecture. But the truth is

> that literally any website can benefit from the performance boost that results
> that literally any website can benefit from the performance boost that results

> from the combination of HTTPS + Service Worker + Web App Manifest.
> from the combination of HTTPS + Service Worker + Web App Manifest.



> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 

> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


मेरी व्यक्तिगत भावना यह है कि हर कोई वास्तव में पीडब्ल्यूए में ए पर लटका हुआ है: 'ऐप'। यह अवधारणा के ब्रांडिंग की सफलता और विफलता है; 'ऐप' नाम पर है, 'ऐप' कई उपयोगकर्ताओं और व्यवसायों के प्रति जागरूक है और इसलिए संगठन काफी स्पष्ट हैं।

पूरी तरह से स्पष्ट होने के लिए, हमारी टीम में स्वयं और कई अन्य लोगों ने विशेष रूप से मोबाइल मूल अनुभवों के साथ प्रतिस्पर्धा के संबंध में पीडब्लूए के संदर्भ में 'ऐप' शब्द पर कड़ी मेहनत की। [एंड्रयू बेट्स 'पोस्ट](https://trib.tv/2016/06/05/progressively-less-progressive/) हमारे मूल स्थिति के खिलाफ एक अच्छा सारांश था, और जब मुझे नहीं लगता कि हम गलत थे, हमने किया विशेष रूप से फॉर्म-कारकों के आसपास व्यापक कहानी की मदद करने का अवसर याद करें जो इतने मोबाइल केंद्रित नहीं थे।

जब हम क्रोम वेब स्टोर के बारे में बात कर रहे थे तो मैं दर्शकों से यह पूछता था। क्या जीमेल एक ऐप या साइट है? एक ऐप, यह आसान है। क्या ट्विटर एक ऐप या साइट है? एक ऐप .. क्या यह है? अगर मैं सिर्फ सामग्री पढ़ रहा हूं, तो यह अभी भी एक वेबसाइट की तरह लगता है। विकिपीडिया एक ऐप या साइट है? एक साइट, बिल्कुल; हालांकि यह है? एक संपादक के रूप में यह एक उपकरण की तरह बहुत ज्यादा लगता है।

आखिरकार, मुझे नहीं लगता कि यह वास्तव में बहुत मायने रखता है यदि साइट एक ऐप है या ऐप एक साइट है। लोग वेब पर सबकुछ बना सकते हैं और कर सकते हैं: 'ऐप', गेम्स, वीआर बॉबिन, खुदरा स्टोर या सिर्फ पारंपरिक 'साइट्स', और यह किसी भी विशिष्ट उपयोग मामले - मीडिया, मनोरंजन, प्रकाशन, उपयोगिताओं, वाणिज्य के लिए हो सकता है ...

यदि आप 'इंस्टॉबिलिटी' के अपवाद के साथ पीडब्लूए की मूल परिभाषा को अलग करते हैं (देखें 'गाजर का बैग' देखें), मुझे नहीं लगता कि कोई भी तर्क दे सकता है कि यदि कोई डेवलपर किसी भी अंक में अपनी साइट को सुधारता है तो एलेक्स का संदर्भ दिया जाता है उपयोगकर्ताओं को एक बेहतर अनुभव मिलता है, और जब उपयोगकर्ता को बेहतर अनुभव मिलता है तो वे वेब पर अधिक से अधिक लोगों के साथ वेब के साथ सार्थक जुड़ाव रखते हैं और वेब का उपयोग करते रहते हैं। तो हम पीडब्ल्यूए कथा को इस तरीके से कैसे लागू कर सकते हैं कि प्रत्येक व्यवसाय और डेवलपर जानता है कि उन्हें किस पर ध्यान देना चाहिए?

---

I've been thinking of a slight pivot based on the challenges we've seen in the
industry, and I've tried to prioritize the importance of where developers and
businesses can focus their efforts. (Note: I might channel
[BizKin](https://twitter.com/business_kinlan))

We want businesses and developers to succeed by leveraging the web’s unique
capabilities that allow them to: Reach the most users they can at the click of a
button; Retain their users by bringing their best experiences across devices
with a single set of code; and to meaningfully engage with their users by
building a direct and ownable relationship with them.

I've tried to articulate this as a set of principles that the user should feel
when using the web. Your experience should be:
DISCOVERABLE, SAFE, FAST, SMOOTH, RELIABLE, MEANINGFUL

Make it Discoverable
: Enable users to find your experience. The web is made of links and pages.
Ideally every page and state should have a deep-link so that anyone can be sent
to it from any site, be it an aggregator, a message, an email or a billboard.
Content should be served so that any renderer can read it.

Make it Safe
: Users and content owners can trust experiences built on the web, protecting
identity, confidentiality and data integrity.

Make it Fast
: Once the user has the link to your site, then the instant they tap it they are in
your experience and able to start using it irrespective of the network or device
that the user has.

Make it Smooth
: When users are on your site the experience is responsive and interactive to all
user gestures. Animations feel smooth and crisp, feedback is instant, scrolling
is silky, navigations are instant. Ideally if you think of the web performance
in terms of
[RAIL](https://developers.google.com/web/fundamentals/performance/rail), you are
focusing on the 'RAI'.

Make it Reliable
: Users of your site perceive as few interruptions as possible when faced with
unreliable network or devices. The experience should work and be responsive 
wherever the user is.

Make it Meaningful
: You must provide value and meet your user's needs through
high-quality experiences that provide value. This can seem quite fluffy, but
[Dion Almaer described it
well](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411).
The focus is really about your site solving a need for the user, be it
entertainment, smoothing out a purchase, advancement of knowledge or quick
completion of a task. It's all about the UX.

A modern experience that meets these principle goals of **fast, reliable, safe
and smooth**. It becomes progressively more **capable** using modern APIs and
highly **discoverable** by harnessing the reach of the open web and at the core
of it. A PWA should naturally meet each of these "principle goals" based on user
expectations and continues to build on the experience as more technologies and
capabilities come in. But so should any modern experience on the web today....

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> &mdash; Progressive Web All-the-things.

This is where I want to push PWA over the next year. What do you think?

_Thanks to Harleen Batra._

{{<html>}}

<style>
dt {
  font-weight: 600;
  margin-bottom: 0.8em;
}
dd {
  margin-bottom: 1em;
}
#pw {
  font-weight: 700;
  font-size: 1em;
}
#name {
  font-size: 1em;
  font-weight: 100;
}
</style>
<script>
  const nameEl = document.getElementById('name');
  const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];
  let counter = 1;
  setInterval(()=> { 
    nameEl.textContent = names[counter];
    counter = (counter + 1) % names.length;
    nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})
  }, 2000)
</script>
{{</html>}}