---
date: 2020-01-09 13:33:02.762000+00:00
link: https://github.com/PaulKinlan/simple-image
slug: light-fork-of-simpleimage-for-editor-js
summary: I've created a lighter fork of the SimpleImage tool for Editor.js!  It addresses
  a couple of issues I had with the original.  First, it now uses blob URLs instead
  of base64, which saves memory. Second, it adds the ability to select an image file
  directly, rather than only drag-and-drop. Check out the fork on GitHub!
tags:
- editor.js
- simpleimage
- images
- blob
- base64
- javascript
- plugin
- fork
- optimization
title: Light fork of SimpleImage for Editor.js

---

I love Editor.js. It's a nice simple block editor that I use to write these posts. It has a host of good plugins that enable you to extend the capabilities of the editor, such as the SimpleImage tool that allows you to add images to the editor without having to upload them.

It's the SimpleImage that I briefly want to talk about. It's a good tool, but it has two problems, 1) I can only drag images on to the editor, I can't "add" an image; 2) It uses base64 data URL's to host the image, this is a waste of memory and it should be using blob URLs.

I wrote a [simple fork](https://github.com/PaulKinlan/simple-image) that addresses these two pain points. The first is that it uses less memory because it uses blob URLs. The second is that now you can add images in when adding in a new Block to the editor.

In fact, the following images are added using this new way.

<figure><img src="/images/2020-01-09-light-fork-of-simpleimage-for-editor-js-0.jpeg" alt="Add Image"></figure>

<figure><img src="/images/2020-01-09-light-fork-of-simpleimage-for-editor-js-1.jpeg" alt="Choose file"></figure>

<figure><img src="/images/2020-01-09-light-fork-of-simpleimage-for-editor-js-2.jpeg" alt="Image added"></figure>

