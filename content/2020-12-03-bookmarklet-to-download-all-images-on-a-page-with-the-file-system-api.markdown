---
slug: bookmarklet-to-download-all-images-on-a-page-with-the-file-system-api
date: 2020-12-03T10:45:30.271Z
title: Bookmarklet to download all images on a page with the File System API
link: ''
tags: [bookmarklet, filesystem, fugu]
---

My daughter is attending nursery school and every day they post photos of the baby to a special portal so we can see what she has been doing. The web site, is, err, well... functional. However they block the ability to download the photos in their UI, I've no clue why, but it's super frustrating.

I love [Bookmarklet](/tags/bookmarklets/) because they let me quickly augment a site without having to build a full extension, and this is no exception. I knew that the UI gave me access to the actual image so it shouldn't be too complex to find those images, fetch them and save them.

Traditionally saving a file from the browser to your machine is [hacky](https://www.youtube.com/watch?v=rXLNC8yCRnw&amp;feature=player_detailpage#t=280s), you create an anchor that links to the image, add a 'download' attribute (optionally with the name of the file), and then simulate a mouse click on it.&nbsp;&nbsp;

I knew that Chromium had added a new [File System API](https://web.dev/file-system-access/), so I wanted to try my hand to see if it would let me batch download a large array of files and then save them to a directory, and it does.

The process I chose was as follows:


 Request the users consent to access a folder (it won't let you pick a system folder such as the photo directory) and get access to the directory handle.
1. Find all the images on the page
1. Sequentially fetch the images (could have made it parallel but I didn't want to overload their server)
1. Create a file handle in the directory that the user gave the script access to
1. Create a file writer stream
1. Pipe the image to it.
1. Voila. It's saved to disk.


The code for that process is as follows:

```JavaScript
const run = async () => {
  const dirHandle = await window.showDirectoryPicker();
  const imgs = document.querySelectorAll("img");
  let i = 0;

  imgs.forEach(async (img) => {
    const url = img.src;
    const name = `img-${i}.png`;
    i++;

    try {
      console.log(`Fetching ${url}`);
      const response = await fetch(url);

      console.log(`Saving to ${name}`);

      const file = await dirHandle.getFileHandle(name, { create: true });
      const writable = await file.createWritable();
      await response.body.pipeTo(writable);
    } catch (err) {
      console.log(err);
    }
  });
};

run();
```

I then wrapped it up in a bookmarklet, and now I can download all the images directly to a directory of my choosing, and we are very happy that we can have permanent access to these memories :D

