"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = async (data) => {
  const urlData = {};
  const images = new Set();
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if (url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if (wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);

    if ("author" in item && "photo" in item.author) {
      images.add(item.author.photo);
    }
  });

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if (fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });

  for (let image of images) {
    if (image === '') continue; // occasionally this happens

    const md5ImageUrl = md5(image);
    console.log(`fetching avatar ${image} => ${md5ImageUrl}`);

    try {
      let imageData = await (await fetch(image)).buffer();
      fs.writeFileSync(`./static/images/twitter-${md5ImageUrl}`, imageData);
    } catch (err) {
      console.error(`Unable to fetch ${image}. Reason: ${err}`);
    }
  }
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  await processMentionsJson(mentiosnJson);
})();