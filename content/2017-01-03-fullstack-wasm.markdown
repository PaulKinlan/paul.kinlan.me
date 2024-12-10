---
date: 2017-01-03
draft: true
slug: fullstack-wasm
summary: This blog post explores the potential of WebAssembly (Wasm) for full-stack
  development, allowing code sharing between client and server.  I discuss how Wasm
  could enable progressive enhancement for web APIs like the Shape Detection API.  Using
  this API as an example, I illustrate how a C-binding library like OpenCV, compiled
  to Wasm, could be used on both client and server to provide consistent functionality
  regardless of native browser support.  This approach involves creating a wrapper
  around OpenCV and the target web API to bridge the gap between them.  I express
  my excitement about Wasm's potential to simplify deployment and maintenance by enabling
  the use of a single binary across different environments.
tags:
- WebAssembly
- WASM
- fullstack
- progressive enhancement
- Shape Detection API
- OpenCV
- JavaScript
- Node.js
- client-server
- web development
title: Fullstack Web Assembly

---

The other day I was thinking about the [Shape Detection
API](https://paul.kinlan.me/face-detection/) and the possibilities that it
presents for web developers, and I was also thinking about what the progressive
story is for web developers in the sense that this API is still in development,
not fully landed in Chrome and for a long time is likely not to be supported
natively on the web-at-large.

A traditional understanding of Progressive Enhancement is to manage rendering
and logic on the Server so that we have full support across the web platform,
when JS is available try to emulate the API if the API doesn't exist. This is a
relatively sane model that we can all pretty much agree on.

My terrible mental model is: Server &rarr; JS (+ Web ASM maybe) &rarr; Web API;
and it is this bit on the left and in the middle that is interesting to me because
in an ideal world we would share the code between the client and the server.

The Shape Detection API is pretty simple and it belies the complexity that lays
beneath. There is a huge amount of logic that goes on in any form of image
processing and it is certainly non-trivial and to support the Facial Detection
part of the Shape Detection API progressively the model might look like:

1. Try to get Open CV on the server via a [C-binding into
   nodeJS](https://github.com/peterbraden/node-opencv)
2. Try to get in Open CV on to the client (emscriptem/wasm) so that we have the
   same API on client and server.
3. Try to create some wrapper around Open CV and the target API.

For example the OpenCV binding

```javascript
cv.readImage("./examples/files/mona.png", function(err, im){
  im.detectObject(cv.FACE_CASCADE, {}, function(err, faces){
    for(let face of faces) {
      im.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
    }
    im.save('./out.jpg');
  });
})
```

vs the API for the Web.

```javascript
var faceDetector = new FaceDetector();
faceDetector.detect(image)
  .then(faces => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    for(let face of faces) {
      ctx.rect(face.x, face.y, face.width, face.height);
      ctx.stroke();
    }
  })
```

The logic for outlining the detected face is the same, and the API if you squint
is nearly the same, but the API's are obviously different.

I believe it would be relatively easy to provide a mapping between the "Shape
Detection API" and the OpenCV API.  You could then have this binding shared
between web client that has no native implementation and then the server
binding too.

As far as I understand it, the NodeJS team are waiting for the v8 team to land
support for WASM and once it is in, then it is likely to be a done deal.

I am excited by Web Assembly for many reasons, one of them is that I think we
have a great chance of having one "binary" that can run on the client and the
server that is easy to deploy and maintain whilst at the same time allowing us
to have consistent results across server and browser.