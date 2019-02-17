---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31+01:00
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
This article is over a year late. It was stuck in my drafts for a long time,
yet I think the idea is something that we need to solve into 2018. It also
turns out that other issues have arisen in the last year that make it 
a bit more relevant.

I was in Indonesia earlier in 2016 idly chatting with developers and it came up
in conversation that the web is screwed (they were the literal words). The crux
of the issue was that users today, and specifically users who are coming online
for the first time, are creating content inside silos. In some cases these silos
[look and feel like the web](/rise-of-the-meta-platforms/) but the content is
only ever available on those platforms but it is perpetuated by the fact that
every native application has the ability to actively participate in every
interaction the user has on their computing device, but the web doesn't, and
that is a killer. It's impossible to get content into web experiences, but
it is easier to get content out.

More concretely, there were a number of scenarios that we discussed.

1. You take a picture on your camera app and you want to share the image. You
   press share but only native apps appear in the list. The web is not part of
   the choice for users, so the web can never capture that value.
2. You want to share the current page in the browser. You press share but only
   native apps appear in the list. The act of sharing information means that we
   are losing the a user from the web to a native experience
3. You create some content directly inside a web page and you want to share it,
   your only option is to include a widget that shares.

In early 2017 we saw the launch of [navigator.share](/navigator.share/) which
brought native sharing to the web (well, users of Chrome at least). The irony is
that the `navigator.share` API perpetuates the flow of the users using native
apps.

In 2018 I would love the web to be to more effective at breaking down the silos
that are perpetuated on native platforms. The web needs to be able to
participate in every major interaction the user has with their device.

Late in 2017, "Improved add to home-screen" launched in Chrome on Android. This
meant that every time a user installs your `Progressive Web App` an actual APK
is generated for the user. An APK on Android means that for all intents and
purpose your web application is considered a native application. In the first
iteration of "Improved add to home-screen" all that it means is that every
navigation to a url inside the scope of your PWA will open directly in the PWA.

The future is a little bit brighter though. Chrome is working on the [Share
target
API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md)
which allows you to declare that your site will participate in the receiving of
"shares". That means every time a user shares a link, your PWA will be able to
be listed.

I am quite excited by this development because it means that large sites like
[Twitter Lite](https://lite.twitter.com) will now be able to be shared to
without the need for the user to use the Native app, but it also means that
small niche sites that only a handful of users might use can also be part of the
same ecosystem.

The API can't handle images and binary data just yet, but looking at the Android
ecosystem the ACTION_SEND intent is the most used intent and it's primarily 
just for sharing text and links. 

It's a start. The web is breaking down one silo at a time.
