---
slug: feature-policythe-well-lit-path-for-web-developmentchrome-dev-summit-2018-
date: 2018-11-23T14:32:09.248Z
title: 'Feature Policy & the Well-Lit Path for Web Development (Chrome Dev Summit 2018)'
link: https://www.youtube.com/watch?v=igHvSUrLqXc&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF&t=0s&index=14
tags: [links, chrome dev summit, feature policy]
---
Jason did an amazing talk about a little-known but new area of the web platform 'Feature Policy'.

> Feature Policy is a new primitive which allows developers to selectively enable, disable, and modify the behaviour of certain APIs and features in the browser. It's like CSP, but for features & APIs! Teams can use new tools like Feature Policy and the Reporting API to catch errors before they grow out of control, ensure site performance stays high, keep code quality healthy, and help avoid the web's biggest footguns.
> 
> Check out [featurepolicy.rocks](https://featurepolicy.rocks) for more information about Feature Policy, code samples, and live demos.
> 
> Submit new ideas for policies or feedback on existing policies at  &#x2192; [https://bit.ly/2B3gDEU](https://bit.ly/2B3gDEU).
> 
> To learn more about the Reporting API see [https://bit.ly/rep-api](https://bit.ly/rep-api).

[Read full post](https://www.youtube.com/watch?v=igHvSUrLqXc&list=PLNYkxOF6rcIDjlCx1PcphPpmf43aKOAdF&t=0s&index=14).

Feature policy is an interesting area that can seem like a hard place to work out where.

There are a couple of areas where I seeing it being beneficial:

1) **Control 3rd-party content**. As an embedder, you should be able to control what functionality runs in the context of your page and when it runs. Feature policy gives you that control. Don't want iframes to autoplay video? Turn it off. Don't want third party iframes to request geo-location? Turn it off. Don't want iframes to access sensor information? Turn it off. You should be in control of your experience, not third party sites.
2) **Stay on target in development**. We talked a lot at Chrome DevSummit about perf-budgets, yet today they can be hard to reason with. Feature Policy enabled on your development and staging services will help you know if any sets of changes you are making will breach your performance budgets by stopping you from doing the wrong thing. A case in point, our very own Chrome Dev Summit side had feature policy enabled for images called 'max-downscaling-image' - it inverts the colour of the image when it has been downscaled too much (a large image displayed in a small container). Feature policy picked it up and enabled us to make a decision about what to do. In the end, we disabled the policy because we were using the larger version of the image in multiple places and the images were already cached at that point.

I do encourage you all to look in to feature policy a lot more because it will play an important part of the future of the web. If you want to see the latest Policies that Chrome is implementing then checkout [Feature Policy on Chrome Status](https://www.chromestatus.com/features#feature%20policy)
