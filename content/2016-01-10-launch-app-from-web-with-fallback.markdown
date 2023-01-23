---
slug: launch-app-from-web-with-fallback
date: 2016-01-10T12:20:31.000Z
title: "Launch an Android app from the web and cleanly fallback to web"
description: ""
tags:
- intents
---

I was writing about [Service Discovery](https://paul.kinlan.me/service-discovery-on-the-web/) the other
day and I have some thoughts about how we can do inter-app communication on the web 
more effectively than what we can today.

Interactions between web and web, web and apps and apps and web is something that 
many of you may know that I am passionate about, but it is incredibly hard and using
the [intent](https://developer.chrome.com/multidevice/android/intents) syntax in Android
is a great start but has huge problems because it is not portable.

Intents on Android allow the user to use apps and services of their choice to complete actions
offered by the App they are currently using and all the developer has to do is 
indicate the intent of the user to the system when they start the task. Intents such as 
[SEND](http://developer.android.com/reference/android/content/Intent.html#ACTION_SEND) (read: Share), 
[CALL](http://developer.android.com/reference/android/content/Intent.html#ACTION_CALL), [PICK](http://developer.android.com/reference/android/content/Intent.html#ACTION_PICK) and
[EDIT](http://developer.android.com/reference/android/content/Intent.html#ACTION_EDIT) are all common actions
that can be fulfilled by other apps on the users system.

The web on Android also has the ability to participate in this system too through the use
of `intent:` syntax URLs.  

<pre>intent:
   HOST/URI-path // Optional host 
   #Intent; 
      package=[string]; 
      action=[string]; 
      category=[string]; 
      component=[string]; 
      scheme=[string]; 
   end; 
</pre>

The format of these URLs is pretty simple and an example of a real URL that you can use is: 
```
intent://#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=http://test.com;S.android.intent.extra.SUBJECT=Test;end
``` 

This will let us launch an app from the web that supports sharing plain text (think Twitter, Facebook link sharing) and pass
data into the app that the user chooses. Whilst cool, this URL has a number of problems:

1. It is not portable. Try this on a desktop or iOS.
2. If the user is on Android and doesn't have an app installed that can handle the intent it won't work.

Let's deal with point 2 first. In Chrome 40 [S.browser_fallback_url](https://paul.kinlan.me/deep-app-linking-on-android-and-chrome/) was introduced to all an intent to resolve
to a web page if there is no app available to handle it.  This is great for Android, it means that 
we can provide a web based fallback when there is no app available.  But what about the massive issue of zero 
cross platform support?

Intent URL syntax has very clear benefits for Android users but unless every user has an app that 
can handle the `intent:` URL scheme or every platform adds the ability to handle the `intent:` URL syntax 
then it is not really a viable system to use for linking the web with the user's preferred apps.

I have been playing around with what we can do to bring a little bit of sanity to this situation. Ideally we
want a solution that:

* Doesn't encode a service directly into the URL (e.g, I don't want all my links to be https://twitter.com if I am sharing something)
* Is a normal URL so that it works across platforms
* Requires no JS so that it works in all browsers (progressively enhanceable)
* Can enhance up to the intent: syntax to integrate with native platforms when supported

Before I get too deep, I will say that the solution I am going to talk about is only for the action of
Sharing. Sharing is a concrete use-case (many sites have many widgets for sharing on) and has a wide range of 
services that can be integrated with. 

For this Sharing hack, I have made the following assumptions:

1. The user if all else fails will share to one endpoint such as Twitter or some other service.
2. If the platform supports Intents, users will prefer to use their system
3. Only Android supports intents :\
4. No user state of preferred services will be hosted or stored

The first solution I created was a JS plugin along the lines of the following code.

```
encode all service integrations with intent: syntax and S.browser_fallback_urls

onload => if not Android convert all intent: to normal URLs by parsing out S.browser_fallback_url
```

It worked, but it was very crappy. It required JS, could block the main UI thread and potentially needed
lots of DOM manipulation. I had a little think and remembered that if the user directly invokes an action
that triggers a navigations to an `intent:` URL then it will be resolved, this includes a navigation to a URL
that subsequently 302 redirects to an `intent:` URL. 

This is promising.  If I can do a redirect to `intent:` urls then I can encode sharing logic in a 
standard URL that redirects to a Sharing service (Twitter) and for Android users will still support the 
abilities of the `intent:` URL.

I set up a new Server on my host (I use nginx) that if the User Agent is Android then trigger.

```
server {
    listen 443 ssl http2;
    server_name share.kinlan.me;
  
    location / {
        if ($http_user_agent ~ Android ) {
          return 302 'intent://#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=$arg_url;S.android.intent.extra.SUBJECT=$arg_text;S.browser_fallback_url=https://twitter.com/intent/tweet?text=$arg_text&url=$arg_url;end';
        }
        
        return 302 https://twitter.com/intent/tweet?text=$arg_text&url=$arg_url;
    }
    
    # ... rest of my config and SSL configy
}     
```

Check it out: [https://share.kinlan.me/?text=woot+woot&url=https://paul.kinlan.me](https://share.kinlan.me/?text=woot+woot&url=https://paul.kinlan.me)

There is a lot that can still be improved with this approach &mdash; such as the ability for the user to choose
a preferred service with no central registry service &mdash; but there is also a lot to like too:

* For non-Android users it will always resolve to a web service
  * If the OS supports URL hijacking (see iOS and Android) the native app can intercept the request - for example
    for Twitter URLs the Twitter App will be opened.
* For Android users it will open the picker for sharing, if there is no app it will always resolve to a web service (uses browser_fallback_url).
* No server side "code", it is just currently configuration which can be changed quickly

Have any suggestions, critiques or ideas then leave me a note.