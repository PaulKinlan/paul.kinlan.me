---
date: 2022-12-31T19:31:05Z
slug: "button-and-link-scraping-for-ML-training"
summary: "After over 20 years I'm getting back in to ML. I looking at a simple (but practical) example that I can get back up to speed on"
tags: 
  - "puppeteer"
  - "ML"
title: "Button and Link Scraping for ML training"

---
It's been at least 20 years since my last proper foray in to AI and ML, and I'm looking at training myself up again in the latest state of the art (heck, even state of the art 5 years ago) developments in ML so that I at least know what is happening and how I might be able to apply it.

I bought [Laurence Moroney's](https://laurencemoroney.com/) awesome [AI and Machine Learning for Coders for Coders](https://www.oreilly.com/library/view/ai-and-machine/9781492078180/) to get back into the basics.

I decided that I wanted to try and build a tool that would detect a common Accessibility issue: [Links that look like buttons](https://a11y-101.com/design/button-vs-link). My understanding of the issue is that people expect links to navigate and buttons to perform an action, and many developers on the web style the anchor tag in a way that is easy to confuse the intent.

It's kinda hard to detect when a link looks like a button, so I want to create a tool or plugin that will look at how the element is rendered and decide if it looks like a button or not. If I can get the model right, I can integrate it into a tool like [Lighthouse ](https://developer.chrome.com/docs/lighthouse/accessibility/) and its [A11Y](https://developer.chrome.com/docs/lighthouse/accessibility/) checks that will let a developer know that an anchor that they are using looks like a button and thus might break a user expectation.

I'm on a journey to learning but from my previous learning and current refresh, I believe the steps will be.

1. Get the data. What do buttons look like?
   1. Get a list of sites to scan, and for each site...
   2. ... Get a list of text links
   3. ... Get a list of buttons.
   4. ... Get an image of each button and each link.
2. Split the data into a training set and a test set.
3. Train a model
4. Evaluate the model to see if it works. (repeat 1-4 if not)
5. ???
6. Profit. Deploy the model.

The post is all about point 1. "What do buttons look like?". To do this, I've created a repository called [Link and Button Scraper](https://github.com/PaulKinlan/button-and-link-scraper) that is a Puppeteer script that will scan through a list of URLs and get all the anchors and buttons and take a screenshot of them.

The code is [here](https://github.com/PaulKinlan/button-and-link-scraper/blob/main/index.js) - please feel free to critique it.

In theory, it all sounds pretty straightforward: Find the elements, scroll them into view and take a screenshot using `element.screenshot()` API, however I ran in to a number of problems that I had to compensate for.

1. Elements can be obscured by another element  (cookie consent, position:sticky headers)
2. Smooth Scrolling will mean that the element is not yet in view when the screenshot is taken.

Elements can be obscured by another element and Puppeteer will only take a photo of the region that is bounded by the element (make sense given compositing etc). Cookie consent dialogs are a pain.

To fix this I try and get the element into view and test to see if it is occluded - firstly I increased the viewport size so that if I centre something consent dialogs and position:sticky headers will likely be out of the way, and then I test to see the element is occluded.

To test if the element is occluded, I wrote a function called `isOccluded` (heh) which will check if the current element is in the DOM tree hierarch at every corner of the current elements box (5px inset), if it's not then I assume that another element might occluding a part of the element (note I assume all elements are rectangle and not rotated (e.g, this might fail if an element is rotated and placed over the current element such that it doesn't overlap any of the corners).

```JavaScript
function isOccluded(element) {
  const { x, y, width, height } = element.getBoundingClientRect();

  // We inset 5px to avoid the edges of the button.
  const elementsTopLeft = document.elementsFromPoint(x + 5, y + 5);
  const elementsTopRight = document.elementsFromPoint(
    x + width - 5,
    y + 5
  );
  const elementsBottomLeft = document.elementsFromPoint(
    x + 5,
    y + height - 5
  );
  const elementsBottomRight = document.elementsFromPoint(
    x + width - 5,
    y + height - 5
  );

  if (
    elementsTopLeft.indexOf(element) == -1 ||
    elementsTopRight.indexOf(element) == -1 ||
    elementsBottomLeft.indexOf(element) == -1 ||
    elementsBottomRight.indexOf(element) == -1
  ) {
    return true;
  }

  return false;
}
```

I recognise that this is rather complex, and doesn't cover all cases, but given that the majority of elements are rectangle and not rotated it worked for this experiment.

Finally, **Smooth Scrolling** - because I have to get the element into view, I have to scroll the current page to it, and it turns out that when you scroll an element into view if `scroll-behavior: smooth;` is enabled on the page then it might not actually be in view by the time I screenshot.

```JavaScript
page.addStyleTag({ content: "* { scroll-behavior: auto !important; }" });
```

So I just disable it.

And that's pretty much it so far, I now have a collection of things that look like buttons and things that look like text links. The next step is to see if I can get this into an ML Image classifier.