---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
यह पोस्ट एक [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) डिबगिंग पर पोस्ट का एक निरंतरता है, लेकिन [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) का उपयोग करने के बजाय, अब आप Crostini के साथ Chrome OS (m75) का उपयोग कर सकते हैं।

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

मैं [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) से [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) रहा हूं जो एक अच्छी शुरुआत है, लेकिन क्रोम ओएस और क्रॉस्टिनी के साथ जाने के लिए पर्याप्त नहीं है। नीचे किसी न किसी गाइड का अनुसरण किया गया है।

सुनिश्चित करें कि आप कम से कम क्रोम OS m75 (वर्तमान में 15 अप्रैल तक देव चैनल) का उपयोग कर रहे हैं, फिर:

1. सुनिश्चित करें कि आपके पास क्रोस्तिनी USB सपोर्ट सक्षम है - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. क्रेस्टिनी में टर्मिनल खोलें
1. `sudo apt-get install usbutils udev` - आपको यह सुनिश्चित करने की आवश्यकता है कि आपके पास USB उपकरण स्थापित हैं।
1. `lsusb` - आप अब अपने जुड़े डिवाइस देखना चाहिए, अगर यह काम नहीं करता है एक और मुद्दा हो सकता है।
1. काम `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. काम `sudo apt install android-tools-adb android-tools-fastboot`
1. मुझे यकीन नहीं है कि मुझे इसकी ज़रूरत थी, लेकिन मैंने `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` भी चलाया
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` और फिर फ़ाइल में डिवाइस विक्रेता आईडी जोड़ा गया।

सब से ऊपर किया जाता है, तो आप में सक्षम होना चाहिए `adb devices` और जुड़े उपकरणों की अपनी सूची मिलता है।
