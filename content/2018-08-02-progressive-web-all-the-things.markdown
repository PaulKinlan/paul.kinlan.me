---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---

PWA. Progressive Web Apps. Frances Berriman and Alex Russell coined the term
"progressive web apps" in 2015 with what I think is a seminal post
"[Progressive Web Apps: Escaping Tabs
Without Losing Our
Soul](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)".

3 years later, we've come a long way. From a loose collection of technologies -
Service Worker, Manifest, Add to Homescreen, Web Push - that were originally
only implemented in one browser engine, to a brand that has started to stick
across the industry with businesses and developers, and all of the major browser
vendors implementing the majority of the 'PWA' stack.

We've now got [app](https://appsco.pe/)
[directories](https://pwa-directory.appspot.com/),
[tools](https://blog.tomayac.com/2018/07/09/progressive-web-apps-in-the-http-archive-143748)
that help us understand roughly how many PWA's there are in the wild, and a host
of awesome [case studies about the benefits of
PWA](https://developers.google.com/web/showcase/). But what defines a PWA?
Frances and Alex came up with this list of traits:

> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> to fit any form factor  
> **Connectivity independent**: Progressively-enhanced with [Service 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> to let them work offline  
> **App-like-interactions**: Adopt a Shell + Content application model to create 
> appy navigations & interactions  
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> process  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Discoverable**: Are identifiable as "applications" thanks to 
> [W3C](https://w3c.github.io/manifest/) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> and Service Worker registration scope allowing search engines to find them  
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> to the home screen through browser-provided 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> allowing users to "keep" apps they find most useful without the hassle of an 
> app store  
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> The social [power of
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> _matters_.

Importantly, this description marked the moment where we were all a little
clearer about how we wanted to see the web and we've got
[tools](https://developers.google.com/web/tools/lighthouse/) that helped us
understand if our site is a 'PWA' or not. Alex went even further and defined
some of the [technical aspects that make a 'PWA' a
PWA](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/).

With the hyperbole of this post out of the way, why isn't everyone building
these things? [Well, it can be hard. Very
hard](/challenges-for-web-developers/). We are asking developers and businesses
to do a lot. In some cases focusing on AppShell can be a complete
re-architecture of a site, in other cases ['AppShell' isn't the correct
architecture](/progressive-progressive-web-apps/). And in many cases the value
or narrative isn't always quite clear.

I've been fortunate enough to be able to speak directly to businesses and
developers about their concerns building on the web, specifically things that I
have heard businesses and developers say about PWA, are:

> We've got our site... but we are also making a PWA.

> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)

Interesting. Are they different? Frequently not, but PWA is a 'thing' they
have heard about and it's another product to launch. Much like m.* sites
were the mobile version of the desktop site, PWA's can be another thing
they have to launch.

> I've got a PWA. It just does Push notifications.

> &mdash; Too many people.

Wah. That's not a PWA, that's just using a piece of technology that native apps
have had.

> I'm only building a blog... it's not a PWA

> &mdash; Many bloggers we spoke to.

Hmmm. It's a clear case that we've not been able to articulate why it's important
for content sites to make the move.

> I don't care about making it installable.. I don't need a Service Worker.

> &mdash; Many publishers we spoke to.

Huh. People associate App's with installs, and the thought that a site or
experience must act like an App install turns some people off from the concept
as a whole. In 2015 there was a very interesting discussion about
[carrots](https://trib.tv/2015/10/11/progressive-apps/) that I encourage you to
disect.

> I don't need an app on desktop. I just need users to click 'checkout'

> &mdash; Many retailers we spoke to.

Ok. That's pretty clear. The value to a user or the business is not there, 
and it's enough to stop a business prioritizing the traits of a PWA.

> Progressive Web Apps are just better sites.

> &mdash; Many developers we speak to.

Actually I hear this a lot from a lot of great web developers.

I encourage you to check out the writings of [Jeremy
Keith](https://adactio.com/) who for a while has been pushing the 'PW' in PWA
for a long time and in a recent talk has said something similar:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.

> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 

My personal feeling is that everyone is really hung up on the A in PWA: 'App'.
It's the success and failure of the branding of the concept; 'App' is in the
name, 'App' is in the conscious of many users and businesses and so the
associations are quite clear.

To be absolutely clear, myself and many others across our team pushed hard on
the 'App' term in the context of PWA, specifically in relation to competing with
Mobile native experiences. [Andrew Betts'
post](https://trib.tv/2016/06/05/progressively-less-progressive/) had a good
summary against our original positioning, and whilst I don't think we were
wrong, we did miss a chance to help the wider story specifically around
form-factors that were not so mobile centric.

I used to ask audiences this when we were talking about the Chrome Web Store. Is
Gmail and app or a site? An App, that's Easy. Is Twitter an app or a site? An
App.. is it? If I'm just reading content, it still feels like a web site. Is
Wikipedia an app or site? A site, absolutely; is it though? As an editor it
feels very much like a tool.

Ultimately, I don't think it actually matters too much if a site is an app or an
app is a site. People can and do create everything on the web: 'apps', games,
VR bobbins, retail stores or just traditional 'sites', and it could be for any
specific use case - media, entertainment, publishing, utilities, commerce...

If you tease apart the original definition of PWA, with the exception of
'installability' (see 'bag of carrots'), I don't think anyone could argue that
if a developer improves their site in anyone of the points Alex referenced then
users get a better experience, and when user's get a better experience they
value the web more and more people have a meaningful engagement with the web and
keep using the web.
  
So how can we apply the PWA narrative in a way that every business and developer
knows what they should focus on?

---

I've been thinking of a slight pivot based on the challenges we've seen in the
industry, and I've tried to prioritize the importance of where developers and
businesses can focus their efforts. (Note: I might channel
[BizKin](https://twitter.com/business_kinlan))

We want businesses and developers to succeed by leveraging the web’s unique
capabilities that allow them to: Reach the most users they can at the click of a
button; Retain their users by bringing their best experiences across devices
with a single set of code; and to meaningfully engage with their users by
building a direct and ownable relationship with them.

I've tried to articulate this as a set of principles that the user should feel
when using the web. Your experience should be:
DISCOVERABLE, SAFE, FAST, SMOOTH, RELIABLE, MEANINGFUL

Make it Discoverable
: Enable users to find your experience. The web is made of links and pages.
Ideally every page and state should have a deep-link so that anyone can be sent
to it from any site, be it an aggregator, a message, an email or a billboard.
Content should be served so that any renderer can read it.

Make it Safe
: Users and content owners can trust experiences built on the web, protecting
identity, confidentiality and data integrity.

Make it Fast
: Once the user has the link to your site, then the instant they tap it they are in
your experience and able to start using it irrespective of the network or device
that the user has.

Make it Smooth
: When users are on your site the experience is responsive and interactive to all
user gestures. Animations feel smooth and crisp, feedback is instant, scrolling
is silky, navigations are instant. Ideally if you think of the web performance
in terms of
[RAIL](https://developers.google.com/web/fundamentals/performance/rail), you are
focusing on the 'RAI'.

Make it Reliable
: Users of your site perceive as few interruptions as possible when faced with
unreliable network or devices. The experience should work and be responsive 
wherever the user is.

Make it Meaningful 
: You must provide value and meet your user's needs through
high-quality experiences that provide value. This can seem quite fluffy, but
[Dion Almaer described it
well](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411).
The focus is really about your site solving a need for the user, be it
entertainment, smoothing out a purchase, advancement of knowledge or quick
completion of a task. It's all about the UX.

A modern experience that meets these principle goals of **fast, reliable, safe
and smooth**. It becomes progressively more **capable** using modern APIs and
highly **discoverable** by harnessing the reach of the open web and at the core
of it. A PWA should naturally meet each of these "principle goals" based on user
expectations and continues to build on the experience as more technologies and
capabilities come in. But so should any modern experience on the web today....

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> &mdash; Progressive Web All-the-things.

What do you think?

_Thanks to Harleen Batra._

{{<html>}}

<style>
dt {
  font-weight: 600;
  margin-bottom: 0.8em;
}
dd {
  margin-bottom: 1em;
}
#pw {
  font-weight: 700;
  font-size: 1em;
}
#name {
  font-size: 1em;
  font-weight: 100;
}
</style>
<script>
  const nameEl = document.getElementById('name');
  const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];
  let counter = 1;
  setInterval(()=> { 
    nameEl.textContent = names[counter];
    counter = (counter + 1) % names.length;
    nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})
  }, 2000)
</script>
{{</html>}}