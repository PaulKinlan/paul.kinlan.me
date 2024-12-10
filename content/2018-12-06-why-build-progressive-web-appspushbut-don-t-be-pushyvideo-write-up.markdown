---
date: 2018-12-06 04:08:53.347000+00:00
link: https://medium.com/dev-channel/why-build-progressive-web-apps-push-but-dont-be-pushy-video-write-up-aa78296886e
slug: why-build-progressive-web-appspushbut-don-t-be-pushyvideo-write-up
summary: This post discusses the importance of using push notifications responsibly
  in Progressive Web Apps (PWAs).  It highlights the negative impact of intrusive
  notification prompts and emphasizes the need for providing context and respecting
  user preferences.  The post links to a helpful article and video by Thomas Steiner
  that provides further guidance on best practices for web push notifications, including
  avoiding immediate prompts and clearly communicating the value and frequency of
  notifications.
tags:
- Progressive Web Apps
- Push Notifications
- User Experience
- Web Development
- Best Practices
title: 'Why Build Progressive Web Apps: Push, but Don''t be Pushy! Video Write-Up'

---
A great article and video and sample by Thomas Steiner on good push notifications on the web.

> A particularly bad practice is to pop up the permission dialog on page load, without any context at all. Several high traffic sites have been caught doing this. To subscribe people to push notifications, you use the the PushManager interface. Now to be fair, this does not allow the developer to specify the context or the to-be-expected frequency of notifications. So where does this leave us?

[Read full post](https://medium.com/dev-channel/why-build-progressive-web-apps-push-but-dont-be-pushy-video-write-up-aa78296886e).

Web Push is an amazingly powerful API, but it's easy to abuse and annoy your users. The bad thing for your site is that if a user blocks notifications because you prompt without warning, then you don't get the chance to ask again.

Treat your users with respect, Context is king for Web Push notifications.
