---
date: 2011-05-13
slug: io-question-websql-is-dead-or-dieing-indexedd
summary: 'During my \"Mobile Web Development: From Zero to Hero\" talk at Google I/O,
  a question came up about client-side data storage now that WebSQL is deprecated.  While
  IndexedDB is on the horizon, what are developers using *today*?  I shared my preference
  for Lawnchair, a simple key-value store abstraction that''s easy to use and perfect
  for many situations. While I didn''t use it in the IO Reader app due to late-stage
  project constraints and the sufficiency of localStorage, I generally prefer using
  such libraries.  I''m interested in hearing from others. What data storage wrappers
  or techniques do *you* prefer when building web apps?'
tags:
- websql
- indexeddb
- lawnchair
- localstorage
- data storage
- client-side storage
- offline storage
- web development
- mobile web
- javascript
- html5
title: 'IO Question: WebSQL is dead or dieing, IndexedDB isn''t there yet, what do
  you think about libraries like Lawnchair?'

---
A <a href="http://goo.gl/mod/VrlF">question</a> in our IO Talk: <a href="http://io2011-zerotohero.appspot.com/index.html#1">Mobile Web Development: From Zero to Hero</a> was with regards <p /><div>I will say this, I love LawnChair - I have used it a couple of times and it makes getting data in and out of your application very easy, it is based on the premis that you need to store objects against a key, and then get it out again, it allows you to use a richer querying syntax, but in many cases (as with our <a href="https://github.com/PaulKinlan/ioreader">IO Reader</a> app) you don&#39;t need anything more complex.</div> <p /><div>As to why I didn&#39;t use LawnChair (or any other wrapper) in IO Reader? I actually added the data caching layer later on in the project cycle, localStorage was supported well enough and I didn&#39;t want to introduce a new dependency in the code that late on.</div> <p /><div>As a developer that likes to get things done, I very rarely write code that will manipulate a given data source directly, instead I either use a project like LawnChair, or I use a simple wrapper that I have written that allows for flexible querying semantics on JSON based objects.</div> <p /><div>I am keen to hear your thoughts.  What are your favorite DataStore wrappers for Web apps?  Do you write to the bare metal?</div>

