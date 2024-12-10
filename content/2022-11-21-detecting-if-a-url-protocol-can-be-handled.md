---
date: 2022-11-21 20:24:15+00:00
slug: detecting-if-a-URL-scheme-can-be-handled
summary: Custom URL schemes can enhance web app functionality by handling specific
  URLs, but detecting scheme support is tricky.  Several methods exist, including
  click handlers, navigation handlers (Blink), and server-side redirects with meta
  refresh. While the server-side approach offers the most robust solution, it introduces
  complexity.  A key challenge is the limited user understanding of custom schemes,
  leading to a preference for standard HTTPS URLs.  This post explores a common pattern
  for custom scheme usage, involving detecting navigation failures and presenting
  alternative UI.  The pattern addresses the issue of handling custom schemes like
  `web+follow` for Mastodon, aiming to improve user experience. While custom schemes
  are valuable developer tools, user preference for HTTPS URLs persists.  Despite
  this, custom schemes empower developers to guide users to preferred apps or sites
  while gracefully handling cases where no suitable option exists. This approach also
  opens possibilities for other applications, like rebuilding web intents.
tags:
- URL Schemes
- Web Development
- JavaScript
- User Interface
- Protocol Handling
- Navigation
- Click Handling
- Meta Refresh
- Server-Side Redirect
- User Experience
- Custom Schemes
- Web Apps
- HTTPS
- Mastodon
- ActivityPub

---
[registerProtocolHandler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler) is an under used API. I love this API, it allows a web app to become the default system handler for [safe](https://html.spec.whatwg.org/multipage/system-state.html#safelisted-scheme) URLs such as 'mailto', 'irc', 'tel', 'sms' as well as custom `web+*` types.

It unfortunately has a few issues:

1. It's not well supported on Mobile. PWAs in Chrome can [register](https://developer.mozilla.org/en-US/docs/Web/Manifest/protocol_handlers) a `protocol_handler`, which is huge!
2. People don't really understand the scheme part of urls, and prefer `https` (more on this at the end) 
3. Developers don't have the ability to determine if a custom scheme will resolve to anything useful for the user.

The last point is a big pain. If the user clicks a link on a web page you would expect it to do something. I think we can do something here, specifically present a common pattern that we can use when there is no app or web-site to handle the link.

A long time ago this was a solved issue. Chrome had an `isProtocolHandlerRegistered` method which would let you determine if there is something on the other end of the custom scheme. It was later [removed](https://groups.google.com/a/chromium.org/g/blink-dev/c/ljkPttdvVuc/m/atNE2qYSCAAJ) from Chrome because it was removed from the Spec, and it was removed from the Spec for a variety of reasons including that the API could be as a finger-printing vector.

I'm opening up this can of worms again because of a challenge that I see with the "Follow" function in Mastodon and I think we can make it better. 

**_Disclaimer:_** _I know I will be conflating Mastodon and ActivityPub._

If you want to follow a person who is on a different Mastodon instance to you, you need to  find their Follow page, enter your ID and instance name (i.e, @paul@status.kinlan.me) into the follow field, it will then redirect you back to your instance to let you follow that user.

It would be much nicer if you could click on a link to a Mastodon profile (say, on this web page) and it will take you directly to your instance to let you follow the user.

I could envisage a system where a link encoded as follows: `<a href="web+follow:@paul@status.kinlan.me">Follow</a>` (note `web+follow` instead of `https`), when clicked would take the user to _their_ instance (or whatever ActivityPub service they have), with the `@paul@status.kinlan.me` populated so they can quickly follow me; and if the user **_doesn't_** have an ActivityPub app or site available we can do something specific.

I will save the specifics for `web+follow` for another post. The pattern I am attempting to document is a common one for using custom schemes:

1. User clicks a link that has a custom scheme
2. Detect if the navigation failed (because there is no app)
3. Present a UI to tell the user to do something.

I'll give a preview: There is no solution that is as decisive `isProtocolHandlerRegistered`, all of the solutions are based on a heuristic.

What about the finger-printing concern? It might still be there. `isProtocolHandlerRegistered` didn't have a required User-Gesture constraint so you could in theory scan a large set of protocols to determine sites the user might have registered. Any solutions here are gated on a user gesture such as a navigation via a link click.

This code assumes `updateUI_NoHandler` is a function that will update the UI to tell the user there is no site or app installed that can handle `web+follow:` links.

### Attempt 1: Individual Click Handler

HTML
```html
<a href="web+follow:@paul@status.kinlan.me" id="follow">
  Follow
</a>
```

JavaScript
```JavaScript
addEventListener("load", (loadEvent) => {
  const follow = document.getElementById("follow");
  follow.addEventListener("click", (clickEvent) => {
    setTimeout(() => updateUI_NoHandler(), 1000);
  });
});
```
Pros:

* Work's in all browsers

Cons:

* You need to augment your links with an ID and handle it in the click handler
* Heuristic based - if the user is presented with a prompt (like in Safari and Firefox) then the UI will update.

### Attempt 2: Global Click Handler

If you don't want to augment your anchor, you could intercept all link clicks.

HTML
```html
<a href="web+follow:@paul@status.kinlan.me">Follow</a>
```

JavaScript
```JavaScript
addEventListener("load", (loadEvent) => {
  document.body.addEventListener("click", (clickEvent) => {
    const { target } = clickEvent;
    if (target.nodeName == "A" && target.href.startsWith("web+follow:")) {
      setTimeout(() => updateUI_NoHandler(), 1000);
    }
  });
});
```

Pros:

* Work's in all browsers
* Doesn't require you to augment your anchors.

Cons:

* All the same problems you have tracking clicks globally on your page.
* Doesn't handle URLs from external apps
* Heuristic based - if the user is presented with a prompt (like in Safari and Firefox) then the UI will update.

### Attempt 3: Navigation Handler (Blink Only)

HTML
```html
    <a href="web+follow:@paul@status.kinlan.me">Follow</a>
```
JavaScript

```JavaScript
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
```

Pros:

* Doesn't require you to augment any links in your HTML

Cons:

* Blink only & Not stable yet.
* Doesn't handle

### Attempt 4: Winner, but more complex.

This one is a little complex because it requires a server, but it handles all the cases **and** preserves URLs as HTTPS URLs.

Thanks to [James Henstridge](https://theblower.au/@jamesh/109376597447099245) who mentioned that you might be able to 302 redirect to a custom scheme (such as mailto - [try it](https://eastern-shimmering-car.glitch.me/mailto)) and if there is no app or site to handle the custom URL scheme the request doesn't 404, it gets cancelled and the current page is left intact.

With this "no-op" side effect, you can then use a `meta http-equiv="refresh"` to attempt to redirect to the handler and if it's available it will be followed, and if it isn't you will remain on the current page.

```HTML
<meta
 http-equiv="refresh"
 content="0; url=https://eastern-shimmering-car.glitch.me/web-follow"
/>
</head>
<body>
  You don't have a site installed to handle `web+follow`.
  Do x.y.z instead.
</body>
```

In this case "[https://eastern-shimmering-car.glitch.me/web-follow](https://eastern-shimmering-car.glitch.me/web-follow "https://eastern-shimmering-car.glitch.me/web-follow")"is a simple 302 redirect to `web+follow:@paul@status.kinlan.me`.

Pros:

* Works
* Keeps URLs as they are commonly understood

Cons:

* Not super easy to set up.

## Wrap up

I got to the end of this and I realised that I don't think people will want custom schemes in their day to day lives, I wouldn't encode a web+follow link in an email, I'd prefer to send a person to a web page. **However** custom schemes are incredibly useful as a tool for developers to be able to direct people into the sites and apps of _their_ choice without knowing what site or app they are using while handling the case when there is no choice available.

Now it's got me thinking that I could rebuild web intents off this.