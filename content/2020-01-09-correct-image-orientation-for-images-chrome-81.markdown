---
date: 2020-01-09 14:16:53.134000+00:00
link: ''
slug: correct-image-orientation-for-images-chrome-81
summary: 'Chrome 81 finally fixes a long-standing bug where images taken in portrait
  mode on phones were displayed in landscape. Now, images will respect the orientation
  from the EXIF data by default, unless overridden with the CSS attribute `image-orientation:
  none`. Check out the demo!'
tags:
- chrome
- chromium
- image orientation
- exif
- css
- web development
- bug fix
title: Correct image orientation for images - Chrome 81

---

<figure><video src="/videos/2020-01-09-correct-image-orientation-for-images-chrome-81-0.mp4" alt="Screencast 2020-01-09 14:11:12.mp4" controls></video></figure>

Looks like one of the oldest bugs in [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=158753) has been fixed. Chrome used to display images in landscape orientation even if they were taken in portrait on a phone.

Now it appears that in Chrome 81 we will respect the image orientation from the files EXIF data and display the image in that orientation by default unless you override it with a CSS attribute `image-orientation: none`.

Fun times.

[Demo](https://sumptuous-passionfruit.glitch.me/)

