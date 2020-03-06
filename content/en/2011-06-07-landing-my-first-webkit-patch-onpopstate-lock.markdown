---
slug: landing-my-first-webkit-patch-onpopstate-lock
date: 2011-06-07
 
title: Landing my first WebKit patch. OnPopState Lock and Load.
published: true
---
<p>This is a story all about how my life got flipped turned upside down&hellip;..
wait what?!?! I can't start a blog post with The Fresh Prince.</p>

<p>Last week, when I was still in my 20's, I wrote a blog post about HTML5
History API <a href="/html5-history-needs-another-event">needing a new event</a>.  This came about
because the <a href="http://github.com/PaulKinlan/leviroutes">LeviRoutes</a> framework
would work better if it could understand when state had been pushed via
History.pushState.  Whilst investigating pushState and adding some tests to
the LeviRoutes framework I wanted to be able to simulate an 'onpopstate'
event.</p>

<p>Let's just quickly digress with a little bit about HTML DOM events.  HTML
defines a rich series of events that are fired when a user clicks on
something, the page loads or&hellip;.. well let's just say there are hundreds of
events.  Not only do the events get triggered when the user or system does
something, but the developer can easily <a href="http://www.w3.org/TR/2001/WD-DOM-Level-3-Events-20010823/events.html#Events-document">simulate events</a>.
 If you want to click on a button via script.  Simple:</p>

<div class="CodeRay">
  <div class="code"><pre>var evt = document.createEvent(&quot;MouseEvent&quot;);
var anchor = document.getElementById(......);
evt.initMouseEvent(&quot;click&quot;, true, true, window, 0, 0, 0, 0, 0, false,</pre></div>
</div>


<p>false, false, false, 0, null);</p>

<div class="CodeRay">
  <div class="code"><pre>anchor.dispatchEvent(evt);</pre></div>
</div>


<p>Why is this programatic dispatch important? You can build individual tests
that are responsive to the events that would fire to user events without
having to build a system that tries to automate the UI by say, managing the
mouse pointer through hardware control.</p>

<p>Digressions aside, I was building tests that would test my HTML5 History
handling logic without me having to physically invoke a History.pushState
command.  In summary, separating the physical navigation from my logic.</p>

<div class="CodeRay">
  <div class="code"><pre>var evt = document.createEvent(&quot;PopStateEvent&quot;);
evt.initPopStateEvent(&quot;popstate&quot;.....);
window.dispatchEvent(evt);</pre></div>
</div>


<p> This should have worked.  Instead all I got was:</p>

<div class="CodeRay">
  <div class="code"><pre>var evt = document.createEvent(&quot;PopStateEvent&quot;);
DOMException</pre></div>
</div>


<p>Which if you read the <a href="http://www.w3.org/TR/2001/WD-DOM-Level-3-Events-20010823/events.html#Events-DocumentEvent">Event specification</a>
is what occurs when an Event type is not implemented.  I quickly jumped
across to Firefox and tested the same code.  It worked.  So it must be a bug
in WebKit.</p>

<p>Now, this is where my real story starts, and what I hope will demonstrate
the power of Open Source software.</p>

<p>I was in a bind. I could raise a bug and hope someone might pick it up at
some point in the future, or I could raise a bug and try to fix it myself.
 I chose the latter.  I didn't think it would be hard &ndash; after all the Event
system is already in WebKit and PopStateEvent is already implemented, it is
only the hookup with createEvent that didn't.</p>

<p>Where do you start?  I started by <a href="http://www.webkit.org/building/checkout.html">downloading the latest WebKit code</a> and <a href="http://www.webkit.org/building/build.html">building it</a>.  In all this process took longer
than the actual fix.</p>

<p>Once I had a build, I decided to create a very simple test case to prove
that it is still broken.  With this in hand, I had a quick peek at the
Webkit code.  Google Code search is your friend here, I just searched for
'<a href="http://www.google.com/codesearch?q=PopStateEvent&amp;exact_package=chromium&amp;hl=undefined&amp;vert=chromium">PopStateEvent</a>'
and it returned a list of important places to look.</p>

<p>Inspecting PopStateEvent.cpp and PopStateEvent.h, I could see that there was
a create and initPopStateEvent methods so I was pretty sure I was in the
roughly the correct place.  I also knew that createEvent is on the document
object in the DOM, so I did a quick search for <a href="http://www.google.com/codesearch?q=createEvent&amp;exact_package=chromium&amp;hl=en&amp;vert=chromium">createEvent</a>
and there was a file called 'Document.cpp', this looked promising.  A quick
search in <a href="http://www.google.com/codesearch/p?hl=en#OAMlx_jo-ck/src/third_party/WebKit/Source/WebCore/dom/Document.cpp&amp;q=createEvent&amp;exact_package=chromium&amp;sa=N&amp;cd=8&amp;ct=rc">Document.cpp</a>
highlighted the area where the events are created, and there was a
suspicious lack of PopStateEvent.</p>

<p>Bingo!</p>

<p>I quickly raised a bug, on <a href="http://bugs.webkit.org/">http://bugs.webkit.org/</a> detailing the error with
a simple test case attached, and then went about fixing the code.  Raising
the bug seemed to take longer than the fix, which amounted to adding in a
condition for the type of event, adding in a parameterless constructor and
then calling it.</p>

<p>Pretty quick.  My own test case passed, so I had a strong indication that it
was fixed, but I knew if I submitted it without an automated test it would
probably get rejected.  The problem is that I had no idea how to build the
automated tests or where to put them.</p>

<p>I had a quick scan through LayoutTests, and in the 'fast' directory there is
an 'events' directory which seemed liked the logical place to start.  I
followed the examples of other tests, I created a simple test and an
'expected' results file and then gave the test runner a go.  Boom! it
failed. It took a little bit of looking, I found that the results of the
test run were stored in '/tmp/layout-test-results/results.html' and it gives
you a visual diff of the actual output vs the expected &ndash; it was a single new
line character that was causing the problem.</p>

<p>That was me done. I created the ChangeLog and attached it <a href="https://bugs.webkit.org/show_bug.cgi?id=62099">to the bug</a>, set r to ? (this was an
oddity that I had to learn about).  After the first review there were a
couple of changes I needed to make.  The second review indicated that I
updated the wrong ChangeLog and some other smallish issues.  But after that
it was ok and submitted.</p>

<p>And here it is: <a href="http://trac.webkit.org/changeset/88187">http://trac.webkit.org/changeset/88187</a>, it is not a complex
fix but it is one I am proud of, if all the ports include the fix then my
code will be used by the eleventy billion users of WebKit (ok &ndash; I have no
idea of the number of users, but I know it is very large number) and now I
can get on with fixing my LeviRoutes framework ;)</p>

<p>In my eyes, this is one of the powers of Open Source.  Rather than just
report a bug and hope someone picks it up, and then wait for the next major
release of the software to see if it is fixed, I have the power to go in and
fix the problem, and if it stands up to muster I can get the solution
published.</p>

<p>Beautiful!</p>

