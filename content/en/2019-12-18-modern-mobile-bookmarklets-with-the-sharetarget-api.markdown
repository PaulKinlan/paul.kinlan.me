---
slug: modern-mobile-bookmarklets-with-the-sharetarget-api
date: 2019-12-18T13:48:22.821Z
title: Modern Mobile Bookmarklets with the ShareTarget API
link: ''
tags: [share target, intents, share]
---

Bookmarklets are an unsung superpower of Desktop Web Browsers. They are not as powerful as Chrome Extensions, they require a user gesture, they don't have access to browser specific API's (such as chrome.*), yet I love them. In their simplest form (a Bookmark) they navigate you to a URL; more complex forms (Bookmarklets) navigate to a `javascript:` URL which means you can run simple automated actions that run in the context of the page, creating functionality that the original developer didn't get around to creating just yet, just at the click of a button.

I create Bookmarklets all the time. Most of the Bookmarklets that I create are relatively simple, they take some data from the page, manipulate it and then call another page or app with that data. For example, this [bookmarklet](/bookmarklet-trace-page/) inspect the performance of the page you are on.

Bookmarklets on mobile are a different story altogether, they don't exist. I am not sure of the reasoning, but I think there is a way around to support basic Bookmarklets in Browser's that support the `ShareTarget` API. 

The [ShareTarget API](/file-web-share-target/) is a new feature in the browser that lets a user install your web app and receive native Share Actions. The Twitter PWA is a great example of this in action, you can share links and files directly to the web app from any part of the Android system.&nbsp;

`ShareTarget` has two components, a description of how to get data in a manifest file, and the fetch handler in a service worker. When the user shares to an installed PWA it will create an HTTP POST request to the end-point defined in the manifest, and then it's up to you to handle the POST in the `onfetch` handler.

With this in mind, I believe you can solve a lot of use cases you need Bookmarklets for via this API.

I wrote three simple 'Share' actions for services that I don't expect to [Hacker News](https://github.com/PaulKinlan/hn-share-target), [Reddit](https://github.com/PaulKinlan/reddit-share-target), and [LinkedIn](https://github.com/PaulKinlan/linkedinposter) will implement PWA sharing any time soon. Now, if you visit [https://hn-share.now.sh/](https://hn-share.now.sh/) you can install this small PWA and share any URL to it from any App on your Android device. The best thing was it wasn't as complex as I thought it might be.

First you define your 'mini-app' in your [web app manifest file](https://github.com/PaulKinlan/hn-share-target/blob/master/site/manifest.json), and configure the `share_target` object.

```
{
  "name": "Share to HackerNews",
  "short_name": "HN Share",
  "start_url": "/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [
    {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
    },
    {
      "sizes": "512x512",
      "src": "/images/me.png",
      "type": "image/png"
    }
  ],
  "share_target": {
    "action": "/share.html",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "display": "standalone",
  "scope": "/"
}
```

Then in the [service worker](https://github.com/PaulKinlan/hn-share-target/blob/master/site/sw.js) handle the `POST` method in the `onfetch` handler.

```
onfetch = async (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'POST') return;

  const location = encodeURIComponent(url.searchParams.get('url') || url.searchParams.get('text'));
  const title = encodeURIComponent(url.searchParams.get('title'))
  const hnUrl = `https://news.ycombinator.com/submitlink?u=${location}&t=${title}`

  event.waitUntil(event.respondWith(Response.redirect(hnUrl)));
};

oninstall = () => {
  skipWaiting();
};

onactivate = () => {
  clients.claim();
};
```

It is this last piece where you control what happens to the user - in this case I forward the user to the 'Share URL' of the service that is installed. You could do more complex actions too - for example, Imgur has an API and if you were integrating with that service you could upload an attached image and then redirect the user to the upload results page.

Whilst this doesn't offer exactly the same functionality as Desktop Bookmarklets, the idea does offer a new level of hackability for mobile web experiences and I would love to see what you build.

