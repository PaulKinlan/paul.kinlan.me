---
date: 2024-11-06 16:54:00
slug: user-agents-hitting-my-site
summary: Curious about who's visiting my site, I built a user-agent tracker using
  Vercel middleware and KV storage.  It logs every request and displays a live table
  of user agents and hit counts, refreshing every minute. Check out the code on GitHub!
tags:
- user agents
- vercel
- kv store
- middleware
- website traffic
- analytics
- website monitoring
- real-time
- javascript
title: User Agents Hitting My Site

---

I've always wanted to know which user agents are currently hitting my site... Am I getting crawled? Are ML bots sifting through my site?

I added some middleware to my site to count user-agent families while using [Vercel's KV](https://vercel.com/docs/concepts/kv) to store their counts. Requests are grouped into a fixed set of browser and bot families rather than storing arbitrary user-agent strings.

If you are interested in the code, the [middleware](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/middleware.ts) and the [api](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/user-agents.ts) are both on GitHub.

<br>
<h4>User-agent families in the last minute</h4>

<table>
<thead>
  <th>User-agent family</th>
  <th>Count</th>
  </thead>
  <tbody id="user-agents">
  <tbody>
</table>

<script type="module">
  const render = async (data) => {
    const userAgents = document.getElementById("user-agents");
    userAgents.innerHTML = "";
    const response = await fetch('/api/user-agents.ts');
    const userAgentData = await response.json();

    userAgentData.forEach(item => {
      const row = document.createElement("tr");

      const ua = document.createElement("td");
      const count = document.createElement("td");
      ua.innerText = item[0];
      count.innerText = item[1];
      row.appendChild(ua);
      row.appendChild(count);
      userAgents.appendChild(row);
    });
  };

  render();

  setInterval(() => {
    render();
  }, 60000);
</script>
