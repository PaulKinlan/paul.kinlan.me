---
date: 2024-06-07 13:52:00
description: ''
slug: reactive-prompts
summary: I've created a small library called `reactive-prompt` that lets you easily
  manage prompts in a reactive way, similar to how you'd build a web app with React.
  It uses Preact's Signals to track changes to inputs and automatically re-runs prompts
  when those inputs update.  This allows for efficient chaining of prompts, where
  the output of one becomes the input of another, and only necessary prompts are re-evaluated.
  The library currently uses Chrome's experimental prompt API but could be adapted
  for other providers like OpenAI or Gemini.  It makes complex prompt flows much more
  manageable.
tags:
- reactive prompts
- prompt chaining
- Preact Signals
- Chrome prompt API
- LLM applications
- Breadboard
- data flow
- web development
- Gemini
- OpenAI
title: Reactive Prompts

---

I\'ve been doing a lot of work on [Breadboard](https://github.com/breadboard-ai/breadboard). Breadboard is great because it changes the way you think about data flow through an LLM application by focusing on thinking about graphs. One of the things it does well is reacting to inputs updating and chaining of prompts. I wanted to see if I can make a simple imperative way to react to changing inputs.

I thought it would be neat to experiment with:

1.  Prompt responses should rerun (aka react) as the inputs to the prompt change (like a Web App with React)
2.  You should be able to chain responses easily, that is the output of one response can be used in another prompt.
3.  It should integrate with Chrome\'s (very experimental)

Preact\'s `Signals` seemed like an ideal way to manage this.

The [`reactive-prompt`](https://www.npmjs.com/package/@paulkinlan/reactive-prompt) library exports a single function called `prompt`. It\'s a tagged template literal which allows you to substitute any variable including Signals. When a Signal is referenced and updated, it\'s prompt will be recalculated.... and now we have reactive prompts.

### Simple Demo

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const name = signal("Paul");

const response = prompt`Say "Hello ${name}".`;

effect(async () => {
  console.log(await response.value);
});

setTimeout(() => name.value = "Serene", 2000);
```

### Prompt Chaining

You can chain multiple prompts together, that is the output of one prompt can be the input of another prompt. For sufficiently complex data flows this means that you only the prompts that need updating will be re-run.

```JavaScript
import { prompt } from "@paulkinlan/reactive-prompt";
import { signal, effect } from "@preact/signals-core";

const nameSignal = signal("Paul Kinlan");

const prompterSignal = prompt`Using "${nameSignal}", extract the following data:

+ First name
+ Surname
+ Date of Birth

Return as valid JSON
`;

const uiBuilderSignal = prompt`You are an expert web developer, and you have been tasked with creating a form for a client. The form should have the following fields: "${prompterSignal}".

Return the required HTML for the form only and populate the default values.`;

effect(async () => {
  output.innerHTML = parseCodeFromMarkdown(await uiBuilderSignal.value);
});

setTimeout(() => name.value = "Jack Jones, 18th May 1967", 5000);
```

## Chrome\'s experimental prompt API

This library relies on Chrome\'s experimental prompt API.

To use this, you need at least Chrome 127 (Dev Channel) and to enable the following flags.

* chrome://flags/#prompt-api-for-gemini-nano
* chrome://flags/#optimization-guide-on-device-model \"Enable Bypass\"

Then go to `chrome://components` and click \"Check for updates\" on \"Optimization Guide On Device Model\". After some time the model will be available.

## What about other prompt APIs?

The `prompt` tagged template is just built for Chrome\'s prompt API, but there is nothing stopping this being being ported to other APIs like OpenAI or Gemini\'s REST APIs.
