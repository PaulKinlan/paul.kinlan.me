const chrome = require('chrome-aws-lambda');

const template = (title, description, hue = 272, imgUrl) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
    html,
    body {
      display: flex;
    }

    html {
      height: 100%;
      align-items: center;
      justify-content: center;
      background: hsl(${hue}, 98%, 53%);
      font-family: Arial;
    }

    body {
      background-color: white;
      color: black;
      width: 100%;
      border-radius: 2em;
      margin: 1em 1em;
      box-shadow: rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,
        rgba(0, 0, 0, 0.12) 0px 3px 14px 2px,
        rgba(0, 0, 0, 0.2) 0px 5px 5px -3px;
      max-height: calc(400px - 3em);
      max-width: calc(800px - 2em);
      aspect-ratio: 2 / 1;
      overflow: clip;
    }

    img {
      grid-area: head;
      object-fit: cover;
      height: 100%;
      max-width: 100%;
    }

    h1 {
      font-size: 3em;
      margin: 0;
    }
    
    div {
      grid-area: body;
      padding: 1em;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    p:empty {
      display: none;
    }

    section {
      overflow: clip;
      border-radius: inherit;
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-areas: "head body";
    }
    </style>
  </head>
  <body>
    <section>
      <img src="${imgUrl}" />
      <div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
    </section>
  </body>
</html>`;



const defaultOrigin = 'https://paul.kinlan.me/';

const checkOrigin = (url, base) => new URL(url).host == base;

module.exports = async (req, res) => {
  const { puppeteer } = chrome;
  const { title = '', description = '', imgUrl = 'https://paul.kinlan.me/images/me.png', width = 800, height = 400 } = req.query;

  if (isNaN(width) && isNaN(height)) throw new Error(`Width and height must be a number`);
  if (width > 1024 || height > 1024) throw new Error(`Width and Height can't be over 1024`);
  if (title.length > 200) throw new Error(`Title is too long`) ;
  if (description.length > 1000) throw new Error(`Description is too long`);
  if (imgUrl && checkOrigin(imgUrl, defaultOrigin)) throw new Error(`Image must be on ${defaultOrigin}`);

  const hue = Math.floor(Math.random() * 360);
  
  try {

    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
   
    const page = await browser.newPage();

    await page.setViewport({
      width: width,
      height: height
    });

    const output = template(title, description, hue, imgUrl);

    await page.setContent(output);

    const data = await page.screenshot({ 'encoding': 'binary' });

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