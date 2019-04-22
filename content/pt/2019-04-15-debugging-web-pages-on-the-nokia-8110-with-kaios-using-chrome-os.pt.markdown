---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Esta postagem é uma continuação da postagem sobre a depuração de [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , mas, em vez de usar o macOS, agora você pode usar o Chrome OS (m75) com o Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Eu estou cribbing do [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) que é um bom começo, mas não o suficiente para começar com o Chrome OS e Crostini. Abaixo está o guia aproximado que eu segui.

Certifique-se de que você está usando pelo menos o Chrome OS m75 (atualmente o canal de desenvolvimento a partir de 15 de abril) e, em seguida:

1. Assegure-se de ter o suporte a Crostini USB ativado - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Abra o terminal em crostini
1. `sudo apt-get install usbutils udev` - Você precisa ter certeza de que você tem as ferramentas USB instaladas.
1. `lsusb` - Você deve ver agora o seu dispositivo conectado, se isso não funcionar, pode haver outro problema.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Não estou certo de que eu precisava, mas eu também correu `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` e, em seguida, adicionou o ID do fornecedor do dispositivo ao arquivo.

Se tudo o que foi `adb devices` acima estiver pronto, você deve ser capaz de `adb devices` e obter sua lista de dispositivos conectados.
