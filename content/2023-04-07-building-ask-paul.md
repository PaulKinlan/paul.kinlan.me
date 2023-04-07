---
slug: building-ask-paul
date: '2023-04-07T17:36:14'
title: Building Ask Paul
published: false
tags:
- ML
- polymath
draft: false
---

I've been doing a lot of experimentation with Generative Machine Learning and one of the demo's that I've build is called "[Ask Paul](https://paul.kinlan.me/ask-paul)". You can ask me nearly any front-end web development question and the software will give you a direct answer if it can and links to further reading across the sites that I create content for (this blog, [web.dev](http://web.dev) and [developer.chrome.com](http://developer.chrome.com))

You can try it with a couple more queries:

* [How do you centre a div?](https://paul.kinlan.me/ask-paul?query=how+do+you+centre+a+div%3F)
* [Can you use CSS Grid with Safari and since when?](https://paul.kinlan.me/ask-paul?query=Can+you+use+CSS+Grid+with+Safari+on+iOS+%28and+since+when%29%3F)  
* [What is the code to connect to device with Web USB?](https://paul.kinlan.me/ask-paul?query=What+is+the+code+to+connect+to+a+device+with+Web+USB%3F)
    

I'm very happy with the results, and I thought it would be nice to document how I built it because I believe that the technology is a lot more accessible than it was just 6 months ago and it can be integrated into any site.

Goals:

*   I wanted a search function that could easily index content that I gave it
*   I wanted the search to be able to understand related concepts e.g, "PWA" and "Progressive Web App" are the same thing.
*   I wanted to see if I could get the machine to generate a summary that would answer the person's question
*   Did not require JavaScript, and rendered a UI instantly

I used the [Polymath-AI](https://github.com/polymath-ai/polymath-ai) project as the main infrastructure for this project. Polymath-AI is pretty great (I've now contributed some fixes) and it's interesting to me not because of how I integrated it to my site, but rather it's a protocol to query and interrogate a web of repositories of knowledge. If you check out the [CLI](https://www.npmjs.com/package/@polymath-ai/client) you can see that you can query any polymath instance ( e.g, `npx polymath ask "What happened to Web Intents?" --servers https://paul.kinlan.me/polymath --openai-api-key [YOUR OPEN AI API KEY]` ). I thought that this was incredibly powerful because I can ACL my own data and give _you_ complete access to my public data, and selected people access to private data (I'm a big `logseq` user and I have a private repo that I would like to be able to interrogate).

It's worth giving a quick overview of Polymath because it does three things:

1.  It ingests data from the owner of the instance (me in this case), and for each piece of content creates an `embedding vector` which is then stored in a `pinecone` database.
2.  It finds content and links that are related to a persons query. First by creating an `embedding vector` for the persons query and then use cosine-similarity to compare the query vector against all the known contents embedding vector.
3.  It discovers the most similar piece of content to the person's query to insert directly into a query to the Open AI API, with a question of the form: `Answer the question as truthfully as possible using the provided context, and if the answer is not contained within the text below, say "I don\'t know".\n\nContext:{context}\n\nQuestion: {query}\n\nAnswer:`. `context` is the most similar document, and `query` is the person's query.

And it works incredibly well. My mind was completely blown the first time that I saw it working.

I won't cover the ingestion process in this post as it's basically `npx polymath ingest rss [url]` .

It turns out that the plumbing to get this working is achievable and can be hooked up relatively quickly. If you want to host your own instance, you can do something similar to what I've done with the three components that I created.

1. **A UI** - Renders an HTML streaming response from the Polymath Client - that is all. \[[direct link](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/ask-paul.ts)\] ( about 30 lines of HTML and a `fetch` request)
2. **A Polymath Client** - takes a person's query and interacts with any Polymath host - it's configured to connect to my Polymath Host and once it has the data, then queries Open AI with the above request. \[[direct link](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/polymath.js)\]
3. **The Polymath Host** - the implementation of the protocol defined by Polymath - this directly queries my configured pinecone database and will return embeddings that are closest to your query \[[direct link](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/polymath/ask.ts)\] - They great thing is that you don't need to use my UI to query it, you can use your own client (or CLI) `npx polymath ask "Why is Paul so handsome?" --servers https://paul.kinlan.me/polymath --openai-api-key [YOUR OPEN AI API KEY]`
    
_Just a note if you are implementing this_: I had to split it into three pieces because the Polymath client currently only supports the Node runtime and my UI needed to be able to stream a response from Vercel (which at the time was only available on the "Edge Server"). If I can get Node streaming working, then the UI and Client code would be be merged.

And that's it. I'm just at the start of an ML assisted journey and I still struggle to know what I can do with LLM but it's been a wild couple of weeks trying to learn how it all workings.

It's also wild to me that I can quickly build Generative ML experiences that work directly into my site easily. That I can implement your own site search++ quickly and it's a solved problem. There are database companies that just focus on Vector search :mind-blown:

Interesting links:

*  [Client](https://www.npmjs.com/package/@polymath-ai/client)
*  [CLI](https://www.npmjs.com/package/@polymath-ai/cli)
*  [Host](https://www.npmjs.com/package/@polymath-ai/host)