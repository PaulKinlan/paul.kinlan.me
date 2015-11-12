---
slug: sharing-natively-on-android-from-the-web
date: 2015-11-11T12:20:31+01:00
title: "Triggering a native Share intent on Android from the web"
description: "This story starts a long time, was tickled into existing after I visited FlipKart
in Bangalore and was finalized after an internal conversation about the fact that
it is impossible to trigger the share dialog in Android from the web.  Lots of people
want it, it turns out everyone thought it wasn't possible.  It is.*"
image_header: "/images/intent.png"
---

This story starts a long time, was tickled into existing after I visited FlipKart
in Bangalore and was finalized after an internal conversation about the fact that
it is impossible to trigger the share dialog in Android from the web.  Lots of people
want it, it turns out everyone thought it wasn't possible.  Any how.....

I have fond memories of Web Intents and what it could have been.... Ok, I won't
lie, I cry in to my cup most nights about its failure.  

Web Intents modeled the successful Android Intents ecosystem pretty closely and
the primary use-case for Web Intents, like Android, was to provide a good sharing experience 
on the web. Rather than have a sea of social widgets on your page &mdash; one for each service
a user might use &mdash; you have a single button that the user clicks to 
share some content and their OS or browser will decide how to show a list of services 
that can fulfill the users request.  It was a glorious idea, 
[even if I do say so myself](https://en.wikipedia.org/wiki/Paul_Kinlan).

Skip forward, the Web Intents project is dead, Android is incredibly popular and 
already has an ecosystem built around sharing between apps.  The most powerful attribute
of Android Intents in my opinion is that for most parts an Intent can be encoded as a 
simple URL using the `intent:` scheme. Chrome and every other browser on the platform
support.  However the only time it used on the web is to open up a user's installed native
app. For example: [intent:paul.kinlan.me#Intent;scheme=https;package=com.chrome.beta;end](intent:paul.kinlan.me#Intent;scheme=https;package=com.chrome.beta;end) 
will open my site in the Chrome Beta browser on Android.

The interesting thing is that you can't just open any app on the users device. The app
has to say to the system that it can be opened from the web by including 
`<category android:name="android.intent.category.BROWSABLE" />` in the intent-filter.

A fuller example of what might be included in the Android Manifest follows.

    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
    </intent-filter>

This is interesting, if you know Android you know that [ACTION_SEND](http://developer.android.com/reference/android/content/Intent.html#ACTION_SEND) 
is by far the most popular Action and it is used mostly commonly for sharing data between apps.

In fact, Chrome itself fires an ACTION_SEND when the user chooses to share from inside
the Chrome App and if you have the following declaration in your Android Manifest your
app will appear in the Chrome Intent picker.

    <!-- Used to handle Chrome then menu then share.-->
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:mimeType="text/plain" />
        <data android:mimeType="image/*" />
    </intent-filter>  

So. Big question. Does this just work from the web if I craft the correct looking
`intent` url?

No. Well. Yes. But.... the apps that handle link sharing need to declare
`<category android:name="android.intent.category.BROWSABLE" />` and right 
now none do (that I can find) and they will need to define the following in 
their manifest:

    <!-- Used to handle Chrome then menu then share.-->
    <intent-filter>
        <action android:name="android.intent.action.SEND" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:mimeType="text/plain" />
        <data android:mimeType="image/*" />
    </intent-filter>  

Now, when apps have this it is pretty easy to open up Native Sharing
from Chrome on Android.

So let's build up a share button.

#### 1. Create a basic share experience

Trigger the intent picker with using ACTION_SEND. Note: no data will be sent yet, it
will just list apps that have said they can receive text (a URL for example).

[intent:#Intent;action=android.intent.action.SEND;type=text/plain;end](intent:#Intent;action=android.intent.action.SEND;type=text/plain;end)
  
#### 2. Add a link to the share

Add some data by encoding a String EXTRA_TEXT in to the Intent, for example: `S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F`

[intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;end](intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;end)
 
 
#### 3. Add a Subject

We can also flesh out some extra information that you can send across to the app.  For example 
Android lets you specify a "Subject" in the Intent, for example: `S.android.intent.extra.SUBJECT=Amazing`

[intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;S.android.intent.extra.SUBJECT=Amazing;end](intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;S.android.intent.extra.SUBJECT=Amazing;end)
  
#### 4. Fallback to a webpage if there are no apps installed.

Quite frequently the user might not have any apps installed that can handle the request.  In this
case you will want to fallback to a web url that still allows the user to complete the task.  This
can be achieved by add in an `S.browser_fallback_url` Extra.  In the following link the fallback
is Twitter's sharing widget.

[intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;S.browser_fallback_url=https:%3A%2F%2Ftwitter.com%2Fintent%2Ftweet;end](intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=https%3A%2F%2Fpaul.kinlan.me%2F;S.browser_fallback_url=https:%3A%2F%2Ftwitter.com%2Fintent%2Ftweet;end)

#### That's a wrap or what comes first? The chicken or the egg.

Technically we have all the pieces. Our biggest challenge is not the URL string 
but the fact that Android apps for our favorite social sites and communications
apps need to be updated.  Once they are then this is a great way to invoke a sharing 
experience from the web.

My ideal solution is that one or two apps update their manifest and a couple of big
players on the web commit to making creating an intent share URL for Android.