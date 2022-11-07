const path = require('path');
const process = require('process');
const {readFileSync} = require('fs');

module.exports = (req, res) => {
  const file = path.join(process.cwd(),'public', 'outbox.ajson');
  const stringified = readFileSync(file, 'utf8');

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);

  return res.end(stringified);
};
