---
layout: post
title: "Auto-deploying Jekyll via Github"
date: 2014-02-17 17:15
comments: true
categories: jekyll
---

If you are seeing this then everything worked fine and dandy.  Woot.

It probably isn't hard to tell that this Blog is built using Jekyll (Octopress actually) and one of the things that I have always wanted to fix was how I deploy the site.

The workflow that I have used in the past is to:

*  edit locally.
*  commit changes to a github repository 
*  then `rake deploy` via ssh.

Whilst this flow works pretty well, there are number of times where I don't have terminal access and even if I did, I don't have my public keys.

I need to be able to make changes on Github (or any other system that I can use to access my repository) and have them live on my site shortly after.

The new process I have now uses Github's WebHooks (they are amazing) to tell my blog to pull in the latest changes from the repository, build them and get them live.  To integrate with Gihub's WebHooks I use the amazingly simple [Github-Auto-Deploy](https://github.com/PaulKinlan/Github-Auto-Deploy) with some modificiation from the original project and simple build script.

There really isn't anything to show you other than it just works.  Now my deployment process is just a simple push up to Github.  I even have the same ability to edit and test locally if I need to.
