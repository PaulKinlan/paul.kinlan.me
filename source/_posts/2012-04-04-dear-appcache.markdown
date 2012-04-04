---
layout: post
title: "Dear AppCache we need to talk."
date: 2012-04-04 15:12
comments: true
categories: appcache, web app, javascript, html5
---

It's not me.  It's you!

Ok. thats a little harsh.  Without AppCache we wouldn't even be able to think about building Offline enabled web apps.  But it seriously does have some issues, one of which I am blogging about today has been not discussed in depth before (as far as I can tell).

Imagine you building an offline enabled app that integrates with registerProtocolHandler or registerContentHandler. These two API's use query parameter substitution to pass data from the client page to the service page (http://mailfoo.com/createmail.php?t=paul.kinlan@gmail.com&s=Test Message for example opens up your mail client at createmail.php when you click on a mailto link). This works well for purely online apps, but as we will see when used with apps built with AppCache you won't get the experience you are expecting, at worst you could DoS your site.

Your createmail.php will likely render a manifest="cache.manifest" attribute in your html element, which when visited is cached offline and works as expected. The problem lies in the fact that AppCache treats the entire URI (including query strings) as an identifier to the page, therefore if you have a unique query string each of these pages are downloaded and added to the AppCache group.

Ok, cool, but what does this mean? Well it means that http://mailfoo.com/createmail.php?t=paul.kinlan@gmail.com is cached separeately to http://mailfoo.com/createmail.php?t=paul.kinlan@hotmail.com, all the resources will be quickly fetched as the manifest has already got hold of the data and they are already cached in AppCache.

Whilst you are online, this is all gravy. It works beautifully. However now go offline and create an email to paul.kinlan@gmail.com (it works because it is cached), but try instead creating an email to paulkinlan@google.com(via a mailto link)... hmm, where did my app go? It is not there because it has not yet been cached for offline use. Big problem.

You thought that was bad? Now for the kicker. 

You happily make and send 100's of emails over a couple of weeksr. Whilst you are online, all works well. The developer of the app decides to upload a new version of their code so updates their app cache. What happens? Every single unique url (so every email you might have sent via a mailto) is requested and downloaded again (even if it is not in the manifest, it is in the app cache group). If I have sent 100 unique emails via mailto, then every single page with that query sting is fetched quickly by the browser... Seems like a good way to add a lot of load to your machine.

It is pretty hard to change a specifictation in flight so we need to start documenting patterns for building offline apps than we do today because AppCache is not easy to use, and there are lots of gotchas like this that make developers not even bother using the API.
