---
date: 2024-02-20 10:12:00+00:00
description: tldr.rocks is a simple site that summarizes the sentiment of Hacker News
  posts.
slug: tldr-rocks
summary: I created tldr.rocks, a simple site that summarizes Hacker News posts and
  comment sentiment.  As a DevRel, it's crucial to understand developer sentiment
  towards our work. This tool helps me quickly identify key comments and critical
  challenges, although it doesn't replace direct engagement with the community.  It's
  built with Hugo, uses Breadboard to manage the Generative AI, and leverages Anthropic's
  Claude via my \"Claude Kit\" Breadboard integration.
tags:
- Hacker News
- Sentiment Analysis
- Summarization
- DevRel
- Developer Relations
- Generative AI
- Claude
- Anthropic
- Breadboard
- Hugo
- tldr.rocks
title: tldr.rocks

---

[tldr.rocks](http://tldr.rocks "http://tldr.rocks") \[[code](https://github.com/PaulKinlan/tldr.rocks "https://github.com/PaulKinlan/tldr.rocks")\] is a simple service that I created to summarize the Hacker News posts and the sentiment of the comments.

I built this tool because as part of a DevRel team it\'s important to understand how the people that we work with (developers) feel about our work and the platform as a whole. It can take a lot of time to go through each of the comments to understand what the issues are, so I built this tool to help me find the most important comments.

This tool isn\'t a replacement for spending time in the ecosystem and understanding needs, but helps to identify critical challenges and how teams might address them.

The UI is a simple Hugo static CMS. The Generative AI is managed by [Breadboard](https://github.com/breadboard-ai/breadboard "https://github.com/breadboard-ai/breadboard") (a project that I work on) and Anthropic\'s [Claude](https://docs.anthropic.com/claude/reference/getting-started-with-the-api "https://docs.anthropic.com/claude/reference/getting-started-with-the-api") using the Breadboard \"[Claude Kit](https://github.com/PaulKinlan/claude-breadboard-kit "https://github.com/PaulKinlan/claude-breadboard-kit")\".
