const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core'); // Remove -core if testing locally.

const template = (title, description, imgUrl) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      html, body { 
        align-items: center;
        display: flex; 
      }

      html { 
        height: 100%;
        background: #8d11fd;
        font-family: monospace;
      }
      
      body {
        background-color: #282b36;
        color: white;
        width:100%;
        border-radius: 5px;
        overflow: hidden;
        padding: 1em;
        margin: 0 2em;
        box-shadow: rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px, rgba(0, 0, 0, 0.2) 0px 5px 5px -3px;    
        max-height: calc(400px - 1em);
        max-width: calc(800px - 1em);
        aspect-ratio: 2 / 1;
      }
      
      body::before {
        content: "";
        display: block;
        padding-bottom: calc(100% / (2/1));
      }  
      
      img {
        width: 33%;
        border-radius: 5px;
      }

      p {
        overflow: scroll;
        height: 4em;
      }

      h1 {
        font-size: 2em;
        margin: 0;
      }

      div {
        flex: 1;
        padding: 1em;
        align-content: center;
        justify-content: center;
        align-items: center;
        justify-items: center;
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>
  <body>
    <img
      src="${imgUrl}"
    />
    <div>
      <h1>${title}</h1>
    </div>
  </body>
</html>
`;

const defaultOrigin = 'https://paul.kinlan.me/';

const checkOrigin = (url, base) => new URL(url).host == base;

module.exports = async (req, res) => {
  const { title = '', description = '', imgUrl = 'https://paul.kinlan.me/images/me.png', width = 800, height = 400 } = req.query;

  if (isNaN(width) && isNaN(height)) throw new Error(`Width and height must be a number`);
  if (width > 1024 || height > 1024) throw new Error(`Width and Height can't be over 1024`);
  if (title.length > 200) throw new Error(`Title is too long`) ;
  if (description.length > 1000) throw new Error(`Description is too long`);
  if (imgUrl && checkOrigin(imgUrl, defaultOrigin)) throw new Error(`Image must be on ${defaultOrigin}`)
  
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

    const output = template(title, description, imgUrl);

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