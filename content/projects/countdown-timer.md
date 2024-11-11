---
slug: countdown-timer
date: 2024-11-06T10:46
title: Countdown timer
description: ''
---

I\'ve a little thing where I like to know roughly how many days it until something. My kids\' birthdays, my wedding anniversary, Christmas...

Following my focus on [Generated Web Apps](https://paul.kinlan.me/generated-web-apps/ "https://paul.kinlan.me/generated-web-apps/") where launch sites and services without touching a single line of code, I decided to build a simple service that didn\'t require anyone to sign-up or sign-in, but could also share the time with their friends and family.

[https://countdown-timer.replit.io/](https://countdown-timer.replit.io/ "https://countdown-timer.replit.io/")

![Screenshot\_20241111-115108.jpg](/images/Screenshot_20241111-115108.jpg)I\'m pretty happy with the output. Earlier versions used Dall-e for the background image, but the quality wasn\'t that good. I replaced it with Black Forrest Labs\' API which I think creates far better images. Black Forrest Labs has an API with an OpenAPI spec, but they on don\'t have any generated client libraries which I thought was going to be an issue. Nope. Replit\'s Agent could take the OpenAPI spec and directly implement the code to request the image and poll for the response. My mind was kinda blown by this.

The source is here if you are interested: [https://github.com/PaulKinlan/CountdownCrafter](https://github.com/PaulKinlan/CountdownCrafter "https://github.com/PaulKinlan/CountdownCrafter")