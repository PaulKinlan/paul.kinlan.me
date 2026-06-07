---
date: 2026-06-07 22:15:00
draft: true
slug: six-threads-i-keep-pulling-on
summary: A map of the thinking behind my AI blog aifoc.us. Stepping back from a year
  of posts, six threads keep recurring: how stale model knowledge rots the web developers
  inherit, web intents finally arriving through WebMCP, the browser as a sandbox for
  prompt-defined programs, agent loops and what they unlock, generated content and
  content negotiation, and a few other openings like transclusion and web components.
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
- thesis
title: Six threads I keep pulling on
---

I have been writing a lot over at [aifoc.us](https://aifoc.us/), my blog about AI and the web. When I started it I thought I was writing one-off posts. Looking back, I clearly was not. The same handful of ideas keep showing up, each post pulling a little harder on a thread I had tugged in an earlier one. This is my attempt to lay the threads out in one place, both for you and for me, so I can see the shape of what I actually think.

There are six.

## Models inherit a stale web, and that rots what they build

The thing I keep coming back to is that the models we now write code with learned from a web that is already old. I made [the model gap](https://aifoc.us/the-model-gap/) to show this concretely: measured in Chrome releases, even the freshest model is several versions behind, and most are ten to twenty behind. The knowledge cutoff is not a footnote, it is the lens the model sees the whole platform through.

That connects to [model half-life](https://aifoc.us/model-half-life/), where I looked at how quickly models are superseded, and to [dead framework theory](https://aifoc.us/dead-framework-theory/): if a framework stops appearing in fresh training data, the models stop reaching for it, and the framework quietly dies regardless of its merits. The flip side is [quality](https://aifoc.us/quality/), where the code coming out genuinely is getting better, and [on-device](https://aifoc.us/on-device/), where I wrestle with the gap between what runs in the browser and what runs on a server. The uncomfortable conclusion across all of these is that the web inside the model is the web developers actually inherit, and right now it is a year out of date and getting staler with every release.

## Web intents, finally, through WebMCP

I have been trying to give the web a federated way to link to functionality for over a decade. I wrote [what happened to web intents](https://paul.kinlan.me/what-happened-to-web-intents/) and later [reinventing web intents](https://paul.kinlan.me/reinventing-web-intents/) about the first attempt and its failure. The idea never left me.

WebMCP is the thing that finally makes it plausible. I argued the case in [webmcp is the new web intents ... maybe](https://aifoc.us/webmcp-is-the-new-web-intents/), and then, once I had actually built a relay that discovers and reuses a page's tools across sites, I dropped the maybe in [i think i've got it](https://aifoc.us/i-think-ive-got-it-web-intents/). This sits on top of older thinking about why the link is the web's most underrated primitive ([a link is all you need](https://aifoc.us/a-link-is-all-you-need/)), what an addressable unit of the web should look like for agents ([slice for agents](https://aifoc.us/slice-for-agents/), building on [SLICE](https://paul.kinlan.me/slice-the-web/)), and the unsettling fact that you never really know what is on the other end of a link ([dangerous](https://aifoc.us/dangerous/)).

## The browser is a sandbox for prompt-defined programs

If a program is mostly a prompt, then the interesting question is where you run it safely. I think the browser is the answer, which is the argument in [the browser is the sandbox](https://aifoc.us/the-browser-is-the-sandbox/). That follows from [the prompt is the program](https://aifoc.us/prompt-is-the-program/), where the entire application is a markdown file, and [shipping a prompt](https://aifoc.us/shipping-a-prompt/), where the portability of a prompt becomes the distribution model.

I have been poking at the edges of this too: [building a claw in the browser](https://aifoc.us/building-a-claw-in-the-browser/) is a genuinely dangerous experiment in how much access an in-page agent can get, and [how might a browser be developed](https://aifoc.us/how-might-a-browser-be-developed/) asks what the browser even becomes when this is the workload it has to host.

## Agent loops, and what they actually enable

Once you have written a few agents the loop stops being the interesting part, which is more or less the opening line of [where agents actually run](https://aifoc.us/where-agents-actually-run/). I built my own provider-agnostic loop and wrote it up in [agent-do](https://aifoc.us/agent-do-my-agent-loop/). The loop is a commodity; what it enables is not.

What it enables is the rest of this cluster: a whole small company replaced by agents in a container ([business in a box](https://aifoc.us/business-in-a-box/)), the strange new economics of paying for tokens instead of people ([the token salary](https://aifoc.us/the-token-salary/), [token slinging](https://aifoc.us/token-slinging/)), and the sheer volume of machine-authored work already landing, which I measured in [damn claude, that's a lot of commits](https://aifoc.us/damn-claude-thats-a-lot-of-commits/).

## Generated content and content negotiation

This is the thread I find most exciting for the web specifically. If a page can be generated on demand, the old idea of [content negotiation](https://aifoc.us/hyper-content-negotiation/) gets a second life: the server does not pick from a few fixed representations, it generates the one you asked for. I keep using [NotebookLM as the proof](https://aifoc.us/if-notebooklm-was-a-web-browser/) that a tool which generates a custom view of a corpus is already a kind of browser.

Around that sit a cluster of related moves: [interception](https://aifoc.us/interception/) of requests to synthesise responses, [hypermedia](https://aifoc.us/hypermedia/) and the Memex lineage, what happens to the [CMS](https://aifoc.us/whither-cms/) when content is generated, how any of this gets [indexed](https://aifoc.us/indexing/), the falling [latency](https://aifoc.us/latency/) that makes generating UI on the fly viable, the [AI-powered site mashups](https://aifoc.us/ai-powered-site-mashups/) that follow, and the [super-apps](https://aifoc.us/super-apps/) that hint at a world where you barely open a browser at all.

## A few other openings

Two more that do not fit neatly but I cannot let go of. [Elements](https://aifoc.us/elements/): web components are a quietly perfect packaging format for agent-generated UI, and almost nobody frames them that way. And [embedding](https://aifoc.us/embedding/), which is really about transclusion, pulling live functionality from one site into another, the E in SLICE and an old web dream that agents might finally make real. [Headless stopgap](https://aifoc.us/headless-stopgap/) sits near here too, on how our separations of concern keep getting reinvented.

---

Laid out like this, the through-line is obvious to me in a way it was not while I was writing the individual posts. Every thread is the same question asked from a different angle: what does the web become when the thing on the other end of the link, and increasingly the thing reading it, is a model. The platform did not stop moving, the models are behind, the linking story is unsolved, and the substrate to run prompts safely is already in everyone's hands. That is the web I want to spend the next year building toward, and most of what I make now is just me pulling on one of these six threads to see what comes loose.
