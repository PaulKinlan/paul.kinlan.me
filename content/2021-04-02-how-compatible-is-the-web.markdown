---
date: 2021-04-02 01:30:29.419000+00:00
draft: true
slug: how-compatible-is-the-web
summary: This post explores the concept of web compatibility and whether it can be
  quantified. It draws parallels to the Receiver Operating Characteristic (ROC) curve,
  questioning if a similar metric could represent the trade-off between compatibility
  and feature availability. The post also examines how browser vendors' incentives
  influence feature adoption and proposes leveraging compatibility data sources like
  caniuse and web platform tests (WPT) to prioritize compatibility improvements. Potential
  tools, such as a compatibility bot and automated blog updates, are suggested to
  highlight these improvements.
tags:
- web
- compatibility
- metrics
- browser
- testing
- wpt
- caniuse
- developer
- ecosystem
- roc
title: How compatible is the web?

---

This is very early exploratory and will likely go nowhere.

* My dissertation looked at Receiver Operating Characteristic... (mining my memory...) To get 100% True Positives identified, you have to accept 100% of false positives will be in the set.  It got me thinking....
  * Is there an analogy to ROC to get 100% compatibility on a site you have to accept 50% of APIs not useable because it's not in other browsers. Or to have 100% of people using your site, you will only have X% of web platform available to use..
  * Can it describe the state of the ecosystem?
    * (sorry for this framing) Gecko adds a feature before anyone else there's less incentive for developers to use it because the user-base is smaller. How would we help change this incentive?
    * Chromium adds a feature before anyone else, there's a lot of usage of Chromium browsers - but ecosystem rightly wants to use things that are broadly compatible.
    * WebKit adds a feature before anyone else US and EMEA tends to move because huge amounts of their revenue is generated via iOS + Safari.
    * Actually do we know what developers say they support? Yes, Quarterly survey says: Chromium/Blink, WebKit, Gecko.
  * Can it be used to help prioritize compat across all browsers? (More research needed)
  * Can we look use caniuse compat data? WPT?
  * Can we just look at wpt.fyi test runs?
  * Why would Browser Vendors care? Work out what to work on. Show they are listening to the needs of developers.
  * Why would Developers care? Perception, developers tell us constantly that compat is a huge issue in their day to day lives. There's a lot of work in browsers to improve that, but it goes unseen.

* Can we use this to determine how safe it is to change an API, or remove it (not purely just usage counter).

Tools we can build:

* Compat Bot - look at wpt.fyi, see what tests have just now passed across the board and tweet success!
* Chromium Blog - automatically list compat improvements.