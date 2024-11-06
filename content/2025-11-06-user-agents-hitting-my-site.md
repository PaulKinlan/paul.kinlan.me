---
slug: user-agents-hitting-my-site
date: 2024-11-06T16:54:00
title: User Agents Hitting My Site
published: true
---

I've always wanted to know which user agents are currently hitting my site... Am I getting crawled? Are ML bots sifting through my site?

I added some middleware to my site to log the user agent of every request while using [Vercel's KV](https://vercel.com/docs/concepts/kv) to store the user agents and their counts.

<h3>User Agents in the last hour</h3>
<div id="user-agents"></div>

<script type="module">
  const render = async (data) => {
    const userAgents = document.getElementById("user-agents");
      const response = await fetch('/api/user-agents.ts');
      const userAgentData = await response.json();
      userAgentData.forEach(item => {
        const el = document.createElement("p");
        el.innerText = `${item[0]}: ${item[1]}`;
        userAgents.appendChild(el);
      });
  });
</script>