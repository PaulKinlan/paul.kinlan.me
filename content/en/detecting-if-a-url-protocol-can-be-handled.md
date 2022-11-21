+++
date = 2022-11-21T20:24:15Z
draft = true
slug = "detecting-if-a-URL-protocol-can-be-handled"
summary = ""
tags = []
title = "Detecting if a URL protocol can be handled"

+++
[registerProtocolHandler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler) is an under used API. I love this API, it allows a web app to become the default system handler for [safe](https://html.spec.whatwg.org/multipage/system-state.html#safelisted-scheme) URLs such as 'mailto', 'irc', 'tel', 'sms' as well as custom `web+*` types.

It unfortunately has a few issues:

1. It's not well supported on Mobile. PWAs in Chrome can [register](https://developer.mozilla.org/en-US/docs/Web/Manifest/protocol_handlers) a `protocol_handler`, which is huge!
2. Developers don't have the ability to determine if a custom scheme will resolve to anything useful for the user.

A long time ago Chrome had an `isProtocolHandlerRegistered` method which would let you determine if there is something on the other end of the custom scheme. It was later [removed](https://groups.google.com/a/chromium.org/g/blink-dev/c/ljkPttdvVuc/m/atNE2qYSCAAJ) from Chrome because it was removed from the Spec, and it was removed from the Spec for a variety of reasons including that the API could be as a finger-printing vector.

I'm opening up this can of worms again because of a challenge that I see with the "Follow" function in Mastodon and I think we can make it better.

If you want to follow a person who is on a different Mastodon instance to you, you need to  find their Follow page, enter your ID and instance name (i.e, @paul@status.kinlan.me) into the follow field, it will then redirect you back to your instance to let you follow that user. 

It would be much nicer if you could click on a link to a Mastodon profile (say, on this web page) and it will take you directly to your instance to let you follow the user.

I could envisage a system where a link encoded as follows: `<a href="web+follow:@paul@status.kinlan.me">Follow</a>` (note `web+follow` instead of `https`), when clicked would take the user to _their_ instance (or whatever ActivityPub service they have), with the `@paul@status.kinlan.me` populated so they can quickly follow me; and if the user doesn't have an ActivityPub app or site available - well, I could just redirect them to the current way to "Follow" me.

This code assumes `updateUI_NoHandler` is a function that will update the UI to tell the user there is no site or app installed that can handle `web+follow:` links.

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

### Things that don't work at all

1. Form method=GET

   <form method="get" action="web+follow:@paul@status.kinlan.me">
   <input type="submit" value="Follow: web+follow:@paul@status.kinlan.me">
   </form>
2. Errors with "Insecure" warning.