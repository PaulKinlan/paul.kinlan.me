---
date: '2023-02-13T09:45:35'
slug: bcd-experimental-apis
summary: I've added a new feature to time-to-stable that lists experimental APIs across
  browsers using BCD. This helps developers track experimental APIs, understand their
  stability, and consider the implications for website integration.  It helps answer
  questions about cross-browser compatibility and potential deprecation, informing
  decisions about using these APIs.
tags:
- web development
- browser compatibility
- APIs
- experimental APIs
- BCD
- time-to-stable
- cross-browser compatibility
- API deprecation
- website integration
title: BCD - Experimental APIs bcd

---

This is just a small update. I've spent a bit of time adding some features to "[time-to-stable](https://time-to-stable.deno.dev/)". As I try to think about what is [stable across the web platform](https://paul.kinlan.me/what-is-new-on-the-web/) it is useful to think about what APIs are marked as experimental.

I added a new page to the site which lets you discover the APIs across a selected list of browsers that are still [marked as experimental in BCD (Browser Compat Data)](https://paul.kinlan.me/what-is-new-on-the-web/).

![A list of APIs that are marked as experiemntal in Chrome, Safari or Firefox](/images/Screenshot%202023-02-13%20at%2009.59.34.png)

Why is this important? For me at least it is useful to know when an API is not something that I can rely on across because it's not in all browsers, and at the same time an API might be considered experimental for an incredibly long time (6 years in the screenshot above) - that gives you an idea about the potential importance of other browser vendors to standardise on this.

It is fair to ask the question: If it's just in browser X and it has for a long time, is it something that will get deprecated?

Now, there might not be an answer to that, but at least you have more data to help you make a decision on if it is something you want to integrate into your site and have productive conversations with your stakeholders and team.

Let me know what I can do to improve this.