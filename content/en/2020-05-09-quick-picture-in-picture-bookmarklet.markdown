---
slug: quick-picture-in-picture-bookmarklet
date: 2020-05-09T10:56:14.262Z
title: Quick Picture in Picture Bookmarklet
link: ''
tags: [bookmarklet, video, picture-in-picture]
---

[Picture in Picture](https://w3c.github.io/picture-in-picture/) is an amazing API, it let's you keep on working in another tab but have a little playable live thumbnail of the video on the screen for you to keep up with. Yet there are a number of sites that disable the feature.

I just wanted a quick and easy access button that I can press in my browser that will just PIP the video. So I made a bookmarklet.

Just drag the link to you Bookmark bar and when you press it, the currently playing video will be put in to Picture in Picture mode.

[Quick PIP](javascript:(function()%7B%5Bdocument%2C...%5B...document.querySelectorAll(%22iframe%22)%5D.map(iframe%20%3D%3E%20iframe.contentDocument).filter(iframe%20%3D%3E%20!!iframe)%5D.some(d%20%3D%3E%5B...d.querySelectorAll(%22video%22)%5D.filter(video%20%3D%3E%20video.paused%20%3D%3D%20false%20%26%26%20video.ended%20%3D%3D%20false).some(video%20%3D%3E%20!!video.requestPictureInPicture().catch(err%20%3D%3E%20console.log(err))))%7D)())

If it tickles your fancy, the code is below.

```JavaScript
// dont define a variable on scope. Only pip the first video

[
  document,
  ...[...document.querySelectorAll("iframe")]
    .map(iframe => iframe.contentDocument)
    .filter(iframe => !!iframe)
].some(d =>
  [...d.querySelectorAll("video")]
    .filter(video => video.paused == false && video.ended == false)
    .some(
      video => !!video.requestPictureInPicture().catch(err => console.log(err))
    )
);
```

Why one line? Well, Bookmarklets run their code in the local scope, and I worry about adding new variables on to the global object that might clash with others on the current page.

The above code will find the first video that is playing in either the document or an iframe that is on the same origin.

First we build a list of valid documents, then for each document (using `some`) we check to see if there are any videos that are currently playing and then using `some` will `requestPictureInPicture`.&nbsp;

The use of `some` is interesting because it means that we don't need to iterate over each video in each document, instead the first document to contain a playing video will be Picture in Pictured.

That was a fun 30 minutes :D

