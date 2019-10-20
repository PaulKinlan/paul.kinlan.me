#! /usr/bin/node
// Imports the Google Cloud client library
const parseOpml = require('./opml-parser.js');
const fetch = require('node-fetch');

(async () => {
  const opmlUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL
  const opmlResponse = await fetch(opmlUrl);
  const opmlText = await opmlResponse.text();

  const processOpml = (err, items) => {

    if (err) {
      console.error(err);
      return
    }

    items = items.sort((a,b)=> (a.title === b.title) ? 0 : (a.title < b.title) ? -1 : 1 )
    
    console.log(items.map((item) => `* [${item.title}](${item.url || item.feedUrl}) - [${item.feedType}](${item.feedUrl})`).join('\n'));

  };
  parseOpml(opmlText, processOpml);
})();