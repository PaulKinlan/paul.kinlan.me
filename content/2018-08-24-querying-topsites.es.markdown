---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse]
---


Estoy a punto de realizar un breve viaje a la India, y he estado pensando en relaciones de desarrollador a largo plazo para Chrome y Web en la región. Al igual que con la mayoría de los viajes, me gusta investigar un poco antes de tiempo para poder entender mejor cómo es la web desde la perspectiva del país que estoy visitando.

He estado siguiendo un montón de las actualizaciones de [HTTPArchive](https://httparchive.org/) en los últimos meses y ha sido sorprendente ver las mejoras en los tipos de datos que recopila y almacena en su [ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) tablas. Una pieza específica de información que me interesa enormemente es la información [Lighthouse](https://developers.google.com/web/tools/lighthouse/) generada en cada ejecución de HTTPArchive. Con estos datos, estaba ansioso por ver si podía usarlo para obtener una instantánea de los datos y obtener un entendimiento de alto nivel de cómo las personas podrían experimentar la red en el país.

La buena noticia es que no es demasiado difícil analizar los datos de Lighthouse en HTTPArchive.

Para mis necesidades, sin embargo, la parte más difícil es ponerle un cerrojo a lo que es un 'sitio superior' en cualquier país dado, especialmente cuando estoy pensando en el trabajo de relaciones de desarrollador que podríamos y deberíamos estar haciendo.

Así es como rompí el problema. En cada país hay muchos tipos de desarrolladores que crean para la web y, personalmente, tiendo a agruparlos en 3 grupos: aquellos cuyo proyecto actual apunta al mercado local; Aquellos que apuntan a un mercado extranjero (construyo para la exportación); y aquellos que apuntan a una audiencia global.

Cuando pienso en los tres grupos anteriores, es casi imposible determinar la intención del sitio y las personas que lo respaldan. Pero hay algunas heurísticas que puede usar para ayudarlo a razonar y comprender los datos.

Para mi análisis, no pensé que podría obtener una lista de los mejores sitios visitados por los usuarios en la India, así que asumí que '.in' dominios * probablemente * sean construidos para personas en la India. La sensibilidad y la especificidad para la cuestión de los "sitios indios" no es 100% al centrarse en ".in dominios" & mdash; a los usuarios de todo el mundo les gusta usar experiencias que no solo están bloqueadas en los países TLD y mdash; pero parece una buena medida del estado de los sitios indios como primer paso.

Este tipo de análisis resulta bastante fácil. Abre [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) y busca la última tabla que contiene la ejecución de datos de Lighthouse [httparchive: faro .2018_08_01_mobile] en este caso y ejecute la siguiente consulta.


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


La consulta anterior se filtra en dominios que terminan en '.in', y devuelve la puntuación de Faro para cada una de las categorías de prueba de Faro. Los datos de Lighthouse se almacenan como un objeto JSON, que debe extraer los componentes necesarios a través de una sintaxis similar a XPath para JSON.

La cantidad de resultados es en realidad bastante grande y de poca utilidad para presentar aquí, pero sí los convertí en un histograma.

<table><thead><th> Rango de puntuación </th><th> Puntuación de SEO </th><th> Puntaje de PWA </th><th> Puntuación de velocidad </th><th> Puntuación A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0.5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0.7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0.8 </td><td> 1438 </td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0.9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

Es necesario profundizar y analizar los datos para comprender exactamente qué problemas específicos afectan los puntajes, sin embargo, en algunos casos, como con el "Puntaje de PWA", ya he visto suficientes puntajes de sitios en el pasado como para saber qué problemas afectan el puntaje general y puedo ver algunos de los desafíos que tenemos por delante ahora.

El siguiente. Intente encontrar la manera de obtener los sitios que los usuarios indios frecuentan ... Sugerencia, es [aquí](/ crux-topsites-and-lighthouse-scores-for-india /)