---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
ਇਹ ਪੋਸਟ ਇੱਕ [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) ਡੀਬਗਿੰਗ &#39;ਤੇ ਪੋਸਟ ਦੀ ਨਿਰੰਤਰਤਾ ਹੈ, ਪਰ ਮੈਕੌਸ ਦੀ ਵਰਤੋਂ ਕਰਨ ਦੀ ਬਜਾਏ ਤੁਸੀਂ ਹੁਣ ਕ੍ਰੋਓਸਟਨੀ ਨਾਲ Chrome OS (m75) ਵਰਤ ਸਕਦੇ ਹੋ.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

ਮੈਂ [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) ਤੋਂ [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) ਰਿਹਾ ਹਾਂ ਜੋ ਕਿ ਚੰਗੀ ਸ਼ੁਰੂਆਤ ਹੈ, ਪਰੰਤੂ Chrome OS ਅਤੇ Crostini ਦੇ ਨਾਲ ਜਾਣ ਲਈ ਕਾਫ਼ੀ ਨਹੀਂ ਹੇਠਾਂ ਮੈਂ ਮਾਰੂ ਮਾਰਗ ਹੈ ਜਿਸਦਾ ਮੈਂ ਪਾਲਣ ਕੀਤਾ ਹੈ.

ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਤੁਸੀਂ ਘੱਟੋ ਘੱਟ Chrome OS m75 (ਇਸ ਸਮੇਂ ਅਪ੍ਰੈਲ 15 ਦਾ ਚੈਨਲ) ਵਰਤ ਰਹੇ ਹੋ, ਫਿਰ:

1. ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਕ੍ਰੋਸਟੀਨੀ USB ਸਹਾਇਤਾ ਸਮਰਥਿਤ ਹੈ - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. ਕਵੋਸਟਨੀ ਵਿਚ ਟਰਮੀਨਲ ਖੋਲੋ
1. `sudo apt-get install usbutils udev` - ਤੁਹਾਨੂੰ ਇਹ ਯਕੀਨੀ ਬਣਾਉਣ ਦੀ ਲੋੜ ਹੈ ਕਿ ਤੁਹਾਡੇ ਕੋਲ USB ਟੂਲ ਸਥਾਪਿਤ ਹਨ.
1. `lsusb` - ਤੁਹਾਨੂੰ ਹੁਣ ਤੁਹਾਡੀ ਕਨੈਕਟ ਕੀਤੀ ਡਿਵਾਈਸ ਨੂੰ ਵੇਖਣਾ ਚਾਹੀਦਾ ਹੈ, ਜੇਕਰ ਇਹ ਕੰਮ ਨਹੀਂ ਕਰਦਾ ਤਾਂ ਕੋਈ ਹੋਰ ਸਮੱਸਿਆ ਹੋ ਸਕਦੀ ਹੈ
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. ਮੈਨੂੰ ਪੱਕਾ ਯਕੀਨ ਨਹੀਂ ਹੈ ਕਿ ਮੈਨੂੰ ਇਸ ਦੀ ਜ਼ਰੂਰਤ ਹੈ, ਪਰ ਮੈਂ `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` ਵੀ ਚਲਾ `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` ਅਤੇ ਫਿਰ ਫਾਈਲ ਵਿੱਚ ਡਿਵਾਈਸ ਵਿਕਰੇਤਾ ID ਨੂੰ ਜੋੜਿਆ ਗਿਆ

ਜੇ ਉਪਰੋਕਤ ਸਾਰੇ ਕੀਤੇ ਗਏ ਹਨ, ਤਾਂ ਤੁਹਾਨੂੰ `adb devices` ਅਤੇ ਤੁਹਾਡੀਆਂ ਕਨੈਕਟ ਕੀਤੀਆਂ ਡਿਵਾਈਸਾਂ ਦੀ ਸੂਚੀ ਪ੍ਰਾਪਤ ਕਰਨ ਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ.
