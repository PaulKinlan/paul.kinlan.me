---
slug: email-summary-service
date: 2025-01-08T19:37:00
title: Email Summary Service
description: A simple tool that summarizes the email that is sent to it.
---

I get a lot of newsletters, and I love them. They often contain a wealth of deep insight that I can\'t easily find while browsing the web. Yes, there are RSS feeds that publish their protected content, but since I spend so much time in my email, I effectively use it as a way of browsing.

I really wanted a way to get quick summaries of the newsletters I read, so I built one. [Val.town](http://Val.town "http://Val.town") is an amazing platform; you can quickly create an HTTP endpoint, a cron job, or an email handler and publish it to the web in milliseconds.

The email handler alone is incredibly powerful, it's something that App Engine used to do and you can do with SendGrid if you have the time to set it all up. With val.town, it's just a function and deploy.

Send an email to [paulkinlan.emailSummaryHandler@valtown.email](mailto:paulkinlan.emailSummaryHandler@valtown.email "mailto:paulkinlan.emailSummaryHandler@valtown.email"), and in a couple of seconds, you\'ll get back a summary of its contents.

<iframe width="100%" height="400px" src="https://www.val.town/embed/paulkinlan/emailSummaryHandler" title="Val Town" frameborder="0" allow="web-share" allowfullscreen></iframe>

Given the asynchronous, text-based nature of email, I\'m surprised there haven\'t been more tools built that interact with it using LLMs.
