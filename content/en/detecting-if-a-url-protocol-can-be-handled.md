+++
date = 2022-11-21T20:24:15Z
draft = true
slug = "detecting-if-a-URL-protocol-can-be-handled"
summary = ""
tags = []
title = "Detecting if a URL protocol can be handled"

+++

### Attempt 1: Individual Click Handler

HTML

    <a href="web+follow:@paul@status.kinlan.me" id="follow">
      Follow
    </a>

JavaScript

    addEventListener("load", (loadEvent) => {
      const follow = document.getElementById("follow");
      follow.addEventListener("click", (clickEvent) => {
        setTimeout(() => updateUI_NoHandler(), 1000);
      });
    });

Pros:

* Work's in all browsers

Cons:

* You need to augment your links with an ID and handle it in the click handler
* Heuristic based - if the user is presented with a prompt (like in Safari and Firefox) then the UI will update.

### Attempt 2: Global Click Handler

If you don't want to augment your anchor, you could intercept all link clicks.

HTML

    <a href="web+follow:@paul@status.kinlan.me">Follow</a>

JavaScript

    addEventListener("load", (loadEvent) => {
      document.body.addEventListener("click", (clickEvent) => {
        const { target } = clickEvent;
        if (target.nodeName == "A" && target.href.startsWith("web+follow:")) {
          setTimeout(() => updateUI_NoHandler(), 1000);
        }
      });
    });

Pros:

* Work's in all browsers
* Doesn't require you to augment your anchors.

Cons:

* All the same problems you have tracking clicks globally on your page.
* Heuristic based - if the user is presented with a prompt (like in Safari and Firefox) then the UI will update.

### Attempt 3: Navigation Handler (Blink Only)

HTML

    <a href="web+follow:@paul@status.kinlan.me">Follow</a>

JavaScript

    navigation.addEventListener("navigate", (event) => {
      if (event.destination.url.startsWith("web+follow")) {
        setTimeout(() => window.stop(), 1000)
      }
    });
    
    navigation.onnavigateerror = (event) => {
      if (event.error.message === "Navigation was aborted") {
        updateUI_NoHandler();
      }
    };

Pros:

* Doesn't require you to augment any links in your HTML

Cons:

* Blink only

Things that don't work at all

1. Form method=GET 

   Errors with "Insecure" warning.