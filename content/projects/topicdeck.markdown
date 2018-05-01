---
slug: topicdeck
date: 2018-03-03T09:00:00+01:00
title: Topicdeck
description: Topicdeck is the module that aggregates a selection of RSS feeds into a tweetdeck style view
tags: ['pwa', 'app shell', 'topicdeck']
---

I love how TweetDeck presents and lets you organize multiple columns of feeds of
data so that you can massively increase your information density. I also love RSS
feeds and want to help increase their usage as much as possible.

I created TopicDeck to help me organise and aggregate RSS feeds into an TweetDeck
inspired layout.

TopicDeck today is a npm module on GitHub that you can use to quickly host. One 
of those instances is [pwa.topicdeck.com](https://pwa.topicdeck.com/) which 
aggregates a number of Progressive Web App related feeds into eiter a deck format
or a single master feed.

I'm quite proud of this project. The UI is plain and simple, but under the hood
it does a number of interesting things:

1. All of the logic is shared between the Server and the Service Worker. I
   believe it was the first web app to do that. There have been 'isomorphic'
   examples of sites before, but they mostly did the work in the frontend.
   TopicDeck moves the server logic closer to the user. To achieve this I had to
   abstract away some of the differences the Node and Web ecosystems, such as
   unifying around the WhatWG Streams implementation; and bring a simple Express
   like clientside router to Service Workers.
2. The service worker does full template rendering. If the service worker has
   the cached data it will merge that into the response stream so that there is
   no need to run JS in the client to asynchronously fetch the data.
2. It takes all the individual feeds and creates a master aggregration of the
   feed data. This allowed me to create decks of decks. Check out the [GDE
   Deck](https://gdedeck.com) which aggregtes all of the feeds of Google's
   Developer Experts program, pulling in our [Web](https://web.gdedeck.com),
   [Android](https://android.gdedeck.com/) and [IoT](https://iot.gdedeck.com/)
   GDE's feeds.
3. The original version used CSS-Grid to layout the columns and stream data
   into the UI out of order. I.e, column 1 might come in 10s later.
4. It waits for UI state changes using the MutationObserver API and when a
   column is added to the UI it starts a flow which fetches the latest feed
   data.

I don't imagine that this project will take over the world, but I find it very
useful. It pioneered a new Service Worker rendering model, and it helps me keep
up to date with the world.