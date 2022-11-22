+++
date = 2022-11-21T19:40:32Z
draft = true
slug = "thoughts-on-web-follow"
summary = "Thinking about the follow action on the web."
tags = []
title = "Web Follow"

+++
I've been digging Mastodon for the past couple of weeks. It's fun and it's incredible to see how polished the web app is. It's an exemplar of what is possible in the browser. Kudos.

One thing that I love is that I can follow people on any other mastodon instance, or really anything that supports ActivityPub. The process of following across server instances is kinda hard.

I've not spoken to anyone in the ActivityPub or Mastodon ecosystem about this, and I'm not sure if anyone would appreciate my drive-by hypothesising... but... this is my site. I'm not going to proactively push it because I know how teams feel when there's a pile on for Developer Advocates and other outsiders suggesting things that have been discussed and considered in the [past](https://github.com/mastodon/mastodon/issues/14187) (and more [recently](https://github.com/mastodon/mastodon/issues/19679)) with valid concerns about the UX issues of a confusing prompt.

Using Attempt 4 in "[Detecting if a URL scheme has a handler](https://paul.kinlan.me/detecting-if-a-url-scheme-can-be-handled/)", I believe there can be a relatively seamless solution to the concept of follow on the web.

Before I go further, I'd like to quickly introduce the notion of a dedicated `web+follow` URL scheme. It is possible for a web app or a regular installed app to declare its intent to become the default system handler for any link that is encoded with that particular scheme. Where a browser might handle the scheme `https`, an irc client might handle `irc` - it's possible for a web site to handle a range of app to app integration \[insert link\].

A `web+follow` link is much like `mailto` link - it encodes the users address `web+follow:@paul@status.kinlan.me` that when clicked would open your mastodon instance (or what ever app you choose to use that understands the ActivityPub follow actions) to let you follow that user. This is much like a `mailto` link opening your default Mail app to send an email to the person in the link.

The thing is ... real people in the real world are not going to understand this `web+follow`.

Things to handle:

1. A user clicks a web+follow link from a web page
2. A user clicks a web+follow link from another app (i.e, email client)
3. A user follows a normal https link and we want to reroute it to an installed app.

Note: I am going to talk about Mastodon, and conflate ActivityPub. Apologies. And I am not a spec writer, so expect gaps.

**Step 1.** Your home instance registers as a protocol handler for `web+follow` scheme.

This means that you ever see a link of the form `web+follow:` i.e, `web+follow:@paul@status.kinlan.me` embedded in a web page or native app, then your home instance will be opened.

Mastodon could add a `protocol_handler` to their Web App manifest, or let the user register it via a button in the UI that calls `registerProtocolHandler("web+follow", "/follow?id=%s")`  

**Step 2.** All mastodon instances should handle the `/follow` request. 

This page will show the user's page as something like https://status.kinlan.me/@paul does today and it would embed `<meta http-equiv="refresh" content="0; url=/resolve-app?id=@paul@status.kinlan.me" />` in the html `head` to help redirect to the user's app.

If there is no installed `web+follow` handler, the page would remain as is. i.e, the traditional follow UI.

**Step 3.** Mastodon instances should have an endpoint called `/resolve-app`

This endpoint returns a 302 redirect to the url `web+follow: [id]`. If the user doesn't have an app to handle the scheme, the request to redirect will be cancelled, leaving the user on the current page.

### Benefits of this solution?

This solution works well (at least conceptually) because it is

1. Progressive. The default user facing experience is `https` based URLs and not `web+follow:`\`