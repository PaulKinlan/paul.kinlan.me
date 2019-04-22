---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Esta publicación es una continuación de la publicación sobre la depuración de [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , pero en lugar de usar macOS, ahora puede usar Chrome OS (m75) con Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Estoy [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) que es un buen comienzo, pero no lo suficiente como para empezar a [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) Chrome OS y Crostini. A continuación se muestra la guía aproximada que seguí.

Asegúrese de que está utilizando al menos Chrome OS m75 (actualmente, el canal dev es el 15 de abril), luego:

1. Asegúrese de tener habilitada la compatibilidad con Crostini USB - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Abrir el terminal en crostini.
1. `sudo apt-get install usbutils udev` : debe asegurarse de que tiene las herramientas USB instaladas.
1. `lsusb` : ahora debería ver su dispositivo conectado. Si esto no funciona, puede haber otro problema.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. No estoy seguro de que lo necesitara, pero también ejecuté `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` y, a continuación, agregue el ID de proveedor del dispositivo al archivo.

Si se hace todo lo anterior, debería poder `adb devices` y obtener su lista de dispositivos conectados.
