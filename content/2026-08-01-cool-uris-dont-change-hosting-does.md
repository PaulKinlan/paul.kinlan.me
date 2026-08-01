---
date: 2026-08-01T10:00:00Z
draft: true
slug: cool-uris-dont-change-hosting-does
summary: >-
  Deno Deploy Classic shut down on July 20th and took a handful of my projects
  with it. The ones that survived have new URLs, so links across this site have
  been updated. The ones that did not are just gone. I had even written a
  redirect from the old host to the new one, and it turns out a redirect is
  useless when the hostname stops pointing at your code at all.
tags:
- web
- links
- hosting
- deno
- link rot
title: Cool URIs don't change, hosting does
---

I wrote a redirect that can never run. Back when I moved [time-to-stable](https://time-to-stable.paulkinlan-ea.deno.net/) to its new home, I did the responsible thing and added a 301 in `main.ts`: if the request comes in on the old hostname, rewrite it to the new one, preserve the path and the query string, send the browser on its way. Twelve lines. Every old link would keep working.

It never fires. Deno Deploy Classic shut down on July 20th, and when a platform shuts down it does not politely keep routing the old hostname to your code so your redirect can do its job. The hostname stops resolving to you entirely. My careful little redirect is sitting in a file, correct, tested, and completely unreachable. The only place it could have run is the one place that no longer exists.

So the links had to be fixed by hand, in the content, on my own site. Every post that pointed at `time-to-stable.deno.dev` now points at `time-to-stable.paulkinlan-ea.deno.net`. That is four posts going back to 2022, which is not a lot of work, and that is sort of the point: it was not hard, it was just something only I could do, and nobody else with a link to those pages can do it for their own site.

The migration guide is honest about this, in the flattest possible language. Your Classic projects do not transfer to the new platform. Nothing migrates automatically. Your KV data does not come with you, email support if you want help moving it. I read that and understood it as a policy decision rather than a technical constraint, because it is one. Someone decided that the cost of carrying every existing project forward was higher than the cost of every existing project breaking.

I think that is a bad trade, and I say that as someone who likes Deno a lot and has built plenty of things on it. The whole pitch of a hosting platform is that you stop thinking about the hosting. You put a thing on the internet and it stays on the internet. When the platform breaks that, it is not just an inconvenience for the person who has to redeploy. It is every link, in every post, in every feed reader, in every bookmark, in every search index, in every model that scraped the page, all of it now pointing at nothing.

Some things came back. time-to-stable is running, and so are a couple of newer experiments. Some things did not. [Full RSS](https://github.com/PaulKinlan/full-rss), which turned partial feeds into full ones and which I used every day, is gone. So is [bcd-training](https://github.com/PaulKinlan/bcd-training), the browser compat data explorer I built while working out how to query BCD with an LLM. So is the baseline demo, and the button classifier from the Fresh and TensorFlow post, and superduperfeeder, my WebSub hub. The code is all still on GitHub. The running versions are not, and a demo that you cannot click is a screenshot with extra steps.

What bothers me is how familiar this shape is. I spent a while recently measuring how many external links publishers have removed from their homepages, and worrying about the web's link graph thinning out. That was about publishers choosing not to link outward. This is the other half of the same problem. You can link outward as generously as you like, and it does not matter if the thing you linked to has been switched off. The graph does not care whether the edge was never created or whether the node was deleted. It thins either way.

Tim Berners-Lee wrote "Cool URIs don't change" in 1998, and the argument was always that changing a URI is a choice, usually a lazy one. The version I keep running into is that you can make every right choice at your own layer, own your domain, write your redirects, keep your content in git, and still lose the URL, because the layer underneath you made a different choice and did not ask.

The obvious lesson is to own more of the stack, and I will probably move the things I care about to somewhere I control more of. But I notice that every time this happens the advice is the same, and it is always addressed to the person who lost their links rather than to the platform that deleted them.
