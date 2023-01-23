---
slug: web-intents-a-fresh-look
date: 2011-07-01
tags:
- intents
title: "Web Intents: A fresh look"
published: true
---
<p>We have a huge problem on the web today.  If I built an image
gallery application and I wanted to let users edit an image so that they can
remove red-eye from a photo I either have to build an application that edits
the images, or integrate with a 3rd party solution.  Doing this is hard and
stops you from building an awesome image gallery; and what happens if the
user has a favorite service that they already use to remove red-eye?
 Simple, you have a frustrated user.</p>

<p>We have a solution!</p>

<p>In December 2010 <a href="https://twitter.com/Paul_Kinlan/status/17998349231722497">I announced a project</a> called <a href="http://www.webintents.com">Web
Intents</a> whose goal was to allow developers to
build applications and services that could work with each other, but not
need to explicitly know about each other &ndash; the concept has heavily inspired
by the Intent system in Android, although the API bore no resemblance.  It
would allow you to build applications using just the functionality your
cared about, and then delegate the other functionality to the
users preferred choice of service.</p>

<p>After some conversations, <a href="/so-what-is-happening-with-web-intents">I moved to try and support Web Introducer</a> as a
specification over Web Intents. For one reason or another this didn't quite
work out so I decided to plug away at revising the WebIntents work that I
started back in November.</p>

<p>It turns out there is a lot of interest internally with the idea of Web
Intents and how it can work in modern browsers.  We set up a small crack
team and after a flurry of work, speccing and prototyping how we think it
might look we have put a <a href="https://github.com/PaulKinlan/WebIntents">prototype API on to Github</a>.  <a href="http://examples.webintents.org/">Have a play</a>, it is really easy to get started.</p>

<p>So what changed?</p>

<p>A lot as it happens. It is not the same as the initial project that
I experimented with, although the goals are the same. We have an objective
to make the developer experience of the API so painless that most developers
can start integrating with applications in 5 minute of reading the spec &ndash; in
fact we want it so that most developers can just copy and past examples and
it will work with their service.  We have tried to drastically reduce the
API surface and make it so there is literally only one or two lines of code
you need to start an activity.</p>

<p>Service registration has been made even easier that my initial project
through the use of a new tag, for example:</p>

<div class="CodeRay">
  <div class="code"><pre>&lt;intent
  action=&quot;http://webintents.org/share&quot;
  type=&quot;text/uri-list&quot;
  href=&quot;share.html&quot;
/&gt;</pre></div>
</div>


<p>This small tag, that is included in the head of your application will signal
to the browser the intention to handle a 'share' action for a selection of
URI's (think 'share this page'), and will register it in the system so that
the user can choose it when a client application wants to provide 'share'
functionality in their app.</p>

<p>When the service is chosen by the user, and the service is loaded the intent
data is passed to the open application and is available on the
<code>window.intent</code> object.</p>

<p>For clients to initiate an Activity it is easy too.  Simply declare an
intent and start the Activity as follows:</p>

<div class="CodeRay">
  <div class="code"><pre>var intent = new Intent();
intent.action = &quot;http://webintents.org/share&quot;;
intent.type = &quot;text/uri-list&quot;;
intent.data = &quot;https://paul.kinlan.me&quot;;

window.navigator.startActivity(intent);</pre></div>
</div>


<p>The system will take care of the service resolution for the action and
compatible data formats and give the user the choice of using
their favorite application to handle the 'share' intent.</p>

<p>I have only just touched the surface of what you can do with the API.  There
are a lot of things that you can do with the API over and above what I have
described in this 5 minute overview.  A selection of examples can be found
at <a href="http://examples.webintents.org/">http://examples.webintents.org/</a> where we show you how to build
applications that solve some common use-cases. I particularly like the cloud
kitten service provided by the <a href="http://examples.webintents.org/intents/pick/index.html">'pick' example</a>.</p>

<p>We are working with Mozilla to define a common approach to solving the
challenges that web integrators face today. We are interested in hearing
your thoughts and we are still thrashing out the API so bits of it might
change but the intent is still the same.</p>

<p>My closing thoughts are: &ldquo;This project will fundamentally change and improve
the way we build applications on the web today for our users.&rdquo;</p>

