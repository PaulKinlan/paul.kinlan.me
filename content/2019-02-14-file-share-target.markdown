---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'Web Share Target API - Level 2'
tags: [share, intents]
---

I've frequently said that for web apps to compete effectively in the world of
apps, they need to be integrated in to all of the places that users expect apps
to be. Inter-app communication is one of the major missing pieces of the web
platform, and specifically one of the last major missing features is native
level sharing: Web apps need to be able to get [data out of their
silo](/unintended-silos/) and into other web sites and apps; they also need to
be able to receive the data from other native apps and sites.

The [Web Share Target API - Level 2](https://wicg.github.io/web-share-target/level-2/)
is a game-changer of an API that is now in Chrome
Canary. The API extends the [Web Share Target
API](https://wicg.github.io/web-share-target/)
that lets apps and sites share simple links and text to web sites by integrating
them into the systems sharing functionality.

This very static file blog utilizes the Web Share Target API so I can quickly
[share links](/web-share-target-api/) that I find interesting to it from any
Android application, and as of last week I enabled the Web Share Target API - Level 2 so
that I can [upload images to my blog directly from the Camera app on
Android](/testing-file-share-target-from-camera/). This post is all about how I
did it (and stole some code from Jake Archibald &mdash; tbf he worked out a lot
of the bugs for an integration they are doing in to
[squoosh.app](https://squoosh.app/).)

The [Web Share Target
API - Level 2](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest)
is a very novel API in that it is fully progressive. If your application can
handle Form `POST` requests then you can integrate easily with this API. The
basic flow is: when the user chooses your application from the native picker,
Chrome will send a Form `POST` request to your server, it is up to you what you
do with it (handle in a service worker or on the server).

To add support for sharing files into your web app you need to do two things:

1. Declare support for sharing files via the manifest file,
2. Handle the Form `POST` request in your Service Worker.

The manifest declares to the host system how Sharing should be mapped from the
host application to the web app. In the manifest below it essentially says "When
a user shares a file of type 'image/*' make a Form POST request to
'/share/image/' and name the data 'file'".

*manifest.json*
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Once the user shares to your web application, Chrome will make the web request
to your site with the file data as the payload. 

It is recommended that you handle the POST request inside your service worker so
that 1) it is fast, 2) resilient to the network not being available. You can do
this as follows:

*serviceworker.js* - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

There are a couple of interesting things happening above, which can quickly
summarized as:

* Render the UI as the result of the `POST` request by performing a redirect.
* Read the data that is submitted via the form via `event.request.formData()`
* Send the data to the open window (this will be the UI that we redirected the
  user to in the first point).

It is entirely up to you what you do with the data that has been posted to your
service worker, but in the case of my App I needed to show it directly in the UI
so I have to find the window the user is using and `postMessage` the data there.

*index.html* - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

And that's about it. If you already have an API endpoint for your web forms,
then this is a simple, yet powerful addition that you can make to your site.

The Web Share Target API - Level 2 is an incredibly powerful platform
primitive that breaks down another barrier that web apps have had on their
host platforms.
