---
date: 2012-02-28
published: true
slug: we-need-to-kill-off-the-localstorage-api
summary: LocalStorage is a flawed API with poor querying, performance issues, limited
  storage, inconsistent event handling, and locking problems.  Its only advantages
  are its simple semantics and browser support.  Continued use of LocalStorage hinders
  the development of robust offline and client-side web apps.  We should transition
  to IndexedDB, a superior alternative.  I've demonstrated this by converting the
  BackboneJS TodoMVC example from LocalStorage to IndexedDB using Julien Genestoux's
  adapter.  This involved a few configuration changes, highlighting the ease of adopting
  IndexedDB, which is our only viable path forward for client-side storage.  Let's
  abandon LocalStorage and embrace IndexedDB to unlock the potential of offline web
  apps.
tags:
- localStorage
- IndexedDB
- offline web apps
- client-side storage
- performance
- scalability
- web development
- browser APIs
- backbone.js
- todomvc
title: We need to kill off the localStorage API

---
<div><span style="font-family: Arial,sans-serif; font-size: 13px; line-height: 18px; background-color: rgb(255,255,255);">It is a failure of the web, browser vendors and developers that we are in this situation, but w</span><span style="background-color: rgb(255,255,255); font-family: Arial,sans-serif; font-size: 13px; line-height: 18px;">e need to stop advocating for and building examples that use the LocalStorage API&#39;s, it is simply not a scalable API and the more we build for it the harder it will be for us to ween ourselves off it.  </span></div> <p /><div><span style="background-color: rgb(255,255,255); font-family: Arial,sans-serif; font-size: 13px; line-height: 18px;">LocalStorage has poor querying capabilities, terrible performance, small storage in many browsers, crazily inconsistent eventing and a nasty habit of locking.  It&#39;s saving grace is simple semantics and &quot;browser support&quot;.</span></div> <p /><div>Client-side and offline web-apps are not a reality with localStorage, and if we keep pushing it, we are never going to be in a situation where we have a compelling offline or client-side story.</div><p /><div>We need to bite the bullet, move on and start building compelling apps, examples and demos build around IndexedDB, that is our only future (I am still aggrieved that the web dropped WebSQL, it was simple and familiar) and we need to do this by stopping to support localStorage. Period.<p /> <div><span style="font-family: Arial,sans-serif; font-size: 13px; line-height: 18px; background-color: rgb(255,255,255);">To this effect, I have taken the BackboneJS example in TodoMVC (﻿by <a href="https://github.com/addyosmani/todomvc">Addy Osmani</a></span><span style="font-family: Arial,sans-serif; font-size: 13px; line-height: 18px; background-color: rgb(255,255,255);">) and <a href="https://github.com/PaulKinlan/todomvc/commit/39205e06c4553ceb0c455fbf7d1c69a801c281bb">added IndexedDB support</a></span><span style="line-height: 18px;"> u</span><span style="font-family: Arial,sans-serif; font-size: 13px; line-height: 18px; background-color: rgb(255,255,255);">sing the Backbone JS adapter b</span>y <a href="https://github.com/superfeedr/indexeddb-backbonejs-adapter">Julien Genestoux</a>.<span style="font-family: Arial,sans-serif; font-size: 13px; line-height: 18px; background-color: rgb(255,255,255);"> I quickly removed the LocalStorage interface, and in a couple of lines of config change I had IndexedDB support in.</span></div> </div>

