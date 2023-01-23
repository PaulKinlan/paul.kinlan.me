---
slug: creating-a-simple-lighthouse-audit
date: '2023-01-23T14:37:48'
title: Creating a simple lighthouse audit to detect a button
tags:
- ML
- tensorflow
- lighthouse
---

This post wraps up the series of posts I created about applying ML to some developer tasks that are hard to do programatically. Specifically, I wanted to create a tool that would let me detect if an anchor on a page `<a>` was styled to look like a button or not.

You can check out the previous posts here:

*   [Scraping images of links and buttons to train an ML model](https://paul.kinlan.me/button-and-link-scraping-for-ml-training/)
    
*   [Training the ML model](https://paul.kinlan.me/training-the-button-detector-ml-model/)
    
*   [Building a simple tool to help test the ML model](https://paul.kinlan.me/ml-deno-fresh-tensorflow/)
    
*   [Creating a custom lighthouse gatherer](https://paul.kinlan.me/lighthouse-full-res-screenshot-gatherer/)
    

And you can check out the code here:

*   [Button and link scraper](https://github.com/PaulKinlan/button-and-link-scraper)
    
*   [Is it a button web app](https://github.com/PaulKinlan/is-it-a-button-web-app)
    
*   [Is it a button lighthouse audit](https://github.com/PaulKinlan/is-it-a-button-lighthouse-audit)
    

I had a lot of fun relearning a bunch of ML for the this and while I am certainly no expert, what I learnt gave me some confidence for the future in that it is very possible to sensibly integrate ML into many existing products.