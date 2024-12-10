---
date: 2023-01-16 09:51:54+00:00
slug: lighthouse-full-res-screenshot-gatherer
summary: I needed higher resolution screenshots for an ML model to classify elements
  on a webpage, but the default Lighthouse screenshot was too compressed. So, I created
  a custom Lighthouse Gatherer using Puppeteer.  This gatherer captures a full-page,
  high-resolution screenshot encoded as base64 and returns it along with the device
  pixel ratio.  This was a fun little project, and the code is surprisingly concise.
  However, future Lighthouse versions may include higher-resolution screenshots, making
  this gatherer redundant.
tags:
- lighthouse
- gatherer
- puppeteer
- screenshots
- performance
- web development
- automation
- testing
- machine learning
- image classification

---
[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) has an awesome yet little known [API](https://github.com/GoogleChrome/lighthouse/blob/main/docs/new-audits.md). Anything that Lighthouse can do, so can you and as far as I can tell, pretty much every [Audit](https://github.com/GoogleChrome/lighthouse/tree/main/core/audits) and [Gatherer](https://github.com/GoogleChrome/lighthouse/tree/main/core/gather) that runs in lighthouse is open.

Lighthouse has two concepts:

1. Gatherers: Given a page, run a set of scripts to pull information and data out of the page so that the audit can quickly parse it.
2. Audits: Given all the information gathered, run some tests to see if the page.

Lighthouse has a huge number of Gathers, one of them is called [FullPageScreenshot](https://github.com/GoogleChrome/lighthouse/blob/main/core/gather/gatherers/full-page-screenshot.js) which returns a highly compressed screenshot of the page. (note to self... why didn't I just use this code?? NIH probably).

When I was building the the Audit to identify if an anchor looks like a button (more in a later post), the default screenshot resolution was too low and had too many compression artefacts for the ML model to reliably classify the image. Normal resolution images worked just fine though, so I decided to [build a gatherer](https://github.com/PaulKinlan/is-it-a-button-lighthouse-audit/blob/main/audit/big-screenshot-gatherer.js) that took a full resolution and full-size screenshot of the current page which could later be requested by my audit.

In the end it was quite fun and not a much code as I thought it might be. I chose to use Puppeteer because I know the API well and that's about it.

```JavaScript
const { Gatherer } = require("lighthouse");
const puppeteer = require("puppeteer");

// Heavily inspired by https://keepinguptodate.com/pages/2021/08/custom-lighthouse-audit/ and https://github.com/GoogleChrome/lighthouse/blob/main/docs/recipes/custom-gatherer-puppeteer/custom-gatherer.js

async function connect(driver) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: await driver.wsEndpoint(),
    defaultViewport: null,
  });
  const { targetInfo } = await driver.sendCommand("Target.getTargetInfo");
  const puppeteerTarget = (await browser.targets()).find(
    (target) => target._targetId === targetInfo.targetId
  );
  const page = await puppeteerTarget.page();
  return { browser, page, executionContext: driver.executionContext };
}

class BigScreenshot extends Gatherer {
  /**
   * @param {LH.Gatherer.PassContext} options
   * @param {LH.Gatherer.LoadData} loadData
   */
  async afterPass(options, loadData) {
    const { driver } = options;
    const { page, executionContext } = await connect(driver);

    const devicePixelRatio = await page.evaluate("window.devicePixelRatio");
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: true,
      captureBeyondViewport: true,
    });

    /**
     * @return {LH.Gatherer.PhaseResult}
     */
    return { screenshot, devicePixelRatio };
  }
}

module.exports = BigScreenshot;
```

And that's it.

p.s I heard on the grapevine that version 10 of Lighthouse might move away from Jpeg Screenshot so this code might be redundant pretty quickly.