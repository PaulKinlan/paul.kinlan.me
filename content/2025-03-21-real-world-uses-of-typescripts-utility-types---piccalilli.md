---
title: ": Real-world uses of TypeScript’s utility types - Piccalilli"
date: 2025-03-21T23:40:19.408Z
link: https://piccalil.li/blog/real-world-uses-of-typescripts-utility-types/
---
Link: [Real-world uses of TypeScript’s utility types - Piccalilli](https://piccalil.li/blog/real-world-uses-of-typescripts-utility-types/)

I have a bit of love-hate relationship with TypeScript, but there are parts of the typescript Type system that I really like. This article from Piccalilli is a great introduction to TypeScript's utility types (which is one of the areas I like, even though it is a bit complex)

> Utility types are types that modify other types. You can think of them as functions, but they operate on types instead of values. It’s mind bending at first — especially if you’re coming from languages that don’t have anything similar — but we’re going to walk through a load of examples to see how they work.

Mind-bending indeed.

One of my favorite types that I've made is [here](https://github.com/breadboard-ai/breadboard/commit/ef67eed88c3554f2194ce5d8e3a983b45fa80877#diff-ccdffb90d72b12bb1967f030c8defb82761761d6d7553eee711c04c9b6b402c6R107) in Breadboard. It could take a function and return a proxy for that function that had the same calling parameters.... I think... I'm not sure, I wrote it a while ago... heh, that's the "hate" part of the relationship. :D
