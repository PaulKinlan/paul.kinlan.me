---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


Comme je l'ai mentionné dans mon [post précédent](/ lighthouse-scores-for-in-domains /), je commence à planifier plus de travail de relations avec les développeurs en Inde et je veux mieux comprendre comment les utilisateurs en Inde font l'expérience du Web. . Dans cet article, j'ai eu une heuristique très simple pour déterminer un site en Inde, est-ce un domaine «.in». Je savais que ce n'était pas la meilleure façon de voir les choses, mais c'était comme une bonne première.

Ce que je voulais vraiment, c’était un moyen de comprendre les sites visités par les utilisateurs en Inde, puis d’obtenir leur classement en fonction de la popularité du site.

Heureusement, le [rapport Chrome UX](https://developers.google.com/web/tools/chrome-user-experience-report/) contient certaines de ces données. Le rapport Chrome UX contient une série de tables dans BigQuery contenant une liste des principales origines visitées par les utilisateurs en Inde (la table est `chrome-ux-report.country_in.20180` & mdash; notez le '_in' qui indique le pays). Le rapport Chrome UX contient beaucoup plus de données pour chaque origine, par exemple la vitesse agrégée du site pour les utilisateurs réels, mais je n'avais besoin que des URL.

En utilisant les données du rapport Chrome UX et en les combinant avec le tableau de classement Alexa dans HTTP Archive avec les scores de phare HTTPArchive mentionnés précédemment, nous pouvons avoir une meilleure idée de ce que les utilisateurs en Inde voient réellement.




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


L'exécution de la requête ci-dessus renvoie beaucoup de données, trop pour Google Sheets. J'ai donc analysé à peu près les 16 000 premiers sites (jusqu'à environ 7 000 dans le classement Alexa). Vous trouverez ci-dessous les données agrégées sans commentaire.

#### Top 7k

<table><thead><th> Plage de score </th><th> Score SEO </th><th> Score PWA </th><th> Score de vitesse </th><th> Score A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> dix </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0,8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0,9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Plage de score </th><th> Score SEO </th><th> Score PWA </th><th> Score de vitesse </th><th> Score A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231. </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0,8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0,9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Plage de score </th><th> Score SEO </th><th> Score PWA </th><th> Score de vitesse </th><th> Score A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0,8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0,9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Je pense que les outils que les développeurs et les entreprises ont désormais entre leurs mains peuvent faire une énorme différence dans notre capacité à prendre des décisions raisonnées et fondées sur des principes sur la manière dont les utilisateurs ressentent réellement l'expérience du Web à l'échelle mondiale. Pour moi, ces données me donnent une base sur laquelle je peux me pencher pour voir si nos stratégies pour notre travail dévélé influencent l'écosystème à long terme.