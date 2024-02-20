---
slug: tldr-site
date: 2024-02-20T10:59:00
title: tldr-site.vercel.app
description: A simple service to summarize search and news snippets.
---

As part of my role in Developer Relations for Chrome I need to get a quick understanding of what\'s happening around web development broadly, and also for specific areas of interest for the team.

In August 2023 I built this \"tldr-site\" as an experiment to see if I can get useful information out of the summaries provided by search and news feeds, with the goal of giving me a high-level overview so that I can then go and deep dive into the actual results.

* [Summarize a search](https://tldr-site.vercel.app/ "https://tldr-site.vercel.app/")

* [Summarize the News](https://tldr-site.vercel.app/news "https://tldr-site.vercel.app/news")

I use this quite frequently, for example I needed to get a quick overview of what people thought of the Web Environment Integrity API so that I could make some recomendations internally.

The [Code](https://github.com/paulkinlan/tldr.site "https://github.com/paulkinlan/tldr.site") uses Breadboard as the engine to manage the flow of data through the query to the Google Search API or the News feeds and then on to the LLM.

It works pretty well, but clearly it doesn\'t have enough context because the snippets in search and news are very limited. A future iteration of this would go and fetch the articles in returned for each result, add that to the context and summarize the results.
