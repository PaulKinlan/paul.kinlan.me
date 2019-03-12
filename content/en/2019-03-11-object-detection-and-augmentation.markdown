---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
I've been playing around a lot with the [Shape Detection
API](https://paul.kinlan.me/face-detection/
https://paul.kinlan.me/barcode-detection/
https://paul.kinlan.me/detecting-text-in-an-image/) in Chrome a lot and I really
like the potential it has, for example a very simple [QRCode
detector](https://qrsnapper.com) I wrote a long time ago has a JS polyfill, but
uses `new BarcodeDetector()` API if it is available.

You can see some of the other demo's I've built here using the other
capabilities of the shape detection API: [Face
Detection](https://paul.kinlan.me/face-detection/),[Barcode
Detection](https://paul.kinlan.me/barcode-detection/) and [Text
Detection](https://paul.kinlan.me/detecting-text-in-an-image/).

I was pleasantly surprised when I stumbled across [Jeeliz](https://jeeliz.com)
at the weekend and I was incredibly impressed at the performance of their
toolkit - granted I was using a Pixel3 XL, but detection of faces seemed
significantly quicker than what is possible with the `FaceDetector` API.

[Checkout some of their demos](https://jeeliz.com/sunglasses).

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

It got me thinking a lot. This toolkit (and ones like it) use API's that are
broadly available on the Web (unlike Chrome's Shape Detection API), so we can
reach billions of users with these experiences relatively easily, and we can now
do so safely and consistently across the web. That means we can build the fun
snapchat-esque face filter apps without having users install MASSIVE apps that
harvest huge amount of data from the users device (because there is no
underlying access to the system).

Outside of the fun demos, it's possible to solve very advanced use-cases quickly
and simply for the user, such as:

* Text Selection directly from the camera or photo from the user
* Live translation of languages from the camera
* Inline QRCode detection so people don't have to open WeChat all the time :)
* Auto extract website URLs or address from an image
* Credit card detection and number extraction (get users signing up to your site
  quicker)
* Visual product search in your store's web app.
* Barcode lookup for more product details in your stores web app.
* Quick cropping of profile photos on to people's faces.
* Simple A11Y features to let the a user hear the text found in images.

I just spent 5 minutes thinking about these use-cases &mdash; I know there are a
lot more &mdash; but it hit me that we don't see a lot of sites or web apps
utilising the camera, instead we see a lot of sites asking their users to
download an app, and I don't think we need to do that any more.

**Update** Thomas Steiner on our team mentioned in our team Chat that it sounds
like I don't like the current `ShapeDetection` API. I love the fact that this
API gives us access to the native shipping implementations of the each of the
respective systems, however as I wrote in [The Lumpy Web](/the-lumpy-web/), Web
Developers crave consistency in the platform and there are number of issues with
the Shape Detection API that can be summarized as:

1. The API is only in Chrome
2. The API in Chrome is vastly different on every platforms because their
   underlying implementations are different. Android only has points for
   landmarks such as mouth and eyes, where macOS has outlines. On Android the
   `TextDetector` returns the detected text, where as on macOS it returns a
   'Text Presence' indicator... This is not to mention all the bugs that Surma
   found.

The web as a platform for distribution makes so much sense for experiences like
these that I think it would be remiss of us not to do it, but the above two
groupings of issues leads me to question the long-term need to implement every
feature on the web platform natively, when we could implement good solutions in
a package that is shipped using the features of the platform today like WebGL,
WASM and in the future Web GPU.

Anyway, I love the fact that we can do this on the web and I am looking forwards
to seeing sites ship with them.