---
date: 2018-10-22 10:02:36.853000+00:00
link: https://www.computerworld.com/article/3314746/mobile-apps/why-microsoft-and-google-love-progressive-web-apps.html
slug: why-microsoft-and-google-love-progressive-web-appscomputerworld
summary: This post discusses Progressive Web Apps (PWAs) and why companies like Microsoft
  and Google are embracing them.  While PWAs offer instant access to content and cross-device
  compatibility, a key concern is their isolated nature, making it difficult for them
  to share data and resources.  This contradicts the core principles of the web, which
  should be linkable and interoperable.  The increasing isolation of PWAs, along with
  the broken functionalities of basic web operations like copy/paste and drag/drop,
  contributes to the creation of unintended data silos on the modern web.
tags:
- Progressive Web Apps
- PWA
- Web Development
- Data Silos
- Interoperability
- Microsoft
- Google
title: Why Microsoft and Google love progressive web apps | Computerworld

---
A nice post about PWA from [Mike Elgan](https://elgan.com/). I am not sure about Microsoft's goal with PWA, but I think our's is pretty simple: we want users to have access to content and functionality instantly and in a way they expect to be able to interact with it on their devices. The web should reach everyone across every connected device and a user should be able to access in their preferred modality, as an app if that's how they expect it (mobile, maybe), or voice on an assistant etc.

We're still a [long way from the headless web](/the-headless-web/), however, one thing really struck me in the article:

> Another downside is that PWAs are highly isolated. So it&#x2019;s hard and unlikely for different PWAs to share resources or data directly.
> 
> 

[Read full post](https://www.computerworld.com/article/3314746/mobile-apps/why-microsoft-and-google-love-progressive-web-apps.html).

Sites and apps on the web are not supposed to be isolated, the web is [linkable, indexable, ephemeral](/slice-the-web/), but we are getting more siloed with each site we build. We are [creating unintended silos](https://paul.kinlan.me/unintended-silos/) because the platform doesn't easily allow users to get *their* data in and out off sites easily. I'm not talking about RDF or anything like that, basic operations such as copy and paste, drag and drop, share to site and share from site are broken on the web of today, and that's before we get to IPC between frames, workers and windows.
