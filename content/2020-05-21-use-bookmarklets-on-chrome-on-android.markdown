---
date: 2020-05-21 16:20:28.560000+00:00
link: ''
slug: use-bookmarklets-on-chrome-on-android
summary: For years, I thought bookmarklets weren't supported on Chrome for Android.  Turns
  out, they are!  You just need to access your bookmarks through the address bar,
  not the Bookmarks menu. This method retains the page context, allowing your bookmarklets
  to execute JavaScript properly.  This opens up new possibilities for customizing
  web pages on Android.
tags:
- bookmarklets
- chrome
- android
- mobile browsing
- web customization
title: Use Bookmarklets on Chrome on Android

---

I love Bookmarklets, they let you quickly customise web sites in a lighter way than a Chrome extension, and for the longest time (5 years), I thought it wasn't possible to run Bookmarklets on Chrome on Android.

It turns out, I was wrong. You just can't run them the traditional way.

The way that most people access Bookmarks on Android doesn't let you run a Bookmarklet, i.e, via "Select Bookmarks" in the main menu;

<figure><img src="/images/2020-05-21-use-bookmarklets-on-chrome-on-android-0.jpeg" alt="Accessing Bookmarklets via the menu"></figure>

And then then picking their bookmark from the list of bookmarks

<figure><img src="/images/2020-05-21-use-bookmarklets-on-chrome-on-android-1.jpeg" alt="A List of bookmarks"></figure>

This is because Chrome on Android seems to have no knowledge of the current page the user is on, and therefore can't execute JavaScript against that page.

I was today years old when I learnt that you can find bookmarks via the Address Bar, and they keep the context of the current page. This means that you can run Bookmarklets.

<figure><img src="/images/2020-05-21-use-bookmarklets-on-chrome-on-android-2.jpeg" alt="Accessing Bookmarks in Chrome via the address bar"></figure>

Voila.

Now that I know you can use bookmarklets via the address bar, this opens up a lot of options for slightly deeper customisation on Android than what is possible today.

