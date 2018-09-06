---
slug: building-a-pubsub-api-in-javascript
date: 2016-12-08T13:20:31+01:00
title: "Building a simple PubSub system in JavaScript"
tags: ['pubsub', 'javascript']
---


பயன்பாட்டு நிலை நிகழ்வுகளுக்கு (உன்னதமான முறையில் நீங்கள் விரும்பினால்) என் UI பதிலளிக்க வேண்டும் என்ற ஒரு [web push](/ designing-a-webpush-service /) சேவையை உருவாக்கும் ஒரு சமீபத்திய திட்டத்தில், கணினி ஆனால் ஒருவருக்கொருவர் சார்ந்து இல்லை மற்றும் நான் 'வணிக தர்க்கம்' சுயாதீனமாக தங்களை நிர்வகிக்க முடியும் வேண்டும்.

எனக்கு உதவ பல்வேறு கருவிகள் நிறைய சுற்றி பார்த்தேன், ஆனால் நான் அடிக்கடி NIH நோய்க்குறி மற்றும் நான் மக்கள் விரைவில் தங்கள் சொந்த உள்கட்டமைப்பு கூறுகளை செயல்படுத்த முடியும் என்று உண்மையில் ஒரு காரணமாக உள்ளது, நான் விரைவாக ஒரு எளிய வாடிக்கையாளர்- பக்க PubSub சேவை & mdash; அது என் தேவைகளுக்கு மிகவும் நன்றாக வேலை செய்தது.

நான் தனிப்பயன் டிஓஎம் `நிகழ்வை` பயன்படுத்த வேண்டுமா மற்றும் டி.ஓ.எம் ஏற்கனவே டெவலப்பர்களுக்கு வழங்கியிருக்கும் உள்கட்டமைப்பைப் பயன்படுத்தலாமா என்று விவாதித்தேன் & mdash; `addEventListener` & mdash ஐப் பயன்படுத்தி நிகழ்வுகள் மற்றும் நுகரும் நிகழ்வுகளின் திறமை. ஆனால் ஒரே பிரச்சனை என்னவென்றால், நிகழ்வு நிகழ்வு ஹேண்டலரை ஒரு DOM அங்கம் அல்லது சாளரத்தை நீக்கிவிட வேண்டும் என்பதால், `EventTarget` இல் மரபுரிமையாக அல்லது கலந்த ஒரு மாதிரி இருக்க முடியாது.

_ ** சிந்தனை: ** ஒரு பொருளை 'EventTarget` கொண்டிருப்பது தனிபயன் PubSub அமைப்புகளை உருவாக்கும் அவசியத்தை தவிர்க்க உதவும்.

இந்த கட்டுப்பாட்டு மனதில், ஏதோ ஒன்றைக் குறியீடாகவும், நான் உருவாக்கும் பிழைகள் மனதில்லாமல் இருப்பதற்காகவும், நான் ஒரு கடினமான திட்டத்தை வகுத்தேன்:


```javascript
/* When a user is added, do something useful (like update UI) */
EventManager.subscribe('useradded', function(user) {
  console.log(user)
});

/* The UI submits the data, lets publish the event. */
form.onsubmit(function(e) {
  e.preventDefault();

  // do something with user fields

  EventManager.publish('useradded', user);
})
```


இவை அனைத்தும் புதியவை அல்ல. Redux மற்றும் பல அமைப்புகள் ஏற்கனவே இதை செய்கின்றன மற்றும் பல சந்தர்ப்பங்களில் அவை மாநிலத்தை நிர்வகிக்க உதவுகின்றன. என் தலையில், நான் உண்மையில் மாநில இல்லை உலாவி ஏற்கனவே மாநில septate என்று ஒரு மாதிரி வேண்டும்.

செயல்படுத்த செயல்படுத்த அழகான எளிமையானது மற்றும் சுருக்கம் குறைந்தபட்சம் எனக்கு மிகவும் பயனுள்ளதாக உள்ளது.


```javascript
var EventManager = new (function() {
  var events = {};

  this.publish = function(name, data) {
    var handlers = events[name];
    if(!!handlers === false) return;
    handlers.forEach(function(handler) {
      handler.call(this, data);
    });
  };

  this.subscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) {
      handlers = events[name] = [];
    }
    handlers.push(handler);
  };

  this.unsubscribe = function(name, handler) {
    var handlers = events[name];
    if(!!handlers === false) return;

    var handlerIdx = handlers.indexOf(handler);
    handlers.splice(handlerIdx);
  };
});
```
திருத்து: வாக்குறுதியின் பயன்பாடு நீக்கப்பட்டது.

அங்கு நாம் இருக்கிறோம். பிழைகள் நிறைந்த ஒரு எளிய pubsub அமைப்பு, ஆனால் நான் விரும்புகிறேன். :) நீங்கள் அதை ஆர்வமாக இருந்தால் [github](https://github.com/PaulKinlan/EventManager) மீது வைத்திருக்கிறேன்.