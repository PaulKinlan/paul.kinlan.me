---
date: 2018-08-24 08:09:10.405000+00:00
description: A quick dive in to how to use Lighthouse to try and understand how users
  in a country might experience the web.
slug: lighthouse-scores-for-in-domains
summary: In preparation for a trip to India and future developer relations work, I
  explored the Indian web landscape using HTTPArchive and Lighthouse data.  I analyzed
  Lighthouse scores for \".in\" domains as a proxy for sites built for Indian users,
  acknowledging limitations in this approach.  BigQuery analysis revealed overall
  Lighthouse scores across SEO, PWA, performance, and accessibility. The results highlight
  opportunities for improvement, especially in PWA scores.  The next step is to identify
  sites frequently used by Indian users to gain further insights.
tags:
- India
- web performance
- Lighthouse
- HTTPArchive
- BigQuery
- SEO
- PWA
- Accessibility
- Performance
- developer relations
- internationalization
title: Getting Lighthouse scores from HTTPArchive for sites in India.

---

I'm about to go on a short trip to India, and I've been thinking about
longer-term developer relations work for Chrome and Web in the region. As with
most trips I like to do a bit of research ahead of time so I can get a better
understanding of what the web looks like from the perspective of the country I
am visiting.

I've been following a bunch of the updates to
[HTTPArchive](https://httparchive.org/) over the past couple of months and it's
been amazing to see the improvements to the types of data it collects and stores
in its
[BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md)
tables. One specific piece of information that is of massive interest to me is
the [Lighthouse](https://developers.google.com/web/tools/lighthouse/) data
generated on each run of HTTPArchive. With this data I was keen to see if I
could use it to get a snapshot of the data and get a high-level understanding of
how people might experience the web in the country.

The good news is that it's not too hard to analyse the Lighthouse data in
HTTPArchive.

For my needs though, the harder part is to get a lock on what a 'top site' in
any given country is, especially when I am thinking about developer relations
work that we could and should be doing.

Here is how I broke the problem down. In each country there are many types of
developers that build for the web and personally I tend to bucket them in to 3
groups: Those whose current project target the local market; Those that target a
foreign market (I building for export); and those that target a global audience.

When I think about the above three groups, it's nearly impossible to work out
the intent of the site and the people behind it. But there are some heuristics
that you can use to at least help you reason and understand the data.

For my analysis I didn't think I could get a list of the top sites visited by
users in India, so I made a simple assumption that '.in' domains are *likely* to
be built for people in India. The sensitivity and specificity for the question
of ‘indian sites’ is not 100% by focusing on ‘.in domains’ &mdash; users all
over the world like to use experiences that aren't just locked to the countries
TLD &mdash; but it seems like decent measure of the state of Indian sites as a
first pass. 

This type of analysis turns out to be pretty easy. You open up [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md)
and find the latest table that contains the Lighthouse data run
[httparchive:lighthouse.2018_08_01_mobile] in this case and run the following
query.

```sql
SELECT
  url,
  JSON_EXTRACT(report, '$.categories.seo.score') AS [seo_score],
  JSON_EXTRACT(report, '$.categories.pwa.score') AS [pwa_score],
  JSON_EXTRACT(report, '$.categories.performance.score') AS [speed_score],
  JSON_EXTRACT(report, '$.categories.accessibility.score') AS [accessibility_score]
FROM
  [httparchive:lighthouse.2018_08_01_mobile]
WHERE
  url LIKE '%.in/'
```

The above query is filtered on domains ending in '.in', and it returns the
Lighthouse score for each of the Lighthouse test categories. The Lighthouse data
is stored as a JSON object, which you have to extract the required components
via an XPath like syntax for JSON.

The number of results is actually pretty large and not of much use to present
here, but I did pivot these into a histogram.

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
<td>46</td>
<td>279</td>
<td>25</td>
</tr>
<tr>
<td>0.5</td>
<td>84</td>
<td>13992</td>
<td>6502</td>
<td>3973</td>
</tr>
<tr>
<td>0.7</td>
<td>3391</td>
<td>1400</td>
<td>2222</td>
<td>7585</td>
</tr>
<tr>
<td>0.8</td>
<td>1438</td>
<td>19</td>
<td>1147</td>
<td>2374</td>
</tr>
<tr>
<td>0.9</td>
<td>2762</td>
<td>9</td>
<td>1545</td>
<td>1069</td>
</tr>
<tr>
<td>1</td>
<td>7752</td>
<td>13</td>
<td>3189</td>
<td>434</td>
</tr>
</tbody>
</table>

Further drill-down and analysis of the data needs to take place, to understand
exactly which specific issues are affecting the scores, however in some cases
like with the 'PWA Score' I've seen enough of the site scores in the past to
know what issues affect the overall score and I can see some of the challenges
ahead of us now.

Next up. Try and find a way to get the sites that Indian users frequent....
Hint, it's [here](/crux-topsites-and-lighthouse-scores-for-india/)