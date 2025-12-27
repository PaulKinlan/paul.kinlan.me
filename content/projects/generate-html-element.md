---
date: 2025-12-27T12:00:00
description: A secure, LLM-powered Web Component that generates and renders interactive HTML or SVG images on the fly using Google Gemini or Chrome's built-in AI.
slug: generate-html-element
summary: I've created the `<generate-html>` Web Component, an LLM-powered tool that generates and renders interactive HTML or SVG images securely using Google Gemini or Chrome's built-in AI. It features a "Double Iframe" architecture for security, supports multiple providers, and has zero framework dependencies. It also allows for template context to guide LLM output.
tags:
- web components
- custom elements
- LLM
- AI
- Google Gemini
- Chrome AI
- HTML generation
- SVG generation
- security
- javascript
title: <generate-html> Web Component

---

The [`<generate-html>`](https://github.com/PaulKinlan/generate-html-element/) Web Component is a LLM-powered custom element that generates and renders interactive HTML or SVG images on the fly using Google Gemini or Chrome's built-in AI.

It uses a double iframe architecture to reduce the ability of any generated code to access your API keys or host page data. The outer iframe exposes a limited API to the host page it mediates all communication with the inner iframe.

Both iframes are sandboxed and both iframes are created via blob URLs so their origin's are `null`. This means that the inner iframe cannot access the host page or any of the host page or the outer iframe. The outer iframe can't directly access the DOM of the inner iframe other than changing the `href` source.

## Features

*   **AI-Generated Content:** Turns text prompts into interactive web apps (calculators, games) or SVG images.
*   **Sandbox:** Uses a "Double iframe" architecture to ensure generated code cannot access your API keys or host page data.
*   **Multi-Provider:** Supports **Google Gemini** (via API Key) and **Chrome Built-in AI** (experimental `window.LargeLanguageModel`).
*   **Vanilla JS:** Zero framework dependencies. Built with standard Web Components.

## Usage

You can install the component directly via npm:

```bash
npm install @paulkinlan/generate-html
```

Then, import the component script and use the tag in your HTML:

```html
<script type="module" src="/src/generate-html.js"></script>

<generate-html
  prompt="Create a snake game"
  api-key="YOUR_GEMINI_API_KEY"
  model="gemini-2.5-flash-latest"
  provider="gemini"
  type="html"
></generate-html>
```

The demo can be accessed here: [https://generate-html-element.paulkinlan-ea.deno.net/](https://generate-html-element.paulkinlan-ea.deno.net/)

For more details, check out the [GitHub repository](https://github.com/PaulKinlan/generate-html-element/blob/main/README.md).
