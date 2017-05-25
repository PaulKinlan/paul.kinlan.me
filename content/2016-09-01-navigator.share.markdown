---
slug: navigator.share
date: 2016-09-01
title: "Simple sharing on the web with navigator.share"
video_url: /videos/navigator.share.mp4
---

Many of you know that I am passionate about [inter-app communications](https://paul.kinlan.me/what-happened-to-web-intents/), specifically
the action of sharing. One of the things that I have encouraged anyone who wants to do the next version of Web Intents to do
is focus on a very small and specific use case.

Well Good News Everybody. Matt Giuca on the Chrome team has been working on a [simple API](https://github.com/mgiuca/web-share/blob/master/docs/interface.md) ([Web Share](https://github.com/mgiuca/web-share/blob/master/docs/explainer.md)) that has the potential to connect websites with native apps 
and also and it is in Chrome Dev Channel on Android to test. The great thing is that Matt and team have also been working on making it 
[possible for your own web site or service to be registered as a native share receiver](https://github.com/mgiuca/web-share-target) thus 
enabling web->app sharing, app->web sharing and web->web sharing.

It's all still early stages, but I think it is worth testing out and giving us as much feedback as possible whilst this is getting developed. You can get all the relevant information at [ChromeStatus](https://www.chromestatus.com/features/5668769141620736), but
to save you a click here are the important links:

* [Launch Tracking bug](https://crbug.com/620973)
* [Intent to implement](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/1BOhy5av8MQ/8LqNvS5TAQAJ)
* [Sample](https://github.com/mgiuca/web-share/blob/master/docs/explainer.md)
* [Share explainer](https://github.com/mgiuca/web-share/blob/master/docs/explainer.md)
* [Share target explainer](https://github.com/mgiuca/web-share/blob/master/docs/interface.md)

I am incredibly excited by this API. It opens an entirely new part of the ecosystem up to web developers and if
the Sharing API works well then the model can be extended to other app to app interactions.

### How to get this working.

1. Get [Chrome Dev Channel on Android](https://play.google.com/store/apps/details?id=com.chrome.dev&hl=en).
2. Toggle chrome://flags/#enable-experimental-web-platform-features
3. Go to any page on my blog and click the share button at the end of each article.
4. Share.

```
 navigator.share({title: document.title, text: window.location.href, url: window.location.href})
          .then(() => console.log('Successful share'),
           error => console.log('Error sharing:', error));
```

### Here is how I have integrated it into my blog.  

1. Check to see if the API is available, if not fallback to my [existing solution](https://paul.kinlan.me/sharing-natively-on-android-from-the-web/)
2. Wait for the content to be available and then find the sharing element
3. Intercept and consume the click
4. navigator.share()

```
if(navigator.share !== undefined) {
    document.addEventListener('DOMContentLoaded', e => {
      var shareBtn = document.querySelector('div.share a');
      shareBtn.addEventListener('click', clickEvent => {
        clickEvent.preventDefault();
        navigator.share({title: document.title, text: window.location.href, url: window.location.href})
          .then(() => console.log('Successful share'),
           error => console.log('Error sharing:', error));
      });
    });
}
```
