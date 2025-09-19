---
slug: fauxmium
date: 2025-09-19T10:12:00
title: fauxmium - browse an infinite imaginary web
description: Everything you see inside the Fauxmium browser is generated on the fly. It is not real.
---

What if every website you visited didn't actually exist until the moment you asked for it? What if the entire web was a unique, AI-generated experience, created just for you, on the fly?

That's the core idea behind my latest project, **Fauxmium**.

Fauxmium is a proof-of-concept that explores what it's like to browse an effectively infinite web. Everything you see inside the Fauxmium browser is generated in real-time by AI. It is not real.

{{<youtube NZ0D2MwNbrM >}}

It works by launching a real Chrome browser, but with a twist. It intercepts every navigation and image request and routes them to a local server. That server then prompts a generative AI model to create the HTML and images for the URL you requested, streaming the content back to your browser. The result is a unique, ephemeral, and often surprising browsing session.

**➡️ [Check out Fauxmium on GitHub](https://github.com/paulkinlan/fauxmium)**

Getting started is simple. If you have Node.js installed and a GEMINI API Key, you can run it with a single command in your terminal. I'd recommend running it with DevTools open to see what's happening under the hood.

```bash
npx fauxmium --devtools
```

Once it launches, just start typing in any URL you can imagine and see what the AI comes up with!

### How It Works (The Gist)

Under the hood, Fauxmium combines a few key components:

1.  **Browser Control:** It uses **Puppeteer** to launch a headful instance of Google Chrome.
2.  **Request Interception:** Puppeteer intercepts every request and sends it to a local proxy server.
3.  **AI Generation:** The local server uses the Vercel AI SDK and the Google Gemini API to handle requests. It takes the URL you requested and uses it in a prompt to ask an AI model to generate the corresponding HTML page or image.
4.  **Rendering:** The generated content is streamed directly back to the browser and rendered.

Currently, it supports text generation from **Google (Gemini)**, **OpenAI**, **Anthropic**, and **Groq**, with image generation handled by Gemini. You can tweak the prompts it uses by editing the text files in the `prompts/` directory—they're re-read on every request, so you can experiment without restarting the server.