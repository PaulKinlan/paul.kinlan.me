---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Posting ini merupakan kelanjutan dari posting tentang debugging [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , tetapi alih-alih menggunakan macOS, Anda sekarang dapat menggunakan Chrome OS (m75) dengan Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Saya [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) dari [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) yang merupakan awal yang baik, tetapi tidak cukup untuk menjalankan Chrome OS dan Crostini. Di bawah ini adalah panduan kasar yang saya ikuti.

Pastikan Anda menggunakan setidaknya Chrome OS m75 (saat ini saluran dev pada 15 April), lalu:

1. Pastikan dukungan USB Crostini Anda diaktifkan - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Buka terminal di crostini
1. `sudo apt-get install usbutils udev` - Anda harus memastikan bahwa Anda memiliki alat USB yang diinstal.
1. `lsusb` - Sekarang Anda akan melihat perangkat Anda yang terhubung, jika ini tidak berhasil mungkin ada masalah lain.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Saya tidak yakin saya membutuhkannya, tetapi saya juga menjalankan `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` dan kemudian menambahkan ID vendor perangkat ke file.

Jika semua hal di atas selesai, Anda harus dapat `adb devices` dan mendapatkan daftar perangkat yang terhubung.
