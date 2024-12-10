---
date: 2020-02-11 09:51:48.911000+00:00
link: ''
slug: scroll-to-text-bookmarklet
summary: Just saw that Scroll To Text Fragment is launching in Chrome 81!  This feature
  lets you link to specific text within a page, which is awesome.  I created a bookmarklet
  that grabs your selected text and generates a link using the new `:~:text=` fragment
  identifier.  Drag the \"Find in page\" link to your bookmarks bar to try it out.  The
  bookmarklet currently selects whole words, but I'm planning on adding some logic
  to handle partial word selections better. You can also easily modify the bookmarklet
  to copy the generated link to the clipboard instead of opening a new window.
tags:
- bookmarklet
- scroll to text
- chrome
- javascript
- link
- text fragment
- web development
title: Scroll to text bookmarklet

---

I forgot that [Scroll to Text fragment](https://wicg.github.io/ScrollToTextFragment/) was a thing that is [launching soon in Chrome (81 and not 80 as mentioned in Chrome Status)](https://chromestatus.com/feature/4733392803332096), until I saw this [Tweet](https://twitter.com/stefanjudis/status/1225133056736088065?s=20).

I love this feature, it let's you link to more than just named elements. Domenic Denicola asked if there was an extension that did this. I don't think you need one, because bookmarklets are awesome and underused. I decieded that it should be pretty quick to write up a simple bookmarklet that creates a link with a scroll to text anchor that you can share with people. 

Here it is. It get's the selected text, and creates a new URL and opens a window. I've noticted that 'scroll to text' can only scroll to whole words so I might need to add some logic that extends the selection so that it picks up partial words correctly.

```Javascript
const selectedText = getSelection().toString();
const newUrl = new URL(location);
newUrl.hash = `:~:text=${encodeURIComponent(selectedText)}`;
window.open(newUrl);
```

If you have Chrome 81 then you can drag this <a href="javascript:(function()%7Bconst%20selectedText%20%3D%20getSelection().toString()%3Bconst%20newUrl%20%3D%20new%20URL(location)%3BnewUrl.hash%20%3D%20%60%3A~%3Atext%3D%24%7BencodeURIComponent(selectedText)%7D%60%3Bwindow.open(newUrl)%7D)()">Find in page</a> bookmarklet to your address bar and easily create links that link to content.

<figure><video src="/videos/2020-02-11-scroll-to-text-bookmarklet-0.mp4" alt="findbookmarklet1.mp4" controls></video></figure>

It's not too hard to extend this, for example if you wanted to just paste on to the clipboard you could do that by replacing the `window.open` line.

Triff and Marv.
