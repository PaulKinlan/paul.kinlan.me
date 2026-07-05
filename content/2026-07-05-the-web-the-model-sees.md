---
date: 2026-07-05T10:00:00Z
slug: the-web-the-model-sees
summary:
  A run of recent posts on aifoc.us that I did not plan as a series but which
  turned into one. The thread is that the web a model sees is staler and thinner
  than the one you ship, and I have mostly been trying to find ways to see it.
tags:
- ai
- web platform
- agents
- crawling
- bots
- llm
title: The web the model sees
---

I have written a run of posts over on [aifoc.us](https://aifoc.us/) that I did not plan as a series, but they kinda just plopped out. 

I'm very interested in what the models have visibilty into and the differences between the models, and then by extension what it means for us as web developers. I think we're not in the best position and a lot of the data in the models is supprisingly stale. In [please mind the model gap](https://aifoc.us/please-mind-the-model-gap/) I tried to measure how far behind a model actually is:

> [...] the platform did not stop moving the day the training data was frozen.

The [interactive timeline in that post](https://aifoc.us/model-gap.html) plots each model's cutoff against Chrome releases, and the gap is bigger than most people expect. I don't really know why we don't talk about this more. If I was a library author, or a [new framework author](https://aifoc.us/dead-framework-theory), or heck, I just updated and released a new version, then I would be doing all I could possible to make sure the models had access to it (and search isn't always the answer imo)

I did also try to check whether the "model half-life" everyone keeps citing is even a real thing, and mostly [talked myself out of it](https://aifoc.us/model-half-life/):

> On reflection, model halflife really doesn't make much sense and it's just a bit of a buzzword to mean that models now ship faster.

What surprised me was the lack of data "in the model". I had a lot of fun and I spent a lot of money and a long time on [does a url in a prompt steer an llm's output](https://aifoc.us/influencing-model-output-with-urls/), testing whether a URL sitting in a prompt changes the answer, and the bit that stuck with me was not about URLs at all:

> If your site relies on JavaScript to load its content, that content is very likely not in a model (you might consider that a feature).

You can watch it happen in [the results](https://paulkinlan.github.io/url-influence/results/dashboard.html): the models can't (obvjously) can't recall the data they don't have when given an identifier (a url) that's not in the model. They then recover when you hand them the actual page (kinda obvious). When the content *is* memorised, the URL seems to clearly tilt the output just by being there towards the content that behind that URL, which if this really really is true, I think is something we can take advantage of instead of stuffing our prompts with context, the mere presence of that URL will influence the output to align with what's behind that page - this could be a big win for skills and well established best practices.

During the proccess of creating the post I found that there was 0 recall for ChromeStatus.com and I thought it was a pointer to my idea failing and it turns out that ChromeStatus.com is JS rendered and the content wasn't in things like `CommonCrawl` and by extension depending on what the indexer's did, likely a pointer to the data not being in the model.

That left then left me with a question I couldn't easily answer at the time: when one of the many bots hitting those URLs loads a page, what does it actually *do*? Fetch the HTML and stop? Parse the CSS? Run the JavaScript, or just download the `.js` and move on? So I built [ua-tracer](https://uatracer.com) to watch, and [wrote it up here](https://paul.kinlan.me/ua-tracer/)

The early data already broke an assumption I did not know I was holding, that "an AI read my page" means one thing. It does not. [GPTBot parses your CSS but runs no JavaScript](https://uatracer.com/trace/w0qUMmns), [ClaudeBot stops at the CSS file](https://uatracer.com/trace/GS6aE5u1), and of the OpenAI agents only [OAI-SearchBot runs the script](https://uatracer.com/trace/nrrxKcDC). Point a crawler at [uatracer.com](https://uatracer.com) and you can see what yours does.

Finally, my last post was something I hope was a bit more constructive and shows how web development might change with new tooling. In [how might a modern lighthouse work with large language models](https://aifoc.us/how-might-a-modern-lighthouse-work-with-llms/) I built an audit where the model does the judging rather than a pile of hard-coded checks, and one of the things it looks at is how much of the page exists before any JavaScript runs. I pointed it at one of my own sites ([iwanttouse.com](https://iwanttouse.com)):

> Coverage was 6 percent, that is, only 6 percent of the words a browser eventually renders were in the HTML before any JavaScript ran.

I knew at the time that I was building a JS-powered site, but it was nice to see the LLM pick this up based on the descriptive tests and then offer up a solution for how to fix it.

The [live playground](https://aifoc.us/web-uplift-playground.html) runs the whole find-fix-verify loop on a set of deliberately broken pages, and there is a [full report](https://aifoc.us/web-uplift-report.html) with the  evidence it gathered from the example site if you want to see the shape of the output. 

> I love that this is a loop and not a tool.

I mean... I wrote that bit thinking I was clever, but it's also a tool: `npx web-uplift@latest audit https://paul.kinlan.me/`


