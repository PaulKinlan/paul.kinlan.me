---
slug: querying-browser-compat-data-with-a-LLM
date: "2023-04-11T13:19:43"
title: Querying browser compat data with a LLM
---

I've been noodling about a lot with LLMs recently and naturally I wanted to see if they could help me with my role. There's a lot of places I've found them to be useful, but an area where I've struggled is their data sources not being up to date with the current state of the web.

I build a lot of sites and speak to a lot of Web Developers and a huge problem we have is knowing what APIs are supported so that I can use and rely on it in my sites without having to worry about compatibility as much. There are a number of sites that have this information ([canisuse](https://caniuse.com) and [MDN](https://developer.mozilla.org/en-US/)), however if the LLM isn't up to date on the latest state of browsers then we can't query compatibility information.

Luckily, the raw [Browser Compat Data](https://github.com/mdn/browser-compat-data) by MDN is here to the rescue ([again](https://paul.kinlan.me/what-is-new-on-the-web/)), and the team build and maintain the BCD data as an ongoing and always up to date resource in JSON. This gave me an idea - if I can load this data into my [Polymath](https://github.com/polymath-ai/polymath-ai) instance then I might be able to ask a question like:

- I need to use Safari, Firefox and Chrome - is CSS Grid ok to use?
- When did CSS Grid become useable in Safari, Firefox and Chrome?

The hypothesis I had was that we have all the data so an LLM might be able to infer decent results to questions like the above.

The first step I tried was to pass some raw JSON data into GPT-4 and see what it could infer - It worked okay but it doesn't have a clear comprehension of the data format so it made a lot of mistakes, for example if it saw support value "mirror", it outputted "supported in Chrome" and not the base engine (i.e, Safari on iOS mirrors Safari or WebKit). The answer was good enough for me that I decided that I wanted to flesh it out a bit more and try and massage the input data into something the LLM might better work with.

My hypothesis was that the LLM might parse written English better, so I quickly threw together a complete list of all the APIs tracked by [BCD with an English description of the support matrix](https://bcd-training.deno.dev/) that expanded on the data in the JSON file. For example, here is the support data for [acos](https://bcd-training.deno.dev/feature?id=css.types.acos) (you can see the code in my [github repo](https://github.com/PaulKinlan/bcd-training)).

I then ingested all the data into my Polymath instance ([creating the Embedding vectors](https://paul.kinlan.me/building-ask-paul/)) and uploaded it to the data store so that you can now query it like so: [When did CSS acos arrive in Chrome?](https://paul.kinlan.me/ask-paul?query=When+did+CSS+acos+arrive+in+Chrome%3F) and [I need to use Safari, Firefox and Chrome - can I use css.acos?](https://paul.kinlan.me/ask-paul?query=I+need+to+use+Safari%2C+Firefox+and+Chrome+-+can+I+use+css.acos%3F)

A fun experiment and it seems to work well, but it's only as good as the data I put in and the quality of the LLM (I imagine it can make up things so I wouldn't really trust the output just yet).
