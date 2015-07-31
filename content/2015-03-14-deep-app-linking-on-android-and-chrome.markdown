---
slug: deep-app-linking-on-android-and-chrome
date: 2015-03-14
layout: post
title: "Deep App linking and changes to Chrome on Android"
description: "Deep App Links: Changes have come to Chrome and this is my summary of what's happened, why and how to manage the change"
categories: chrome deep-app-link android intent
---

I am fascinated by deep app linking.  On the web, we've never had the problem of identifying a piece of content and loading the resource behind it.  I say we have never had a problem, there have been many different ways to link to content, each with some trade-off, linking however has never been a problem.

Native on the other-hand hasn't got a consistent way across platforms to link from the web to an app or even app to app: iOS uses protocol schemes, Android uses Intents, Windows phone uses protocol schemes as well, and we've seen a number of start-ups appear to try and smooth cross platform linking system (I'll go into why I think this is shaky ground to base a business on in a future post).

A perennial problem that both web and native have is that you don't actually know if that target exists on other end of the link.  On the non-HTTPS web it's painfully common for ISP's to intercept lack of target on a link for their own needs, whilst this interception doesn't happen for apps, instead there has been a gap left open for Deep App Linking companies to step in and try and solve the problem.

A question came up recently, all centered around a change we made to Chrome on Android that frustrated some developers, but, I believe will make users happy. You can see a quick summary on Tapstream:

* [Why Has Google Broken Deeplinking on Android?](http://blog.tapstream.com/post/113470535413/why-has-google-broken-deeplinking-on-android)
* [Google’s Changes to Chrome Break Deeplinking To Prevent Abuse](http://blog.tapstream.com/post/113573591838/googles-changes-to-chrome-break-deeplinking-to)

*TL;DR* &mdash; sites were using a piece of functionality that we believe was broken in Chrome whereby when a user types in a URL in to the address bar and navigates to the web site, the site author would add a specially encoded link to the page and simulate a click on the link as follows:

    <a href="intent:some-intent-string" id="clickTarget">Open in our app</a>
    <script>
      window.onload = function() {
        var clickTarget = document.getElementById("clickTarget");
        var fakeMouseEvent = document.createEvent('MouseEvents');
        fakeMouseEvent.initMouseEvent("click", true, true, window,
            0, 0, 0, 20, 10, false, false, false, false, 0, null);

        clickTarget.dispatchEvent(fakeMouseEvent);
      };
    </script>

The reason why sites do this in most cases is that they want to push all users to the native app.  Personal philosophical issues aside, our position is clear: 

*  If a user enters a URL into the address bar of the system, then the intention of the user is to visit the page in question.  We don't believe that the user intended to go to the app.  Ergo, redirecting the user to the app is a poor user experience.

We believe it was a bug that this could be circumvented, so we have fixed it.

## So what works and what doesn't (or shouldn't work)?

Deep App Linking is an important concept and it hasn't changed much.

* If a user enters a URL in the address bar then Chrome will load the page. Redirects to non-HTTP and non-HTTPS schemes will be ignored.

That's clear. But there are a lot of other scenarios including when:

* A user clicks a link with an `intent:` scheme
* A user clicks a link with a protocol such as `pandora:` 
* A user clicks an HTTP link and is redirected

#### A user clicks a link with an `intent:` scheme

This is probably the most common scenario, but it has a couple of logic paths in it.

* If an app is installed that matches the intent Chrome will launch the app
* If the app is not installed Chrome will:
  * Look for an Intent EXTRA called `S.browser_fallback_url` and load that URL
  * Look for the package and load the PlayStore
  * Otherwise, No op

I have created a quick chart that shows the `intent:` resolution (mostly because I wanted to test out).

<img src="/images/intent-click.png" style="max-width: 50%; height: auto;">

#### A user clicks a link with a protocol such as `pandora:` 

Chrome will try to resolve the app, however if there is no app that can handle the Intent then Chrome will no-op and stay on the same page.

There is a way to mitigate this issue, use the `intent:` syntax to mitigate the issue. For example replace your `custom-scheme:` anchor with an `intent:/#Intent;scheme=custom-scheme;...` anchor.

#### A user clicks an HTTP link and is redirected

When a user clicks a link with an HTTP or HTTPS protocol and is subsequently redirected to an `intent:` based URL, Chrome will consider that a user triggered gesture and will allow the request to take place.  This includes at least the two following scenarios:

* An immediate HTTP 302 redirect to an `intent:` URL will resolve the intent.
* An synthetic link click within 1 second to an `intent:` URL will resolve the intent.

## Is there actually a problem?

Many Deep App Linking providers provide a service takes an HTTP URL, looks up what deep-link path the user should be sent to and then redirects the user to it.  So for iOS it might turn the link into a protocol based URL and for Android it would turn the URL into a `intent:` based URL.

All that has changed is that if the user types in the URL then it will load the page and not allow the redirect to a non-HTTP and non-HTTPS URL to occur.  Any other link navigation *should* be kept the same (i.e, click a link Android's intent picker should appear if an app can handle it).

*Side Note:* I am investigating if encoding &referrer=xyz into the package id is a bug or intended behavior.

## I saw mention of S.browser_fallback_url. What is it and how can it help?

One huge issue for Deep App Linking on all platforms is that if there is no App installed then the user has nothing to go to.  On Android, if you do it correctly, the user will be directed to the Play Store.  This certainly helps users as at least they have something to do on the end of a link, however if you wanted the user to read some content or perform an actions it is highly likely that you have lost that conversion.

Chrome will now look for an Intent EXTRA named `browser_fallback_url` which when specified will be used as the URL that Chrome will load when it can't find the app that the developer wanted to launch.

A while ago I created some detailed guidance of the [Intent syntax for web developers](https://developer.chrome.com/multidevice/android/intents), we are yet to update that but here is a run down of different solutions.

Originally an anchor with the following `href` would try to launch the app `com.google.zxing.client.android`

    intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;end

If the app wasn't installed, the presence of the `package=com.google.zxing.client.android` would direct the user to the Play Store to install the app.

The recent addition is called "Browser Fallback URL" and has been made to allow you to instead direct the user to a URL, this is important if you want to ensure that you have a high conversion rate (remember huge numbers of users drop off at the app install phase) and ensure that the user has some content to read.

It is simple to implement.  If you are using the `intent:` URL syntax, encode a `S.browser_fallback_url=` parameter in to the URL. The following example demonstrates a browser fall-back URL and shows you the referrer that will be shown if the App is not installed (hint it's the page that was the originator of the link click).

    intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fwww.whatismyreferer.com%2F;end

[Demo](intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=http%3A%2F%2Fwww.whatismyreferer.com%2F;end)

A good example of falling back to a real Web App with similar functionality:

    intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=https%3A%2F%2Fqrsnapper.appspot.com%2F;end

[Demo](intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=https%3A%2F%2Fqrsnapper.appspot.com%2F;end)

If you rely on the referrer being sent with your package ID, you can use the S.browser_fallback_url as a workaround.

    intent://scan/#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.google.zxing.client.android&%26referrer%3Dkinlan;end

Please note that the above is a workaround.  The fallback URL should be used for falling back to content, not the Play Store.

## TL;DR - What are the best practices for deep app linking?

This is *my* best practice and you have to understand that I am a webby at heart :)

* Use Android's built in Intent syntax.
* If you have a custom protocol schemes (such as `pandora:`):
  * Replace `custom-scheme:` with `intent:/#Intent;scheme=custom-scheme;...` 
  * Add `S.browser_fallback_url=yoururl` as it will allow a graceful fall back to a page
  * Add `package=xyz.your.package.id` parameter to take the user to the playstore
* Don't try to redirect without a user gesture.

## Accuracy and Veracity 

This information is "accurate" as of March 2015.  As always this could change again in the future.  Please leave a comment if you find an issue. 

If you want to understand exactly how the URL handling works visit check out the [shouldOverrideUrlLoading](https://code.google.com/p/chromium/codesearch#chromium/src/chrome/android/java/src/org/chromium/chrome/browser/externalnav/ExternalNavigationHandler.java&q=browser_fallback_url&sq=package:chromium&l=77) methodd