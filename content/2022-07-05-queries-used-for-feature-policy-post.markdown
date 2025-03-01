---
date: 2022-07-05 20:30:13.874000+00:00
draft: true
slug: queries-used-for-feature-policy-post
summary: This post explores the usage of Feature Policy and Permissions Policy headers
  on the web. The data shows that 151,159 websites set either header on mobile devices
  as of June 1, 2022. A more detailed analysis delves into the specific directives
  used within these policies, examining their prevalence across different website
  rankings.  The queries provided offer a way to analyze the adoption of these important
  security headers and gain insights into how developers are utilizing them to control
  browser features and permissions.
tags:
- Feature Policy
- Permissions Policy
- HTTP Headers
- Web Security
- Browser APIs
- BigQuery
- Data Analysis
- Website Ranking
title: Queries used for feature policy post

---
### Queries used

#### Sites setting feature-policy or permissions-policy header on mobile
```
SELECT
  count(distinct url)
FROM
  `httparchive.requests.2022_06_01_mobile`,
  UNNEST(JSON_EXTRACT_ARRAY(payload,
      "$.response.headers")) AS response_headers
WHERE
  (JSON_VALUE(response_headers,
      '$.name') = 'permissions-policy'
    OR JSON_VALUE(response_headers,
      '$.name') = 'feature-policy')
  AND page = url
```

Results: 151159.

#### Feature Policy and Permission Policy Usage.

```
WITH page_ranks AS (
  SELECT
    client,
    page,
    rank
  FROM
    `httparchive.almanac.requests`
  WHERE
    date = '2022-06-01' AND
    firstHtml = TRUE
),

response_headers AS (
  SELECT
    client,
    page,
    LOWER(JSON_VALUE(response_header, '$.name')) AS header_name,
    LOWER(JSON_VALUE(response_header, '$.value')) AS header_value
  FROM
    `httparchive.almanac.requests`,
    UNNEST(JSON_QUERY_ARRAY(response_headers)) response_header
  WHERE
    date = '2022-06-01' AND
    firstHtml = TRUE
),

meta_tags AS (
  SELECT
    client,
    url AS page,
    LOWER(JSON_VALUE(meta_node, '$.http-equiv')) AS tag_name,
    LOWER(JSON_VALUE(meta_node, '$.content')) AS tag_value
  FROM (
    SELECT
      _TABLE_SUFFIX AS client,
      url,
      JSON_VALUE(payload, '$._almanac') AS metrics
    FROM
      `httparchive.pages.2022_06_01_*`
    ),
    UNNEST(JSON_QUERY_ARRAY(metrics, '$.meta-nodes.nodes')) meta_node
  WHERE
    JSON_VALUE(meta_node, '$.http-equiv') IS NOT NULL
),

totals AS (
  SELECT
    client,
    rank_grouping,
    COUNT(DISTINCT page) AS total_websites
  FROM
    `httparchive.almanac.requests`,
    UNNEST([1000, 10000, 100000, 1000000, 10000000]) AS rank_grouping
  WHERE
    date = '2022-06-01' AND
    firstHtml = TRUE AND
    rank <= rank_grouping
  GROUP BY
    client,
    rank_grouping
),

merged_feature_policy AS (
  SELECT
    client,
    page,
    IF(header_name = 'feature-policy', header_value, tag_value) AS feature_policy_value
  FROM
    response_headers
  FULL OUTER JOIN
    meta_tags
  USING (client, page)
  WHERE
    header_name = 'feature-policy' OR
    tag_name = 'feature-policy'
),

merged_permissions_policy AS (
  SELECT
    client,
    page,
    IF(header_name = 'permissions-policy', header_value, tag_value) AS permissions_policy_value
  FROM
    response_headers
  FULL OUTER JOIN
    meta_tags
  USING (client, page)
  WHERE
    header_name = 'permissions-policy' OR
    tag_name = 'permissions-policy'
),

feature_policy_directives AS (
  SELECT
    client,
    page,
    ARRAY_AGG(TRIM(SPLIT(TRIM(feature_policy_directive), ' ')[OFFSET(0)])) AS directives
  FROM
    merged_feature_policy,
    UNNEST(SPLIT(feature_policy_value, ';')) feature_policy_directive
  GROUP BY
    client,
    page
),

permissions_policy_directives AS (
  SELECT
    client,
    page,
    ARRAY_AGG(TRIM(SPLIT(TRIM(permissions_policy_directive), '=')[OFFSET(0)])) AS directives
  FROM
    merged_permissions_policy,
    UNNEST(SPLIT(permissions_policy_value, ',')) permissions_policy_directive
  GROUP BY
    client,
    page
),

site_directives AS (
  SELECT
    client,
    page,
    -- distinct directives; https://stackoverflow.com/a/58194837/7391782
    ARRAY(
      SELECT DISTINCT
        d
      FROM
        UNNEST(ARRAY_CONCAT(feature_policy_directives.directives, permissions_policy_directives.directives)) d
      WHERE
        TRIM(d) != ''
      ORDER BY
        d
    ) AS directives
  FROM
    feature_policy_directives
  FULL OUTER JOIN
    permissions_policy_directives
  USING (client, page)
)

SELECT
  client,
  rank_grouping,
  directive,
  COUNT(DISTINCT page) AS number_of_websites_with_directive,
  total_websites,
  COUNT(DISTINCT page) / total_websites AS pct_websites_with_directive
FROM
  site_directives,
  UNNEST([1000, 10000, 100000, 1000000, 10000000]) AS rank_grouping
JOIN
  page_ranks
USING (client, page)
JOIN
  totals
USING (client, rank_grouping),
  UNNEST(site_directives.directives) directive
WHERE
  rank <= rank_grouping
GROUP BY
  client,
  rank_grouping,
  directive,
  total_websites
ORDER BY
  rank_grouping,
  client,
  number_of_websites_with_directive DESC,
  directive
```