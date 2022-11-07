module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end(`{  
    "subject": "acct:paul@paul.kinlan.me",
    "links": [
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": "https://paul.kinlan.me/paul"
      }
    ]
  }`);
};
