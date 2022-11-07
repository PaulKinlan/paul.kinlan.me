module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end(`{  
    "subject": "acct:paul@paul.kinlan.me",
    "links": [
      {
        "rel": "http://webfinger.net/rel/profile-page",
        "type": "text/html",
        "href": "https://paul.kinlan.me/"
      },
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": "https://paul.kinlan.me/activity.ajson"
      }
    ]
  }`);
};
