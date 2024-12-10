---
date: 2022-09-09 06:00:00+00:00
slug: what-is-new-on-the-web
summary: I've created a tool called \"Now Stable\" using Browser Compat Data (BCD)
  to help developers determine when web APIs become stable across different browsers.  This
  addresses the challenge of keeping up with browser updates and helps developers
  confidently choose APIs for their projects.  The tool allows users to select their
  target browsers (e.g., Chrome, Safari, Firefox) and see a chronological list of
  when APIs became available across those browsers.  I'm looking for feedback on how
  this tool can be improved and how developers would use this data.
tags:
- web development
- browser compatibility
- API
- BCD
- tooling
- developer tools
- cross-browser
- web platform
title: What is new on the web?

---
I have always wanted to understand the shape of the web platform. What APIs are available? When did they become available in a browser? When did a wide range of browsers support the APIs?

Answers to these questions help me work out the strategy for our Developer Relations team. Especially as we work to ensure on web.dev that we are helping developers build for the web and not just Chrome.

[Browser Compat Data](https://paul.kinlan.me/bcd-a-hidden-web-compat-gem/) (BCD) is a relatively unknown, yet incredible resource that gives you access to the data to answer questions like this. However it's not easily queryable.

I've used BCD before in projects like "[The Web Of ...](https://the-web-of.glitch.me/)" ([Source](https://github.com/PaulKinlan/the-web-of)) but I wanted to make something a little more useful.

[Developers have told us time and time again](https://paul.kinlan.me/top-web-developer-pain-points-in-2021/) that they can't keep up with the pace of change in all of the browsers and at the same time they don't build for one browser so an API has to be [broadly available for it to be something they want to use in their projects](https://paul.kinlan.me/thinking-about-developer-satisfaction-and-web-developers/).

You might have seen a new set of posts called "[New to the Web](https://web.dev/tags/new-to-the-web/)" over on web.dev. This is a great series curated by [Rachel Andrew](https://rachelandrew.co.uk/) where each and every month Rachel will go through the latest additions to browsers to determine what APIs are now available to use on "the web" with the aim of giving the developer ecosystem confidence that APIs are more likely to be useable for the majority of users without having to worry about browser support.

This series gave me an idea!

Using BCD it should be possible to look at every API in every browser (or every browser you care to support) and see if the API landed in all of the browsers and if so when. When an API is in your selected set of browsers it could be considered "Stable" for you to use.

I pulled together this simple page called "[Now Stable](https://time-to-stable.deno.dev/when-stable?browser-chrome=on&browser-safari=on&browser-firefox=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on)" \[[Source](https://github.com/PaulKinlan/time-to-stable)\] that answers this question: What APIs are available across a select set of browsers, and when did they become available? (ordered reverse chronologically)

<figure>
<img src="/images/screen-shot-2022-09-09-at-23.36.34.png" />
<figcaption>A list of APIs that are stable across a selected set of browsers.</figcaption>
</figure>

The site doesn't present any opinion about how to pick your set of Stable Browsers - I left that as an option for you and your business to work out, however I found it very interesting to compare the list of [Safari, Chrome and Firefox](https://time-to-stable.deno.dev/when-stable?browser-chrome=on&browser-safari=on&browser-firefox=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on) vs [Safari & Chrome](https://time-to-stable.deno.dev/when-stable?browser-chrome=on&browser-safari=on&browser-firefox=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on) and see how they compare.

Every browser has a "Stable Channel" (the current product browser that people are likely to be using). Using this data, it would be interesting for the web to have a "Stable Channel" that is clear what is available in it so that you can have more confidence in knowing what is available for you to use.

I'd love your feedback. Is there anything missing? How would you use this data?

Updates:

* I will be adding an RSS feed to this. Thank you Stefan for the request.
* Thank you [Šime](https://twitter.com/simevidas/status/1568395613472972800) for the note about missing Firefox.