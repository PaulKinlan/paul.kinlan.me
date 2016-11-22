---
slug: face-detection
date: 2016-11-22
title: "Face detection using Shape Detection API"
video_url: /videos/face-detection.mp4
---

I was at the party of the [Chrome Dev
Summit](https://developer.chrome.com/devsummit) and Miguel Casa-Sanchez on the
Chrome team came up to me and said "Hey Paul, I have a demo for you".  Once I
saw it, I had to get it into my talk.

That API was the [Shape Detection
API](https://wicg.github.io/shape-detection-api/#introduction) that is currently
in the [WICG](https://github.com/wicg/) in an incubation and experiementation
phase and is a nice incremental addition to the platform.

The Shape Detection API is interesting because it creates a standard interface
on top of some underlaying hardware features on the user's device and opens up a
new set of capabilities to the web platform.

Shape Detection has been possible on the web for a long time. There are numerous
libraries that have been able to do Edge Detection, Face Detection, barcode
and QR code detection (I even wrote a web app that has done it.)

The Shape Detection API is currently in Chrome Canary (M57) and can detect both
faces and barcodes (and QRCodes) and because it is still experiemental
you have to enable it via `chrome://flags/#enable-experimental-web-platform-features`

The API is relatively simple to use, with the simplest form of face detection
being to invoke the API with an image and get the list of faces back.

```
var faceDetector = new FaceDetector();
faceDetector.detect(image)
  .then(faces => faces.forEach(face => console.log(face)))
  .catch(e => {
    console.error("Boo, Face Detection failed: " + e);
  });
```

It takes an image object (either a CanvasImageSource, Blob, ImageData or an
`<img>` element) and then passes that to the underlying system API and it will
return an array of `DetectedFace` objects that implement `DetectedObject` which
essentially gives you the bounds of each face in the image.

Miguel Casas-Sanchez wrote a fuller demo (which I stole and put on
[JSBin](https://jsbin.com/gegudoc/4/)) that loads an image, passes it through
the detection API and then draws on the image a rectangle around each of
the `DetectedFace` faces.

```
var image = document.getElementById('image');
var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');
var scale = 1;

image.onload = function() {
  ctx.drawImage(image,
              0, 0, image.width, image.height,
              0, 0, canvas.width, canvas.height);

  scale = canvas.width / image.width;
};

function detect() {
  if (window.FaceDetector == undefined) {
    console.error('Face Detection not supported');
    return;
  }

  var faceDetector = new FaceDetector();
  faceDetector.detect(image)
    .then(faces => {
      // Draw the faces on the <canvas>.
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      for(let face of faces) {
        ctx.rect(Math.floor(faces[i].x * scale),
                 Math.floor(faces[i].y * scale),
                 Math.floor(faces[i].width * scale),
                 Math.floor(faces[i].height * scale));
        ctx.stroke();
      }
    })
    .catch((e) => {
      console.error("Boo, Face Detection failed: " + e);
    });
}
```

### What does this enable?

There are quite a few different use-cases that are opened up a little more
with the FaceDetection API, for example you could:

* Vastly more peformant experiences when detecting faces &mdash; we have a lot
  of flexibility with this API as it allows us to move the processing into a
  Service or Web Worker.
* Profile picture croping &mdash; find your face in the picture and automatically
  crop the image so that
* Enable quick tagging &mdash; quickly find all the faces in a scene and create
  a UI that enables you to quickly tag them.
* Optimising facial recognition &mdash; once you have the image of the face you
  can then pass just those regions to your Facial Recognition tools.

Are these all possible today in the browser? Yes, but you need to plan for
progressive use ahead of time.

### Planning for Progressive-ness.

This is obviously a pure JS API that requires access to the underlying
hardware APIs, but this can "easily" (heh) be built to be fully progressive and
ensuring that users who don't use the latest version of Chrome are still
able to access your experience.

My thoughts around this follow a relatively standard approach to progressive
enhancement: Server &rarr; JS (+ Web ASM maybe) &rarr; Web API but I thought
I would explore this a little bit further as I do see a number of challenges.

#### Server

We can create a simple form that has an `<input type="file">` that uploads an
image to your server and you do your image detection on the server and
return the results to the client.

#### JS

If we have JS enabled we have the ability to do facial detection inside the
browser and directly in the context of the page using any one of a number of
client libraries.

The Web Assembly aside:

It is incredibly hard (at least in my opinion) to do image processing and even
harder to do object detection especially in a performant way. "Native platforms"
have long had many libraries ([Open
CV](http://docs.opencv.org/2.4/modules/contrib/doc/facerec/facerec_tutorial.html)
for example) that are primarily written in C which can now be brought to the
browser and take advantage of the rich eco-system and also be in the same order
of magnitude of performance.

It would be incredible useful if someone made a polyfil for this ShapeDetection
API.

#### Web API

Now that we can get ubiqutiy accross all platforms it is possible to utilise the
underlying system API when it is availble.

I think this is an interesting API to bring to the platform and it certainly
opens up a range of possibilities, specifically for me this is about vastly
increasing the performance of object detection on the web by using the
underlying system as opposed to pure javascript and this is why I am looking
forward to the barcode detection API as it will greatly increase the performance
of my [QR Scanner Web app](https://qrsnapper.appspot.com/) whilst at the same
time reducing the complexity of the application.