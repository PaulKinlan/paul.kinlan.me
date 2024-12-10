---
date: 2011-05-13
slug: io-question-how-are-you-dealing-with-appcache
summary: 'During our Google IO talk on Mobile Web Development, we received a great
  question about handling AppCache storage limits in modern browsers. Our approach
  was straightforward: we primarily used AppCache for program code, including CSS
  and JS, along with the main page. Our application''s size remained manageable, helped
  by minifying the JS in our production build using uglifyJS. Although we could have
  compressed the CSS, we prioritized ease of development.  If space became an issue,
  our plan was to AppCache only form-factor specific code and assets, but thankfully,
  that wasn''t necessary.'
tags:
- appcache
- html5
- mobile web development
- offline storage
- performance
- google io
title: 'IO Question: How are you dealing with AppCache relatively small storage limits?'

---
We had an <a href="http://goo.gl/mod/NSEW">awesome question</a> for our Google IO talk - <a href="http://io2011-zerotohero.appspot.com/index.html#1">Mobile Web Development: Zero to Hero</a> - that we didn&#39;t get time to answer live.<p /><div>How do we deal with the storage constraints imposed by modern browsers.  The answer is simple, App Cache is used mainly to store program code, that is just the CSS and JS (and also the page that requests the AppCache), our application never got that large.</div> <p /><div>We did make some basic optimisations, our production version ran compressed JS code - our <a href="https://github.com/PaulKinlan/ioreader/raw/master/run.sh">build process minified the JS</a> using uglifyJS.  We had the option to compress the CSS (but we chose not too for ease of development).  But in all honesty, our application never got that large.</div> <p /><div>If we struggled for space we would have moved into only AppCaching the form-factor specific code and assets, but it wasn&#39;t required.</div>

