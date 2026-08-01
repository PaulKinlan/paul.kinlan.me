---
date: 2026-07-08T12:00:00Z
draft: true
slug: your-attention-is-all-i-need
summary: >-
  I measured the external link ratios of 95 websites across a decade
  of web archive data (2014 vs 2024). The finding: news publishers have
  dramatically reduced the number of links they make to other sites, and a
  growing number of pages have become invisible to crawlers entirely. The open
  web's link graph is thinning, and I think I know why.
tags:
- web
- links
- publishing
- common crawl
- research
title: "Your Attention Is All I Need"
---

I had a hypothesis. Publishers used to link to each other. They used to link to primary sources, to the articles they were building on, to the research they cited. Somewhere along the way, they stopped. The web became a collection of walled gardens, each hoarding attention, each pointing inward.

It is a feeling a lot of people have. But I wanted to know if it was true.

So I pulled the homepages of 95 websites from the Wayback Machine, from two snapshots a decade apart: 2014 and 2024. For each page I extracted every link in the raw HTML, classified it as internal or external, and measured the ratio. I excluded social media links from a separate cut, because linking to your Twitter account is not the same as linking to a source. I also checked whether the links had actually disappeared or just changed format (hidden behind JavaScript, wrapped in tracking redirects, replaced with click handlers). They had not changed format. They were gone.

The first time I ran the numbers, the BBC looked like a smoking gun. 54% of its links were external in 2014. By 2024 that had fallen to 3%. A staggering collapse. But when I dug into the actual link URLs, 131 of the 135 "external" links in 2014 were to `bbc.co.uk`, the BBC's own UK domain. The BBC had not stopped linking to sources. It had restructured how `bbc.com` and `bbc.co.uk` cross-link. The real number was 4 external links in 2014, falling to 0 in 2024. A much smaller, and much less interesting, story.

That correction matters. If you are going to claim the web is changing, you need to be honest about what you measured and what you did not.

So I fixed the classification. I used the Public Suffix List so that compound top-level domains like `.co.uk` and `.com.au` were handled correctly. I added an organisation-level check so that links between `bbc.com` and `bbc.co.uk`, or between any domains sharing the same organisation name, were not counted as genuine external links. Then I re-ran the numbers.

The aggregate finding is real, but modest. The median genuine external-link ratio (the percentage of links pointing to a genuinely different organisation) fell from 8.5% to 6.5% across the 58 site pairs where both years had real, server-rendered content. If you exclude social media links, the drop is sharper: 7.7% to 5.4%, a 30% decline.

But the aggregate hides where the change is actually happening. It is not spread evenly. It is concentrated, heavily, in news publishers.

Vox went from 97% external links to 12%. Nearly every link on their 2014 homepage pointed to a different site. By 2024, that had collapsed to roughly one in eight. The Wall Street Journal went from 67% to 8%. NBC News from 40% to 9%. Engadget from 28% to 10%. The New Yorker from 19% to 8%. These are not small changes. These are publishers that used to be hubs in the web's link graph, connecting their readers to the wider web, and they have systematically stopped doing so.

There is a second, quieter finding that I think matters as much. Some sites did not just stop linking externally. They stopped having links in their HTML at all. TechCrunch had 345 links in its 2014 homepage. By 2024, the raw HTML had zero. The Atlantic went from 401 links to zero. Both had become JavaScript-rendered single-page applications. The links still exist, you can see them when you load the page in a browser, but they are injected by JavaScript that crawlers and archive services do not execute. From the perspective of the web's link graph, they have vanished.

This is not a small thing. Search engines, research tools, and AI training pipelines all rely on the link graph. When a page moves from server-rendered HTML to client-rendered JavaScript, it does not just change how it looks. It changes whether it exists in the crawled record at all. A growing fraction of the web is becoming invisible to anything that does not run JavaScript.

I found that 4% of pages in 2014 had less than 300 characters of visible text in their raw HTML, which I used as a threshold for "JavaScript shell." By 2024, that had risen to 8%. It is doubling, roughly, and it is still accelerating.

So there are two things happening at once. Publishers are choosing to link less. And the web is moving to a rendering model that makes even the links that do exist invisible to the systems that map it.

The title of this post is a joke, but only sort of. "Attention Is All You Need" was the paper that gave us the Transformer architecture, the foundation of modern language models. But it is also literally what publishers are doing. Your attention is all they need. They do not want to send you somewhere else. They do not want you to leave. Every external link is an exit door, and they are bricking them up, one by one.

The open web was built on the assumption that pages link to each other. That assumption is getting weaker every year. Not because the technology cannot support it, but because the economics of attention reward keeping people inside. And when the links disappear, the crawlers and the models that rely on them see a smaller, thinner web. A web where every page is an island.

I do not think this is a conspiracy. I think it is an incentive structure. Publishers measure engagement, and engagement means time on site, and time on site means fewer exits. External links are exits. So they go.

But the cost is real. A web without external links is a web without context. It is a collection of articles that reference nothing, build on nothing, and point nowhere. It is harder to verify, harder to explore, and harder to trust. And for the crawlers and models that are trying to understand the web, it is a web that is actively shrinking, even as more content is published than ever before.

I am going to keep running this study at scale. The 95-domain sample is enough to see the trend, but I want thousands of domains across Common Crawl data, multiple years, and different verticals. I want to know whether this is a publishing problem or a web problem. I suspect it is both.

In the meantime, the next time you read an article that makes a claim without linking to its source, ask yourself: did they not link because there is no source, or did they not link because they do not want you to leave?
