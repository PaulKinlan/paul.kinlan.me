---
slug: creating-a-simple-lighthouse-audit
date: '2023-01-23T14:37:48'
title: Creating a simple lighthouse audit to detect a button
tags:
- ML
- tensorflow
- lighthouse
---

This post wraps up the series of posts I created about applying ML to some developer tasks that are hard to do programatically. Specifically, I wanted to create a tool that would let me detect if an anchor on a page `<a>` was styled to look like a button or not.

You can check out the previous posts here:

*   [Scraping images of links and buttons to train an ML model](https://paul.kinlan.me/button-and-link-scraping-for-ml-training/)
    
*   [Training the ML model](https://paul.kinlan.me/training-the-button-detector-ml-model/)
    
*   [Building a simple tool to help test the ML model](https://paul.kinlan.me/ml-deno-fresh-tensorflow/)
    
*   [Creating a custom lighthouse gatherer](https://paul.kinlan.me/lighthouse-full-res-screenshot-gatherer/)
    

And you can check out the code here:

*   [Button and link scraper](https://github.com/PaulKinlan/button-and-link-scraper)
    
*   [Is it a button web app](https://github.com/PaulKinlan/is-it-a-button-web-app)
    
*   [Is it a button lighthouse audit](https://github.com/PaulKinlan/is-it-a-button-lighthouse-audit)
    

I had a lot of fun relearning a bunch of ML for the this and while I am certainly no expert, what I learnt gave me some confidence for the future in that it is very possible to sensibly integrate ML into many existing products.

The final step of my project was to create the Lighthouse Audit. The goal of this particular audit is to visually highlight in the final report all of the links that look like a button, like so:

I'm very happy with the result.

You can see from the source [here](https://github.com/PaulKinlan/is-it-a-button-lighthouse-audit/blob/main/audit/anchor-looks-like-a-button.js) that it is very [similar to the web app](https://paul.kinlan.me/ml-deno-fresh-tensorflow/) in that it takes a list of images and runs it through the TensorflowJS model. In fact, the code to run the image through the model is almost exactly the same in both the web app and the lighthouse Audit.

```
async function testImage(model, image) {
  const normalizedData = tf.tidy(() => {
    //convert the image data to a tensor
    const decodedImage = tf.node.decodePng(image, 1);
    const tensor = tf.image.resizeBilinear(decodedImage, [256, 256]);

    // Normalize the image
    const offset = tf.scalar(255.0);
    const normalized = tensor.div(offset);
    //We add a dimension to get a batch shape
    const batched = normalized.expandDims(0);

    return batched;
  });

  const predTensor = model.predict(normalizedData);

  const predSoftmax = predTensor.softmax();
  const data = await predSoftmax.data();

  //console.log(predSoftmax.print(), data)

  const max = Math.max(...data);
  const maxIdx = data.indexOf(max);

  const classes = {
    0: "Button",
    1: "Text Link",
  };

  return { classname: classes[maxIdx], score: max };
}
```

I loved the Lighthouse Audit API because it worked pretty much as expected. The biggest wrinkle that I had is that the ML model requires clean screenshots of the anchor which means that I have do some extra work. The first is to generate a high-res image of the page because the current "FullscreenShot" artefact is a heavily compressed JPEG screenshot that can't be used in the model, and the second is a list of "[NonOccludedAnchorElements](https://paul.kinlan.me/ml-deno-fresh-tensorflow/)" which is used to detect `<a>` elements in the DOM that are visible and unlikely to be obscured by another element.

```
static get meta() {
    return {
      id: "anchor-looks-like-a-button",
      title: "Anchor element looks like links",
      failureTitle: "Anchor element looks like a button",
      description:
        "Links should like links and buttons should look like buttons",
      requiredArtifacts: [
        "AnchorElements",
        "NonOccludedAnchorElements",
        "BigScreenshot",
      ],
    };
  }
```

And then once the audit is running and I loop through all of the `nonOccludedAnchorElements` pull them out of the high-res screenshot and pass them through to the ML model via `await testImage(newModel, image);` as follows.

```
for (const anchorElement of nonOccludedAnchorElement) {
      const { left, top, width, height } = anchorElement.node.newBoundingRect;
     
      const newScreenshot = screenshot.clone().extract({
        left: Math.floor(Math.max(left * devicePixelRatio, 0)),
        top: Math.floor(Math.max(top * devicePixelRatio,0)),
        width: Math.floor(Math.min(width * devicePixelRatio, metadata.width)),
        height: Math.floor(Math.min(height * devicePixelRatio, metadata.height)),
      });
      try {
        const image = await newScreenshot.clone().png().toBuffer();
        const { classname, score } = await testImage(newModel, image);
        // console.log(classname, score, anchorElement.node.lhId);
        await newScreenshot
          .clone()
          .png()
          .toFile(`./images/${anchorElement.node.lhId}-${classname}.png`);

        if (classname === "Button") {
          buttonsOnPage.push(anchorElement);
        }
      } catch (error) {
        console.error(error, left, top, width, height);
      }
    }
```

And that's it.