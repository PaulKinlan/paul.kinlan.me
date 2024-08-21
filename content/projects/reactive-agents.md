---
slug: reactive-agents
date: 2024-08-21T13:42:00
title: Reactive Agents
description: ''
---

I\'ve been pretty enamoured by [Preact\'s Signals API](https://preactjs.com/guide/v10/signals/) and how it makes it easy to build applications that respond to state and environment changes, so following on from the [reactive-prompt](https://paul.kinlan.me/projects/reactive-prompts/) API that I built the other month, I\'ve been exploring a higher-level `Agents` API that follows the same principles: Agents that can react to their environment using the Signals API.

An Agent is a tool that given an input and a way of working will try to perform all the actions needed to complete the task. `[reactive-agent](https://github.com/paulkinlan/reactive-agent)` is my first attempt at a toolkit for building browser-based applications with Agents using Chrome\'s prompt API.

The general gist is that each \"Agent\" has a persona (How it should think or act), a task (What the user needs it to do) and a context (That data that it should work on). Once it is supplied with data it should try to run to complete the task it was given.

In this framework, each Agent will only run (or react) when their input changes. This allows you to chain the output of one Agent into the input of another and build complex chains of agents that might only partially update as the state of the application changes.

```JavaScript
import { effect } from "@preact/signals-core";
import { Agent } from "@paulkinlan/reactive-agent";

const interviewer = new Agent({
  persona: "You are a pirate and you speak like a pirate",
  task: "You need to find out how old the user is"
});

interview.context.value = "Paul Kinlan";

effect(() => {
  // This is where the agent starts to get resolved.
  console.log(interviewer.response.value)
})
```

This Agent isn\'t particularly useful, all it can do is come up with a question. So once the agent has decided on a question, you need to get an answer from the user. This is where the `Human` Agent comes in. In the code below we are connecting the input `context` of the `Human` to the output of the Pirate Agent.

```
import { effect } from "@preact/signals-core";
import { Agent, Human } from "@paulkinlan/reactive-agent";

const agent = new Agent({
  persona: "You are a pirate and you speak like a pirate",
  task: "You need to find out how old the user is"
})

const human = new Human({});

effect(() => {
  human.context.value = agent.response.value;
});

effect(() => {
  console.log(human.response.value)
});

agent.context.value = "Paul Kinlan";
```

The `Human` agent is a representation of the user in the flow of data through the Agent. The more important part of this is we are chaining the output of one agent into another.

A more interesting Agent would be one that perform actions, or more specifically can call existing JS functions. A Tool calling agent can work out which function to call and what parameters to provide based on the input context.

In this case, the persona and task are pre-configured and can\'t be changed.

```JavaScript
import { effect } from "@preact/signals-core";
import { ToolCaller } from "@paulkinlan/reactive-agent";

const toolCaller = new ToolCaller({
  tools: [
    {
      func: function getWeather(location) { return `It's Hot in ${location}`; },
      description: "Get the weather for a given location"
    },
    {
      func: function getTime(location) { return Date.now(); },
      description: "Get the time for a given location"
    }
  ]
})

effect(()=> {
  // Log the result of the function call.
  console.log(toolCaller.context.value)
});

toolCaller.context.value = "What is the weather in London?";
```

This project is just an experiment, and like with [Breadboard](https://github.com/breadboard-ai/breadboard), I love the idea of describing LLM based applications as graphs of data-flow. This might not be the way to build applications in the future, but it feels pretty powerful. I also think that Preact\'s Signals (well, Signals in general) are an incredibly powerful mechanism for managing data flow in an application and they don\'t have to be used just for updating UI.
