---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


Wie ich in meinem [vorherigen Beitrag](/ lighthouse-scores-for-in-domains /) erwähnt habe, fange ich an, mehr Developer Relations in Indien zu planen, und ich möchte ein besseres Verständnis dafür bekommen, wie Benutzer in Indien das Web erleben . In diesem Post hatte ich eine sehr einfache Heuristik, um eine Site in Indien zu bestimmen, ist es eine '.in' Domain. Ich wusste, dass dies nicht der beste Weg war, um es anzuschauen, aber es fühlte sich wie ein guter erster Schritt an.

Was ich wirklich wollte, war eine Möglichkeit, die Websites zu verstehen, die Nutzer in Indien besuchen, und dann ihre Bewertungen nach Beliebtheit der Website zu sortieren.

Glücklicherweise enthält der [Chrome UX-Bericht](https://developers.google.com/web/tools/chrome-user-experience-report/) einige dieser Daten. Der Chrome UX Report enthält eine Reihe von Tabellen in BigQuery, die eine Liste mit vielen der Top-Ursprünge enthalten, die Nutzer in Indien besuchen (die Tabelle ist "chrome-ux-report.country_in.20180" & mdash; beachten Sie das "_in", das angibt das Land). Der Chrome UX-Bericht enthält viel mehr Daten für jeden Ursprung, z. B. die aggregierte Geschwindigkeit der Website für tatsächliche Nutzer, aber ich benötigte wirklich nur die URLs.

Mit den Daten aus dem Chrome UX-Bericht und der Kombination mit der Alexa-Rangliste in HTTP Archive zusammen mit den zuvor erwähnten HTTPArchive-Leuchtturm-Werten können wir ein besseres Bild davon gewinnen, was Nutzer in Indien tatsächlich sehen.




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


Wenn Sie die obige Abfrage ausführen, werden viele Daten zurückgegeben, die für Google Tabellen zu hoch sind. Daher habe ich nur die Top 16.000 Websites (bis zu etwa 7.000 in den Alexa-Rankings) analysiert. Im Folgenden sind die Daten ohne Kommentar zusammengefasst.

#### Top 7k

<table><thead><th> Score-Bereich </th><th> SEO Ergebnis </th><th> PWA-Ergebnis </th><th> Geschwindigkeitswert </th><th> A11Y Ergebnis </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Score-Bereich </th><th> SEO Ergebnis </th><th> PWA-Ergebnis </th><th> Geschwindigkeitswert </th><th> A11Y Ergebnis </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Score-Bereich </th><th> SEO Ergebnis </th><th> PWA-Ergebnis </th><th> Geschwindigkeitswert </th><th> A11Y Ergebnis </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Ich denke, die Tools, die Entwickler und Unternehmen jetzt in ihren Händen haben, können einen großen Unterschied für unsere Fähigkeit ausmachen, fundierte und prinzipielle Entscheidungen darüber zu treffen, wie Nutzer das Weberlebnis weltweit erleben. Diese Daten geben mir die Basis, auf die ich schauen kann, um zu sehen, ob unsere Strategien für unsere Devrel-Arbeit das Ökosystem langfristig beeinflussen.