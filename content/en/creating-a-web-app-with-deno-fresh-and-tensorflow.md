+++
date = 2023-01-12T11:10:43Z
draft = true
slug = "ml-deno-fresh-tensorflow"
summary = "I created a tool."
tags = ["button", "ml", "tensorflow"]
title = "Creating a web app with deno, fresh and Tensorflow"

+++
Last week I got a trained a [simple model that will detect if an image looks like a link or a button](https://paul.kinlan.me/training-the-button-detector-ml-model/). It was fun and I learnt a lot.

This article is less about the ML model and more about how I made a [TensorflowJS](https://www.tensorflow.org/js) Preact Component using [Deno](https://deno.land/) and [Fresh](https://fresh.deno.dev/) and some of the snags I hit so that you don't have to hit them.

The [Demo](https://is-it-a-button-web-app.deno.dev/) itself might not make sense, so I will give some context first. I trained the ML model in Google Colab, and while it has a handy little script that lets me upload files it is incredibly slow, so I wanted a way to drag and drop many images on a page and have it automatically classify the images. If you try the demo just take a screen shot of a button or a link with about 10px of padding around it like so ![](/images/2023-01-13-screenshot-2023-01-13-at-20-48-55.png)) and it will output something like the following:

![](/images/2023-01-13-screenshot-2023-01-13-at-20-49-55.png)

I also wanted an excuse to get a model into "production".

The [Code](https://github.com/PaulKinlan/is-it-a-button-web-app) is built around Deno and Fresh, and broadly it was a lot of fun to get started. I really liked how quick it is to deploy (feels significantly faster than Vercel). I did struggle with the documentation, for example the docs around `islands` is sparse and it implies that it runs in the client - so n

    if (IS_BROWSER) {
      await import("https://esm.sh/file-drop-element");
    }