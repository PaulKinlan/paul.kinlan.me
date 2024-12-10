---
date: 2018-07-26 22:46:46.011000+00:00
link: https://developers.google.com/web/updates/2018/07/nic68
slug: new-in-chrome-68webgoogle-developers
summary: In Chrome 68, the Add to Homescreen banner will no longer automatically appear,
  even if the site meets the criteria. Instead, developers have control over prompting
  users.  Listen for the `beforeinstallprompt` event, then present a custom button
  or UI element to trigger installation when appropriate. This change aims to reduce
  annoying prompts and give developers more control over the user experience.  While
  potentially impacting install rates initially, it empowers developers to prompt
  users strategically. Chrome is exploring ambient badging as a less intrusive way
  to indicate installability.
tags:
- add to homescreen
- pwa
- installable web apps
- beforeinstallprompt
- chrome
- web development
- user experience
title: Add to homescreen changes in Chrome 68 - Pete LePage

---
Pete LePage writes about important changes to Add to Homescreen in Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.

[Read full post](https://developers.google.com/web/updates/2018/07/nic68).

I had mixed feelings about this originally because so many people don't handle the `beforeinstallprompt` event it meant that all of a sudden the number of installs of Web APK's would drop quite significantly, but I think it's actually the right thing to do. 

The goal is to reduce the number of annoying prompts happening on the web, and the last thing that we need in the industry is for a relatively large prompt to appear when we think the user might want to install a PWA, instead you now need to think about where and when **you** want to prompt for an install and you have to do it in response to a user-gesture. 

The neat thing is that we (Chrome) are introducing more ambient ways of letting the user know that an experience is able to be installed, right now it's the small bottom bar that appears on the first load, and hopefully in the future we can explore more subtle ways of letting the user know they can take action.
