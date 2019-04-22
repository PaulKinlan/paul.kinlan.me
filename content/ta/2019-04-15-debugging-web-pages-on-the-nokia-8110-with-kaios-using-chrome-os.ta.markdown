---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
இந்த இடுகை [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) ஐப் பிழைத்திருத்தலில் இடுகையின் தொடர்ச்சியாகும், ஆனால் MacOS ஐப் பயன்படுத்துவதற்குப் பதிலாக, இப்போது க்ரோஸ்டினி உடன் Chrome OS (m75) ஐப் பயன்படுத்தலாம்.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

நான் ஒரு நல்ல துவக்கம் இது [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) இருந்து [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) , ஆனால் Chrome OS மற்றும் Crostini கொண்டு போகிறது போதாது. நான் தொடர்ந்து வந்த கடினமான வழிகாட்டி கீழே உள்ளது.

நீங்கள் குறைந்தது Chrome OS m75 ஐ பயன்படுத்துகிறீர்கள் என்பதை உறுதி செய்து கொள்ளுங்கள் (தற்போது ஏப்ரல் 15 ஆம் தேதியைப் போலவே சேனல்)

1. நீங்கள் Crostini USB ஆதரவு இயலுமைப்படுத்த வேண்டும் என்பதை உறுதிப்படுத்தவும் - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. க்ரெஸ்டினியில் டெர்மினல் திறக்க
1. `sudo apt-get install usbutils udev` - நீங்கள் USB கருவிகள் நிறுவப்பட்டிருப்பதை உறுதி செய்ய வேண்டும்.
1. `lsusb` - இது உங்கள் இணைக்கப்பட்ட சாதனம் இப்போது பார்க்க வேண்டும், இது வேலை செய்யவில்லை என்றால் மற்றொரு சிக்கல் இருக்கலாம்.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. எனக்கு அது `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` எனக்குத் `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` , ஆனால் நான் `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules` ஓடியது
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` பின்னர் சாதன விற்பனையாளர் ஐடி கோப்பில் சேர்த்தது.

மேலே உள்ள எல்லாவற்றையும் செய்தால், நீங்கள் `adb devices` ஆக முடியும் மற்றும் உங்கள் இணைக்கப்பட்ட சாதனங்களின் பட்டியலைப் பெறலாம்.
