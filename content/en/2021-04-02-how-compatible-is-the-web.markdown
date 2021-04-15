---
slug: how-compatible-is-the-web
date: 2021-04-02T01:30:29.419Z
title: How compatible is the web?
summary: Is there a single number we can use to determine web compatibility?
draft: true
tags: [drafts]
---

This is very early exploratory and will likely go nowhere.

* My dissertation looked at Receiver Operating Characteristic... (mining my memory...) To get 100% True Positives identified, you have to accept 100% of false positives will be in the set.  It got me thinking....
  * Is there an analogy to ROC to get 100% compatibility on a site you have to accept 50% of APIs not useable because it's not in other browsers. Or to have 100% of people using your site, you will only have X% of web platform available to use..
  * Can it describe the state of the ecosystem?
    * (sorry for this framing) Gecko adds a feature before anyone else there's less incentive for developers to use it because the user-base is smaller. How would we help change this incentive?
    * Chromium adds a feature before anyone else, there's a lot of usage of Chromium browsers - but ecosystem rightly wants to use things that are broadly compatible.
    * WebKit adds a feature before anyone else US and EMEA tends to move because huge amounts of their revenue is generated via iOS + Safari.
    * Actually do we know what developers say they support? Yes, Quarterly survey says: Chromium/Blink, WebKit, Gecko.
  * Can it be used to help prioritze compat across all browsers? (More research needed)
  * Can we look use caniuse compat data? WPT?

* Can we use this to determine how safe it is to change an API, or remove it (not purely just usage counter)