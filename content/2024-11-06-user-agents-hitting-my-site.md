---
date: 2024-11-06 16:54:00
slug: user-agents-hitting-my-site
summary: Curious who's visiting my site, I built a user-agent tracker with Vercel
  middleware and KV storage. It admits up to 100 new user agents a minute and keeps a
  60-second count for each, then shows a live table of a sample of up to 100 recently
  admitted agents, refreshing every minute. Code on GitHub!
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

I added some middleware to my site to log the user agents hitting it, while using [Vercel's KV](https://vercel.com/docs/concepts/kv) to store the user agents and their counts. New agents are only admitted up to a fixed budget each minute, so a burst of bots can't flood the store with garbage.

If you are interested in the code, the [middleware](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/middleware.ts) and the [api](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/user-agents.ts) are both on GitHub.

<br>
<h4>Recently admitted user agents</h4>
<p id="sampling-notice" class="text-xs text-slate-400 italic mb-2"></p>

<table>
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
    userAgents.innerHTML = "";
    const response = await fetch('/api/user-agents.ts');
    const samplingPolicy = response.headers.get('x-sampling-policy');
    const notice = document.getElementById("sampling-notice");
    if (notice && samplingPolicy === 'bounded-sample-100') {
      notice.innerText = "Showing a sample of up to 100 recently admitted user agents. Each agent's count covers its most recent 60-second window.";
    } else if (notice) {
      notice.innerText = "";
    }
    const userAgentData = await response.json();

    if (Array.isArray(userAgentData)) {
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
    }
  };

  render();

  setInterval(() => {
    render();
  }, 60000);
</script>
