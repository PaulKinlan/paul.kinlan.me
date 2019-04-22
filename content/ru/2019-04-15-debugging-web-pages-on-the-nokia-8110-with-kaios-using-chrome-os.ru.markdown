---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Этот пост является продолжением поста об отладке [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , но вместо macOS теперь можно использовать Chrome OS (m75) с Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Я пишу с [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) который является хорошим началом, но этого недостаточно для начала работы с Chrome OS и Crostini. Ниже приведено грубое руководство, которому я следовал.

Убедитесь, что вы используете хотя бы Chrome OS m75 (в настоящее время канал разработки по состоянию на 15 апреля), а затем:

1. Убедитесь, что у вас включена поддержка Crostini USB - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Откройте терминал в Кростини
1. `sudo apt-get install usbutils udev` - Вы должны убедиться, что у вас установлены инструменты USB.
1. `lsusb` - `lsusb` вы должны увидеть подключенное устройство, если это не работает, может быть другая проблема.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Я не уверен, что мне это было нужно, но я тоже запускал `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` а затем добавили идентификатор производителя устройства в файл.

Если все вышеперечисленное выполнено, вы сможете использовать `adb devices` и получить список подключенных устройств.
