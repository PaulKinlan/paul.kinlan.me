---
date: 2011-05-14
slug: io-question-how-long-did-it-take-to-develop-t
summary: At Google I/O 2011, we showcased a mobile web app.  Many asked about its
  development timeline.  Work began on March 3rd, with core coding starting on March
  25th.  While the calendar time was just over a month, the effort was spread across
  four engineers, each dedicating about 20% of their time to their respective UI using
  the FormFactorJS framework.  This setup facilitated isolated development, with the
  flexibility to inject custom code per form factor and a common base controller in
  controller.js.  We also developed and leveraged two frameworks, LeviRoutes and FormfactorJS,
  to efficiently consolidate common logic and specialize the controller according
  to form factors.
tags:
- io2011
- mobile web development
- app development
- formfactorjs
- leviroutes
- javascript
- prototypal inheritance
- engineering
title: 'IO Question: How long did it take to develop the app? #io2011'

---
One of the many question that we didn&#39;t get to answer in our talk - <a href="http://io2011-zerotohero.appspot.com/index.html">Mobile web development: Zero to Hero</a> - is &quot;<a href="http://goo.gl/mod/OuwY">How long did it take to develop the app</a>?&quot;.  Luckily, we have an answer: The first commit of the project was on the <a href="https://github.com/PaulKinlan/ioreader/commit/a42daa85023fb278dc98fb0201555e300b1eb552">3rd of March</a>, but that was mainly just a simple README file, the first commit of the server was <a href="https://github.com/PaulKinlan/ioreader/commit/b96a5f217a042ea4610972bc1bcbf227b73b6a65">25th of March</a> which is when we really started working on the code and began taking our ideas and basic concepts into a fully fledged solution<p /><div>You might think that just over a months worth of work went into this (it was, in theory), but it is a little more complex than that.  We developed 2 frameworks, <a href="https://github.com/PaulKinlan/leviroutes">LeviRoutes</a> and <a href="https://github.com/PaulKinlan/formfactor">FormfactorJS</a> and allowed us to push a lot of the common logic into a single controller.  <a href="http://io2011-zerotohero.appspot.com/index.html#36">Using FormfactorJS</a> it was possible to assign engineers to each distinct UI and have them work on it in isolation.  FormfactorJS was used to specialize the base controller that was in every single page.  If you look in our &quot;<a href="https://github.com/PaulKinlan/ioreader/tree/master/client/scripts">scripts</a>&quot; directory, you can see how we structured the project - <a href="https://github.com/PaulKinlan/ioreader/blob/master/client/scripts/controller.js">controller.js</a> is common across all interfaces, <a href="https://github.com/PaulKinlan/ioreader/blob/master/client/scripts/desktop/controller.js">desktop/controller.js</a> is then dynamically injected at run-time and using <a href="http://javascript.crockford.com/prototypal.html">prototypal inheritance</a> we added custom formfactor specific features (such as swipe detection in the case of tablet and mobile)</div> <p /><div>In total we had <a href="http://io2011-zerotohero.appspot.com/index.html#75">4 engineers working on the project</a>, each working on their own UI.  Each engineer spent roughly 20% of their time developing the parts of the UI that they were responsible for.</div> <p /><div>In all, it took just over a month of man effort to develop this application.</div>

