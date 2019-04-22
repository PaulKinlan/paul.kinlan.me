---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Dieser Beitrag ist eine Fortsetzung des Beitrags zum Debuggen eines [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , aber anstelle von macOS können Sie jetzt Chrome OS (m75) mit Crostini verwenden.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Ich schaue nach [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) was ein guter Anfang ist, aber nicht genug, um mit Chrome OS und Crostini loszulegen. Unten ist der grobe Leitfaden, dem ich gefolgt bin.

Vergewissern Sie sich, dass Sie mindestens Chrome OS m75 (derzeit am 15. April entwickelter Kanal) verwenden.

1. Stellen Sie sicher, dass die Crostini USB-Unterstützung aktiviert ist - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Öffnen Sie das Terminal in crostini
1. `sudo apt-get install usbutils udev` - Sie müssen sicherstellen, dass die USB-Tools installiert sind.
1. `lsusb` - Ihr angeschlossenes Gerät sollte jetzt angezeigt werden. Wenn dies nicht funktioniert, liegt möglicherweise ein anderes Problem vor.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Ich bin mir nicht sicher, ob ich es brauchte, aber ich habe auch `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` und fügte der Gerätehersteller-ID dann die Datei hinzu.

Wenn Sie alles getan haben, sollten Sie in der Lage sein, `adb devices` und Ihre Liste der angeschlossenen Geräte `adb devices` .
