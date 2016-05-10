---
slug: notification-test
date: 2016-05-10T13:20:32+01:00
title: "Notification test page"
description: "Feel free to ignore."
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