const sax = require('sax');

// based on https://github.com/akupila/node-opml-parser/blob/master/index.js but fixes bugs

module.exports = function parse(opmlXML, callback) {
  const parser = sax.parser(false, {
    strictEntities: false,
    lowercase: true
  });

  const items = [];
  const existingFeeds = {};

  parser.onopentag = function (node) {
    if (node.name === 'outline') {
      // folders also are outlines, make sure an xmlUrl is available
      const feedUrl = node.attributes.xmlurl;
      if (feedUrl && !existingFeeds[feedUrl]) {
        items.push({
          title: node.attributes.title || node.attributes.text || node.attributes.description,
          url: node.attributes.htmlurl,
          feedUrl: feedUrl,
          feedType: node.attributes.type,
        });
        existingFeeds[feedUrl] = true;
      }
    }
  };

  parser.onend = function() {
    callback(null, items);
  }

  // Annoyingly sax also emits an error
  // https://github.com/isaacs/sax-js/pull/115
  try {
    parser.write(opmlXML).close();
  } catch (error) {
    callback(error);
  }
};