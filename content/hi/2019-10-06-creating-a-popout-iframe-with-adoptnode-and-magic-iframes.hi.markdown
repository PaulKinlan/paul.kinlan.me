---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### अद्यतन: 8 अक्टूबर - इस डॉक के साथ महत्वपूर्ण मुद्दों।

मैंने इस पोस्ट के बारे में [Jake Archibald](https://jakearchibald.com/) साथ पकड़ लिया क्योंकि मुझे लगा कि मेरे पास कुछ उपन्यास है, बातचीत के दौरान हमने बहुत सी चीजों को उजागर किया जो इस पोस्ट को कुछ अमान्य बना देती हैं, और मैंने इस प्रक्रिया में बहुत कुछ सीखा है जो मुझे नहीं लगता कि अधिकांश डेवलपर्स जानना।

* कॉलिंग `.append()` और `.appendChild()` नोड को अपनाएं। यह इस उदाहरण में `adoptNode` के उपयोग को बेकार बनाता है क्योंकि परिशिष्ट एल्गोरिथ्म यह सुनिश्चित करता है कि नोड को अपनाया गया है। MDN डॉक्स में इसका उल्लेख नहीं किया गया था, लेकिन यह [spec](https://dom.spec.whatwg.org/#concept-node-append) । मुझे वापस जाने और कसरत करने की आवश्यकता है क्यों मुझे पहले एक मुद्दा था, लेकिन मुझे संदेह है कि यह इसलिए था क्योंकि मैं orginally एक `DocumentFragment` को जोड़ने की कोशिश कर रहा था। इसका अर्थ है कि `w.document.body.appendChild(document.adoptNode(airhornerIframe));` और `w.document.body.appendChild(airhornerIframe);` दोनों का प्रभाव समान होगा।
* जबकि DOM तत्व अपने राज्य को रखेंगे (कस्टम तत्व की जाँच करें), अगर एक iframe को DOM में ले जाया जाता है तो उसे पुनः लोड किया जाता है। अवधि। इसका मतलब यह है कि इसे आइफ्रेम के बीच ले जाने से वह स्थिति नहीं रहेगी जैसे मैंने मूल रूप से परीक्षण किया था, मेरा मानना है कि यह इस तथ्य के कारण था कि एसडब्ल्यू ने पृष्ठ को अविश्वसनीय रूप से जल्दी से लोड किया था। पोर्टल एपीआई इससे प्रभावित नहीं हो सकता है - इसलिए भविष्य में यह अनुभव काम करना चाहिए :)

दस्तावेजों के बीच बढ़ते तत्वों की अवधारणा अभी भी वैध और दिलचस्प है, लेकिन आइफ्रेम का लाभ नहीं है। मैंने देखा कि विंडोज़ के बीच स्थानांतरित होने पर वीडियो तत्वों को रीसेट मिल गया और मुझे iframe की पुष्टि करते हुए अधिक मेहनती होना चाहिए था क्योंकि यह वास्तव में रीसेट नहीं है।

हमेशा की तरह, आप [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) देख सकते हैं।

### मूल पोस्ट जब मैं 2010 में Google में शामिल हुआ, तो मैंने एक दस्तावेज़ में ठोकर खाई, [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39; नामक जीमेल में एक अवधारणा का उल्लेख किया गया था, इसमें एक अच्छा नाम था और अवधारणा उपन्यास थी।

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

अवधारणा यह है कि कई अनुप्रयोगों को बहुत सारे जटिल जावास्क्रिप्ट को लोड करना पड़ता है, यहां तक कि &#39;छोटे घटक&#39; के लिए भी जैसे कि जीमेल में `iframe` विंडो, आपके पास किसी `iframe` में लोड किए गए एप्लिकेशन के घटक हो सकते हैं जो उपयोगकर्ता मुख्य विंडो में `iframe` कर सकता है, इसके बाद आप &#39;आंसू बंद&#39; कर सकते हैं और एक नई विंडो में जा सकते हैं, जब उपयोग क्लिक करें &#39;नई विंडो में लिखें&#39; बटन। मुझे लेखक से बात करने के लिए पर्याप्त विश्वास नहीं था (और मैं अभी भी नहीं हूं, न ही मैंने जीमेल के लिए स्रोत को देखा है यह देखने के लिए कि क्या यह वास्तव में कभी उपयोग किया गया था) लेकिन यह मेरे दिमाग में ज्यादातर बना रहा क्योंकि नाम गूढ़ था ।

हॉप फॉरवर्ड 10 साल और मैं एक लंबी ट्रेन की सवारी पर था और एक ऐसे क्षेत्र की जांच करना शुरू कर दिया था जो मुझे `adoptNode` एपीआई के बारे में ज्यादा जानकारी नहीं है। मैंने एक [lot of ideas](https://nifty-meadowlark.glitch.me/) साथ खेला और मुझे एहसास हुआ कि DOM तत्वों, उनकी वर्तमान स्थिति और उनके संलग्न ईवेंट हैंडलर्स को नई विंडो में ले जाना संभव है। इसने मुझे &#39;मैजिक आइफ्रेम्स&#39; की याद दिला दी और अंततः यह विचार पैदा किया कि आप एक पॉप-आउट आइफ्रेम बना सकते हैं (ए पॉप-आउट आइफ्रेम पिक्चर इन पिक्चर वीडियो है, लेकिन आइफ्रेम तत्वों के लिए)

पॉप-आउट आइफ्रेम के लिए कोड बहुत सरल है:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` आपको ब्राउज़र में दस्तावेजों के बीच, अपने मौजूदा बाउंड इवेंट हैंडलर को बनाए रखते हुए DOM तत्वों को उनकी वर्तमान स्थिति के साथ स्थानांतरित करने की अनुमति देता है - जो कि वर्तमान विंडो के अंदर एक नया DOM हो सकता है, या इस डेमो के मामले में यह पहले से ही आगे बढ़ सकता है। लोड किए गए `iframe` को उसी मूल पर दूसरी विंडो में। (ऊपर अद्यतन देखें)।

एक iframe को हिलाना दिलचस्प है क्योंकि इसका मतलब है कि आपको iframe की सामग्री को रिबूट करने की आवश्यकता नहीं है, उदाहरण बस ले जाया गया है। डाउनसाइड के कुछ जोड़े हैं:

1. URL वर्तमान मूल पर रहता है, न कि iframe मूल, हालांकि यह कुछ ऐसा हो सकता है जिसे `<portal>` API हल कर सकता है।
2. यदि आप एक कस्टम तत्व को स्थानांतरित कर रहे हैं, या ऐसा कुछ है जिसमें यह ओपनर पर होस्ट किया गया तर्क है - यदि आप ओपनर को बंद करते हैं, तो निष्पादन बंद हो जाएगा।

एक तरफ नुकसान, मैंने सोचा कि यह डोम स्तर का आईपीसी तंत्र बहुत दिलचस्प था। [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) के साथ एक नाटक करें और मुझे बताएं कि क्या आपके पास कोई दिलचस्प विचार है जहां इसका उपयोग किया जा सकता है।

