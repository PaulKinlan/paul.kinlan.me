---
date: 2026-06-07T20:17:06.325Z
slug: where-my-head-is-at-with-llms-and-the-web
summary:
  Where my head is at with LLMs and the future of the web... Quite focused actually.
tags:
- ai
- web platform
- agents
- webmcp
- web intents
- sandboxing
- generated content
- llm
- agent-do
title: Where my head is at with LLMs and the web
---

I have been writing a lot over at [aifoc.us](https://aifoc.us/) for the past year (actually, my last post on this site was a year and a day ago), and I've spent a lot of time exploring the risks and opportunities for the web, and the challenges that I think we need to adapt to as an ecosystem.

I kept it distinct from this site because I know that quite a few web developers who follow my content are not fond (to put it mildly) of LLMs and the AI industrial complex, and I felt it would be good to split the two.

I will keep publishing my posts on the other site, but I thought it might be good to try and pull together the 30-odd posts that I've created and try and explain where my head is at and provide some colour on how I got there.

Before I dive too deep, I think we are potentially in a golden age for the web, with a massive influx of people having major barriers to entry removed. Barriers that once were the reason why people preferred Instagram and similar services are being lowered to the point where anyone can build on our platform (and I'm seeing lots more people building).

Anyway, here we go:

## Models inherit a stale web, and they set us back a year

The thing I keep coming back to is that the models we now write code with learned from a web that is already old. I made [the model gap](https://aifoc.us/the-model-gap/) to show this concretely: measured in Chrome releases (I know, I know, the web is far broader than just Chrome, but also Chrome has easy data to access on chromestatus.com), even the freshest model is several versions behind, and most are ten to twenty behind. The "knowledge" cutoff is a serious issue for the web platform, and the ecosystem of libraries and tools that are being launched but are not easily available to these models is massively gaining traction (Claude Code).

That connects to [model half-life](https://aifoc.us/model-half-life/), where I looked at how quickly models are superseded, and to [dead framework theory](https://aifoc.us/dead-framework-theory/): if a framework stops appearing in fresh training data, the models stop reaching for it, and the framework quietly dies regardless of its merits. I wrote this thesis at least 6 months ago, and I think I've been proven correct (which is why we built Modern Web Guidance). The flip side, though, is that I've found guided output getting better than what people create (I think auto-research loops to optimize web performance, as an example, will massively raise the bar for the quality of the web people experience).

My uncomfortable conclusion across all of these is that the web inside the model is the web that developers actually inherit, and right now it is a year out of date and getting staler with every release.

## We can discover functionality and link to it

I have been trying to give the web a federated way to link to functionality for over a decade. I wrote [what happened to web intents](https://paul.kinlan.me/what-happened-to-web-intents/) and later [reinventing web intents](https://paul.kinlan.me/reinventing-web-intents/) about the first attempt and its failure. The idea never left me; ask anyone who knows me, I never shut up about it.

WebMCP is the thing that finally makes it plausible. I argued the case in [webmcp is the new web intents ... maybe](https://aifoc.us/webmcp-is-the-new-web-intents/), and then, once I had actually built a relay that discovers and reuses a page's tools across sites, I dropped the maybe in [i think i've got it](https://aifoc.us/i-think-ive-got-it-web-intents/). This sits on top of older thinking about why the link is the web's most underrated primitive ([a link is all you need](https://aifoc.us/a-link-is-all-you-need/)).

I want to explore more about what an addressable unit of the web should look like for agents, building on [SLICE](https://paul.kinlan.me/slice-the-web/), and how it might evolve. Naturally, there is a lot of worry about the I in SLICE that I want to explore a little bit more.

## The browser is an amazing sandbox and other platforms are racing to what we have already

If a program is mostly a prompt, then the interesting question is where you run it safely. I think the browser is the answer, which is the argument in [the browser is the sandbox](https://aifoc.us/the-browser-is-the-sandbox/). That follows from [the prompt is the program](https://aifoc.us/prompt-is-the-program/), where the entire application is a Markdown file, and [shipping a prompt](https://aifoc.us/shipping-a-prompt/), where the portability of a prompt becomes the distribution model.

I have been poking at the edges of this too: [building a claw in the browser](https://aifoc.us/building-a-claw-in-the-browser/) is a genuinely dangerous experiment in how much access an in-page agent can get.

I really think we should be exploring this space a lot more, making some small changes to the platform (heh, Safari doesn't have CSP3) and really pushing on what every super-app platform doesn't yet have that can really differentiate the web.

## Agent loops, and what they actually enable

Once you have written a few agents, you see that we have a new pattern for software (that people call agent loops). It is slower and vastly more expensive, but it is also opening up a world where it's easier and easier for people to instruct their machines and get accurate results. It's rather incredible, and it reminds me of how much more approachable HTML was when I started.

I built my own provider-agnostic loop, wrote it up in [agent-do](https://aifoc.us/agent-do-my-agent-loop/), and it enables me to do a *lot* of experimentation, for example:

* a whole small company replaced by agents in a container ([business in a box](https://aifoc.us/business-in-a-box/))
* [building a claw in the browser](https://aifoc.us/building-a-claw-in-the-browser/)
* [the prompt is the program](https://aifoc.us/prompt-is-the-program/), where the entire application is a Markdown file
* and [shipping a prompt](https://aifoc.us/shipping-a-prompt/)

I know I linked to these above, but I think the browser sandbox and agent loops are going to change a lot about how web experiences could be built in the future. I don't think we are there yet, but I can imagine a world where entire websites and services are higher-level instructions and design guidance.

## Development is changing quickly

I really don't know what else to say about this: the sheer volume of machine-authored work already landing, which I measured in [damn claude, that's a lot of commits](https://aifoc.us/damn-claude-thats-a-lot-of-commits/), is astounding, and it could lead to strange new economics of paying for tokens instead of people ([the token salary](https://aifoc.us/the-token-salary/)) and how we charge for services ([token slinging](https://aifoc.us/token-slinging/)).

I'm personally fully on board with these tools, and I think I've become quite proficient. While I do encourage people to understand how the platform works and how the browser works, I don't think we are going back at all. In fact, everything will accelerate now that the technology and tools exist.

## Generated content and content negotiation

This is the thread I find most exciting for the web specifically. If a page can be generated on demand, the old idea of [content negotiation](https://aifoc.us/hyper-content-negotiation/) gets a second life: the server does not pick from a few fixed representations, it generates the one you asked for. I keep using [NotebookLM as the proof](https://aifoc.us/if-notebooklm-was-a-web-browser/) that a tool which generates a custom view of a corpus is already a kind of browser.

I'm personally kind of shocked there isn't more experimentation about how the future of sites and browsers might work. As tools that generate content get higher quality and quicker, they are going to open up new areas of the platform:

* If we can [intercept](https://aifoc.us/interception/) requests to synthesise responses, what does it enable?
* If we take [hypermedia](https://aifoc.us/hypermedia/) to the extreme and enable any content to be turned into experiences that people prefer, what will happen? I know a lot of folks who learn via manga; why shouldn't they be able to consume content in their preferred format?
* I think we now have the Memex, so what happens to the [CMS](https://aifoc.us/whither-cms/) when content is generated (hint: they can adapt), and how can markup change to be more expressive ([Headless stopgap](https://aifoc.us/headless-stopgap/))?

There's going to be even more change to the web as the [latency](https://aifoc.us/latency/) of models falls, making generating UI and new content modalities on the fly viable (and I think sites should lean into generating content in the form their users prefer).

Maybe we can also get back to [site mashups](https://aifoc.us/ai-powered-site-mashups/), and stave off the threat of [super-apps](https://aifoc.us/super-apps/) (btw, this is a huge risk.)

## How browsers might adapt

First, [super-apps](https://aifoc.us/super-apps/) are coming, and they hint at a world where you barely open a browser at all. It might be a little way off, but I would love browser vendors to work out how the web will remain a first-class citizen if this happens. That's why I think WebMCP is critical, as is exploring what is listed below.

[Elements](https://aifoc.us/elements/): web components are a quietly perfect packaging format for agent-generated UI, and almost nobody frames them that way.

Can we bring in primitives and interactions that you don't get on other platforms? I'd love for us to explore how the link might evolve. I did this in [embedding](https://aifoc.us/embedding/), which is really about transclusion: pulling live functionality from one site into another, the E in SLICE, and an old web dream that agents might finally make real.

I built a lot of demos to try and show this in action:

> - [Hyperlink Experiment](https://github.com/PaulKinlan/hyperlink): There is a lot in here.... I struggle with the hubris the industry has around the link. I set out to experiment with the concept of linking on the web and I really want to encourage people to really push the boundaries of what a link is and, if possible, how technologies like LLMs and image recognition models change how the web fundamentally works.
>
>  - [Merge](https://github.com/PaulKinlan/hyperlink/tree/main/packages/merge) - [Extension](https://chromewebstore.google.com/detail/merge-link/ffpcdfloldhbeielaoiblgalmpkalnjo) - One of the things I love about the web is that you don't really know what is on the other side of a link. One of the things I dislike is that you don't know what is on the other side of a link. I also wonder what the intent of a link is.
>  - [Trails](https://github.com/PaulKinlan/hyperlink/tree/main/packages/memex-join) - [Extension](https://chromewebstore.google.com/detail/trails/cmhofadlaokelmccnocbnojdbdnfjhga) - This uses no LLM technology, but I built it with an LLM. Vannevar Bush's "user links" let you create your own links on pages and have them be permanent.
>  - [Summary](https://github.com/PaulKinlan/hyperlink/tree/main/packages/summary) - Hover over a link and get a summary of what is on the linked page before you click it.
>  - [Stretch Text](https://github.com/PaulKinlan/hyperlink/tree/main/packages/stretchtext) - Taking Ted Nelson's idea and trying to make it usable. Select some text and zoom in (expand) or zoom out (summarize). After reading Ted Nelson's ideas on this, it was up to the author to offer this, and knowing how people publish on the web, people just aren't going to do this. LLMs make it possible to add extra context or summarize it. I didn't really test this too much in the end because I wanted to get Merging and Trails working.
>  - I made a lot of other experiments, such as linking into images with descriptions, and also making it easy to do [image maps again by using English (using the Segment Anything model)](https://github.com/PaulKinlan/hyperlink/tree/main/packages/image-links/src) instead of points. [Link to audio content via timestamps with a Whisper-like model.](https://github.com/PaulKinlan/hyperlink/tree/main/packages/audio-link) [Pull in the UI of a linked element](https://github.com/PaulKinlan/hyperlink/tree/main/packages/ui-links) into the current page, taking the Merge experiment one step further.

If browser vendors choose, they could solve interop issues once and for all. In [how might a browser be developed](https://aifoc.us/how-might-a-browser-be-developed/), I explore how a browser might be developed to the point where the major points of interop difference are fundamental issues of where the browser vendor thinks the web should go. I also go a little further out into some sci-fi.


## The End

That's roughly where I am. There's still lots I will be exploring. 

I am very excited about the future because I think we could continue to see millions more people start publishing on the web, the web getting higher-quality experiences, and waves of new innovation into what the web could be.
