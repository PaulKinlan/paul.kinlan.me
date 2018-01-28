---
slug: every-browser-should-support-intent-urls
date: 2016-01-11T13:20:32+01:00
title: "Every browser should support a style of 'intent:' URL syntax"
description: ""
image_header: "/images/android_intents.jpg"
---

The URI is a handy thing, it's kind of like a Command Line Interface. A URI lets 
you target a site or an app and pass it data and then see a result in some form.

Nearly everyone will know and understand that to load a web page we enter `http://` or
more recently (and more importantly) `https://`, but Apps can also be targeted directly 
with a custom form of the 'https' prefix called a custom scheme. For example `mailto:` 
based URL's will open up the users default mail client when the user clicks a mailto 
link. For many pre-approved schemes, the browser can also register a web app to handle
the custom scheme so that every time the URL is clicked either on a site or in an app
on the user's system it will open the web site.

This all sounds great, after all every platform supports these URL schemes, but they're not 
without a huge number of problems.

#### The problem with custom schemes

There are two classes of problems that I am thinking about right now.

General problems across all platforms (Web and Native):

* Zero confidence: A user sees a link and they click it. If there is no app
  to handle the interaction on the user's system, there is nothing the user can do.
* There can only be one app that can handle the scheme. Yes, Android doesn't have this 
  problem, every other platform does.
* Data flows only one way, there is no standard facility to get data back into the calling app
* No strict schema to validate you are passing the correct data (this might be a blessing)
* It is semantically ambiguous, by opening the link is it a GET, POST, PUT, DELETE?
* Complex data forms are hard to transport. Want to attach a file? you can only include
  a textual link to it.

and Web problems:

The browser in particular is a second class citizen in this ecosystem.

* Mobile support is very weak: No mobile browser I know of allows web apps to 
  participate in the custom scheme ecosystem, most browsers on mobile don't allow a 
  site to register for any "spec allowed" schemes either.
* New schemes &mdash; say `twitter:` or `facebook:` which any app can naturally register &mdash;
  can't be registered by websites unless you prefix the scheme with a `web+` (`web+twitter`).  No 
  native app is going to register this, therefore no link
* Only a URL can be dynamically substituted into the URL via a single `%s`

#### What does a good solution look like.

I recently described a solution in "[Service discovery and app interactions on the web](/service-discovery-on-the-web/)"
but to summarize:

* Give the user choice of the service they want to use either on the web or native
* Let the developer target a service but fallback to the generic system
* Support a variety of different data transport mechanisms depending on the service
* Allow web sites to register with the system so that they can be opened from apps
* Function Online and Offline.

And then I followed it up in "[Launch an Android app from the web and cleanly fallback to web](/launch-app-from-web-with-fallback/)":

* Doesn't encode a service directly into the URL (e.g, I don't want all my links to be https://twitter.com if I am sharing something)
* Is a normal URL so that it works across platforms
* Requires no JS so that it works in all browsers (progressively enhanceable)
* Can enhance up to the intent: syntax to integrate with native platforms when supported

I think the biggest piece I missed out is that a solution should require minimal change and impact
on the existing ecosystem, every URL scheme should still work.

#### Standardizing around `https:`?

I have recently discovered a [little way around the custom scheme fallback problem](/launch-app-from-web-with-fallback/) 
by taking advantage of plain old "https" URL's and they work pretty well.

Plain old web URL's are fine for web->web interactions too especially if you know the integration that you are
pointing too.  If we open a new window we can `postMessage` to it, if
we don't open a new browser window we can also POST and PUT to it them etc using standard REST semantics.

But they also have problems. Both Android and Apple have models for a site owner to claim 
that their app is able to own an entire URL space. This means Twitter could say that they are the
owner of twitter.com and then present a new style User-Agent if the user already has it on their system.

There are also issues with offline interactions which I think Service Worker can help alleviate, but there
is always an HTTP request and round trip that needs to be made to do the service resolution.

One of the biggest issues with domain name interception is that an origin on the web expects to be the 
owner of domain expects to control the address space it encompasses and anything that intercepts that 
is a bad actor. If the user visits the domain they expect to see the site or use the official app. The domain 
and paths in the origin are sacrosanct in that respect.

Anecdotally, apart from `mailto`, `feed` and `tel`, the custom scheme protocol is frequently used by site owners to open up
their own native application.  These custom schemes inside native apps don't support REST based 
interfaces nor can they, and they certainly do not support JSON message passing, therefore out of the pure
URI string in the custom scheme there is no easy way for site and apps to talk to each other on the device.

#### What else is out there?

[Indie-web actions](https://indiewebcamp.com/webactions) focuses currenlty mostly on social sharing and
syndication of content, whilst not currently thinking about the ecosystem of installed apps.  I have a 
strong sense too that like WebIntents it has been over-engineered early on and defined an HTML
syntax (albeit through the use of Web Components) and a requirement for a configuration service for 
the `web+action:` action scheme to help ensure there is an endpoint to call.

It has some good attributes: the web+action scheme is/was the start of an interesting exploration,
 some custom markup that allows you to encapsulate and customize the data that will be sent to the service 
 is looks interesting too, but I think still over-kill.

#### Why Android's Intent URLs are a good candidate to build on top of?

The best way to think about what an intent is that is an abstract description 
of an operation to be performed by the user. It is an Android feature so whilst it is not
directly portable to other platforms it sits as a layer above what we have on the web, that is
it by default is agnostic to "scheme" and data types, but can be made to be more specific depending
on the needs of your application.

An intent URI has the following layout (all optional - heh!)

<pre>intent:
   HOST/URI-path // Optional host 
   #Intent; 
      package=[string]; 
      action=[string]; 
      category=[string]; 
      component=[string]; 
      scheme=[string]; 
      type=[string]
      S.*=[string];
   end; 
</pre>

The interesting thing for me is that it is just a URL yet it bridges the existing `registerContentHandler`
and `registerProtocolHandler` Web based APIs.

Consider the following: `intent:+44123#Intent;scheme=tel;end` - this would dial the talking clock in the UK and 
is equivalent to `tel:+44123`.  Ok that is some standard functionality of any phone, but what about an
app that isn't installed on every device.  Let's take Twitter: `twitter://user?screen_name=paul_kinlan`, this
would open up the Twitter app on the user page, however if there is no App, nothing will happen.  You would
ideally want this to fallback to Twitter's web site.  [You can get that with the intent syntax](https://jsbin.com/rupaxu/latest):

    intent://user?screen_name=paul_kinlan#Intent;scheme=twitter;S.browser_fallback_url=https%3A%2F%2Ftwitter.com%2Fpaul_kinlan;end

That is custom schemes out of the way with a sane fallback, but what about Content-types? i.e I want to open a 
video in a custom app?  `intent:` syntax has that [solved too](http://stackoverflow.com/questions/34516817/open-video-url-in-native-player-from-google-chrome/34619131#34619131):

    intent://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4#Intent;action=android.intent.action.VIEW;scheme=http;type=video/mp4;end

Cool, how about I just want to open up the twitter app?

    intent:#Intent;package=com.twitter;end

There is so much you can do with the `intent:` URL format, but the critical thing to remember is that 
the `intent:` syntax has abstracted away the underlying means for discovering the service, as a developer
I can put in any constraint that I want and the system will resolve it for me and find an app that can handle it or
fallback to a web solution.

#### What next?

There is certainly scope to do a deeper investigation on a custom URI scheme that is transportable across
 browsers and operating systems and supports all of the above criteria.  

Right now, the web can't play in the `intent:` URL space, the browser doesn't respond to `intent:` URL's
unless directly called via the system (`intent://paul.kinlan.me#Intent;package=com.chrome.beta;scheme=https;end`) and
it certainly can't yet have generic web apps be able to handle an intent.

There is some spec work certainly needed and I don't particularly want to design this on my blog, but
I was thinking of breaking it in to a unified way to resolve services, and a universal way to register your site
with the system to handle services.

**Resolve a service**

We should create a new custom protocol scheme (`/me ducks and runs`) called `action:` whose goal it is to map to 
the existing underlying ways to launch apps.  The action scheme would look similar to the intent syntax 
but won't be Android specific. Therefore it should support a way to:

* Launch a service on the system that can handle other custom schemes, such as `twitter:`, `tel:`, `yourservicehere:`
* Launch a service that can open a specific type of content-type such as `pdf`, `word doc` etc.
* Launch a service that can handle any level of specificity of schemes and data types.
* Support a developer defined callback for the app to call with return data
* Support a developer specified fallback for the times when there is no app on the system
* Provide a way to embed extra meta data in the request derived from the page (over and above the URL)
* Doesn't trash the existing ways developers talk to apps and can be integrated into to existing platforms

If we could solve this part, we have moved along way in to making bridging the gaps between services, 
however we as web developers want the web to have an equal footing in the ecosystem.

**Registering a service**

We want our web apps to be on a level playing field on the users device so we need some way of defining 
the capabilities of the web experience so that the operating system and other platforms can present
our sites as an option for the user to integrate with.

*  A site should be to register the current site imperatively as a handler for an action maybe via an API like `navigator.registerHandler`
*  A site needs to be able to declaratively present the services it can offer quite likely via the Web App manifest

#### Final thoughts

I am pretty open to any solution that helps solve the issues we have and brings the Web and Apps together, 
but I do believe that the solution has to work well in the existing ecosystems.  

The proposed solution here is not without issue. For one, the `action` scheme should really 
be a `web+action` so that it can be polyfilled.
