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

\[TODO\] Create a post about protocol handlers.

Using Attempt 4 in "[Detecting if a URL scheme has a handler](https://paul.kinlan.me/detecting-if-a-url-scheme-can-be-handled/)", I believe there can be a relatively seamless solution to the concept of follow on the web.

I'd like to quickly introduce the notion of a dedicated `web+follow` URL scheme. It is possible for a web app or a regular installed app to declare its intent to become the default system handler for any link that is encoded with that particular scheme. Where a browser might handle the scheme `https`, an irc client might handle `irc` - it's possible for a web site to handle a range of app to app integration \[insert link\].

A `web+follow` link is much like `mailto` link - it encodes the users address `web+follow:@paul@status.kinlan.me` that when clicked would open your mastodon instance (or what ever app you choose to use that understands the ActivityPub follow actions) to let you follow that user. This is much like a `mailto` link opening your default Mail app to send an email to the person in the link.

Things to handle:

1. A user clicks a web+follow link from a web page
2. A user clicks a web+follow link from another app (i.e, email client)
3. A user follows a normal https link and we want to reroute it to an installed app.

Note: I am going to talk about Mastodon, and conflate ActivityPub. Apologies.

Note 2: I am not a spec writer, so expect gaps.

**Step 1.** Your home instance registers as a protocol handler for `web+follow` scheme.

This means that you ever see a link of the form `web+follow:` i.e, `web+follow:@paul@status.kinlan.me` embedded in a web page or native app, then your home instance will be opened.

Mastodon could add a `protocol_handler` to their Web App manifest, or let the user register it via a button in the UI that calls `registerProtocolHandler("web+follow", "/follow?id=%s")`  

**Step 2.** Your home instance should handle the `/follow` request. 

Present the UI to follow a person as you would if you searched for them.

Redir

**Step 3.**