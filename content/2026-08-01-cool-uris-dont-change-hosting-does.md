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

Most of it came back, but none of it came back for free. Every project failed for a different reason, and none of the reasons were in my code when I wrote it.

[Full RSS](https://full-rss.paulkinlan-ea.deno.net/) failed because KV is no longer something you just get. The new platform wants a database provisioned and explicitly attached to the app, so a top-level `await Deno.openKv()` now throws before the app can start. Its config file was also still in the old format, which the new tooling refuses to parse at all.

[bcd-training](https://bcd-training.paulkinlan-ea.deno.net/) and the [baseline demo](https://baseline.paulkinlan-ea.deno.net/) both failed twice over. The old `std/http` `serve` helper hardcodes port 8000 where the platform now assigns one. And `@mdn/browser-compat-data` had quietly dropped the default export that my type annotation depended on, so I had to pin a version from 2023 to get a build at all. The baseline demo had a third problem: one import came from a CDN that is not on Deno's default allowlist, so it was refused outright.

Then there was the one that cost me the most time and taught me the least. An empty `include` array in the config, which I had written myself assuming it meant "no filter", is actually an explicit empty allowlist. Zero files get uploaded. The build then fails with "entrypoint not found" while the tool cheerfully reports that there was nothing to upload, which are two true statements that together tell you nothing.

The button classifier from the Fresh and TensorFlow post is still down. It builds fine now, but it is a 2023-era Fresh app and its server bootstrap does not survive contact with the new runtime. superduperfeeder, my WebSub hub, I have retired rather than fixed. It leans on queues, and I would rather delete it than pretend it works.

What bothers me is how familiar this shape is. I spent a while recently measuring how many external links publishers have removed from their homepages, and worrying about the web's link graph thinning out. That was about publishers choosing not to link outward. This is the other half of the same problem. You can link outward as generously as you like, and it does not matter if the thing you linked to has been switched off. The graph does not care whether the edge was never created or whether the node was deleted. It thins either way.

Tim Berners-Lee wrote "Cool URIs don't change" in 1998, and the argument was always that changing a URI is a choice, usually a lazy one. The version I keep running into is that you can make every right choice at your own layer, own your domain, write your redirects, keep your content in git, and still lose the URL, because the layer underneath you made a different choice and did not ask.

The obvious lesson is to own more of the stack, and I will probably move the things I care about to somewhere I control more of. But I notice that every time this happens the advice is the same, and it is always addressed to the person who lost their links rather than to the platform that deleted them.
