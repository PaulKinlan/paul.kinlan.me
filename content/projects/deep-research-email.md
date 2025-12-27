---
slug: deep-research-email
date: 2025-12-27T12:00:00
title: Deep Research Email
description: A Deep Research agent over email.
tags: 
- valtown
- ai
- gemini
- email
- agent
---

I've been exploring how to integrate advanced AI agents into my daily workflow, and email remains the most universal interface for asynchronous tasks.

I built a "Deep Research" agent using [Val Town](https://val.town) that allows me to trigger complex research tasks simply by sending an email. It uses Google's Deep Research model to perform the heavy lifting.

## How to use it

It is pretty simple to get started, you just need to send an email.

1.  **Send an email** to: `deep-research@valtown.email`
2.  **Subject**: Your research topic (e.g., "Latest advances in quantum computing") - this is only used in the title of the reply
3.  **Body**: Detailed research question or context that will be sent to Deep Research
4.  **Wait**: The system will process your request and send the research report back to your email

## How it works

The architecture is interesting because Deep Research can take a while to complete. I couldn't just hold the connection open. Instead, I set up a two-part system on Val Town:

1.  **An Email Handler**: Receives the query and kicks off the job with the Google GenAI API, saving the task ID to a JSON object in valtown blob storage.
2.  **A Cron Job**: Periodically checks the status of pending tasks. Once a report is ready, it formats the result as HTML and emails it back to the sender.

It's a great example of how serverless functions and simple state storage can build powerful asynchronous agents.

## Where to get the code

You can fork this project or view the source code directly on Val Town.

[View the Code on Val Town](https://www.val.town/x/paulkinlan/deep-research-email)