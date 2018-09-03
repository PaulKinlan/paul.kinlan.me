---
slug: crux-topsites-and-lighthouse-scores-for-india
date: 2018-08-24T08:19:10.405Z
title: Using HTTPArchive and Chrome UX report to get Lighthouse score for top visited sites in India.
description: A quick dive in to how to use Lighthouse,HTTPArchive and Chrome UX report to try and understand how users in a country might experience the web.
tags: [webdev, bigquery, lighthouse, crux]
---


என் [முந்தைய இடுகை](/ கலங்கரை விளக்கங்கள்-க்கு-ல்-களங்கள் /) இல் நான் குறிப்பிட்டுள்ளபடி, நான் இந்தியாவில் மேலும் டெவலப்பர் உறவுகளைத் திட்டமிடுவதற்குத் தொடங்குகிறேன், இந்தியாவில் உள்ள பயனர்கள் எவ்வாறு பயனர்களைப் பயன்படுத்துவது என்பது பற்றி எனக்கு நன்றாக புரியும். . அந்த இடுகையில், இந்தியாவில் ஒரு தளத்தைத் தீர்மானிப்பதற்கான மிக எளிய குணாம்சம் எனக்கு இருந்தது, அது '.in' டொமைன். நான் அதை பார்க்க சிறந்த வழி இல்லை என்று எனக்கு தெரியும், ஆனால் அது ஒரு நல்ல முதல் போல் உணர்ந்தேன்.

இந்தியாவில் உள்ள பயனர்களைப் பார்வையிடும் தளங்களைப் புரிந்து கொள்வதற்கான ஒரு வழியாக நான் விரும்பினேன், அந்த தளத்தின் பிரபலத்தினால் தரப்பட்ட மதிப்பெண்களைப் பெற்றேன்.

அதிர்ஷ்டவசமாக [Chrome UX அறிக்கை](https://developers.google.com/web/tools/chrome-user-experience-report/) அந்த தரவுகளில் சில உள்ளது. Chrome UX அறிக்கை இந்தியாவில் உள்ள பயனர்கள் வருகை தரும் பல மூலங்களின் பட்டியலைக் கொண்ட BigQuery இல் பல அட்டவணைகளை கொண்டுள்ளது (அட்டவணை `குரோம்-ux-report.country_in20180` & mdash; நாடு). உண்மையான பயனர்களுக்கான தளத்தின் மொத்த வேகம் போன்ற ஒவ்வொரு தோற்றத்திற்கும் Chrome UX அறிக்கை நிறைய தரவு உள்ளது, ஆனால் நான் உண்மையில் URL கள் மட்டுமே தேவை.

Chrome UX அறிக்கையிடமிருந்து தரவைப் பயன்படுத்தி, HTTP காப்பகத்திலுள்ள அலெக்ஸா தரவரிசை அட்டவணையுடன் அதை இணைத்து முன்னர் குறிப்பிடப்பட்ட HTTPArchive Lighthouse மதிப்பெண்களுடன் சேர்ந்து இந்தியாவில் உண்மையில் என்ன பயனர்கள் பயனர்களைப் பார்ப்பது என்பது ஒரு சிறந்த படத்தை பெறலாம்.




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


மேலே உள்ள வினவலைப் பயன்படுத்தி, Google Sheets க்கு மிக அதிகமான தரவுகளைத் தருகிறது, எனவே நான் மேல் 16,000 தளங்களை (அலெக்ஸா ரேங்கிங்கில் சுமார் 7k வரை) மட்டுமே பகுப்பாய்வு செய்தேன். கருத்து இல்லாமல் ஒருங்கிணைக்கப்பட்ட தரவு கீழே உள்ளது.

#### Top 7k

<table><thead><th> ஸ்கோர் ரேஞ்ச் </th><th> எஸ்சி ஸ்கோர் </th><th> PWA ஸ்கோர் </th><th> வேகம் ஸ்கோர் </th><th> A11Y ஸ்கோர் </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 25 </td><td> 149 </td><td> 10 </td></tr><tr><td> 0.5 </td><td> 45 </td><td> 12253 </td><td> 7841 </td><td> 3925 </td></tr><tr><td> 0.7 </td><td> 1907 </td><td> 3609 </td><td> 2725 </td><td> 6498 </td></tr><tr><td> 0.8 </td><td> 1713 </td><td> 54 </td><td> 1188 </td><td> 2610 </td></tr><tr><td> 0.9 </td><td> 3016 </td><td> 30 </td><td> 1180 </td><td> 1788 </td></tr><tr><td> 1 </td><td> 9278 </td><td> 21 </td><td> 2283 </td><td> 1157 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 100

<table><thead><th> ஸ்கோர் ரேஞ்ச் </th><th> எஸ்சி ஸ்கோர் </th><th> PWA ஸ்கோர் </th><th> வேகம் ஸ்கோர் </th><th> A11Y ஸ்கோர் </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 0 </td><td> 3 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 0 </td><td> 2279 </td><td> 1231 </td><td> 519 </td></tr><tr><td> 0.7 </td><td> 87 </td><td> 703 </td><td> 484 </td><td> 1348 </td></tr><tr><td> 0.8 </td><td> 199 </td><td> 0 </td><td> 198 </td><td> 587 </td></tr><tr><td> 0.9 </td><td> 375 </td><td> 0 </td><td> 261 </td><td> 302 </td></tr><tr><td> 1 </td><td> 2316 </td><td> 0 </td><td> 694 </td><td> 219 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

#### Alexa Top 1000

<table><thead><th> ஸ்கோர் ரேஞ்ச் </th><th> எஸ்சி ஸ்கோர் </th><th> PWA ஸ்கோர் </th><th> வேகம் ஸ்கோர் </th><th> A11Y ஸ்கோர் </th></thead><tbody><tr><td> 0 </td><td> 0 </td><td> 1 </td><td> 19 </td><td> 2 </td></tr><tr><td> 0.5 </td><td> 16 </td><td> 5471 </td><td> 3517 </td><td> 1942 </td></tr><tr><td> 0.7 </td><td> 546 </td><td> 1867 </td><td> 1272 </td><td> 2941 </td></tr><tr><td> 0.8 </td><td> 757 </td><td> 9 </td><td> 507 </td><td> 1212 </td></tr><tr><td> 0.9 </td><td> 1077 </td><td> 16 </td><td> 567 </td><td> 719 </td></tr><tr><td> 1 </td><td> 4962 </td><td> 6 </td><td> 1241 </td><td> 550 </td></tr><tr><td></td><td> 0 </td><td> 0 </td><td> 0 </td><td> 0 </td></tr></tbody></table>

நான் கருவிகள் டெவலப்பர்கள் மற்றும் இப்போது தங்கள் கைகளில் வணிகங்கள் நினைக்கிறேன் பயனர்கள் உண்மையில் உலகளாவிய வலை அனுபவம் உணர எப்படி நியாயமான மற்றும் கொள்கை முடிவுகளை எடுக்க எங்கள் திறனை ஒரு பெரிய வித்தியாசம் முடியும். என்னைப் பொறுத்தவரை, இந்த தரவு எனக்கு அடிப்படைக் கோட்டை கொடுக்கிறது, எங்களது உபாய வேலைக்கான நமது உத்திகள் நீண்டகாலத்தில் சுற்றுச்சூழலை பாதிக்கின்றனவா என்று நான் பார்க்கிறேன்.