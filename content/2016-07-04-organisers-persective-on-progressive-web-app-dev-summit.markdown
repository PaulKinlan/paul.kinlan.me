---
slug: organisers-persective-on-progressive-web-app-dev-summit
date: 2016-07-04T14:20:32+01:00
title: "An organizer's perspective on Progressive Web App Dev Summit"
description: "TL;DR - Went well. Lots to learn."
image_header: /images/pwa_summit_green_room.jpg
---
I always meant to do this for the Chrome Dev Summit's but I never got around to it.  Now that the US
is on vacation due to July 4th I have some time :)

I had the pleasure of recently organizing the [Progressive Web App Dev Summit](https://events.withgoogle.com/progressive-web-app-dev-summit/)
in Amsterdam this June and I think overall it went well. Here are some [attendee](https://hiddedevries.nl/en/blog/2016-06-22-progressive-web-apps-dev-summit)
[thoughts](https://adactio.com/journal/10866) and [comments](https://medium.com/@trajchevska/pwa-and-the-future-of-web-2c43c1434875?platform=hootsuite#.5h32kouha)

<figure>
<img src="/images/pwa-summit-audience.jpg">
<figcaption>An audience</figcaption>
</figure>

Before I go any further, I just wanted to quickly say a huge thank you to our Day 2 speakers
who all quickly turned around some great presentations after we realised that our 2nd
day logisitcs of "All day Codelabs" was not going to be possible.

* Patrick (pDiddy) Kettner and Ali Alabbas from Microsoft 
* Dan Appelquist and Jungkee Song from Samsung
* Andreas Bovens from Opeara
* Ben Kelly from Mozilla
* Jesse Yang from Booking.com
* Andrew Mori from Konga
* and Jeremy Keith who excellently moderated the panel.

It really was amazing to see how the industry come together so quickly and start to present
a strong shared vision and story for one way that we believe will make a better web for users. (Obviously, I love all 
the Google speakers we had, but they get my thanks privately ;)

I will be using a lot of *I*, *me*, *my* and *myself* pronouns in this, but I do want to be extremely clear
that there was a massive team behind this event including: Chris Wilson!, Planners (Vanessa gets a special mention), Speakers, Video team (who
managed to get the videos up a couple of hours after each talk) and the entire event staff.

### Vision for the event

I've planned 2 Chrome Dev Summit's and this event (as well as helping with the content narrative
at Google I/O - don't mention 2015!!!) and the biggest thing that we do as a team is to define
a set of goals and a structure for the event and then an incredibly tight narrative (I very very
rarely do a call for papers).

__Goals__:

I've learnt a lot over the past year seeing developers build progressive web apps and with that in
mind I had a set of goals for what I wanted developers to take away from the event and what we have
learnt:

* PWA present a good model for thinking about the way we should be building experiences on
  the web.
* Everyone is learning: users, developers, browser vendors,  
* This works everywhere even if "it doesn't work on iOS"
* This works irrespective of your framework of choice
* This works for everyone and is already showing benefits to users
* AppShell is one way you can build a progressive web app, not *the only* way.
* Sometimes it can be tough to do on an existing site, but possible.
* A PWA is an end-goal, the route you take to get there is up to you. One thing that I have learnt
  is that you can present value to developers and businesses incrementally and every single
  piece that the developer builds improves the web for users, and this thinking is how 
  we defined the event structure

It is this last point that is defining my teams plans for the year.  We all want a better web,
even if you never build a Progressive Web App or you don't buy into the vision, in isolation
all of the things that you can do on the road to a PWA benefit you and users long term (I will talk about this in
the narrative bit).

__Structure__: 

I am very keen for developers to learn about a technology and then have the opportunity
to immedidately put it in to practice. The great thing about running events is that that we can do this. 

The original plan for the event was Day 1: All things PWA, Day 2: All day
codelabs with our team supporting developers along the way. This is a very very powerful
model that I do encourage other events to follow (maybe not to the same extreme).  *However*
we couldn't run it fully this way. 

The second day only happened by the grace and goodwill of many people and I am humbled to work with you all
in this industry.  If I had my planning time again, Day 1 and Day 2 would be much more merged together in
terms of content.

__Narrative__:

I think that the Progressive Web App model presents a strong and relatively opinionated way
to think about how you will build for the web and how to use the technologies that are in 
the browser to build a great experience for your users.  

I know that not everyone thinks that it is a good model or it should be the only model, and 
I think that is ok.

I am very keen to see developers build Progressive Web Apps, however in many cases developers
don't get there overnight. If you are building a new app, great, you could probably follow
the AppShell model and get a great experience quickly, however I am certain that 99.9% of
developers live with existing legacy code bases and projects so you will need
to do things progressively and incrementally. I wanted to try and address this in the event so 
we tried to answer the following questions.

Sites, Pages and Apps should be:

* Secure: The web needs to be on HTTPS and developers need the tools, guidance and support to 
  move to HTTPS.
* Fast: Sites, Pages and Apps should load instanlty and operate smoothly at 60 FPS.
* A great user experience: They should work on all device form factors and device capabilities 
* Engaging: We should be able to access the parts of the native platforms that bring users back

The above is a subset of the PWA story but generally follow the structure of our Web Fundamentals
guidance and also the flow of the event.

* Why: Keynote and Building for Billions (this is available everywhere).
* How: Service Worker and Steams
* Secure: Move to HTTPS!
* Great UX: Fast loading sites with HTTP/2, Smooth UX and UI, Web Components help you develop quickly and accessibile sites for everyone
* Engaging: Web Push and future platform features
* Available Everywhere: Progressive - Works everywhere, Tools to support you, and you can build with any framework 

That was the plan and I think it came across. 

With all that being said, my underlying goal is to improve the web for users and if all you and your business 
can do in the next 6 months is move to HTTPS, Great! If all you can do is notifications, even better - get 
users enagaged and keep coming back to the web, etc etc.

Each of these incremental improvements opens up more opportunities for you and your business and for your users, 
for example: 

* Move to HTTPS: 
  * User Benefit: your users are more secure and you can trust that what they see is what you sent
  * Your Opportunity: 
     * You can move to HTTP/2 and your users sites load quicker (given work). 
     * You can integrate a Service Worker for content caching (your sites load even quicker)
     * You can integrate a Service Worker for added resiliance (your sites work where ever the user is)
     * You can integrate a Service Worker and then implement Web Push.
* Add in Web Push:
  * User Benefit: Users get timely, important and relevant information and come back to your site.
  * Your Opportunity:
     * You can in the future move to headless interactions and the user never opens your site but interacts with your service
     * You can integrate a Service Worker and partial offline support so that when a user clicks a notification the content is available instantly
        * Once you have partial offline support, you will find it easier to incrementally make your entire experience offline available.

The list goes on and I will save that for another post (I have a lot to say in this space :)

### Scaling Globally

I am going to save this for another post, but I just wanted to quickly thank our GDG (Google Developer Group) organisers globally for
quickly aranging viewing parties and running external events to complement this. We had 30 events run across Africa on the
day of the event. There are events still running right [now](https://developers.google.com/events/5488604060319744/) ;)

I am incredibly humbled by the support and I hope we helped you!

### Lots of things to improve

There are always many things to improve.  We haven't yet had a full post-mortem yet. But there were a couple of things
that I noticed.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/pwadevsummit?src=hash">#pwadevsummit</a> is HUGE! And still impeccably organized. Fantastic catering. But damn it&#39;s such a sausage fest! Looks like &lt; 1% women…</p>&mdash; (((Lea Verou))) (@LeaVerou) <a href="https://twitter.com/LeaVerou/status/744836780457877504">June 20, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I don't have the numbers in front of me, but I wouldn't be surprised if it is in that order of magnitude. Chrome
Dev Summit in the past was roughly 13% female attendees. We can do better, we must do better and I can 
promise everyone that we are and will be working on making this happen.

The second day only happened by the grace and goodwill of many people and I am humbled to work with you all
in this industry.

### Will there be another Progressive Web App Dev Summit?

Something great happened (in my eyes at least) and as I said earlier I am indebted to everyone involved, but I love
that we as an industry got the chance to start to present this as a vision that we all share. It felt great to 
see Samsung, Mozilla, Firefox, Opera, Microsoft and ourselves start to come together for developers.

So in short, I hope so! :) 

One of the things that I am keen to push for is to share this with all of the other browser
vendors and community. I need to work with the team on logistics and I suppose I should get all the legals sorted
but I would love to see this free from just Google. 

### Final thoughts

There are many people who organise conferences, whether they are free or paid, my hat goes off to you all!

Now on to the Chrome Dev Summit in November ;)