---
slug: shiminig-request-formdata-in-safari
date: 2020-06-11T21:19:57.352Z
title: Shiming Request.formData in Safari
link: ''
tags: [javascript, safari]
---

I'm currently building a simple CRUD client-side only data logger PWA that contains no client-side JavaScript apart from what is inside the service worker.&nbsp;

To do that I am following basic REST principles, and just using the Form element to submit data to the service-worker that then stores in it IndexedDB and renders the results back out to the client. I will explain more in another post, but in this post I want to quickly document how I fixed an issue in Safari.

When reading the request data that is posted by the user from a Form, you can use the `event.request.formData()` method to get a `FormData`, however it throws an exception in Safari (yet it works in Firefox and Chrome). It turns out the WebKit team haven't implemented it properly yet.

I wrote a little shim that hack together a similar looking API to the `FormData` object so that you can process form data inside your service worker.

```JavaScript
export default async (request) => {
  if (request.headers.get('content-type') !== 'application/x-www-form-urlencoded') {
    return null;
  }

  const data = await request.text();
  const params = new URLSearchParams(data);

  return params;
};
```

The TL;DR is that for simple `www-url-form-encoded` forms, the data is passed in as a query string, which means that if you create a URL object and then return the data in the `searchParams` property, you get something that looks similar to the `FormData` object.

If your form is a `multipart` form (i.e, one that attaches a file), then you will need to use another solution that parses that data.

Hat-tip to [Ingvar](https://twitter.com/RReverser) for mentioning that we don't need to make a fake URL, we can just instantiate `URLSearchParams`.  Also, Hat-tip again to him for making sure we should mention that this doesn't work for multipart forms.

