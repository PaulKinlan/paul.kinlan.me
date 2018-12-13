---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, india]
---


Ich bin gerade dabei, eine kurze Reise nach Indien zu machen, und ich habe über längerfristige Entwicklerbeziehungen für Chrome und Web in der Region nachgedacht. Wie bei den meisten Reisen mache ich gerne ein bisschen Recherche im Voraus, um besser zu verstehen, wie das Web aus der Perspektive des Landes aussieht, das ich besuche.

Ich habe in den letzten paar Monaten eine ganze Reihe von Updates zu [HTTPArchive](https://httparchive.org/) verfolgt und es war erstaunlich, die Verbesserungen der Datentypen zu sehen, die es sammelt und speichert in [ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) -Tabellen. Eine spezielle Information, die für mich von großem Interesse ist, sind die [Lighthouse](https://developers.google.com/web/tools/lighthouse/) Daten, die bei jedem Lauf von HTTPArchive generiert werden. Mit diesen Daten wollte ich herausfinden, ob ich damit eine Momentaufnahme der Daten machen und ein besseres Verständnis dafür bekommen könnte, wie die Leute das Internet im Land erleben könnten.

Die gute Nachricht ist, dass es nicht schwierig ist, die Lighthouse-Daten in HTTPArchive zu analysieren.

Für meine Bedürfnisse besteht jedoch der schwierigere Teil darin, eine "Top-Site" in einem bestimmten Land zu sperren, besonders wenn ich über Entwickler-Relations-Arbeit nachdenke, die wir tun könnten und sollten.

Hier ist, wie ich das Problem gelöst habe. In jedem Land gibt es viele Arten von Entwicklern, die für das Web bauen und persönlich tendiere ich dazu, sie in 3 Gruppen einzuteilen: Diejenigen, deren aktuelles Projekt den lokalen Markt anvisiert; Diejenigen, die einen ausländischen Markt anvisieren (Ich baue für den Export); und solche, die ein globales Publikum ansprechen.

Wenn ich über die drei oben genannten Gruppen nachdenke, ist es fast unmöglich, die Absichten der Website und der dahinter stehenden Personen herauszufinden. Aber es gibt einige Heuristiken, mit denen Sie die Daten zumindest nachvollziehen und verstehen können.

Für meine Analyse glaubte ich nicht, dass ich eine Liste der Top-Sites, die von Nutzern in Indien besucht wurden, bekommen konnte, also nahm ich einfach an, dass '.in' Domains * wahrscheinlich * für Menschen in Indien gebaut werden. Die Sensitivität und Spezifität für die Frage "indian sites" liegt nicht zu 100% in der Konzentration auf ".in domains" & mdash; Nutzer auf der ganzen Welt nutzen gerne Erfahrungen, die nicht nur auf die Länder TLD & mdash; aber es scheint ein anständiges Maß für den Zustand der indischen Stätten als erster Pass.

Diese Art von Analyse erweist sich als ziemlich einfach. Sie öffnen [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) und finden die letzte Tabelle, die den Lighthouse-Datenlauf enthält [httparchiv: lighthouse .2018_08_01_mobile] in diesem Fall und führen Sie die folgende Abfrage aus.


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


Die obige Abfrage wird nach Domains mit der Endung '.in' gefiltert und gibt den Lighthouse-Score für jede Lighthouse-Testkategorie zurück. Die Lighthouse-Daten werden als JSON-Objekt gespeichert, das Sie über eine XPath-ähnliche Syntax für JSON extrahieren müssen.

Die Anzahl der Ergebnisse ist eigentlich ziemlich groß und es ist nicht sehr nützlich, sie hier zu präsentieren, aber ich habe sie in ein Histogramm gedreht.

<table><thead><th> Score-Bereich </th><th> SEO Ergebnis </th><th> PWA-Ergebnis </th><th> Geschwindigkeitswert </th><th> A11Y Ergebnis </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0.5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0.7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0.8 </td><td> 1438 </td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0.9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

Weitere Drill-Downs und Analysen der Daten müssen stattfinden, um genau zu verstehen, welche spezifischen Probleme die Scores beeinflussen. In einigen Fällen, wie zum Beispiel beim "PWA Score", habe ich genug von den Site-Scores in der Vergangenheit gesehen Welche Probleme beeinflussen die Gesamtpunktzahl und ich kann einige der vor uns liegenden Herausforderungen sehen.

Next Up. Versuchen Sie und finden Sie einen Weg, um die Seiten zu bekommen, die indische Benutzer häufig besuchen ... Hinweis, es ist [hier](/ crux-topsites-and-lighthouse-scores-for-india /)