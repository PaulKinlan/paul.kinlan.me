---
date: 2011-03-03
published: true
slug: so-what-is-happening-with-web-intents-
summary: I've been working on Web Intents, a project to simplify client-to-client
  service discovery and communication on the web using technologies like IFrames and
  SharedWorkers.  It addresses the current issue of apps needing to integrate with
  third-party services, which restricts user choices.  However, I recently discovered
  a similar project, Web Introducer, also by a Googler. It tackles the same problems
  with more in-depth security considerations. So, I'll be shifting my focus to contribute
  to Web Introducer.  Web Intents remains a valuable example of using SharedWorkers
  and messaging effectively within web apps.  More on Web Introducer and SharedWorkers
  coming soon!
tags:
- web
- intents
- web introducer
- service discovery
- client-to-client communication
- sharedworkers
- iframes
- security
- web development
title: So what is happening with Web Intents?

---
About 2 months ago I announced to the world a project called Web Intents (<a href="http://webintents.appspot.com/">http://webintents.appspot.com/</a>) as a way to allow client to client service discovery and communication over existing supported Web technologies, that is IFRAME&#39;s and SharedWorkers.  <p /><div>There is a definite problem on the web that if you want to talk to an app, you have to integrate your client and service with 3rd party services.  This is bad for the user, your application imposes limits on the services you let the user interact with.  Web Intents was a step towards solving that problem; the problem of service discovery and communication.<p /><div>Well, it is a very long story, but to cut it short I have still been working on Web Intents, but as luck would have it I found a very similar project called Web Introducer (<a href="http://web-send.org/introducer/">http://web-send.org/introducer/</a>) started by another Googler (Tyler Close - <a href="http://waterken.sourceforge.net/recent.html">http://waterken.sourceforge.net/recent.html</a>).  The overlaps between the two projects are clear and plainly obvious;  a lot of the harder security based challenges have been thought out in greater detail than I did for my version of the project. So I have decided that I will be focusing my effort on the Web Introducer project rather than support WebIntents further (although I am happy to answer any questions you have about it).</div> <p /><div>We are going to see some good stuff come from the Web Introducer project in the near future and I am looking forward to working on the project to push.  I am also really excited to start speaking to developers to see how we can get this intergrated in to your apps and services and start to provide a better experience for all users of the web.</div> <p /><div>I still think the WebIntents project did something great though.  It is a great use-case for SharedWorkers and messaging across your app without resorting to nasty localStorage hacks.  I will blog about this more in the near future.</div> <p /><div>Expect more posts from me soon about Web Introducer too.</div> </div>

