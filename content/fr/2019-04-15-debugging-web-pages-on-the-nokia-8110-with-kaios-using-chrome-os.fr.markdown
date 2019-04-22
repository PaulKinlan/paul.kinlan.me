---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Cet article est une continuation de l&#39;article sur le débogage de [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , mais au lieu d&#39;utiliser macOS, vous pouvez maintenant utiliser Chrome OS (m75) avec Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Je viens de [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) ce qui est un bon début, mais pas suffisant pour [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) Chrome OS et Crostini. Ci-dessous le guide approximatif que j&#39;ai suivi.

Assurez-vous que vous utilisez au moins Chrome OS m75 (canal de développement actuel à compter du 15 avril), puis:

1. Assurez-vous que la prise en charge Crostini USB est activée - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Ouvrez le terminal dans crostini
1. `sudo apt-get install usbutils udev` - Vous devez vous assurer que les outils USB sont installés.
1. `lsusb` - Vous devriez maintenant voir votre appareil connecté. Si cela ne fonctionne pas, il peut y avoir un autre problème.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Je ne suis pas sûr d&#39;en avoir besoin, mais j&#39;ai aussi couru `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` , puis a ajouté l’ID du fournisseur du périphérique au fichier.

Si tout ce qui précède est fait, vous devriez alors pouvoir `adb devices` et obtenir votre liste de périphériques connectés.
