---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os
date: 2019-04-15T01:16:30.473Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS using Chrome OS'
link: ''
tags: [chromeos, kaios, webide, crostini]
---
Bài đăng này là phần tiếp theo của bài đăng về gỡ lỗi [KaiOS device with Web IDE](<a href="https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/">https://paul.kinlan.me/debugging-web-pages-on-the-nokia-8110-with-kaios/</a>) , nhưng thay vì sử dụng macOS, giờ đây bạn có thể sử dụng Chrome OS (m75) với Crostini.

<figure><img src="/images/2019-04-15-debugging-web-pages-on-the-nokia-8110-with-kaios-using-chrome-os-1.jpeg"></figure>

Tôi đang [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) từ [KaiOS Environment Setup](<a href="https://developer.kaiostech.com/environment-setup">https://developer.kaiostech.com/environment-setup</a>) , một khởi đầu tốt, nhưng không đủ để bắt đầu với Chrome OS và Crostini. Dưới đây là hướng dẫn sơ bộ mà tôi làm theo.

Đảm bảo rằng bạn đang sử dụng ít nhất Chrome OS m75 (kênh hiện tại là ngày 15 tháng 4), sau đó:

1. Đảm bảo rằng bạn có Crostini hỗ trợ USB kích hoạt - <a <span class="notranslate">href=&quot;chrome://flags/#crostini-usb-support&quot; &gt;chrome://flags/#crostini-usb-support</a>
1. Mở thiết bị đầu cuối trong crostini
1. `sudo apt-get install usbutils udev` - Bạn cần đảm bảo rằng bạn đã cài đặt các công cụ USB.
1. `lsusb` - Bây giờ bạn sẽ thấy thiết bị được kết nối của mình, nếu thiết bị này không hoạt động thì có thể có một vấn đề khác.
1. `sudo apt-get install --no-install-recommends autoconf2.13 bison bzip2 ccache curl flex gawk gcc g++ g++-multilib git lib32ncurses5-dev lib32z1-dev libgconf2-dev libgl1-mesa-dev libx11-dev make zip lzop libxml2-utils openjdk-8-jdk nodejs unzip python`
1. `sudo apt install android-tools-adb android-tools-fastboot`
1. Tôi không chắc là tôi cần nó, nhưng tôi cũng đã chạy `wget -S -O - https://raw.githubusercontent.com/cm-b2g/B2G/1230463/tools/51-android.rules | sudo tee &gt;/dev/null /etc/udev/rules.d/51-android.rules; sudo udevadm control --reload-rules`
1. `sudo chmod a+r /etc/udev/rules.d/51-android.rules` và sau đó thêm ID nhà cung cấp thiết bị vào tệp.

Nếu tất cả các cách trên được thực hiện, thì bạn sẽ có thể `adb devices` và nhận danh sách các thiết bị được kết nối.
