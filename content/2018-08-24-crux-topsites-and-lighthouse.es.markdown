---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


Como mencioné en mi [publicación anterior](/ lighthouse-scores-for-in-domains /), estoy empezando a planear más trabajo de Relaciones con Desarrolladores en India y quiero obtener una mejor comprensión de cómo los usuarios en India experimentan la web. . En esa publicación tenía una heurística muy simple para determinar un sitio en la India, ¿es un dominio '.in'. Sabía que esta no era la mejor manera de verlo, pero me pareció una buena idea.

Lo que realmente quería era una forma de entender los sitios que visitan los usuarios en India y luego obtener sus puntajes clasificados por popularidad del sitio.

Afortunadamente, el [informe de Chrome UX](https://developers.google.com/web/tools/chrome-user-experience-report/) contiene algunos de esos datos. El Informe de UX de Chrome tiene una serie de tablas en BigQuery que contienen una lista de muchos de los principales orígenes que visitan los usuarios de India (la tabla es `chrome-ux-report.country_in.20180` & mdash; tenga en cuenta el '_in' que denota el país). El informe de Chrome UX tiene muchos más datos para cada origen, como la velocidad agregada del sitio para usuarios reales, pero realmente solo necesitaba las URL.

Usando los datos del informe de Chrome UX y combinándolos con la tabla de clasificación de Alexa en HTTP Archive junto con los puntajes del faro de HTTPArchive mencionados anteriormente, podemos obtener una mejor idea de lo que realmente ven los usuarios en India.




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


La ejecución de la consulta anterior devuelve una gran cantidad de datos, demasiado para Hojas de cálculo de Google, por lo que solo analicé aproximadamente los mejores 16,000 sitios (hasta aproximadamente 7k en los rankings de Alexa). A continuación están los datos agregados sin comentarios.

#### Top 7k

<table><thead><th> Rango de puntuación </th><th> Puntuación de SEO </th><th> Puntaje de PWA </th><th> Puntuación de velocidad </th><th> Puntuación A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Rango de puntuación </th><th> Puntuación de SEO </th><th> Puntaje de PWA </th><th> Puntuación de velocidad </th><th> Puntuación A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Rango de puntuación </th><th> Puntuación de SEO </th><th> Puntaje de PWA </th><th> Puntuación de velocidad </th><th> Puntuación A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> dieciséis </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> dieciséis </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Creo que las herramientas que los desarrolladores y las empresas ahora tienen en sus manos pueden marcar una gran diferencia en nuestra capacidad para tomar decisiones razonadas y basadas en principios sobre cómo los usuarios realmente sienten la experiencia de la web a nivel mundial. Para mí, estos datos me dan una línea de base que puedo ver para ver si nuestras estrategias para nuestro trabajo de devolución influyen en el ecosistema a largo plazo.