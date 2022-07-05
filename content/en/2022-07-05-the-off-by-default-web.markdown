---
title: The off by default web
date: 2022-07-05T08:50:56.817Z
draft: true
summary: Some musing on the model of API permissions on the web.
slug: the-off-by-default-web
---
I was idly musing about the state of permissions and how little the [Feature Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy) system (now [Permissions Policy](https://developer.chrome.com/en/docs/privacy-sandbox/permissions-policy/) <- great primer) is understood or used. It got me thinking that maybe that the default way the industry thinks about permissions on the web is not quite right and maybe it's too permissive. We demand the developer asks the question "what should I turn off?" and it might be better to instead think about "what should I enable?".

When I speak to people about the Feature Policy system, the broad consensus is that it's "the first I've heard of it", and for people in the know, the feedback is usually: "Oh it's when I don't want an iframe to do this thing". It's rarely thought about in a first person context (as in what can be used on my site directly). And a query of HTTPArchive suggests that < 7000 sites out of approximately 10 million control their `feature-policy` or `permissions-policy` (queries below) show that to be the case.

Speaking for myself, the cognitive load about thinking of permissions has been deferred to the 'user gesture' protection and I know from experience that it's a similar process for the developers broadly. The default assumption is that "permissions" require the user to grant them so it's safe. However, there are a number of different models such as:

* User Agent default-allow - the Browser vendor deems it safe for a script to access an API without any intervention, such as autoplay (in some cases), devicemotion, gamepad, clipboard-write etc
* Requires User Gesture - the Browser wants the user to explicitly opt-in to using the API such as your Camera, MIDI's, USB, etc
* Developer Controlled - the owner of a site can block access to features on their site, or any resource such as an iframe that might be embedded on the site.

But the question for me now is: Should we as an industry be more intentional about the permission surfaces we make accessible to script?

Looking at the feature policy page, there are [29 (as of July 2022) standardised permissions](https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md), and 49 in Chrome when I run `document.featurePolicy.features()`) that you as a developer can control and that's a lot to think about.

Take the camera for example, the API is gated behind a user-gesture so it's not like a page could grab the camera without the user knowing, but if your site never accesses the Camera or microphone - the question "would it be better to never allow access to it?" should be asked.

If you are confident about all your dependencies on your site then it might not actually be an issue, but if you have to embed 3rd party scripts into your site like many of us have to, then I think it's reasonable to ask the question about what features should be accessible to scripts.

When I look at the data in the HTTP Archive it's not a surprise, but there are shockingly few sites that control their permissions, and even fewer still who disable features.

What would it take to change the mindset to one of least privilege? I don't actually know. What I do know is that today it's too hard.

Today, a deny-all Permissions/Feature Policy would have to look like this for Chrome.

```
permissions-policy: accelerometer=(), autoplay=(), camera=(), ch-device-memory=(),
  ch-downlink=(), ch-dpr=(), ch-ect=(), ch-prefers-color-scheme=(), ch-rtt=(), 
  ch-save-data=(), ch-ua=(), ch-ua-arch=(), ch-ua-bitness=(), 
  ch-ua-full-version=(), ch-ua-full-version-list=(), ch-ua-mobile=(), 
  ch-ua-model=(), ch-ua-platform=(), ch-ua-platform-version=(), ch-ua-wow64=(), 
  ch-viewport-width=(), ch-width=(), clipboard-read=(), clipboard-write=(), 
  cross-origin-isolated=(), display-capture=(), document-domain=(), 
  encrypted-media=(), fullscreen=(), gamepad=(), geolocation=(), 
  gyroscope=(), hid=(), idle-detection=(), keyboard-map=(), 
  local-fonts=(), magnetometer=(), microphone=(), midi=(), otp-credentials=(), 
  payment=(), picture-in-picture=(), publickey-credentials-get=(), 
  screen-wake-lock=(), serial=(), sync-xhr=(), usb=(), window-placement=(), 
  xr-spatial-tracking=()
```
Complex, right? Not to mention an increase in your request size and the fact Permission Policy is only available in Chromium based browsers. So you also have to add feature policy:

```
feature-policy: accelerometer 'none'; autoplay 'none'; camera 'none'; 
  ch-device-memory 'none'; ch-downlink 'none'; ch-dpr 'none'; ch-ect 'none'; 
  ch-prefers-color-scheme 'none'; ch-rtt 'none'; ch-save-data 'none'; 
  ch-ua 'none'; ch-ua-arch 'none'; ch-ua-bitness 'none'; 
  ch-ua-full-version 'none'; ch-ua-full-version-list 'none'; ch-ua-mobile 'none'; 
  ch-ua-model 'none'; ch-ua-platform 'none'; ch-ua-platform-version 'none'; 
  ch-ua-wow64 'none'; ch-viewport-width 'none'; ch-width 'none'; 
  clipboard-read 'none'; clipboard-write 'none'; cross-origin-isolated 'none'; 
  display-capture 'none'; document-domain 'none'; encrypted-media 'none'; 
  fullscreen 'none'; gamepad 'none'; geolocation 'none'; gyroscope 'none';
  hid 'none'; idle-detection 'none'; keyboard-map 'none'; local-fonts 'none'; 
  magnetometer 'none'; microphone 'none'; midi 'none'; otp-credentials 'none'; 
  payment 'none'; picture-in-picture 'none'; publickey-credentials-get 'none'; 
  screen-wake-lock 'none'; serial 'none'; sync-xhr 'none'; usb 'none'; 
  window-placement 'none'; xr-spatial-tracking 'none'
```

But that's not all. Browser vendors don't support all the same permissions. What is above, I believe will work in Safari and Firefox, but they might have a permission that Chrome doesn't.

Urgh.

The web is too far along to move to an off-by-default model for permissions, so we will always probably have to manage it ourselves. Specifically, when a new API is introduced on the web *you* as a developer **have to disable it**. We know from our surveys that developers can't keep up with the additions to the Web Platform, so I believe we should look a little harder into how we manage permissions especially we want a world where a browser update doesn't accidentally enable a new primitive that the developer has not yet reasoned about if they want to enable. 

It does feel like there could be some improvements to the declarative model for permission, for example a simple shortcut for a 'deny-all' such as
`permissions-policy: all=()` or `permissions-policy: ()` would make this a lot easier to reason.

Intentionality is important. I think there is a case for sites to disable all access to APIs by default and selectively turn features on if it's needed for the site to function, but it would require a massive shift in how we think about building web sites.





---
### Sites setting feature-policy or permissions-policy header on mobile
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


### Feature Policy and Permission Policy Usage.

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

