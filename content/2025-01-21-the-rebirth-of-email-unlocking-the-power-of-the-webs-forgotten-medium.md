---
title: "Email - The Web's Forgotten Medium"
description: I hope email can evolve beyond messaging, empowering web discovery, automation, and agentic capabilities.
date: 2025-01-21T09:15:30.569Z
slug: email-the-webs-forgotten-medium
---

I fondly remember the early days of the web. I remember my first time on the Web in an Internet cafe with my friend Bob, patiently waiting for the only thing we knew to load (cnn.com). It was a time intertwined with a lot of other personal discoveries: ICQ, [uh-oh](https://www.youtube.com/watch?v=6iCPIUGnHQ8) and a/s/l; software modems that didn't work with my Cyrix P150+, Quake @ 2fps on the same computer; and a thing called email via hotmail.

While Quake is something I still love to bash on once in a while, the Web and Email are the two main technologies that are still pervasive in my day to day life.

When people ask me what I do, firstly it's a bit hard to say "Developer Relations manager" and have anyone know what that means. So I say that I'm a Web Developer or Software Engineer, and while it's true and I still build a lot of sites, a huge amount of my time is spent in email.

The Web and Email are both the technological basis for my career to date. Yes, I have to deal with huge amounts of SPAM. I get unearthly amounts of mail from my colleagues and I still struggle to manage my inbox (Anyone want to subscribe to my "Inbox 9000" course?)

I might be alone in this, but one of the ways that I "browse the web" is not inside a browser but inside my email. I get hundreds of Newsletters (Substacks and otherwise) a week, each providing content that I find valuable that is hosted on a URL, but is completely undiscoverable by things like search. While I still love RSS, email is the only way that I am getting this information in a unified interface.

I always liked email as an interface for performing actions too. It's asynchronous nature is built in to how we expect to use it and you never know if there is a person or a machine on the other end of the email address. Over the years I've built some basic services, but more recently I've been on a bit of a rampage. I've built services that [Summarize the newsletters](https://paul.kinlan.me/projects/email-summary-service/) for me; provides a [critique](https://www.val.town/v/paulkinlan/criticEmail) of the email; generates images based on a subject; [Sends newsletters and PDF's to my reMarkable](https://sendvia.me/); A service that fetches web pages for me; A service that reminds me at certain times... the list goes on.

While I build these tools, I just don't see many services built on the back of email as an interface. Friendfeed was one of the first services that [I vividly remember letting you perform actions via email](http://blog.friendfeed.com/2009/04/whole-new-friendfeed.html) and Google App Engine also had an inbound email handler (long-since deprecated), there are perilously few services that I can find that are built off the back of this communication modality. Yes, there are ticket systems for support etc, but outside of that we tend to focus our UIs' on Apps and Sites. (If you know of any services that use email as their input mechanism, leave a comment).

I think the issue stems from two things:

1.  There's just not many services that do inbound Email->Webhook. I was sad when Google App Engine cancelled their inbound email service. I did end up using SendGrid, and it's... fine.
    
2.  Munging text and extracting meaning from that text has been almost impossible.
    

I'm hopeful with the progress in Large Language Models we might just be able to see more services use email as the primary interaction modality. Both from a text processing side, to also performing actions based on the content. Some people might say this is Agentic (email's very asynchronous model helps a lot - send an email, some action is performed by a machine or a person, and the result sent back)... Actually, I do too. I don't understand why we sit watching text stream in over a chat interface, I personally just want to fire off an email and get a result as I get on with my day.

I'm also hopeful these types of tools will get easier to deploy too. [val.town](http://val.town) is an amazing service and has the concept of inbound email "vals". Vals are small chunks of TypeScript/JS attached to an email address that when emailed will run. It's really that simple. It's beautiful in fact because it's instant to get it hosted.

Combining both LLM's and the ease of deployment, I do hope for a world where email becomes an even more useful, open, cross-platform tool for discovery and action.