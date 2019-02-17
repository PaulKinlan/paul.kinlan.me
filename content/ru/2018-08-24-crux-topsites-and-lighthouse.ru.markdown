---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux,india]
---


Как я упоминал в своем [предыдущем посте](/ lighthouse-scores-for-in-domains /), я начинаю планировать работу разработчиков в Индии, и я хочу лучше понять, как пользователи в Индии сталкиваются с веб-сайтом , В этом посте у меня была очень простая эвристика для определения сайта в Индии, это домен «.in». Я знал, что это не лучший способ взглянуть на это, но сначала было хорошо.

То, что я действительно хотел, было способом понять сайты, которые посетили пользователи в Индии, а затем получить их оценки по популярности сайта.

К счастью, в [Chrome UX report](https://developers.google.com/web/tools/chrome-user-experience-report/) есть некоторые из этих данных. Отчет Chrome UX содержит серию таблиц в BigQuery, которые содержат список многих из главных истоков, которые посещают пользователи в Индии (таблица «chrome-ux-report.country_in.20180» & ndash; обратите внимание на «_in», который обозначает страна). В отчете Chrome UX имеется гораздо больше данных для каждого источника, например, агрегированная скорость сайта для реальных пользователей, но мне действительно нужны только URL-адреса.

Используя данные из отчета Chrome UX и объединив их с рейтинговой таблицей Alexa в HTTP-архиве вместе с ранее упомянутыми оценками маяка Arthurive, мы можем получить лучшее представление о том, что пользователи в Индии действительно видят.




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


Выполнение вышеуказанного запроса возвращает много данных, слишком много для Google Таблиц, поэтому я только проанализировал примерно 16 000 сайтов (до 7 тыс. В рейтинге Alexa). Ниже приведены данные, агрегированные без комментариев.

#### Top 7k

<table><thead><th> Диапазон оценки </th><th> Оценка SEO </th><th> Оценка PWA </th><th> Оценка скорости </th><th> Оценка A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0,5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> Диапазон оценки </th><th> Оценка SEO </th><th> Оценка PWA </th><th> Оценка скорости </th><th> Оценка A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> Диапазон оценки </th><th> Оценка SEO </th><th> Оценка PWA </th><th> Оценка скорости </th><th> Оценка A11Y </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0,5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> +1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> +719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

Я думаю, что разработчики и бизнес-инструменты теперь могут в огромной степени влиять на нашу способность принимать обоснованные и принципиальные решения о том, как пользователи на самом деле ощущают опыт Интернета в глобальном масштабе. Для меня эти данные дают мне базовую линию, на которую я могу посмотреть, не повлияют ли наши стратегии на нашу жизнь на эволюцию экосистемы в долгосрочной перспективе.