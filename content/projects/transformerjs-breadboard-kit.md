---
date: 2024-02-23 07:45:00
description: A TransformerJS kit for breadboard
slug: transformerjs-breadboard-kit
summary: I've created a new Breadboard kit for TransformerJS, which allows you to
  run HuggingFace models locally on devices.  This is useful for LLM-related tasks
  where cloud access isn't ideal.  The kit is available on GitHub (https://github.com/PaulKinlan/transformerjs-breadboard-kit)
  and can be installed via npm with `npm i @paulkinlan/transformerjs-breadboard-kit`.  Included
  is an example of creating a Breadboard agent for text summarization.
tags:
- Breadboard
- TransformerJS
- HuggingFace
- LLM
- JavaScript
- npm
- local inference
title: transformerjs-breadboard-kit

---

A lot of the tools that I build that interact with LLMs are built with Breadboard. I needed to be able to run a number of tasks on the device that I have the board without using an LLM in the cloud. [TransformerJS](https://huggingface.co/docs/transformers.js/en/index "https://huggingface.co/docs/transformers.js/en/index") is a great API for JS developers to work with a number of different models that are hosted on HuggingFace. To get this working with breadboard I needed to create a Kit.... so here we are.

You can find the [code here](https://github.com/PaulKinlan/transformerjs-breadboard-kit "https://github.com/PaulKinlan/transformerjs-breadboard-kit") and if you are using breadboard you can install it as `npm i @paulkinlan/transformerjs-breadboard-kit`

To create an Breadboard agent you can do it as follows:

```
import { board } from "@google-labs/breadboard";
import { sentiment } from "@paulkinlan/transformerjs-breadboard-kit"

export default await board(({ text, model }) => {
    text.isString();
    model.isString();

    const summarynode = transformersjs.summarize({
      $id: "summary",
      input: text,
      model,
    });

    return summarynode.to(base.output());
  }).serialize({
  title: "Summary board",
  description: "Runs the summarization analysis with transformer JS",
  version: "0.0.2",
});
```
