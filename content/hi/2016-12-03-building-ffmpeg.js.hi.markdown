---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) एक अद्भुत प्रोजेक्ट है और इससे मुझे मेरी नवीनतम परियोजनाओं में से एक बनाने में मदद मिली: [डिवाइस फ़्रेम](https://paulkinlan.github.io/ deviceframe.es/)। यह मूल रूप से ffmpeg बनाता है (आकार को छोटा रखने के लिए डिफ़ॉल्ट के एक अच्छे सेट के साथ & mdash; जितना छोटा हो सकता है)। यदि डिफ़ॉल्ट बिल्ड आपको आवश्यक फ़िल्टर और एन्कोडर्स का समर्थन नहीं करता है, तो आपको इसे स्वयं बनाना होगा।

यह भविष्य में मेरे लिए एक नोट है, लेकिन यह वही है जो मैंने इसे काम करने के लिए किया था। (नोट: मैंने मैकोज़ सिएरा पर कोशिश की और संकलन त्रुटियां प्राप्त कर रही थीं)।

#### जमा स्थापित करें

1. 'sudo apt-get automake libtool build-required cmake' इंस्टॉल करें



#### ffmpeg.js डाउनलोड करें

1. `गिट क्लोन git@github.com: कगामी / ffmpeg.js.git` 2.` सीडी ffmpeg.js` 3. `गिट सबमिशन init` 4.` गिट सबमिशन अद्यतन --recursive`



#### ईएमएसस्क्रिप्ट स्थापित करें:

1. लिनक्स: [डाउनलोड](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk अपडेट` 3.` ./emsdk नवीनतम इंस्टॉल करें `4. रुको ... 5.` ./emsdk नवीनतम '6. स्रोत सक्रिय करें। / Emsdk_env.sh`

#### ffmpeg.js बनाएं

* 'सब कुछ बनाओ'

अगर फ्रिबिडी के साथ त्रुटियां हैं:

* `सीडी बिल्ड / fribidi / && ./bootstrap && कॉन्फ़िगर करें

आपको त्रुटियां दिखाई दे सकती हैं जैसे:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
सुनिश्चित करें कि आपके पास `libtool` स्थापित है।

#### किया हुआ।
