---
slug: idb-as-a-vector-database
date: '2023-05-07T19:15:01'
title: IndexedDB as a Vector Database
published: true
tags:
- openai
- vectordb
draft: false
---

As I started to play with Open AI and some Generative ML ideas, I said ["There are database companies that just focus on Vector search :mind-blown:"](https://paul.kinlan.me/building-ask-paul/). My mind is still blown that this is an industry, but as I play with [Polymath](https://github.com/polymath-ai/polymath-ai) and [Pinecone](https://www.pinecone.io/) it is clear that they are useful services, and the tinkerer that I am wanted to tinker about with the idea of running this type of database directly in the browser. (If you are wondering "What is a Vector Database and why do I need one?", then [this article](https://www.pinecone.io/learn/vector-database/) is a good start)

The other week I spent some time building "**Vector IDB**" ([source](https://github.com/PaulKinlan/idb-vector)) as an experiment for making something similar to the structure that Pinecone has. The API surface is relatively plain, there are all the standard utilities: `insert`, `delete`, `update`, `query` and they can be used as follows.

```JavaScript
import { VectorDB } from "idb-vector";

const db = new VectorDB({
  vectorPath: "embedding"
});

const key1 = await db.insert({ embedding: [1, 2, 3], "text": "ASDASINDASDASZd" });
const key2 = await db.insert({ embedding: [2, 3, 4], "text": "GTFSDGRG" });
const key3 = await db.insert({ embedding: [73, -213, 3], "text": "hYTRTERFR" });

await db.update(key2, { embedding: [2, 3, 4], "text": "UPDATED" });
await db.delete(key3);

// Query returns a list ordered by the entries closest to the vector (cosine similarity)
console.log(await db.query([1, 2, 3], { limit: 20 }));
```

Because it is just a wrapper over IndexedDB you can throw JSON documents at it, and as long as it has an instance of an `Array` on the property referenced by `vectorPath` all should just work. It will create a IndexedDB for you with an objectStore and an index that is based on the defined vector.

Now, this is no way a complete solution. There are no optimisations of the index; it doesn't do any pre-filtering to optimise they size query space; it doesn't do post-filtering of results (outside of the \[limit\] argument) etc etc, but it was certainly fun to learn a bit about Vector Databases and how they can be used when storing and querying `embeddings` from APIs like Open AI directly inside a browser without having to use a hosted solution.

If you have experience building these types of databases, I would love to hear from you and learn what I might be missing.