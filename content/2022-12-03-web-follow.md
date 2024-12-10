---
date: 2022-12-03 19:40:32+00:00
slug: thoughts-on-web-follow
summary: Mastodon's cross-instance following is clunky. I propose a solution using
  the `web+follow` URL scheme, like `mailto`, to streamline following users on ActivityPub
  platforms.  A user's home instance registers as a handler for `web+follow`. Clicking
  a `web+follow` link opens the home instance, redirecting to a `/follow` request
  on the target instance. This page uses a meta refresh tag to redirect to `/resolve-app`,
  which redirects back to `web+follow:` with the user's ID. This triggers the registered
  handler (if available), creating a seamless follow experience within the user's
  preferred app. If no handler is installed, the user remains on the target instance's
  follow page, preserving existing functionality.
tags:
- mastodon
- activitypub
- web+follow
- url scheme
- protocol handler
- user experience
- cross-instance following
- app integration

---
I've been digging Mastodon for the past couple of weeks. It's fun and it's incredible to see how polished the web app is. It's an exemplar of what is possible in the browser. Kudos.

One thing that I love is that I can follow people on any other Mastodon instance, or really anything that supports ActivityPub. The process of following across server instances is kinda hard.

I've not spoken to anyone in the ActivityPub or Mastodon ecosystem about this, and I'm not sure if anyone would appreciate my drive-by hypothesising... but... this is my site. I'm not going to proactively push it because I know how teams feel when there's a pile on for Developer Advocates and other outsiders suggesting things that have been discussed and considered in the [past](https://github.com/mastodon/mastodon/issues/14187) (and more [recently](https://github.com/mastodon/mastodon/issues/19679)) with valid concerns about the UX issues of a confusing prompt.

Using Attempt 4 in "[Detecting if a URL scheme has a handler](https://paul.kinlan.me/detecting-if-a-url-scheme-can-be-handled/)", I believe there can be a relatively seamless solution to the concept of follow on the web.

Before I introduce the notion of a dedicated `web+follow` URL scheme, I thought it might be useful to highlight that it is possible for a web app ([in a select set of browsers](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)) or a regular installed app to declare its intent to become the default system handler for any link that is encoded with that particular URL scheme. Where a browser might handle the scheme `https`, a mail client might handle `mailto`, an irc client might handle `irc` - it's possible for a web site to handle a range of app to app integrations via an API called [registerProtocolHandler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler).

A `web+follow` link is much like `mailto` link - it encodes the users address `web+follow:@paul@status.kinlan.me` that when clicked would open your mastodon instance (or what ever app you choose to use that understands the ActivityPub follow actions) to let you follow that user. This is much like a `mailto` link opening your default Mail app to send an email to the person in the link.

The thing is ... the majority of people are not going to understand what `web+follow` means _and_ custom `web+` schemes are not supported in many browsers, so why even think about a custom scheme?

My belief is that custom schemes are great infrastructure for directing people to installed web apps or apps (it's literally the only solution) and there is already a lot of infrastructure in Chrome and Firefox that let the user own the experience of which app handles a particular scheme.

While custom schemes are not author-friendly or user-friendly - we can't expect people to encode `web+` url - it highlights that we would need a solution that doesn't require `web+follow` from an authorship perspective _and_ it must handle the following scenarios:

1. A user clicks a web+follow link from a web page, it must route the user to "something" (home instance or authors instance)
2. A user clicks a web+follow link from another app (i.e, email client), it must route the user to "something" (home instance or authors instance)
3. A user follows a normal https link and we want to reroute it to an installed app.

_Note_: I am going to talk about Mastodon, and conflate ActivityPub. Apologies. Additionally, I am not a spec writer, so expect gaps.

**Step 1.** Your home instance registers as a protocol handler for `web+follow` scheme.

This means that you ever see a link of the form `web+follow:` i.e, `web+follow:@paul@status.kinlan.me` embedded in a web page or native app, then your home instance will be opened.

Mastodon could add a `protocol_handler` to their Web App manifest, or let the user register it via a button in the UI that calls `registerProtocolHandler("web+follow", "/follow?id=%s")`

**Step 2.** All mastodon instances should handle the `/follow` request.

This page will show the user's page as something like https://status.kinlan.me/@paul does today and it would embed `<meta http-equiv="refresh" content="0; url=/resolve-app?id=@paul@status.kinlan.me" />` in the html `head` to help redirect to the user's app.

If there is no installed `web+follow` handler, the page would remain as is. i.e, the traditional follow UI.

**Step 3.** Mastodon instances should have an endpoint called `/resolve-app`

This endpoint returns a 302 redirect to the url `web+follow: [id]`. If the user doesn't have an app to handle the scheme, the request to redirect will be cancelled by the browser, leaving the user on the current page with the existing experience.

### Benefits of this solution?

This solution works well (at least conceptually) because it is:

1. Progressive. The default user facing experience is `https` based URLs and not `web+follow:` so a browser that doesn't support custom schemes will work as it does today.
2. Resilient. If the user doesn't have a handler installed it offers the user the same experience as today.
3. No JS required - the resolution of the app that can handle the follow works without JS being enabled
4. Non-technical user friendly - because it relies on `https` all education about websites for general users continues to work, and we would not have to educate people on a new unfamiliar scheme.

That's it in a nutshell.
