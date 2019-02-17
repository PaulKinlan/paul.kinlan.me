---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman on Google Developer's Web updates, writes:

> Building for the web is a rocky adventure. It's hard enough to build a top-notch web app that nails performance and uses all the latest best practices. It's even harder to keep that experience great over time. As your project evolves, developers come on board, new features land, and the codebase grows. That Great Experience &#x2122; you once achieved may begin to deteriorate and UX starts to suffer! Feature Policy is designed to keep you on track.
> 
> With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout your site. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.
> 
> Here are examples of things you can do with Feature Policy:
> 
> * Change the default behavior of autoplay on mobile and third party videos.
> * Restrict a site from using sensitive APIs like camera or microphone.
> * Allow iframes to use the fullscreen API.
> * Block the use of outdated APIs like synchronous XHR and document.write().
> * Ensure images are sized properly (e.g. prevent layout thrashing) and are not too big for the viewport (e.g. waste user's bandwidth).
> 
> Policies are a contract between developer and browser. They inform the browser about what the developer's intent is and thus, help keep us honest when our app tries to go off the rails and do something bad. If the site or embedded third-party content attempts to violate any of the developer's preselected rules, the browser overrides the behavior with better UX or blocks the API altogether.

[Read full post](https://developers.google.com/web/updates/2018/06/feature-policy).

I'm interested to see how this lands. I worry that developers won't care about this, or that they will be pressured. As I said [on Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), I worry about the incentives and we need to combine the fact that this feature will let developers control a large number of the available features that either take up memory, can slow the page down, or inadvertently leak user-privacy to third parties embeds, with things that developers can sell in to their business. One example could be that **if** the Play Store were ever to list PWA's then they could come with a set of policies automatically applied when the app is launched, and you as a developer would agree to this for the benefit of being in the store.

I'm excited to see what happens with this API, and I'm keen to see it adopted, even if it's only used by developers to ensure that their teams don't regress.
