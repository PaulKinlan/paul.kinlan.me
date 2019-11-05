---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

I really like <a href="https://editorjs.io/">EditorJS</a>. It's let me create a very simple web-hosted interface for my static Hugo blog.

EditorJS has most of what I need in a simple block-based editor. It has a plugin for headers, code, and even a simple way to add images to the editor without requiring hosting infrastructure. It doesn't have a simple way to add video's to the editor, until now.

I took the <a href="https://github.com/editor-js/simple-image">simple-image</a>&nbsp;plugin&nbsp;repository and changed it up (just a tad) to create a <a href="https://github.com/PaulKinlan/simple-video">simple-video</a> plugin (<a href="https://www.npmjs.com/package/simple-video-editorjs">npm module</a>). Now I can include videos easily in this blog.

If you are familar with EditorJS, it's rather simple to include in your projects. Just install it as follows

```
npm i simple-video-editorjs
```

And then just include it in your project as you see fit.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

The editor has some simple options that let you configure how the video should be hosted in the page:

1. Autoplay - will the video play automatically when the page loads
1. muted - will the video not have sound on by default (needed for autoplay)
1. controls - will the video have the default HTML controls.

Below is a quick example of a video that is embedded (and showing some of the options).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video."></video></figure>

Anyway, I had fun creating this little plugin - it was not too hard to create and about the only thing that I did was defer the conversion to base64 which simple-images uses and instead just use the Blob URLs.