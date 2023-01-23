---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
We've been doing a lot of development on feature phones recently and it's been hard, but fun. The hardest bit is that on KaiOS we found it impossible to debug web pages, especially on the hardware that we had (The Nokia 8110). The Nokia is a great device, it's built with KaiOS which we know is based on something akin to Firefox 48, but it's locked down, there is no traditional developer mode like you get on other Android devices, which means you can't connect Firefox's WebIDE easily.

Through a combination of reading a couple of blogs, and knowing a bit about `adb` I worked out how to do it. Note, others might have been able to do it, but it's not documented in one place cleanly.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(Image above shows the DevTools and also the output of the screenshot tool)

Here are the steps:

1. Connect a USB cable. Ensure you have `adb` installed on your main machine.
2. Download a copy of [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (this is the only one I could get to work)
3. Enable 'Developer Mode' by entering `*#*#33284#*#*` from your phone (note, don't use the dialer). You will see a little 'bug' icon on the top of the screen. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk)]
4. Attach your USB cable
5. On your development machine run the following commands
   1. `adb start-server`
   2. `adb devices` to check your phone is connected.
   3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` this sets up a channel from your machine to a socket on the phone. This is what Web IDE uses.
6. Start `Web IDE` by opening Firefox, go to Tools and then Web IDE
7. Web IDE will be open, click 'Remote Runtime' and click the open button that has 'localhost:6000' in. (this is the tcp forwarding port).
8. Open a page on the phone, and you should see it on the left.
Voila.
