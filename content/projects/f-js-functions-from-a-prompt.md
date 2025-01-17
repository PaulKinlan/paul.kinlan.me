---
slug: f
date: 2025-01-17T14:12
title: f - JS functions from a prompt
description: JS functions from natural language
---

My buddy Dion made a great post \"[English will become the most popular development language in 6 years](https://blog.almaer.com/english-will-become-the-most-popular-development-language-in-6-years/ "https://blog.almaer.com/english-will-become-the-most-popular-development-language-in-6-years/")\". Dion\'s vision is pretty expansive, but it really tickled my brain.

I\'ve been [creating a fair number of web-apps with Replit.](https://paul.kinlan.me/generated-web-apps/ "https://paul.kinlan.me/generated-web-apps/") These \"agents\" are awesome, they take me through the entire app process. But what if I just want a small bit of my application written in English? How far can we get?

`f` is a [small JavaScript library](https://www.npmjs.com/package/@paulkinlan/f "https://www.npmjs.com/package/@paulkinlan/f") that I\'ve created

```
const isOdd = await f`is a given number odd?`;
console.log(isOdd(101))
```

Fun! who needs npm when when you can use an entire LLM to determine if a number is Odd or not :D

It can get a fair bit more complex. How about fetching data from a URL?

```
const spaceData = await f`fetch JSON from https://api.spaceflightnewsapi.net/v4/articles/`;
```
^

```
const news = await spaceData();
```

This will (in most cases) create a function that will fetch and return the data from the given URL.

Wouldn\'t it be nice if we could create a URL from this data?

```
// Describe the data structure so the the UI prompt has a better idea of what to build.

const schema = await f`Return a JSON Schema for a given object. The schema should be in the format defined in https://json-schema.org/understanding-json-schema/reference/object.html and should include all the properties of the object. The schema should include the type of the property, the format of the property, the required status of the property, and the description of the property. The schema should include all the properties of the object. The schema should include the type of the property, the format of the property, the required status of the property, and the description of the property.`;

// Describe the data
const schemeDescription = schema(spaceData);

const spaceUI = await f`Using the data defined in <output> create a UI that will best display the space flight information. The developer will provide the data as a parameter and it will be in the format defined in <output>.
    
<output>${JSON.stringify(schemeDescription)}</output>`;

document.body.appendChild(spaceUI(news));
```

![Screenshot 2025-01-17 at 14.28.38.png](/images/Screenshot%202025-01-17%20at%2014.28.38.png)Fun!

I don\'t know if this is the future. You are heavily reliant on the LLM being good (Claude has consistently good results) - Gemini Nano and Code Llama struggle to generate valid results. Outside of simple functions it\'s also hard (for me) to get consistent results, so each time that you run the function it might produce a different program.

Full example:

```
import { create } from "@paulkinlan/f";
import {
    prompt,
    ClaudePromptConfiguration
} from "@paulkinlan/reactive-prompt/claude";

const config = new ClaudePromptConfiguration({ debug: true });

config.dangerouslyAllowBrowser = true;
config.key = window.prompt("API Key");

// Because we can use many different LLMs we need to pick one.
const f = create(
  prompt,
  config
);

const fetchNews = await f`fetch JSON from https://api.spaceflightnewsapi.net/v4/articles/`;

// Get the news.
const news = await fetchNews();

// If we can describe the object UI gnereation is a bit easier.
const schema = await f`Return a JSON Schema for a given object. The schema should be in the format defined in https://json-schema.org/understanding-json-schema/reference/object.html and should include all the properties of the object. The schema should include the type of the property, the format of the property, the required status of the property, and the description of the property. The schema should include all the properties of the object. The schema should include the type of the property, the format of the property, the required status of the property, and the description of the property.`;

const schemeDescription = schema(news);

const spaceUI = await f`Using the data defined in <output> create a UI that will best display the space flight information. The developer will provide the data as a parameter and it will be in the format defined in <output>.
    
<output>${JSON.stringify(schemeDescription)}</output>`;

document.body.appendChild(spaceUI(news));
```