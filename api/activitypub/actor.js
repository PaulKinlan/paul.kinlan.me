module.exports = (req, res) => {
  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.end(`{
    "@context": ["https://www.w3.org/ns/activitystreams",
                 {"@language": ""en-GB"}],
    "type": "Person",
    "id": "https://paul.kinlan.me/paul",
    "outbox": "https://paul.kinlan.me/outbox.json",
    "inbox": "https://paul.kinlan.me/inbox.json",
    "preferredUsername": "Paul_Kinlan",
    "name": "Paul Kinlan - Modern Web Development with Chrome",
    "summary": "Paul is a Developer Advocate for Chrome and the Open Web at Google and loves to help make web development easier.",
    "icon": [
      "https://paul.kinlan.me/images/me.png"
    ]
  }`);
};
