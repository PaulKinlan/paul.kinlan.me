module.exports = (req, res) => {
  console.log(req)
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end('ok');
};
