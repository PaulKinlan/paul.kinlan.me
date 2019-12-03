---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### నవీకరణ: అక్టోబర్ 8 - ఈ ### ముఖ్యమైన సమస్యలు.

నేను ఈ పోస్ట్ గురించి [Jake Archibald](https://jakearchibald.com/) తో పట్టుబడ్డాను, ఎందుకంటే నాకు ఏదో నవల ఉందని నేను అనుకున్నాను, సంభాషణ సమయంలో మేము ఈ పోస్ట్‌లో కొన్ని చెల్లనివిగా చేసే చాలా విషయాలను బయటపెట్టాము మరియు చాలా మంది డెవలపర్లు అని నేను అనుకోని ఈ ప్రక్రియలో నేను చాలా నేర్చుకున్నాను తెలుసు.

* `.append()` మరియు `.appendChild()` `.append()` `.appendChild()` స్వీకరిస్తుంది. ఇది ఈ సందర్భంలో `adoptNode` వాడకాన్ని నిరుపయోగంగా చేస్తుంది ఎందుకంటే అనుబంధ అల్గోరిథం నోడ్ స్వీకరించబడిందని నిర్ధారిస్తుంది. ఇది MDN డాక్స్‌లో పేర్కొనబడలేదు, కానీ [spec](https://dom.spec.whatwg.org/#concept-node-append) . నేను ఇంతకుముందు ఎందుకు సమస్యను కలిగి `DocumentFragment` వెనక్కి వెళ్లి వ్యాయామం చేయాలి, కాని నేను ఒక `DocumentFragment` ప్రయత్నిస్తున్నందున ఇది జరిగిందని నేను అనుమానిస్తున్నాను. అంటే `w.document.body.appendChild(document.adoptNode(airhornerIframe));` మరియు `w.document.body.appendChild(airhornerIframe);` రెండూ ఒకే ప్రభావాన్ని కలిగి ఉంటాయి.
* DOM మూలకాలు వాటి స్థితిని ఉంచుతాయి (అనుకూల మూలకాన్ని తనిఖీ చేయండి), DOM లో ఒక ఐఫ్రేమ్ తరలించబడితే అది మళ్లీ లోడ్ అవుతుంది. కాలం. దీని అర్థం ఐఫ్రేమ్‌ల మధ్య తరలించడం నేను మొదట పరీక్షించినట్లుగా రాష్ట్రాన్ని ఉంచదు, SW ఈ పేజీని చాలా త్వరగా లోడ్ చేసినందున ఇది జరిగిందని నేను నమ్ముతున్నాను. పోర్టల్స్ API దీని ద్వారా ప్రభావితం కాకపోవచ్చు - కాబట్టి భవిష్యత్తులో ఈ అనుభవం పని చేస్తుంది :)

పత్రాల మధ్య మూలకాలను కదిలించే భావన ఇప్పటికీ చెల్లుబాటు అయ్యేది మరియు ఆసక్తికరంగా ఉంది, అయితే ఐఫ్రేమ్‌లకు ప్రయోజనం లేదు. విండోస్ మధ్య కదిలినప్పుడు వీడియో ఎలిమెంట్స్ రీసెట్ అయ్యాయని నేను గమనించాను మరియు ఐఫ్రేమ్ వాస్తవానికి దాని స్థితిని రీసెట్ చేయలేదని ధృవీకరించడానికి నేను మరింత శ్రద్ధ వహించాలి.

ఎప్పటిలాగే, మీరు [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### ఒరిజినల్ పోస్ట్ నేను 2010 లో ### చేరినప్పుడు &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39; అని పిలువబడే gmail లో ఒక భావనను పేర్కొన్న ఒక పత్రాన్ని నేను [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) , దీనికి మంచి పేరు ఉంది మరియు ఈ భావన నవల.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Gmail లోని కంపోజ్ విండో వంటి &#39;చిన్న భాగం&#39; కోసం కూడా చాలా అనువర్తనాలు చాలా క్లిష్టమైన జావాస్క్రిప్ట్‌ను లోడ్ `iframe` ఉంటుంది, వినియోగదారుడు ప్రధాన విండోలో ఇంటరాక్ట్ చేయగల `iframe` లో లోడ్ చేయబడిన అప్లికేషన్ యొక్క భాగాలను మీరు కలిగి ఉండవచ్చు, &#39;క్రొత్త విండోలో కంపోజ్ చేయండి&#39; బటన్‌ను ఉపయోగించినప్పుడు మీరు &#39;కూల్చివేసి&#39; క్రొత్త విండోకు తరలించవచ్చు. రచయితతో మాట్లాడేంత నమ్మకం నాకు లేదు (మరియు నేను ఇంకా చేయలేదు, లేదా జిమెయిల్ ఎప్పుడైనా ఉపయోగించబడుతుందో లేదో చూడటానికి నేను మూలాన్ని చూడలేదు) కాని ఇది నా మనస్సులో ఎక్కువగా ఉండిపోయింది ఎందుకంటే పేరు సమస్యాత్మకమైనది .

హాప్ ఫార్వార్డ్స్ 10 సంవత్సరాలు మరియు నేను సుదీర్ఘ రైలు ప్రయాణంలో ఉన్నాను మరియు `adoptNode` API గురించి నాకు పెద్దగా తెలియని ప్రాంతాన్ని పరిశోధించడం ప్రారంభించాను. నేను [lot of ideas](https://nifty-meadowlark.glitch.me/) తో [lot of ideas](https://nifty-meadowlark.glitch.me/) మరియు DOM మూలకాలను, వాటి ప్రస్తుత స్థితి మరియు వాటి జత చేసిన ఈవెంట్ హ్యాండ్లర్లను కొత్త విండోల్లోకి తరలించడం సాధ్యమని నేను గ్రహించాను. ఇది నాకు &#39;మ్యాజిక్ ఐఫ్రేమ్స్&#39; గురించి గుర్తు చేసింది మరియు చివరికి మీరు పాప్-అవుట్ ఐఫ్రేమ్‌ను సృష్టించగలరనే ఆలోచనకు దారి తీస్తుంది (పాప్-అవుట్ ఐఫ్రేమ్ పిక్చర్ వీడియోలో పిక్చర్ అయితే ఐఫ్రేమ్ ఎలిమెంట్స్ కోసం)

పాప్-అవుట్ ఐఫ్రేమ్ కోసం కోడ్ చాలా సులభం:

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

బ్రౌజర్‌లోని పత్రాల మధ్య, ప్రస్తుతమున్న బౌండ్ ఈవెంట్ హ్యాండ్లర్‌లను కొనసాగిస్తూ, ప్రస్తుత స్థితిలో ఉన్న DOM మూలకాలను తరలించడానికి `adoptNode` మిమ్మల్ని అనుమతిస్తుంది - ఇది ప్రస్తుత విండో లోపల కొత్త DOM కావచ్చు లేదా ఈ డెమో విషయంలో ఇది ఇప్పటికే కదులుతుంది అదే మూలం ఉన్న మరొక విండోలోకి `iframe` లోడ్ `iframe` . (పై నవీకరణ చూడండి).

ఐఫ్రేమ్‌ను తరలించడం ఆసక్తికరంగా ఉంటుంది ఎందుకంటే మీరు ఐఫ్రేమ్‌లోని విషయాలను రీబూట్ చేయనవసరం లేదని అర్థం, ఉదాహరణ ఇప్పుడే తరలించబడింది. కొన్ని నష్టాలు ఉన్నాయి:

1. URL ప్రస్తుత మూలం మీద ఉంది మరియు ఐఫ్రేమ్ మూలం కాదు, అయినప్పటికీ ఇది `<portal>` API పరిష్కరించగల విషయం కావచ్చు.
2. మీరు కస్టమ్ ఎలిమెంట్‌ను లేదా ఓపెనర్‌లో లాజిక్ హోస్ట్ చేసిన దాన్ని కదిలిస్తుంటే - మీరు ఓపెనర్‌ను మూసివేస్తే, అమలు ఆగిపోతుంది.

ప్రతికూలతలు పక్కన పెడితే, ఈ DOM స్థాయి IPC విధానం చాలా ఆసక్తికరంగా ఉందని నేను అనుకున్నాను. [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) తో ఆట [demo page](https://nifty-meadowlark.glitch.me/) మరియు ఇది ఎక్కడ ఉపయోగించవచ్చో మీకు ఆసక్తికరమైన ఆలోచనలు ఉంటే నాకు తెలియజేయండి.

