---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

When I joined Google in 2010 I stumbled across a document that mentioned a concept in gmail called '[magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)', it had a cool name and the concept was novel. 

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

The concept is that many applications have to load lots of complex JavaScript even for a 'small component' like the compose window in gmail, you could have the components of the application loaded in an `iframe` that the user can interact with in the main window, that you could then 'tear off' and move to a new window when the uses clicks 'compose in new window' button. I wasn't confident enough to speak to the author (and I still haven't, nor have I looked at the source for gmail to see if it was ever actually used) but it did stay in my mind mostly because the name was enigmatic.

Hop forwards 10 years and I was on a long train ride and started to investigate an area that I don't know much about the `adoptNode` API. I played with a [lot of ideas](https://nifty-meadowlark.glitch.me/) and I realised that it's possible to move DOM elements, their current state and their attached event handlers into new windows. This reminded me of 'magic iframes' and ultimately lead to the idea that you can a create a pop-out iframe (A pop-out iframe is Picture in Picture video but for iframe elements)

 The code for the pop-out iframe is pretty simple:

```
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(document.adoptNode(airhornerIframe, true));
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(document.adoptNode(airhornerIframe, true));
    });
 });
</script>

`adoptNode` allows you to move DOM elements with their current state while maintaining their existing bound event handlers, between documents in the browser - that could be a new DOM inside the current window, or as in the case of this demo it could be moving an already loaded `iframe` into another window that is on the same origin. 

Moving an iframe is interesting because it means that you don't have to reboot the contents of the iframe, the instance is just moved. There are a couple of downsides:

1. The URL remains on the current origin and not the iframe origin, although this might be something that the `<portal>` API could solve.
2. If you are moving a custom element, or something that has it's logic hosted on the opener - if you close the opener, execution will stop.

Disadvantages aside, I thought this DOM level IPC mechanism was very very interesting. Have a play with the [demo page](https://nifty-meadowlark.glitch.me/)([src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js)) and let me know if you have any interesting ideas for where this could be used.

