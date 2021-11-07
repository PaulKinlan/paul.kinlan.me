---
slug: puppeteeraas.com
date: 2018-03-15T10:10:10.000Z
title: Puppeteer as a service
description: Being able to run a browser on a server is one of the most powerful things to hit the web.
tags: ['headless', 'puppeteer']
---

I believe that the [Headless Web](/the-headless-web/) is the future. Being able
to offer users experiences that are delivered via the web, but without actually
ever seeing a traditional browser. There are a couple of manifestations of the
headless web: Notification based experiences, such as those that delivered the
news of Brexit; Deep media integration allowing you to control videos and audio
through controls that extend on to connected devices such as watches and Media
surfaces in the host operating sysetem; or the most powerful of them all, the 
ability to run a web browser on the server.

I believe the introduction of Headless Chrome and the Puppeteer API can power
the next generation of web businesses or [commandline tools](/projects/domcurl).
With a browser running on the server we can fetch and execute any content that
lives on the web through a simple server side set of integrations.

[Puppeteer As A Service](https://puppeteeraas.com), or PuppeteerAAS, is a simple
example of some of the things that you can do with the Puppeteer API. It lets
you take screenshots, traces, print pdfs, server-side render dynamic pages.

The very first version of this was a bit of a hack-job, and the awesome Eric
Bidelman hopped in and quickly improved the entire project and has made it what
it is today.

Some interesting things: It's hosted on [zeit.co](https://zeit.co) using their
Docker based deployment scripts. This works really well for me, because I don't
have to think about any of the infrastructure and deploying it is as simple as
`now`.

One neat example is the bookmarklet I created that takes the current page that
you are on, runs a deep performance trace of the page via PuppeteerAAS and then
sends the results to a hosted version of Chrome DevTools.

Try it out with this page. It's very neat.