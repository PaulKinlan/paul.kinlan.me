---
slug: unintended-silos
date: 2017-07-25T13:20:31+01:00
title: "Web sites as unintended silos: The problem with getting data in and out of the web client"
description: "It's nearly impossible to get consistent get data in and out of a web app on the client"
tags: ["intents"]
---

Before you read, here are a number of bugs that I would love you to star that has
come out of the back of this article.

> [Unable to put a file onto the clipboard in 'oncopy' event and](https://crbug.com/860563)	 
> [Unable to attach a file to clipboardData in 'oncopy' event and unable to paste it back into same web app.](https://crbug.com/860562)
> [Unable to read a file from the clipboard on Chrome OS (when Google Docs can.)](https://crbug.com/860560)
> [Unable to drag a dynamically created blob from a page to Files app (DownloadURL is not supported)](https://crbug.com/860558)
> [Unable to drag a file from a page to Files app (DownloadURL is not supported)](https://crbug.com/860557)
> [Drag and Drop - setData with Download URL doesn't work for blobs.](https://crbug.com/741785)
> [Drag and Drop - setData with Download URL bypasses service worker.](https://crbug.com/741778)

The web as an open and interoperable platform has changed the world. It allows
us to view, interact and interchange information with a open set of technologies
APIs, notably the Link, HTTP and HTML. With these simple tools we can create
complex applications and services that are interopperable between server to
server and from the server to a user using a browser.

Once the site is loaded into the user's browser, the data that is generated
by the user and stored in the browser is all but locked away unless it is pushed
back out to a server, and I think this is a hidden problem for the web.

[Web Intents](https://paul.kinlan.me/what-happened-to-web-intents/) was a
technology that was intedend to ensure that web sites on the client had the
ability to interoperate with the world immediately around it: other sites and
apps the user was interacting with on their device. Web Intents was a dead end,
but the problem still exists and we are unintentionally creating silos that are
locked in behind a user-login and a local store of data.

I'm still passionate about getting data in and out of web applications entirely
in the client and we have a number of tools at our disposal, but let me tell
you, we make it really hard to do.

I love the fact that each web site in the user's browser is it's own secure
sandbox, but one thing that I would love to see on the web is a step change in
interfaces on how to get data from the users system into the sandbox and through
defined interfaces pull data out of the sandbox back into the users system.

I started on this post after seeing that iOS 11 will support drag and drop API
on the web and after watching my good friend and colleague Sam Thorogood's post
on Drag and Drop (check it out), I wanted to explore this space a lot more. 

{{< youtube y1BsexcSW8o >}}
**Intro to drag and drop**

For some context, I wanted to build an app that acts like a scratch board and
paste bin, that is you can drop any piece of content on to the web page and then
get it back out at a later date and this post is documenting some of the issues
that I have found along the way.

There are many ways to get data in to the sandbox of the web site from the host
operating system and there are a number of ways to get data hosted and generated
back out to the host system. The problem is that it's incredibly
[lumpy](/the-lumpy-web/) and inconsistent across all platforms which makes it
quite a frustrating experience.

# Available interactions

Let's start with ways of getting data from the clients device into a website:

* `<input type=file>`
* Paste from the clipboard on user paste gesture
* Drag from outside the browser
* Open a web page from the host

Getting data from the website back on to the client

* `<a download>`
* Add data to the clipboard on user copy gesture
* Drag from the browser to the client

## Upload via a picker

I won't go into too much detail but `<input type=file>` works incredibly well as
just a plain file picker.

You can restrict the picker to file types `<input type="file" accept="image/png"
/>`.

You can let the user pick more than one file `<input type="file" multiple />`.

You can also integrate with custom pickers such as camera `<input type="file"
captuaccept="image/*" capture>`.

The `<input>` element even has an interface that allow you to inspect the files
that were selected. It's pretty easy to get a file into the browser's sandbox
if the user selects it.

**Problem 1**: Once you have that file though, you can't save any changes back
out to the same file on the host, you are in effect dealing with a copy of the file.

**Problem 2**: If the host updates the file whilst you have hold of the copy you
will not see the updates.

## Download a file to the host OS

We can download a remote resource by simply using the `download` attribute like
so: `<a href="someurl.html" download="output.html">Download</a>`.

We can also generate content dynamically in the client and download it to the host
as follows: 

```javascript
function download() {
  var url = URL.createObjectURL(new Blob(['hello world at ', Date.now()], {'type': 'text/plain'}));
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'hello.txt';
  a.click();
  URL.revokeObjectURL(url);
}

download();
```

It's simple and effective and is getting support in Safari now too.

**Problem 1**: There is no ability to integrate with the systems 'Save As' which
means that the user can't pick where the file will land outside of the browser
download directory.

**Problem 2**: There is no ability to write back to the file once it's
downloaded and on the user's device, once it's downloaded it is gone.

## Using the clipboard to paste data into a web page

It is possible to intercept the `onpaste` event that is triggered when a user on the
page invokes the system paste gesture and then do some magic.

```javascript
document.body.addEventListener("paste", function(e) {
  // You need to own it.
  e.preventDefault();

  // get all the types of things on the clipboard
  let types = e.clipboardData.types;

  // Get the text on the clipboard
  e.clipboardData.getData("text/plain"); 

  // Get a itterable list of items (Not on Safari)
  e.clipboardData.items
  
  // Get access to a file on the clipboard
  e.clipboardData.files[0]
});
```

This API appears to be relatively consistent across a number of browsers (.items
aside)

Broadly, for getting Data into your web app this API works pretty well, you can
get access to files and text on the clipboard and use it and it's secure in the
sense that the user has to initiate the system paste action for you to be able
to get access to this data. One does wonder if a site could listen for the paste
event and read data that the user never thougth would be read....

**Problem 1**: it's a pain to debug, console logging of `clipboardData` will not
show you the correct data, you have to breakpoint in.

## Using the clipboard to copy custom data from a web page

It is possible to intercept the `oncut` and `oncopy` events that are triggered
when a user on the page invokes the system copy and cut gestures and then add 
your own custom content in to the system clipboard.

```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Set some custom data on 
  e.clipboardData.setData("text/plain", "Hello World");

  // Add a user generated file to the clipboard
  e.clipboardData.items.add(new File(["Hello World"], "test.txt", {type: "text/plain"}));
});
```

At first glance this is amazing, I should be able to anything that I need to the
clipboard, however there are a number of issues.

**Problem 1**: Adding a file to the clipboard is impossible.

```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Add a user generated file to the clipboard
  e.clipboardData.items.add(new File(["Hello World"], "test.txt", {type: "text/plain"}));
});
```

The API exists, but it doesn't work anywhere it seems. If you try and paste on
the same page that added the data to the `clipboardData` object the
`clipboardData.files` property is empty. If you try and paste the result out to
the file system, nothing happens. However if you paste to a text field, the file
name *is* pasted. I can't tell if this is a security feature, but it's not
documented either way &mdash; I question the entire existence of the API if this
is the case.

**Problem 2**: You are expected to do all your clipboard manipulate
synchronously in the event, this means that it is impossible to add data to the
clipboard that is stored in indexed db.

```javascript
document.body.addEventListener("copy", function(e) {
  // You need to own it.
  e.preventDefault();

  // Add a user generated file to the clipboard (Promise)
  getData.then(file => e.clipboardData.items.add(file));
});
```

It looks like you have to mutate the clipboard in the same tick as the event and
this severely limits the capability of the API.

## Drag from the host into a web page

The drag and drop API shares a lot in common with the clipboard events API so in theory
it's not amazingly complex to get started.

To bring in data from the host environment you have to manage the drop event.
First you ensure that you override the default action of the browser (which is
to display the file) and then you can get access to the data that is on event.

Like the clipboard, you have `items` and you also have `files` so that you can 
see all the things that have been dragged from the host on to the page.

```javascript
element.addEventListener('drop', e => {
  // Own it. nuff said.
  e.preventDefault();

  // Get the text on the clipboard
  e.dataTransfer.getData("text/plain"); 

  // Get a itterable list of items (Not on Safari)
  e.dataTransfer.items
  
  // Get access to a file on the clipboard
  e.dataTransfer.files[0]
});
```

This actually all seems pretty decent.

## Drag from a web page to the host

The drag and drop API shares a lot in common with the clipboard events API so in
theory it's not amazingly complex to get started. 

There is a non-standard "mime-type" called `DownloadURL`. This appears not to be
supported in Firefox or iOS, it is supported in Chrome. You give the browser the
url to fetch and it will initiate a download once it is dragged outside of the
browser.

```javascript
element.addEventListener('dragstart', e => {
  // Own it. nuff said.
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
  e.dataTransfer.effectAllowed = "all";
  e.dataTransfer.setData("DownloadURL", `image/png:test.png:${$fileURL.href}`)
});
```

This is the only known way to drag a file out of the browser and on to the users
host OS.

**Problem 1**: `DownloadURL` is completely non standard and only works in Chrome.

**Problem 2**: `DownloadURL` doesn't seem to work with Blob URLs, this means
files created in the browser can't be dragged out.

**Problem 3**: Requests managed via `DownloadURL` don't get handled by the
Service Worker.

**Problem 4**: `dataTransfer` has a `files` object much like the
`clipboardData`, and much like the `clipboardData` interface, adding a file to
it does nothing for the drag operation.

**Problem 5**: Again, much like the `clipboardData` API you have to mutate the
`dataTransfer` object synchronously in the event. This makes it impossible to
interact with async datastores.

# Changes to the web platform that I'd like to see

I think there are some fundamental changes that we can make to the web platform
to make it simpler and easier to get data in and out of web applications on the
client.

## Standardize DownloadURL for drag and drop

It seems like a reasonable thing to do so that. There is literally zero
reference to the design anywhere on the web, and any references on the spec
lists seem to have been lost to time.

It feels like the way the browser manages `<a download>` is similar to the way
that `DownloadURL` works today so that could be a good start.

## Allow files to be added to Clipboard and Drag and Drop operations

I am presuming there is a reason why it's not working anywhere, but I'd expect
to be able to `dataTransfer.files.add([File])` and for that to be the 
thing that is on the clipboard and is dropped when the user gesture completes.

## Make DOM Events that mutate the event work well with asynchronous operations

There are many events that happen inside the browser that let you change the
default action and then mutate some state on the event (see above). It appears
that the data held on these events can only be changed whilst the event is
executing and not as the result of an asynchronous operation created by the
event.

I'd love to see these events utilise
[`ExtendableEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent)
so that we can get access to `waitUntil` (or something similar). As the web is
moving asnyc for data store operations it feels like the way we interface with
events should too.

## Introduce Persistent File API

We don't have a sane way of getting hold of a reference to a file and keeping
that reference so it can be easily manipulated. We can do it in the context of
our "web app" &mdash; persisting a file to IndexedDB is not overly complex
&mdash; but we are siloing all of our data inside apps and not allowing them
to easily connect with the host around it.

# The long game

There are a couple of strands of development happening in the browser ecosystem
at the moment, on one hand we have the race towards Appiness and native parity,
and on the other we have the movement to content fidelity - introducing APIs such
as Grid, fonts and performance tools to ensure that we can deliver content 
quickly and of high quality.

A lot of what I have talked about today looks like it falls in the focus of
"let's make the web an app platform", and it certainly is part of the story. If
we want parity with native experiences the browser and the sites in the browser
should act like they belong as part of the system. But I think there is more to it.

I want to see a web where interconnections between sites are not just defined by
a link and an HTTP request to a server, but we are enabling interactions between
sites directly on the client. We should be able to discover services and
capabilities of the sites the user uses and interact with them seamlessly whilst
ensuring the idioms of the host platform are available to all content on the
web. 

I am concerned that in the long term that even if we have the URL, we will
have a web where it's easy to get data into the sandbox, but impossible to get
out on to the host system or even in between other sites on the web.