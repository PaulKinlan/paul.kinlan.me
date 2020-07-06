const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const { url = 'https://paul.kinlan.me/', selector = 'body' } = req.query
  let data;

  try {
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);
    const elements = await page.$$(selector);

    if (elements && elements.length > 0) {
      data = await elements[0].screenshot({ 'encoding': 'binary' });
      await browser.close();
    }
    else {
      await browser.close();
      throw new Error(`Element not found for selector ${selector} in ${url}`);
    }
    
    // Add caching.
    res.statusCode = 200;
    res.setHeader('Content-Type', `image/png`);
    res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
    res.end(data);
  } catch (ex) {
    console.error(ex);
    res.status(500).send(ex);
  }
}