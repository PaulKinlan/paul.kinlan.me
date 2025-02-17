---
title: "How I edit my blogs"
description: "A little bit about how I edit my blog: It's Hugo, on Vercel with a custom editor I built."
date: 2025-02-17T11:50:41.668Z
tags: ["blogging", "writing", "hugo", "vercel"]
---

It may come as no surprise to the people who get emails from me, but I failed GCSE English. I loved reading, but I struggled to articulate my thoughts clearly and I struggled with basic grammar. It wasn't until I was 20 that I could explain a verb and a noun.... A good friend read my final year dissertation about Fraud Detection and his main comment was: "Did you learn how to use a semi-colon?"; No. I barely know how to use, a comma.

The web has always been a great place for me to explore writing and sharing my thoughts, and it was a large part in getting me a Developer Relations role at Google. This site is my own little corner of it that I can control. When I get the time, I try to write about things that I find interesting. You might find it interesting, you might not. I don't really mind, I just like to try and improve my writing.

I do get the occasional email from people who read my blog and they ask me how I write and edit my blog. I thought I would write a little bit about it.

My blog infrastructure is pretty simple. It's a mostly static site built with [Hugo](https://gohugo.io/). I chose Hugo because it takes 3 seconds to build my entire site and I really value the rapid local building and near instant deployment. All of the other Ruby and JavaScript builders would take sometimes over a minute.

Because my site is not amazingly dynamic, I felt that I didn't really need Wordpress, but I did need a tool for editing.

The hosting is on Vercel, but I've no affinity for it. I just needed something that could host a static site and get it built and hosted in seconds (which Vercel does).

Because Hugo is mostly driven by Markdown I used a tool called [SpinalCMS](https://app.spinalcms.com/) as my editor because it had a GUI and could import my archives, but there were a couple of bugs in it (It doesn't use a date format that works well with Hugo) and text editing (try delete past a paragraph). So I built a simple in about 30 minutes called... well, it doesn't really have a name it's just a URL https://blog-craft-editor-paulkinlan.replit.app/

The editor is just a static page that uses [TipTap](https://tiptap.dev/) as the actual bit you write in (seriously, TipTap is a great editor API). I have some little bits around the editor that can load and save files back the the filesystem and suggest titles and descriptions, but that's it.

The only other thing is [I have list of things that I've been meaning to complete](https://paul.kinlan.me/my-drafts). I may never actually complete any of these posts.

For the site itself, I really want to encourage people to speak to me, but there's not always a lot of engagement. I use [commento.io](http://commento.io/) and it works well.

And that's about it really.