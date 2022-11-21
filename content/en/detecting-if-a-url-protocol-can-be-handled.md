+++
date = 2022-11-21T20:24:15Z
draft = true
slug = "detecting-if-a-URL-protocol-can-be-handled"
summary = ""
tags = []
title = "Detecting if a URL protocol can be handled"

+++
### Attempt 1: Click Handler

HTML

    <a href="web+follow:@paul@status.kinlan.me" id="follow">
       ClickEvent Test: web+follow:@paul@status.kinlan.me
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

* You need to augment your links
* Heuristic based - if the user is presented with a prompt (like in Safari and Firefox) then the UI will update.

### Attempt 2: Navigation Handler

HTML

JavaScript