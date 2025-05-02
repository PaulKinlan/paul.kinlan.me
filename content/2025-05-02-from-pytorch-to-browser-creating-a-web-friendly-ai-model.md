---
title: "Andre Bandarra: From PyTorch to Browser: Creating a Web-Friendly AI Model"
date: 2025-05-02T12:50:17.963Z
link: https://bandarra.me/posts/from-pytorch-to-browser-creating-a-web-friendly-ai-model
---
Link: [From PyTorch to Browser: Creating a Web-Friendly AI Model](https://bandarra.me/posts/from-pytorch-to-browser-creating-a-web-friendly-ai-model)

I loved this post from Andre about running sentiment analysis in the browser using a model that he'd trained on embeddings generated from a YouTube comments data was great and shows that you don't have to run everything through the full language model and instead can use just the embedding APIs to get a decent result.

The client side part of the code can be seen below:

> const input = 'Hello, your video is amazing!';
> const embedResult = await genAi.models.embedContent({
>   model: 'text-embedding-004',
>   contents: [input],
> });
> const embeddings = embedResult.embeddings.map(embedding => embedding.values);
> const outputTensor = await model.predict(tf.tensor2d(embeddings));
> const argmax = await tf.argMax(outputTensor, 1).array();
> const labels = ['Positive', 'Neutral', 'Negative'];
> const results = argmax.map(i => labels[i]);
> console.log(results);
>
> const probabilities = await tf.softmax(outputTensor, 1).array()
> console.log(probabilities);
