---
title: What is new on the web?
date: 2022-09-09T22:16:03.590Z
draft: true
summary: When does an API become available to use on the web?
image_header: ""
tags:
  - bcd
slug: what-is-new-on-the-web
---
I﻿ have always w﻿anted to understand the shape of the web platform. What APIs are available? When did they become available in a browser? When did a wide range of browsers support the APIs?

A﻿nswers to these questions help me work out the strategy for our Developer Relations team. Especially as we work to ensure on web.dev that we are helping developers build for the web and not just Chrome.

[Browser Compat Data](https://paul.kinlan.me/bcd-a-hidden-web-compat-gem/) (BCD) is a﻿ relatively unknown, yet incredible resource that gives you access to the data to answer questions like this. However it's not easily queryable.

I﻿'ve used BCD before in projects like "[The Web Of ...](https://the-web-of.glitch.me/)" ([Source](https://github.com/PaulKinlan/the-web-of)) but I wanted to make something a little more useful.

[D﻿evelopers have told us time and time again](https://paul.kinlan.me/top-web-developer-pain-points-in-2021/) that they can't keep up with the pace of change in all of the browsers and at the same time they don't build for one browser so an API has to be [broadly available for it to be something they want to use in their projects](https://paul.kinlan.me/thinking-about-developer-satisfaction-and-web-developers/).

Y﻿ou might have seen a new set of posts called "[New to the Web](https://web.dev/tags/new-to-the-web/)" over on web.dev. T﻿his is a great series curated by [Rachel Andrew](https://rachelandrew.co.uk/) w﻿here each and every month Rachel w﻿ill go through the latest additions to browsers to determine what APIs are now available to use on "the web" with the aim of giving the developer ecosystem confidence that APIs are more likely to be useable for the majority of users without having to worry about browser support.

T﻿his series gave me an idea!

U﻿sing BCD it should be possible to look at every API in every browser (or every browser you care to support) and see if the API landed in all of the browsers and if so when. When an API is in your selected set of browsers it could be considered "Stable" for you to use.  

I﻿ pulled together this simple page called "[Now Stable](https://time-to-stable.deno.dev/when-stable?browser-chrome=on&browser-safari=on&feature-api=on&feature-css=on&feature-html=on&feature-javascript=on)" [[Source](https://github.com/PaulKinlan/time-to-stable)] that answers this question. What APIs are available across a select set of browsers, and when (ordered reverse chronologically) did they become available.

<﻿figure>
![A list of APIs that are stable across a selected set of browsers](/images/screen-shot-2022-09-09-at-23.36.34.png)
<﻿figcaption>A list of APIs that are stable across a selected set of browsers</figcaption>
<﻿/figure>

E﻿very browser has a "Stable Channel" (the current product browser that people are likely to be using). Using this data, it would be interesting for the web to have a "Stable Channel".

I﻿'d love your feedback. Is there anything missing? How would you use this data?