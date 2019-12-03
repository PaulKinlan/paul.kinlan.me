---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

### புதுப்பிப்பு: அக்டோபர் 8 - இந்த ஆவணத்தில் குறிப்பிடத்தக்க சிக்கல்கள்.

இந்த இடுகையைப் பற்றி நான் [Jake Archibald](https://jakearchibald.com/) உடன் சிக்கிக் [Jake Archibald](https://jakearchibald.com/) ஏனென்றால் என்னிடம் ஏதோ புதினம் இருப்பதாக நான் நினைத்தேன், உரையாடலின் போது இந்த இடுகையில் சிலவற்றை செல்லாததாக்கும் பல விஷயங்களை நாங்கள் கண்டுபிடித்தோம், மேலும் பெரும்பாலான டெவலப்பர்கள் என்று நான் நினைக்காத இந்த செயல்பாட்டில் நான் நிறைய கற்றுக்கொண்டேன். தெரியும்.

* `.append()` மற்றும் `.appendChild()` அழைப்பது `.append()` ஏற்றுக்கொள்கிறது. இந்த நிகழ்வில் `adoptNode` இன் `adoptNode` பயனற்றதாக `adoptNode` , ஏனெனில் இணைப்பு அல்காரிதம் முனை ஏற்றுக்கொள்ளப்படுவதை உறுதி செய்கிறது. இது MDN டாக்ஸில் குறிப்பிடப்படவில்லை, ஆனால் இது [spec](https://dom.spec.whatwg.org/#concept-node-append) . நான் ஏன் முன்பு ஒரு சிக்கலைக் கொண்டிருந்தேன் என்று திரும்பிச் சென்று பயிற்சி செய்ய வேண்டும், ஆனால் நான் ஒரு `DocumentFragment` ஐச் சேர்க்க முயற்சித்ததால் தான் இது என்று சந்தேகிக்கிறேன். இதன் பொருள் `w.document.body.appendChild(document.adoptNode(airhornerIframe));` மற்றும் `w.document.body.appendChild(airhornerIframe);` இரண்டும் ஒரே விளைவைக் கொண்டிருக்கும்.
* DOM கூறுகள் அவற்றின் நிலையை வைத்திருக்கும் (தனிப்பயன் உறுப்பை சரிபார்க்கவும்), DOM இல் ஒரு iframe நகர்த்தப்பட்டால் அது மீண்டும் ஏற்றப்படும். காலம். இதன் பொருள் ஐஃப்ரேம்களுக்கு இடையில் நகர்த்துவது நான் முதலில் சோதித்ததைப் போல மாநிலத்தை வைத்திருக்காது, SW பக்கத்தை நம்பமுடியாத அளவிற்கு விரைவாக ஏற்றியதன் காரணமாக இது நிகழ்ந்தது என்று நான் நம்புகிறேன். போர்ட்டல்கள் API இதை பாதிக்காது - எனவே எதிர்காலத்தில் இந்த அனுபவம் செயல்பட வேண்டும் :)

ஆவணங்களுக்கு இடையில் கூறுகளை நகர்த்துவதற்கான கருத்து இன்னும் செல்லுபடியாகும் மற்றும் சுவாரஸ்யமானது, ஆனால் ஐஃப்ரேம்களுக்கான நன்மை இல்லை. சாளரங்களுக்கு இடையில் நகர்த்தும்போது வீடியோ கூறுகள் மீட்டமைக்கப்படுவதை நான் கவனித்தேன், ஐஃப்ரேம் உண்மையில் அதன் நிலையை மீட்டமைக்கவில்லை என்பதை சரிபார்க்க நான் மிகவும் விடாமுயற்சியுடன் இருந்திருக்க வேண்டும்.

எப்போதும் போல, நீங்கள் [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### அசல் இடுகை 2010 இல் நான் [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) , &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39; எனப்படும் [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) ஒரு கருத்தை குறிப்பிட்டுள்ள ஒரு ஆவணத்தில் தடுமாறினேன், அதற்கு ஒரு குளிர் பெயர் இருந்தது மற்றும் கருத்து நாவல்.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

`iframe` தொகுத்தல் சாளரம் போன்ற ஒரு &#39;சிறிய கூறுக்கு&#39; கூட பல பயன்பாடுகள் சிக்கலான ஜாவாஸ்கிரிப்டை ஏற்ற வேண்டும் என்பது கருத்து, நீங்கள் ஒரு `iframe` ஏற்றப்பட்ட பயன்பாட்டின் கூறுகளை பிரதான சாளரத்தில் பயனர் தொடர்பு கொள்ளலாம், பயன்பாடுகள் &#39;புதிய சாளரத்தில் எழுது&#39; பொத்தானைக் கிளிக் செய்யும் போது நீங்கள் &#39;கிழித்து&#39; புதிய சாளரத்திற்கு செல்லலாம். ஆசிரியருடன் பேசுவதற்கு எனக்கு போதுமான நம்பிக்கை இல்லை (மற்றும் நான் இன்னும் இல்லை, அல்லது ஜிமெயில் எப்போதுமே பயன்படுத்தப்பட்டதா என்பதைப் பார்க்க நான் மூலத்தைப் பார்த்ததில்லை) ஆனால் அது என் மனதில் நிலைத்திருந்தது, ஏனெனில் பெயர் புதிரானது .

ஹாப் 10 வருடங்கள் முன்னோக்கி செல்கிறேன், நான் ஒரு நீண்ட ரயில் பயணத்தில் இருந்தேன், `adoptNode` API பற்றி எனக்கு அதிகம் தெரியாத ஒரு பகுதியை விசாரிக்க ஆரம்பித்தேன். நான் ஒரு [lot of ideas](https://nifty-meadowlark.glitch.me/) உடன் விளையாடினேன், மேலும் DOM கூறுகள், அவற்றின் தற்போதைய நிலை மற்றும் அவற்றின் இணைக்கப்பட்ட நிகழ்வு கையாளுபவர்களை புதிய சாளரங்களுக்கு நகர்த்த முடியும் என்பதை உணர்ந்தேன். இது எனக்கு &#39;மேஜிக் ஐஃப்ரேம்களை&#39; நினைவூட்டியது மற்றும் இறுதியில் நீங்கள் ஒரு பாப்-அவுட் ஐஃப்ரேமை உருவாக்க முடியும் என்ற எண்ணத்திற்கு இட்டுச் செல்கிறது (ஒரு பாப்-அவுட் ஐஃப்ரேம் படம் வீடியோவில் படம் ஆனால் ஐஃப்ரேம் கூறுகளுக்கு)

பாப்-அவுட் ஐஃப்ரேமிற்கான குறியீடு மிகவும் எளிது:

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

உலாவியில் உள்ள ஆவணங்களுக்கிடையில், தற்போதுள்ள பிணைப்பு நிகழ்வு கையாளுநர்களைப் பராமரிக்கும் போது, DOM கூறுகளை அவற்றின் தற்போதைய நிலைக்கு நகர்த்த `adoptNode` அனுமதிக்கிறது - இது தற்போதைய சாளரத்திற்குள் ஒரு புதிய DOM ஆக இருக்கலாம், அல்லது இந்த டெமோவைப் போலவே இது ஏற்கனவே நகரும் அதே தோற்றத்தில் இருக்கும் மற்றொரு சாளரத்தில் `iframe` . (மேலே புதுப்பிப்பைக் காண்க).

ஒரு ஐஃப்ரேமை நகர்த்துவது சுவாரஸ்யமானது, ஏனெனில் நீங்கள் ஐஃப்ரேமின் உள்ளடக்கங்களை மறுதொடக்கம் செய்ய வேண்டியதில்லை என்று பொருள், உதாரணமாக நகர்த்தப்பட்டது. இரண்டு தீமைகள் உள்ளன:

1. URL தற்போதைய தோற்றத்தில் உள்ளது, ஆனால் `<portal>` தோற்றம் அல்ல, இருப்பினும் இது `<portal>` API தீர்க்கக்கூடிய `<portal>` .
2. நீங்கள் தனிப்பயன் உறுப்பை நகர்த்தினால், அல்லது அதன் தர்க்கம் திறந்த நிலையில் ஹோஸ்ட் செய்யப்பட்டிருந்தால் - நீங்கள் துவக்கத்தை மூடினால், செயல்படுத்தல் நிறுத்தப்படும்.

குறைபாடுகள் ஒருபுறம் இருக்க, இந்த DOM நிலை ஐபிசி வழிமுறை மிகவும் சுவாரஸ்யமானது என்று நினைத்தேன். [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) உடன் ஒரு நாடகத்தை [demo page](https://nifty-meadowlark.glitch.me/) , இது எங்கு பயன்படுத்தப்படலாம் என்பதற்கான சுவாரஸ்யமான யோசனைகள் ஏதேனும் இருந்தால் எனக்குத் தெரியப்படுத்துங்கள்.

