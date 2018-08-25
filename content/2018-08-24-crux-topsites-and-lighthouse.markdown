---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---

As I mentioned in my [previous post](/lighthouse-scores-for-in-domains/), I am
starting to plan more Developer Relations work in India and I want to get a
better understanding of how users in India experience the web. In that post I
had a very simple heuristic for determine a site in India, is it a '.in' domain.
I knew that this wasn't the best way to look at it, but it felt like a good
first go.

What I really wanted was a way to understand the sites that users in India
visit and then get their scores ranked by popularity of the site.

Luckily the [Chrome UX
report](https://developers.google.com/web/tools/chrome-user-experience-report/)
has some of that data. The Chrome UX Report has a series of tables in BigQuery
that contain a list of many of the top origins that users in India visit (the
table is `chrome-ux-report.country_in.20180` &mdash; note the '_in' which
denotes the country). The Chrome UX Report has a lot more data for each origin
such as the aggregated speed of the site for actual users, but I really only
needed the URLs.

Using the data from Chrome UX report, and combining it with the Alexa ranking
table in HTTP Archive along with the previously mentioned HTTPArchive lighthouse
scores we can get a better picture of what users in India actually see.


```sql
SELECT
  url, rank,
  JSON_EXTRACT(report, '$.categories.seo.score') AS seo_score,
  JSON_EXTRACT(report, '$.categories.pwa.score') AS pwa_score,
  JSON_EXTRACT(report, '$.categories.performance.score') AS speed_score,
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS accessibility_score
FROM
  `httparchive.lighthouse.2018_08_01_mobile`
JOIN (
  SELECT
    DISTINCT origin,
    Alexa_rank AS rank
  FROM
    `httparchive.urls.20170315`
  JOIN
    `chrome-ux-report.country_in.201807`
  ON
    NET.REG_DOMAIN(origin) = Alexa_domain) AS crux
  ON
    url = CONCAT(origin, '/')
ORDER BY
  rank ASC, url ASC
```

Running the above query returns a lot of data, too much for Google Sheets, so I
only analysed roughly the top 16,000 sites (up to about 7k in the Alexa
Rankings). Below is the data aggregated without comment.

#### Top 7k

<table>
<thead>
<th>Score Range</th>
<th>SEO Score</th>
<th>PWA Score</th>
<th>Speed Score</th>
<th>A11Y Score</th>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>25</td>
<td>149</td>
<td>10</td>
</tr>
<tr>
<td>0.5</td>
<td>45</td>
<td>12253</td>
<td>7841</td>
<td>3925</td>
</tr>
<tr>
<td>0.7</td>
<td>1907</td>
<td>3609</td>
<td>2725</td>
<td>6498</td>
</tr>
<tr>
<td>0.8</td>
<td>1713</td>
<td>54</td>
<td>1188</td>
<td>2610</td>
</tr>
<tr>
<td>0.9</td>
<td>3016</td>
<td>30</td>
<td>1180</td>
<td>1788</td>
</tr>
<tr>
<td>1</td>
<td>9278</td>
<td>21</td>
<td>2283</td>
<td>1157</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

#### Alexa Top 100

<table>
<thead>
<th>Score Range</th>
<th>SEO Score</th>
<th>PWA Score</th>
<th>Speed Score</th>
<th>A11Y Score</th>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>3</td>
<td>2</td>
</tr>
<tr>
<td>0.5</td>
<td>0</td>
<td>2279</td>
<td>1231</td>
<td>519</td>
</tr>
<tr>
<td>0.7</td>
<td>87</td>
<td>703</td>
<td>484</td>
<td>1348</td>
</tr>
<tr>
<td>0.8</td>
<td>199</td>
<td>0</td>
<td>198</td>
<td>587</td>
</tr>
<tr>
<td>0.9</td>
<td>375</td>
<td>0</td>
<td>261</td>
<td>302</td>
</tr>
<tr>
<td>1</td>
<td>2316</td>
<td>0</td>
<td>694</td>
<td>219</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

#### Alexa Top 1000

<table>
<thead>
<th>Score Range</th>
<th>SEO Score</th>
<th>PWA Score</th>
<th>Speed Score</th>
<th>A11Y Score</th>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>1</td>
<td>19</td>
<td>2</td>
</tr>
<tr>
<td>0.5</td>
<td>16</td>
<td>5471</td>
<td>3517</td>
<td>1942</td>
</tr>
<tr>
<td>0.7</td>
<td>546</td>
<td>1867</td>
<td>1272</td>
<td>2941</td>
</tr>
<tr>
<td>0.8</td>
<td>757</td>
<td>9</td>
<td>507</td>
<td>1212</td>
</tr>
<tr>
<td>0.9</td>
<td>1077</td>
<td>16</td>
<td>567</td>
<td>719</td>
</tr>
<tr>
<td>1</td>
<td>4962</td>
<td>6</td>
<td>1241</td>
<td>550</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

I think the tools developers and businesses now have in their hands can make a
huge difference to our ability to make reasoned and principled decisions on how
users actually feel the experience of the web globally. For me, this data gives
me base line that I can look at to see if our strategies for our devrel work
influence the ecosystem in the long-term.