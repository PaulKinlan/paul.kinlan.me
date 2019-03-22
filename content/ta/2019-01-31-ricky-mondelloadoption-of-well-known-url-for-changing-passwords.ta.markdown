---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
சபாரி அணியின் மீது ரிக்கி மோண்டெல்லோ சமீபத்தில் ட்விட்டர் எவ்வாறு பயன்படுத்தப்படுகிறது என்பதைப் பற்றிய ஒரு குறிப்பை பகிர்ந்து கொண்டார். /Well-known/change-password spec.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

இந்த அம்சம் முற்றிலும் என்னை கடந்துவிட்டது ஆனால் அது ஒரு நல்ல யோசனை: நன்கு அறியப்பட்ட இடத்தில் ஒரு கோப்பு கொடுக்கப்பட்டால், உலாவி பயனர்களுக்கு ஒரு UI ஐ வழங்குகிறதா, அவை தளங்களின் சிக்கலான UI ஐத் தொடராமல் தங்கள் கடவுச்சொல்லை விரைவாக மீட்டமைக்க அனுமதிக்கின்றன.

ஸ்பெக் ஏமாற்றும் எளிமையானது: நன்கு அறியப்பட்ட கோப்பில் பயனர் செயலைச் செய்ய விரும்பும் போது நேரடியாக URL ஐ இயக்கும். இந்த சிந்தனை என்னை வழிவகுக்கும், நாம் இந்த அம்சங்களை இன்னும் வழங்க முடியும்:

* GDPR அடிப்படையிலான ஒப்புதல் மாதிரிகள் (குக்கீ சம்மதத்திற்கு) ஒரு நன்கு அறியப்பட்ட இடம் - தள உரிமையாளர்கள் ஒரு பயனரால் நிர்வகிக்கக்கூடிய மற்றும் அனைத்து குக்கீகளையும் பிற தரவு ஒப்புதலுடனான பொருட்களையும் ரத்து செய்யக்கூடிய பக்கத்திற்கு இணைப்பை வழங்க முடியும்.
* உலாவி அனுமதி மேலாண்மைக்கு நன்கு அறியப்பட்ட இடம் - தள உரிமையாளர்கள் புவி-இருப்பிடம், அறிவிப்புகள் மற்றும் பிற முதன்மையானவை போன்றவற்றிற்கு பயனர்கள் அனுமதியை திரும்பப்பெற முடியும்.
கணக்கு நீக்குதல் மற்றும் மாற்றங்களுக்கான ஒரு நன்கு அறியப்பட்ட பாதை
அஞ்சல் பட்டியல் சந்தா மேலாண்மைக்கு நன்கு அறியப்பட்ட பாதை

பட்டியல் தொடர்கிறது .... பயனர்கள் பொதுவான பயனர் செயல்களைக் கண்டறிவதற்கு உதவும் எளிமையான திருப்புதல் கோப்புகளுக்கான யோசனை எனக்கு மிகவும் பிடிக்கும், உலாவிக்கு ஒரு வழியாக அதை மேற்பார்வையிடுவதற்காக.

* புதுப்பி: * நான் ஒரு [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .