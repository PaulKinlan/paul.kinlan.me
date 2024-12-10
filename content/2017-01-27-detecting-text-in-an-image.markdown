---
date: 2017-01-27 13:20:31+00:00
image_header: /images/detect-text-in-image.png
slug: detecting-text-in-an-image
summary: 'I''m excited to share the latest addition to the Shape Detection API: the
  Text Detection API!  This API allows you to detect text within images in real-time,
  right in the browser.  It''s still experimental and currently works on Chrome Canary
  for Android, but it opens up amazing possibilities. Imagine real-time translation,
  assistive technologies for parsing image content, or even grabbing URLs from slides
  at conferences. I''ve built a demo where the API detects text, draws a box around
  it, and reads it aloud when clicked.  Check out the code and demo to experiment
  yourself.  I can''t wait to see what you build with this!'
tags:
- web
- api
- text detection
- shape detection
- javascript
- chrome
- real-time
- accessibility
- translation
- image processing
title: Detecting text in an image on the web in real-time
video_url: /videos/shape-detection-text.mp4

---

Last year just before the Chrome Dev Summit, Miguel Casas came up to me and
showed me something that blew my mind: [Face Detection](/face-detection/) in the
browser using the [Shape Detection
API](https://wicg.github.io/shape-detection-api/#introduction). Shortly after
that [Barcode Detection was added](/barcode-detection/) that allowed me to
update my [QR Code scanner](https://qrsnapper.appspot.com/) so that I no longer
had to include a massive (albeit awesome) port of a QR scanning library.

The Shape Detection API is still in development, and neither the FaceDetection 
nor the Barcode Detection API's are available outside experimentations (you 
need to enable "Experimental Web Platform features" in chrome://flags) but it is
a very exciting space to watch and see another platform capability being opened
up to developers and users on the web.

The latest addition is the [Text Detection
API](https://wicg.github.io/shape-detection-api/#text-detection-api) that will
take an image and scan it for readable text. The video at the top of this
article is a great example (note, I stole some of the code from Miguel but put
my own spin on it, notably the synthesis part.)

The model is exactly the same as the Face and Barcode Detection APIs, you get an
image (either an img, canvas or ImgData object) and pass it into a instance of
the type of detector you want to use. You can the process the results and
perform some action on the data (for example draw on the image where the item 
was detect). In this case the results are an Array of
[`DetectedText`](https://wicg.github.io/shape-detection-api/#ref-for-detectedtext-1)
which you can use to extract what text was detected.

This currently works only on Chrome Canary for Android, but if you want to
experiment check out the [code](https://jsbin.com/qixoduw/edit?html,js,output)
and the [demo](https://output.jsbin.com/qixoduw) and the process is not too
painful although my code is incredibly hacky. I quite like this demo, it detects
text in the image, draws a box around the text and then when the user clicks
inside the bounding box, it will read the text back to the user.

The API is not amazingly complex. If you wanted to implement something yourself
you can follow these steps: 

### 1. Get access to the camera

Query the list of mediaDevices and select the first camera that is front-facing
(note: there are better ways to do this).

```javascript
navigator.mediaDevices.enumerateDevices()
  .then((devices) => {
    let thedevice;
    for(let device of devices) {
      if (device.kind == 'videoinput') {
        thedevice = navigator.mediaDevices.getUserMedia({
          "video": {
            deviceId: {exact : device.deviceId},
            width: { max: 640 }
          }
        });
      }
    }
    return thedevice;
}) 
```
### 2. Capture a full resolution frame

```javascript
capturer = new ImageCapture(theStream.getVideoTracks()[0]);
capturer.grabFrame().then(frame => {  /* */  })
```
### 3. Create a `TextDetector` and start detection

```javascript
var textDetector = new TextDetector();
return textDetector.detect(frame).then(boundingBoxes => { /* */ })
```
### 4. Process the results
For each item that is detected and element will appear in the array that is 
passed to the Promise returned from the `detect` function. You can then itterate
over this array, find where they are positioned in the image, and get access to
the data detected.

```javascript
for(let box of boundingBoxes) {
  // box.boudingBox => DOMRect
  speechSynthesis.speak(new SpeechSynthesisUtterance(box.rawValue));
}
```

# Yup, I am excited!

This API opens up so many interesting possibilities for users such as easier and
broader access to assistive technologies for parsing content in images;
Real-time translation of text in images; extracting urls for slides at
conferences (totally going to try and get a web app ready for Google IO that
does this), are just a few examples that quickly spring to mind.

What would you do with this API?