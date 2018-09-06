---
slug: barcode-detection
date: 2016-12-05
title: "Barcode detection using Shape Detection API"
tags: ['api', 'javascript', 'shape-detection', 'qrcode']
---


Chrome இல் உள்ள கேனரி சேனலில் இருக்கும், (நான் முகம் கண்டறிதல் API வழியாக) (/ face-detection /) பற்றிப் பேசினேன். இப்போது பார்கோடு கண்டறிதல் Chrome Canary இல் உள்ளது ([மிகுவல்](https://twitter.com/yellowdoge) என் ஹீரோ;)

பார்கோடுகள் பெரியவை! அவர்கள் வாங்கிய ஒவ்வொரு தயாரிப்புக்கும் உள்ளோம். மிக மோசமான [கூட QRCode அமெரிக்க மற்றும் ஐரோப்பா வெளியே பெரிய உள்ளது](https://www.clickz.com/why-have-qr-codes-taken-off-in-china/23662/). பார்கோடு மற்றும் QRcode நீங்கள் நடுத்தர மற்றும் நீங்கள் இடையே சிறிய அளவு தரவு மாற்றுவதன் மூலம் உடல் உலக மற்றும் டிஜிட்டல் உலக பாலம் ஒரு எளிய வழி வழங்குகிறது. டெஸ்க்டாப்பின் சகாப்தத்தில் இது ஒரு பெரிய அளவு பயன்பாடாக இருந்திருக்காது, மொபைல் காலத்தில் இது மிக முக்கியமானது. இந்தப் தரவிற்கான அணுகலைப் பெற, நீங்கள் ஒரு பயன்பாட்டை நிறுவ வேண்டியதில்லை.

வடிவமைப்பின் கண்டறிதல் API சிறப்பாக உள்ளது, ஏனெனில் இது பயனரின் சாதனத்தில் சில பின்தங்கிய வன்பொருள் அம்சங்களில் ஒரு நிலையான இடைமுகத்தை உருவாக்குகிறது, மேலும் வெப் தளத்திற்கு ஒரு புதிய தொகுப்பு திறன்களைத் திறக்கிறது, முதன்மையாக ஃபேஸ் டிடக்சன் மற்றும் பார்கோடு கண்டறிதல்.

[WICG] [https://github.com/ இல் தற்போது [வடிவம் கண்டறிதல் API](https://wicg.github.io/shape-detection-api/#introduction) மீது பார்கோடு கண்டறிதல் API கட்டமைக்கப்பட்டுள்ளது. wicg /) என்பது ஒரு காப்பீட்டு மற்றும் சோதனை கட்டத்தில் உள்ளது என்பதாகும். ஆன்ராய்டில் நீங்கள் 1D மற்றும் 2D பலவற்றை கண்டறியலாம் (https://developers.google.com/vision/barcodes-overview) பார்கோடுகள்:

> 1D barcodes: EAN-13, EAN-8, UPC-A, UPC-E, Code-39, Code-93, Code-128, ITF,
> Codabar
>
> 2D barcodes: QR Code, Data Matrix, PDF-417, AZTEC


மேலும்:

> It automatically parses QR Codes, Data Matrix, PDF-417, and Aztec values, for
> the following supported formats:
>
> * URL
> * Contact information (VCARD, etc.)
> * Calendar event
> * Email
> * Phone
> * SMS
> * ISBN
> * WiFi
> * Geo-location (latitude and longitude)
> * AAMVA driver license/ID


வடிவம் கண்டறிதல் API தற்போது Chrome கேனரி (M57) இல் உள்ளது மற்றும் `chrome: // flags / # enable-experimental-web-platform-features` மூலம் நீங்கள் அதை இயக்க வேண்டும்

முகம் கண்டறிதல் போலவே, ஏபிஐ பயன்படுத்த மிகவும் எளிதானது. `பார்கோடு டிடெக்டர்` API இல்` கண்டறிதல்` வழியாக API ஐ நீங்கள் அழைத்துக் கொள்கிறீர்கள், மற்றும் குறியிடப்பட்ட பார்கோடுகளின் பட்டியலுக்கு மீண்டும் ஒரு வாக்குறுதியைப் பெறுவீர்கள்.


```javascript
var barcodeDetector = new BarcodeDetector();
barcodeDetector.detect(image)
  .then(barcodes => {
    barcodes.forEach(barcode => console.log(barcodes.rawValue))
  })
  .catch((e) => {
    console.error("Boo, BarcodeDetection failed: " + e);
  });
```


இது ஒரு பட பொருளை (கேன்வாஸ் இமேஜ் ஆதாரம், ப்ளாப், ImageData அல்லது ஒரு ` <img> `உறுப்பு), பின்னர் அது அடிப்படை கணினி ஏபிஐக்கு சென்று, &#39;DetectedObject` ஐ செயல்படுத்தும்` DetectedBarcode` பொருள்களின் ஒரு வரிசையைத் திரும்பப்பெறுகிறது, இது அடிப்படையில் நீங்கள் படத்தில் உள்ள ஒவ்வொரு முகத்தின் எல்லையும் கொடுக்கிறது.

நான் [ஒருங்கிணைந்த](https://github.com/PaulKinlan/qrcode/commit/21afa9ae4c316e4a8ced76d77f41eda2eb92852b) இது என் [QRCode ஸ்கேனர் அப்ளிகேஷன்] க்கு (https://qrsnapper.appspot.com) ஆனால் நான் ஒரு [கேன்வாஸ்](https://bugs.chromium.org/p/chromium/issues/detail?id=670977) அல்லது [ImageData](https://bugs.chromium.org/) இல் என்னை அனுமதிக்கும் நிலப்பகுதியை சரி செய்யுங்கள் பி / குரோமியம் / சிக்கல்கள் / விவரம்? id = 670975) ஏபிஐ மீது பொருள்.

சுவாரஸ்யமான விஷயம் என்னவென்றால், நான் இந்த பயன்பாட்டை [LazarSoft jsqrcode API](https://github.com/LazarSoft/jsqrcode) ஐப் பயன்படுத்தி ஏற்கனவே சொந்தமாக பார்கோடு ஸ்கேனிங்கின் கிடைப்பதை கண்டறிந்து, அது இல்லாவிட்டால் நான் தூய JS செயல்படுத்த மீண்டும் தோல்வி.

நடவடிக்கைகளில் சில வீடியோக்கள் இங்கு உள்ளன:

{{<youtube LGB0n-dW_HM>}}

{{<youtube Anq_N_SY17o>}}

நான் அதை முந்தைய கட்டுரையில் குறிப்பிடவில்லை, ஆனால் இது ஒரு தொழிலாளி நூலில் (மற்றும் ஒரு சேவை ஊழியருக்குள் விளைவாக) வேலை செய்ய வேண்டும். என் பயன்பாட்டுக் கருவிக்கு இது மிகவும் புத்திசாலித்தனமானது, ஏனென்றால் என் தர்க்கத்தை மற்றொரு நூலுக்குள் அனுப்புவதோடு, எல்லாவற்றையும் UI நூலிலிருந்து விலக்கி வைக்க உதவுகிறது.

நான் அதை வலை தளத்திற்கு மிகவும் கட்டாய கூடுதலாக நினைக்கிறேன் மற்றும் நான் இந்த பயன்படுத்தப்படுகிறது பார்க்க உற்சாகமாக.