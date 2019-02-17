---
slug: is-it-an-app-or-a-link
date: 2010-12-15
 
title: Is it an App or a Link
published: true
---
<p>Quick answer: it is nearly always an App.</p>

<p>Long Answer:
I have seen a lot of Comment for some apps in the <a href="http://chrome.google.com/webstore">Chrome Webstore</a> that are along the lines of &ldquo;This is just
a link&rdquo;.  In some cases, the users are correct but they are missing an
important point.  The webstore is a channel for users to discover great Web
Apps, many users who visit the Web Store will have never seen your app.</p>

<p>Take for example my app <a href="http://simpletodo-app.appspot.com/">
<a href="http://simpletodo-app.appspot.com/">http://simpletodo-app.appspot.com/</a></a> and
the <a href="https://chrome.google.com/webstore/detail/eacapmgbhgdfiolkgbbenjejapdpiapi">App in the Web Store</a>.
 Both load the same URL, but both are <em>defiantly</em> an app.  There is nothing
to suggest that it isn&rsquo;t an app, but if you check out the manifest for the
code, you will see that it is really just a reference to the URL with an
request for unlimitedStorage.</p>

<p>The Web Store doesn&rsquo;t have to have new applications or applications specific
to Chrome; in fact I encourage you to put your existing apps in there, that
is what it is designed for &ndash; to help you, the developer, to reach users more
easily.  I think that a lot of users when they see their favourite app in
the store think that there should be a new experience for them, but you have
to remember that most of the users that see this app probably haven&rsquo;t used
it, so it IS an new experience for them.</p>

<p>Obviously there are some caveats, yes you can create and list &ldquo;packaged
apps&rdquo; which have Chrome specific functionality, and yes you will notice that
quite a few apps have targeted HTML5 enabled browsers (this is a good
thing), but that doesn&rsquo;t have to be the case.  I would love it if you put
your existing app in there, and because you have a whole host of new users
you decide to upgrade the experience to cater for more modern browsers such
as Safari, Chrome, Firefox and IE9.</p>

<p>So if you are a developer of an app where people are saying this and you
can&rsquo;t devote much development resource, I have one simple piece of advice
that can help you: <em>Send your users to functionality as quickly as possible</em>.
 If you have a log-in page, send them to that (but make sure they can
quickly sign-up).  Under no circumstances send them to a default product
page, if you do this, then it really is just a Bookmark Link.  The user has
already chosen to &ldquo;install&rdquo; your app, make it feel like they are jumping
into your application from the instant that they click the icon.</p>

<p>Even better still, if you have some time, get rid of the sign-in page, use
OpenID &ndash; apps can now have a near seamless account creation and login
process.  Check out our article about <a href="http://code.google.com/chrome/webstore/articles/authentication.html">Federated Login</a> for
some really nice examples of account creation and sign-in flows.  You will
see that they get users to the functionality really quickly.  If you want to
see this in action, check out the <a href="https://chrome.google.com/webstore/detail/abjfkoljackhkbokdhonflfjfkboajkp">Diary.com application</a>
&ndash; it is a beautiful sign-in process and will show you how simple it is and
the positive effect that it has for users.</p>

<p>As always, comments welcome! :)</p>

