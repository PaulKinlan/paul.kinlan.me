---
slug: puppeteer-go
date: 2019-12-03T02:28:20.904Z
title: Puppeteer Go
link: 'https://github.com/PaulKinlan/puppeteer-go'
tags: [the headless web, puppeteer, headless]
---

நான் [The Headless Web](https://paul.kinlan.me/the-headless-web/) - இது [The Headless Web](https://paul.kinlan.me/the-headless-web/) யோசனைகளுடன் விளையாடுவதற்கு என்னை அனுமதிக்கிறது - இது ஒரு உலாவியில் வலையில் தெரியும் உலாவி இல்லாமல் இயங்குகிறது மற்றும் [DOM-curl](https://paul.kinlan.me/domcurl/) (ஜாவாஸ்கிரிப்ட் இயங்கும் சுருட்டை) போன்ற கருவிகளைக் கூட உருவாக்குகிறது. குறிப்பாக உலாவியை ஸ்க்ராப் செய்வதற்கும், கையாளுவதற்கும், பக்கங்களுடன் தொடர்புகொள்வதற்கும் நான் விரும்புகிறேன்.

நான் செய்ய விரும்பிய ஒரு டெமோ, [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) ஈர்க்கப்பட்டு, அங்கு அவர் ஒரு பொம்மலாட்ட ஸ்கிரிப்டை [Capturing 422 live images](https://bitsofco.de/how-i-created-488-live-images/) , அது பல பக்கங்களுக்குச் சென்று ஸ்கிரீன் ஷாட்டை எடுக்கும். பல பக்கங்களுக்குச் செல்வதற்குப் பதிலாக, பக்கத்தில் உள்ள பல கூறுகளின் ஸ்கிரீன் ஷாட்களை எடுக்க விரும்பினேன்.

பொம்மலாட்டக்காரரிடம் எனக்கு இருக்கும் பிரச்சனை என்னவென்றால், நீங்கள் எதையும் செய்ய வேண்டிய தொடக்க சரணம். துவக்கு, தாவலைத் திற, வழிசெலுத்தல் - இது சிக்கலானது அல்ல, எளிய ஸ்கிரிப்டுகளுக்கு நான் உருவாக்க விரும்புவதை விட இது கொதிகலன் தான். அதனால்தான் நான் [Puppeteer Go](https://github.com/PaulKinlan/puppeteer-go) ஐ உருவாக்கினேன். இது ஒரு சிறிய ஸ்கிரிப்ட் மட்டுமே, இது உலாவியைத் திறக்கும், ஒரு பக்கத்திற்கு செல்லவும், _உங்கள்_ செயலைச் செய்து, பின்னர் தன்னைத் தூய்மைப்படுத்தும் CLI பயன்பாடுகளை எளிதாக உருவாக்க உதவுகிறது.

அதைப் பாருங்கள்.

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

மேலே உள்ள குறியீடு எனது வலைப்பதிவில் எச் 1 உறுப்பைக் கண்டுபிடித்து ஸ்கிரீன் ஷாட்டை எடுக்கும். இது ஐரேயின் வேலையைப் போல எங்கும் இல்லை, ஆனால் canisuse.com இலிருந்து ஸ்கிரீன் ஷாட்களை பக்கத்திலிருந்து நேரடியாக இழுக்க முடியுமா என்று பார்ப்பது சுத்தமாக இருந்தது என்று நினைத்தேன்.

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

மகிழுங்கள்!

