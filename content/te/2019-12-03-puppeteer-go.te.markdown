---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

నేను [The Headless Web](https://paul.kinlan.me/the-headless-web/) ప్రేమిస్తున్నాను - ఇది [The Headless Web](https://paul.kinlan.me/the-headless-web/) యొక్క ఆలోచనలతో [The Headless Web](https://paul.kinlan.me/the-headless-web/) నన్ను అనుమతిస్తుంది - ఇది వెబ్‌ను కనిపించే బ్రౌజర్ లేకుండా బ్రౌజర్‌లో [DOM-curl](https://paul.kinlan.me/domcurl/) మరియు [DOM-curl](https://paul.kinlan.me/domcurl/) (జావాస్క్రిప్ట్‌ను అమలు చేసే కర్ల్) వంటి సాధనాలను కూడా నిర్మిస్తుంది. పేజీలను స్క్రాప్ చేయడానికి, మార్చటానికి మరియు సంభాషించడానికి బ్రౌజర్‌ను స్క్రిప్ట్ చేయడం నాకు చాలా ఇష్టం.

నేను చేయాలనుకున్న ఒక డెమో [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) యొక్క [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) పోస్ట్ నుండి ప్రేరణ పొందింది, అక్కడ ఆమె ఒక తోలుబొమ్మ స్క్రిప్ట్‌ను నడిపింది, అది చాలా పేజీలకు నావిగేట్ చేస్తుంది మరియు స్క్రీన్ [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) తీసుకుంటుంది. చాలా పేజీలకు వెళ్లే బదులు, పేజీలోని అనేక మూలకాల స్క్రీన్‌షాట్‌లను తీసుకోవాలనుకున్నాను.

పప్పెటీర్‌తో నాకు ఉన్న సమస్య ఏమిటంటే మీరు ఏదైనా చేయవలసిన ప్రారంభ చరణం. ప్రారంభించండి, టాబ్ తెరవండి, నావిగేట్ చేయండి - ఇది సంక్లిష్టంగా లేదు, సాధారణ స్క్రిప్ట్‌ల కోసం నేను సృష్టించాలనుకుంటున్న దానికంటే ఎక్కువ బాయిలర్‌ప్లేట్. అందుకే నేను [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) సృష్టించాను. ఇది CLI యుటిలిటీలను సులభంగా నిర్మించడంలో నాకు సహాయపడే ఒక చిన్న స్క్రిప్ట్, ఇది బ్రౌజర్‌ను తెరుస్తుంది, ఒక పేజీకి నావిగేట్ చేస్తుంది, _మీ_ చర్య చేస్తుంది మరియు తరువాత శుభ్రపరుస్తుంది.

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

