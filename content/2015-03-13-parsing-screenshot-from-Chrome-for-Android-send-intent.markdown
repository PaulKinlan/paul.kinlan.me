---
slug: parsing-screenshot-from-Chrome-for-Android-send-intent
date: 2015-03-13
layout: post
title: "Parsing the screenshot that Chrome for Android includes via ACTION_SEND intent"
description: ""
categories: android intent screenshot
---

You know when you are reading the News and you see something about something you are working on and you have a "Huh?!?! We did that?" moment.

That happened to me today with an article about [on Android Police about Chrome 42](http://www.androidpolice.com/2015/03/13/chrome-v42-automatically-includes-a-screenshot-when-you-share-a-webpage/) about Chrome now including a screenshot with the intent.  I worked a lot on Chrome 42 and I had no idea about this.  We were working on Push, Notifications and also App Install banners that sometimes someone's great feature is missed.

Well it turns out sharing Screenshots from Chrome is not new.  I have heard folklore that the old Android Browser used to have an Extra field called "EXTRA_SHARE_SCREENSHOT" - but I have no idea if that is true or not.

In lieu of us actually getting documentation, samples, "thought leadership" and all the other things (read: gubbins) that you expect a Developer Relations for Chrome organisation to do I might as well bite the bullet and create something.

It's quite simple. Like most apps on Android that want to share data, when the user clicks "Share to" in Chrome an ACTION_SEND Intent is fired with a url and a title. Chrome also uses an Extra as a stream containing the URI of the Screenshot.

The code that Chrome uses to trigger the intent is roughly this:

    Intent intent = new Intent(Intent.ACTION_SEND);
    
    intent.setType("text/plain");
    intent.putExtra(Intent.EXTRA_SUBJECT, titleOfPage);
    intent.putExtra(Intent.EXTRA_TEXT, urlOfPage);
    intent.putExtra(Intent.EXTRA_STREAM, screenshotUri); // This is actually a URI to a file that stores the screenshot

Under the hood the system is taking a screenshot and then saving it to a file and then sharing that URI for the file to the other apps.

>  I don't always create Android Apps, but when I do it's all for Chrome and the Web.

A huge number of apps handle [recieving Share intents](http://developer.android.com/training/sharing/receive.html).  I'll only quickly run over this, because I suspect most Android developers are intimately familiar with this.

Add an intent filter to the approriate activity in your Manifest:

    <intent-filter>
      <action android:name="android.intent.action.SEND" />
      <category android:name="android.intent.category.DEFAULT" />
      <data android:mimeType="text/plain" />
    </intent-filter>

In the onCreate method of the activity that should handle the intent you need to parse the data.  I will say that I am making a lot of magical assumptions that every intent of type "text/plain" has the URL of the page etc, but hold in with me, I am a web developer after all.

    void onCreate (Bundle savedInstanceState) {
      
      // Get intent, action and MIME type
      Intent intent = getIntent();
      String action = intent.getAction();
      String type = intent.getType();

      if (Intent.ACTION_SEND.equals(action) && type != null) {
        if ("text/plain".equals(type)) {

          String titleOfPage = intent.getStringExtra(Intent.EXTRA_SUBJECT);
          if (titleOfPage != null) {
              // Update UI to show we know the Title of the Page.
          }

          String urlOfPage = intent.getStringExtra(Intent.EXTRA_TEXT);
          if (urlOfPage != null) {
              // Update UI to reflect url of the text being shared.
          }
        
          // Handle single image being sent
          Uri imageUriOfPage = (Uri) intent.getParcelableExtra(Intent.EXTRA_STREAM);
          if (imageUriOfPage != null) {
              // Update UI to reflect image being shared.  Here you would need to read the
              // data from the URI.
          }
        }
      }
    }

If you are interested in the change that sparked the article, look at [bug 455996](https://code.google.com/p/chromium/issues/detail?id=455996) and see the [diff](https://codereview.chromium.org/972293003/diff/40001/chrome/android/java/src/org/chromium/chrome/browser/share/ShareHelper.java), I have also found this [tutsplus tutorial](http://code.tutsplus.com/tutorials/android-sdk-receiving-data-from-the-send-intent--mobile-14878) helpful..