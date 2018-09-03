---
slug: lighthouse-scores-for-in-domains
date: 2018-08-24T08:09:10.405Z
title: Getting Lighthouse scores from HTTPArchive for sites in India.
description: A quick dive in to how to use Lighthouse to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse]
---


Je suis sur le point de faire un court voyage en Inde, et j'ai réfléchi à la relation à long terme entre les développeurs et Chrome et Web dans la région. Comme pour la plupart des voyages, j'aime faire un peu de recherche à l'avance pour mieux comprendre à quoi ressemble le Web du point de vue du pays que je visite.

J'ai suivi un tas de mises à jour de [HTTPArchive](https://httparchive.org/) au cours des deux derniers mois et il est étonnant de voir les améliorations apportées aux types de données collectées et stockées dans ses [ BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md). Les informations [Lighthouse](https://developers.google.com/web/tools/lighthouse/) générées à chaque exécution de HTTPArchive constituent un élément d’intérêt particulier. Avec ces données, je souhaitais voir si je pouvais l'utiliser pour obtenir un instantané des données et obtenir une compréhension de haut niveau de la manière dont les gens pourraient expérimenter le Web dans le pays.

La bonne nouvelle est qu'il n'est pas trop difficile d'analyser les données du phare dans HTTPArchive.

Pour ce qui est de mes besoins, le plus difficile est d'obtenir un verrou sur ce qu'est un «site principal» dans un pays donné, surtout quand je pense au travail de relations avec les développeurs que nous pourrions et devrions faire.

Voici comment j'ai cassé le problème. Dans chaque pays, il existe de nombreux types de développeurs qui construisent pour le Web et, personnellement, j'ai tendance à les regrouper en trois groupes: ceux dont le projet actuel cible le marché local; Ceux qui ciblent un marché étranger (je construis pour l'exportation); et ceux qui ciblent un public mondial.

Quand je pense aux trois groupes ci-dessus, il est presque impossible de déterminer l’intention du site et les personnes qui l’appuient. Mais il existe certaines heuristiques que vous pouvez utiliser pour au moins vous aider à raisonner et à comprendre les données.

Pour mon analyse, je ne pensais pas pouvoir obtenir une liste des principaux sites visités par les utilisateurs en Inde. J'ai donc pensé que les domaines ".in" seraient probablement destinés aux utilisateurs en Inde. La sensibilité et la spécificité de la question des «sites indiens» ne sont pas à 100% en se concentrant sur «.in domaines». les utilisateurs du monde entier aiment utiliser des expériences qui ne sont pas seulement verrouillées dans les pays TLD & mdash; mais cela semble être une mesure décente de l'état des sites indiens en tant que premier passage.

Ce type d'analyse s'avère assez facile. Vous ouvrez [BigQuery](https://github.com/HTTPArchive/legacy.httparchive.org/blob/master/docs/bigquery-gettingstarted.md) et trouvez la dernière table contenant le cycle de données Lighthouse [httparchive: lighthouse .2018_08_01_mobile] dans ce cas et exécutez la requête suivante.


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


La requête ci-dessus est filtrée sur les domaines se terminant par ".in" et renvoie le score Lighthouse pour chacune des catégories de test Lighthouse. Les données du phare sont stockées sous la forme d'un objet JSON, que vous devez extraire des composants requis via une syntaxe de type XPath pour JSON.

Le nombre de résultats est en fait assez important et peu utile à présenter ici, mais je les ai intégrés dans un histogramme.

<table><thead><th> Plage de score </th><th> Score SEO </th><th> Score PWA </th><th> Score de vitesse </th><th> Score A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 46 </td><td> 279 </td><td> 25 </td></tr><tr><td> 0.5 </td><td> 84 </td><td> 13992 </td><td> 6502 </td><td> 3973 </td></tr><tr><td> 0.7 </td><td> 3391 </td><td> 1400 </td><td> 2222 </td><td> 7585 </td></tr><tr><td> 0,8 </td><td> 1438 </td><td> 19 </td><td> 1147 </td><td> 2374 </td></tr><tr><td> 0,9 </td><td> 2762 </td><td> 9 </td><td> 1545 </td><td> 1069 </td></tr><tr><td> 1 </td><td> 7752 </td><td> 13 </td><td> 3189 </td><td> 434 </td></tr></tbody></table>

Il faut approfondir l'analyse et analyser les données pour comprendre exactement quels problèmes affectent les scores, mais dans certains cas, comme avec le «score PWA», j'ai déjà vu suffisamment de notes de site pour savoir quels problèmes affectent le score global et je peux voir certains des défis qui nous attendent maintenant.

Prochaine étape Essayez de trouver un moyen d'obtenir les sites fréquentés par les utilisateurs indiens ... Indice, c'est [ici](/ crux-topsites-et-lighthouse-scores-for-india /)