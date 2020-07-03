const { go } = require('puppeteer-go');

module.exports = async (req, res) => {
  const { url = 'https://paul.kinlan.me/', selector = 'body' } = req.query

  try {
    const data = await go(url, async (page) => {
      const elements = await page.$$(selector);
      if (elements && elements.length > 0) {
        return await elements[0].screenshot({ 'encoding': 'binary' });
      }
      else {
        throw `Element not found for selector ${selector} in ${url}`;
      }
    });

    // Add caching.
    res.statusCode = 200;
    res.setHeader('Content-Type', `image/png`);
    res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
    res.end(data);
  } catch (ex) {
    res.status(500).send(ex);
  }
}