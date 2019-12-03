---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
This post is a continuation of the post on debugging a [KaiOS device with Web IDE](https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/), but instead of using macOS, you can now use Chrome OS (m75) with Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

I'm cribbing from the [KaiOS Environment Setup](https://developer.kaiostech.com/environment-setup) which is a good start, but not enough for getting going with Chrome OS and Crostini. Below is the rough guide that I followed.

Make sure that you are using at least Chrome OS m75 (currently dev channel as of April 15th), then:

1. Ensure that you have Crostini USB support enabled - [chrome://flags/#crostini-usb-support](chrome://flags/#crostini-usb-support)
1. Open up the terminal in crostini
1. `sudo apt-get install usbutils udev` - You need to make sure that you have the USB tools installed.
1. `lsusb` - You should now see your connected device, if this doesn't work there might be another issue.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. I am not sure I needed it, but I also ran `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules`&nbsp; and then added the device vendor ID to the file.

If all the above is done, you should then be able to `adb devices` and get your list of connected devices.
