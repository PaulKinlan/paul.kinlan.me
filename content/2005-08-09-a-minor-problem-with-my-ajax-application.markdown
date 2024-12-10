---
date: 2005-08-09
published: true
slug: a-minor-problem-with-my-ajax-application
summary: My AJAX application has a minor cross-site data access security issue, similar
  to one I've encountered in Firefox.  A workaround in IE6/7 involves enabling \"Access
  data sources across domains\" in Internet Options -> Security -> Custom Level, though
  this isn't ideal.
tags:
- ajax
- security
- cross-site
- internet explorer
- firefox
- data access
title: A Minor Problem with my AJAX Application

---
It appears that my sample AJAX Application  (<a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag.html">here</a>).  Has some minor security issues.  This is a similar problem to the problems I have in Firefox, cross site data access. <p />The work around for this is simple in IE6 and IE7 (although not preferable).  If you go to  "Internet Options -&gt; Security -&gt; Custom Level"  and select the option under "Miscellaneous" select "Enable" in the "Access data sources across domains" section.<p />See the image.<p />[[posterous-content:egxxvEEmirocsdiukCcG]]<p />

