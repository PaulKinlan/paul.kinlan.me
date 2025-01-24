---
title: Describing sites instead of coding them
description: It might be possible to build sites entirely from a simple description.
date: 2025-01-24T14:13:04.148Z
slug: describing-sites-instead-of-coding-them
---

I've been noodling on how we might lower the cost to create prototypes of sites for people who aren't technical. When I speak to a lot of people about websites, they kinda know what they want and can describe it, but it's a lot of work for them to get a functional skeleton of a site working, so ultimately they don't build that site or they just go and post something on facebook instead.

Based on my experiences with [replit.com](http://replit.com), [websim.ai](http://websim.ai) and a host of other tools, it feels like it's possible to convert a description of a site into a functioning experience. In fact, the more I play with this type of tooling the more I center on the [importance of the specification of the thing](https://paul.kinlan.me/the-spec-is-important/) you want.

For example, if I have the following prompt. I would expect a site with three pages, an index page, a projects page and about page.

```text
The content will be about Paul Kinlan, a Web Developer and lead of the Chrome Developer Relations team. 

Headshot url: https://paul.kinlan.me/images/me.png

The site should have a marquee resume page that provides a summary of who he is.
An about page with contact details (Email: paul@kinlan.me, Twitter: @paul_kinlan)
A page about his project. It should have a list of projects:
 + reactive-prompt - https://github.com/paulkinlan/reactive-prompt - prompts that react to changes.
 + f - a LLM to JS library - https://github.com/paulkinlan/f
 + reactive-agents - https://github.com/paulkinlan/reactive-agents - build agents that react to input
```

Maybe something like [this](https://web-forge.replit.app/) to should be created.

Oh!

[https://github.com/PaulKinlan/AiWebForge](https://github.com/PaulKinlan/AiWebForge) is the tool that i've built that takes a prompt and creates a runnable site. The theory is that there should never be any manual changes to the server, it should all be specified and defined in a prompt.txt file.

One thing that is working quite well is as the site and the content is fetched and LLM'd into existence, it's then used as context for future requests. This then helps with consistency of things like styles across the site.

What I like about this is that I can very rapidly iterate on ideas, and for the most part the output is what I want.

Now, don't get me wrong there are lots of issues with this right now:

- It's not super quick, so I wouldn't really want to serve this. On the first run for each file it has to pass the entire site through the LLM.
- It doesn't reuse as much shared logic from other files
- While the data is cached, once its evicted from the cache a subsequent fetch could render completely different content
- I ask the LLM to create accessible content and follow best practices, but does it?
- What are the energy cost to generate this? I can't work that out and I don't know if it is more or less than the energy requirements of the people building sites
- It doesn't yet support server side logic, so you can't have a form that posts to a server

Thinking further on that last point and the work that I did on [Runnable JS functions from a prompt](https://paul.kinlan.me/projects/f/), I would love to be able to introduce server runtime functionality. If the site needs a web-form, can we describe what the site needs to collect and how to store it and when the site runs it will just auto-generate the functionality (correctness aside :))

I really like the concept that Ben Thompson talks about (mostly in the context of VR) of just-in-time UI, there's a world where this type of tool could be useful for building a simple UI that gets a very simple task done at run-time.

If you get chance, have a play and let me know what you think.
