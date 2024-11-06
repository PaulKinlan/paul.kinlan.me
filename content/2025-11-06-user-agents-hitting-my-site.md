---
slug: user-agents-hitting-my-site
date: 2024-11-06T16:54:00
title: User Agents Hitting My Site
published: true
---

I've always wanted to know which user agents are currently hitting my site... Am I getting crawled? Are ML bots sifting through my site?

I added some middleware to my site to log the user agent of every request while using [Vercel's KV](https://vercel.com/docs/concepts/kv) to store the user agents and their counts.

<h3>User Agents in the last hour</h3>
<table >
<thead>
  <th>User Agent</th>
  <th>Count</th>
  </thead>
  <tbody id="user-agents">
  <tbody>
</table>

<script type="module">
  const render = async (data) => {
    const userAgents = document.getElementById("user-agents");
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
</script>