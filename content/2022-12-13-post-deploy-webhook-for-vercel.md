---
date: 2022-12-13T20:44:13Z
slug: "post-deploy-webhook-for-vercel"
summary: "This custom integration was created because Vercel does not currently offer the ability to configure webhooks for project-related events such as Deploy Successful."
tags: 
  - "webhook"
  - "vercel"
title: "Post Deploy Webhook for Vercel"

---

(Great news! This is no longer needed as Vercel has added this functionality into their platform)

This static blog is now ActivityPub enabled (more soon). ActivityPub is a push based protocol meaning that I need to send a "Create Note" ActivityStream message to every person who follows my account. That means I need to know when my site has just been deployed so I can then send the messages. 

Unfortunately, right now the Vercel platform doesn't let you register to receive "Deployment Successful" events directly in your project. Integrations however _can_ listen to project related events. So I created one.

[github.com/PaulKinlan/vercel-post-deploy-webhook](https://github.com/PaulKinlan/vercel-post-deploy-webhook "https://github.com/PaulKinlan/vercel-post-deploy-webhook") is a simple Vercel Integration that lets you configure custom webhooks for deployment related events for each of your projects.

Once installed you can add it to your organisation or projects in Vercel and then configure a webhook endpoint of your choice that will be called with a `HTTP POST`.

It is not published in the Vercel Integration Marketplace and I don't intend to launch it as a product. It should be a feature of the platform (ihmo).

I hope this project can serve as inspiration for building your own should you need to automate anything one once a project is deployed.

#### Set up

1. You need to use Firebase Firestore to store the configuration.
2. You need to deploy this integration on Vercel
3. You need to set up a Marketplace entry so that you can add it to your projects
4. You need to configure the webhooks that you want to handle.
