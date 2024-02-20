---
slug: the-critic
date: 2024-02-20T11:18:00
title: The Critic
description: A tool that helps me to review text from a number of different perspectives
---

I\'m broadly interested in Large Language Models and how they can help Developer Relations (my role).

I spend a lot of time reading proposals for new APIs and initiatives and then providing feedback to the authors to help them make sure that they work well for the ecosystem. A lot of the feedback follows a pattern of \"Have you thought about X?\" (in many cases people have, but it\'s just not mentioned clearly in the text)

I wanted a tool that would help me critique articles, Web specs and API explainers from a variety of different perspectives and help me to provide feedback to the teams writing them so that they can be improved.

[The Critic](https://violet-afraid-quotes-paulkinlan.replit.app/ "https://violet-afraid-quotes-paulkinlan.replit.app/") is a basic UI that lets you configure a number of \"agents\" who take on a persona whose job it is to read the input text and provide a generated \"interpretation\" of the text with areas that should be addressed.

It\'s also not doing anything that you can\'t do with an LLM already (i.e, adding preamble to your question like \"You are an expert in Web Accessibility\"), but it adds a small layer of convenience over an LLMs UI by making the requests for each expert agent at the same time and then creating a report at the end (note, the full report is in the console, but each Agent will have a response).

The UI is very rough, but the tool works pretty well. It\'s built using [Breadboard](https://github.com/breadboard-ai/breadboard "https://github.com/breadboard-ai/breadboard") (again :)) where a Critic is [defined as a board](https://github.com/PaulKinlan/TheCritic/blob/main/ui-src/boards/critic.ts "https://github.com/PaulKinlan/TheCritic/blob/main/ui-src/boards/critic.ts") and the [Panel board](https://github.com/PaulKinlan/TheCritic/blob/main/ui-src/boards/the-panel.ts#L49 "https://github.com/PaulKinlan/TheCritic/blob/main/ui-src/boards/the-panel.ts#L49") will `map` the list of inputs against each critic and article pair.

At the end of the day, it\'s an LLM, it doesn\'t replace what people are supposed to do or absolve the authors from thinking about the critical areas up front, and likewise, just because an LLM doesn\'t reply with something doesn\'t mean the input is perfect either. I found it useful for starting conversations though.
