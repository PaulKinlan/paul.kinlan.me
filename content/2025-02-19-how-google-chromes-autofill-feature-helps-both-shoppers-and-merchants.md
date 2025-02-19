---
title: "Lokesh Khurana: How Google Chrome’s autofill feature helps both shoppers and merchants"
date: 2025-02-19T16:41:14.439Z
link: https://blog.google/products/chrome/chrome-autofill/
---
Link: [How Google Chrome’s autofill feature helps both shoppers and merchants](https://blog.google/products/chrome/chrome-autofill/)

> One of Shopify’s key metrics is Checkout Conversion Rate (CCR), which measures the rate of successful checkouts completed over a period of time. Through testing, Shopify found that removing unnecessary steps led to more customers completing their checkouts. **Guest checkouts using autofill had a 45% higher CCR than guest checkouts without autofill**. Basically, the customers who didn’t have to spend time filling out forms were more likely to actually buy something at the end of their online shopping trip.

Emphasis mine, but this is incredible and is something that I think has gone under the radar.

For the longest time it was thought that there was no way to measure the impact of autofill on the web. In 2016  I developed a small snippet to [detect when autofill happens](https://paul.kinlan.me/detecting-when-autofill-happens/) and while no one paid attention, it's good to see that with the introduction of CSS `:autofill` pseudo-class in Baseline, [we can create some simple JS that will more effectively detect when autofill happens](https://web.dev/articles/autofill-measure).

There's also now [better autofill tooling in Chrome DevTools](https://developer.chrome.com/docs/devtools/autofill), so my hope is that more people will start to understand the impact of autofill on their sites and start to optimize for it....

... maybe.. There is still a lot of concern in the ecosystem about `autocomplete=off` and a lot of people that don't want the user's agent to control the autocomplete experience.
