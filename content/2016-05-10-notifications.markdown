---
date: 2016-05-10 13:20:32+00:00
description: Feel free to ignore.
slug: notification-test
summary: This is a test page for notification functionality. It includes JavaScript
  code that reads query string parameters from the URL and displays them in a preformatted
  block on the page.  The intent is to allow for testing how notifications interact
  with various URL parameters, so please disregard the content itself. The page is
  primarily for internal testing and demonstration purposes.
tags:
- javascript
- url parameters
- notifications
- testing
- query string
- client-side scripting
title: Notification test page

---

<h1>Query String Parameters</h1>
<pre id="output">

</pre>

<script>
const params = new URLSearchParams(location.search);
const output = document.getElementById("output");
for (let p of params) {
    const fragment = document.createDocumentFragment();
    fragment.innerText = `Parameter Name= '${p[0]}'; Value = '${p[1]}'`;
    output.appendChild(fragment);
};
</script>