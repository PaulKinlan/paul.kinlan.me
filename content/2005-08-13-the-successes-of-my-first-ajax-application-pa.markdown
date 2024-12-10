---
date: 2005-08-13
published: true
slug: the-successes-of-my-first-ajax-application-pa
summary: 'In this first installment of a series about my AJAX application journey,
  I''m sharing my initial success: learning to think asynchronously.  The current
  app takes user-entered text, sends it to a Yahoo web service (via a local Perl script),
  gets \"interesting\" words, and then makes synchronous calls to Technorati for tag
  counts. This synchronous approach locks the browser, especially with multiple tags.  The
  next version will use a queue and multiple asynchronous XMLHttpRequest objects managed
  by a thread manager to avoid browser lock-up.  This will create a more responsive
  app where results appear as they become available.  Key requirements for v2 include
  full asynchronicity, XMLHttpRequest management, a generic work queue, background
  task indicators, and a non-blocking UI. I''m also planning to develop a reusable
  object model.'
tags:
- AJAX
- Asynchronous Programming
- JavaScript
- Web Development
- XMLHttpRequest
- Technorati
- Yahoo
- Browser Locking
- Thread Management
- Object Model
title: 'The Successes of my first AJAX Application: Part 1'

---
This is the first in the series about the successes and failures of my AJAX application.  With me talking about this, I hope to make a better version 2. Talking about everything that I have learnt so far is good for me and I hope to also help other people so that they don't hit some of the traps and pit falls that I ran across.<p />Most of the successes are related to me learning something.  Most of the failures are due to me not completing features that I wanted in the application.  By the end of this exercise I hope to turn each of the failures into a corresponding success.<p />This entry is about success number 1: It got me thinking Asynchronosly!<p />I think it is best to first describe how the app currently works in brief.<p />The user enters some text into the application.  This text is the data that the user wants Technorati tags to be created for.  Once the text is input it can be sent to the Yahoo web service (Currently it doesn't directly talk to the Yahoo systems, instead it is reffered to an internal Perl script on my system that will forward the request on to Yahoo.)  The first of the Yahoo services returns a list of "Interesting" words.  For each interesting word that is found a request is sent out to the Technorati systems, the Technorati system returns a count of the number of searches that match the "Interesting" word as well as the number of blogs with the tag of the "Interesting" word.  The first call is Asynchronus, the latter are Synchronus.  The first call is quick, the latter locks the application because it has to make lots of synchronus calls to the Technorati system (one call per Tag)<p />There is a second "related searches" step which I will not go in to yet as I will deal with that in one of my failure entries.<p />The reason why one is asynchronus and the other is not is because the first call only involves one call to a remote procedure, the other requires multiple calls.  And until I can work out a way of allowing multiple calls from one Xmlhttprequest object in an asynchronus manner (I have an idea) then I will have to keep doing it this way.  The only problem is that it will completly lock the browser (IE6) and all the tabs (IE7) if I keep doing it this way.<p />So to get me thinking Asynchronusly I have had to contend with different ways of calling remote procedures and web services from a web page.  The next version of the application should not allow the browser to be locked; It should let the user know what it is doing and it should not have to instantiate too many request objects.<p />My solution for the next version will be to have the Yahoo Context parser (which is only one call) populate a queue of Interesting words.  Each time the queue is fed an item, any available XmlHttpRequest objects will take the next available item from the queue and start to do some work.  This work will all be asynchronus so as to not lock the browser, but this means that I will have to make sure that the if a XmlHttpRequest object is currently working then it cannot be reused, otherwise some calls will be lost.  <p />Obviously this means I will have to create a XmlHttpRequest thread manager.  It will also have to be event driven.  So that when an item is queued the thread manager knows that it must service the request.<p />The side effect is that the page will display with not all the information available right away, but rather trickle fed into the page as each of the items in the queue are dealt with.<p />One of the things that I need to do (which know MSN's Start.com does) is to create an Object model that I can use for my project.  This object model will be re-useable through out the app and also in other projects.  <p />Therefore the first set of requirements is as follows:<ul>
<li>Everything must be asynchronus</li>
<li>More than one XMLHttpRequest object can be present at anytime so there must be a manager to control what tasks a particular object does.</li>
<li>Because tasks will come in after each request is made.  There must be a generic way of queue work items, and dispatching work to do once the result comes back</li>
<li>The user must be aware that work is being carried out in the backgroud.</li>
<li>The users browser should never be locked</li>
</ul><p />Do you have anymore?  Do you have any insight or suggestions that would help me.  If so email me: <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a>

