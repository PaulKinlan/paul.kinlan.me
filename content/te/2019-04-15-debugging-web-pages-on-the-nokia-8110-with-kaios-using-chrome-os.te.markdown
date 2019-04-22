---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
ఈ పోస్ట్ [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) ను డీబగ్ చేయడంలో పోస్ట్ కొనసాగింపుగా ఉంది, కానీ బదులుగా MacOS ని ఉపయోగించడం వల్ల, మీరు ఇప్పుడు క్రోస్టినితో Chrome OS (m75) ను ఉపయోగించవచ్చు.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

నేను ఒక మంచి ప్రారంభం ఇది [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) నుండి cribbing చేస్తున్నాను, కానీ Chrome OS మరియు Crostini తో వెళ్ళడం కోసం తగినంత కాదు. నేను అనుసరిస్తున్న కఠినమైన గైడ్ క్రింద ఉంది.

మీరు కనీసం Chrome OS m75 ను ఉపయోగిస్తున్నారని నిర్ధారించుకోండి (ప్రస్తుతం ఏప్రిల్ 15 వ తేదీకి చెందిన డెవలపర్ ఛానల్), అప్పుడు:

1. మీరు Crostini USB మద్దతు ఎనేబుల్ కలిగి నిర్ధారించుకోండి - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. క్రోస్టినీలో టెర్మినల్ను తెరవండి
1. `sudo apt-get install usbutils udev` - మీకు USB టూల్స్ వ్యవస్థాపించబడిందని నిర్ధారించుకోవాలి.
1. `lsusb` - మీరు ఇప్పుడు మీ కనెక్ట్ చేసిన పరికరం చూడాలి, ఇది పనిచేయకపోతే మరొక సమస్య ఉండవచ్చు.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. నాకు అవసరమో నాకు తెలియదు, కానీ నేను `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` కూడా నడిపించాను
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` ఆపై ఫైల్ విక్రేత ID ను ఫైల్కు జోడించింది.

పైవన్నీ పూర్తి చేయబడితే, అప్పుడు మీరు `adb devices` మరియు కనెక్ట్ చేయబడిన పరికరాల జాబితాను పొందవచ్చు.
