---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

నేను పప్పీటీర్‌ను ప్రేమిస్తున్నాను - ఇది <a <span class="notranslate">href=&quot;https://paul.kinlan.me/the-headless-web/&quot; &gt;The Headless Web</a> - కనిపించే బ్రౌజర్ లేకుండా బ్రౌజర్‌లో వెబ్‌ను నడుపుతున్న ఆలోచనలతో ఆడుకోవడానికి నన్ను అనుమతిస్తుంది. మరియు <a <span class="notranslate">href=&quot;https://paul.kinlan.me/domcurl/&quot; &gt;DOM-curl</a> (జావాస్క్రిప్ట్‌ను అమలు చేసే కర్ల్) వంటి సాధనాలను కూడా రూపొందించండి. పేజీలను స్క్రాప్ చేయడానికి, మార్చటానికి మరియు సంభాషించడానికి బ్రౌజర్‌ను స్క్రిప్ట్ చేయడం నాకు చాలా ఇష్టం.

నేను చేయాలనుకున్న ఒక డెమో ఇరే యొక్క <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> పోస్ట్‌ను <a <span class="notranslate">href=&quot;https://bitsofco.de/how-i-created-488-live-images/&quot; &gt;Capturing 422 live images</a> అక్కడ ఆమె నావిగేట్ చేసే ఒక తోలుబొమ్మ స్క్రిప్ట్‌ను నడిపింది చాలా పేజీలు మరియు స్క్రీన్ షాట్ తీసుకోండి. చాలా పేజీలకు వెళ్లే బదులు, పేజీలోని అనేక మూలకాల స్క్రీన్‌షాట్‌లను తీసుకోవాలనుకున్నాను.

పప్పెటీర్‌తో నాకు ఉన్న సమస్య ఏమిటంటే మీరు ఏదైనా చేయవలసిన ప్రారంభ చరణం. ప్రారంభించండి, టాబ్ తెరవండి, నావిగేట్ చేయండి - ఇది సంక్లిష్టంగా లేదు, సాధారణ స్క్రిప్ట్‌ల కోసం నేను సృష్టించాలనుకుంటున్న దానికంటే ఎక్కువ బాయిలర్‌ప్లేట్. అందుకే నేను <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/puppeteer-go&quot; &gt;Puppeteer Go</a> . ఇది CLI యుటిలిటీలను సులభంగా నిర్మించడంలో నాకు సహాయపడే ఒక చిన్న స్క్రిప్ట్, ఇది బ్రౌజర్‌ను తెరుస్తుంది, ఒక పేజీకి నావిగేట్ చేస్తుంది, _మీ_ చర్య చేస్తుంది మరియు తరువాత శుభ్రపరుస్తుంది.

దాన్ని తనిఖీ చేయండి.

```JavaScript
const { go } = require('puppeteer-go');

go('https://paul.kinlan.me', async (page) => {
    const elements = await page.$$("h1");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

పై కోడ్ నా బ్లాగులో h1 మూలకాన్ని కనుగొని స్క్రీన్ షాట్ తీసుకుంటుంది. ఇరే యొక్క పనికి ఇది ఎక్కడా మంచిది కాదు, కాని మనం canisuse.com నుండి స్క్రీన్ షాట్లను పేజీ నుండి నేరుగా లాగగలమా అని చూడటం చక్కగా ఉందని నేను అనుకున్నాను.

```JavaScript
const { go } = require('puppeteer-go');

go('https://caniuse.com/#search=css', async (page) => {
    const elements = await page.$$("article.feature-block.feature-block--feature");
    let count = 0;
    for(let element of elements) {
      try {
        await element.screenshot({ path: `${count++}.png`});
      } catch (err) {
        console.log(count, err);
      }
    }
});
```

<figure><img src="/images/2019-12-03-puppeteer-go-0.jpeg" alt="4.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-1.jpeg" alt="3.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-2.jpeg" alt="2.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-3.jpeg" alt="1.png"></figure>

<figure><img src="/images/2019-12-03-puppeteer-go-4.jpeg" alt="0.png"></figure>

ఆనందించండి!

