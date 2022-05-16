
---
title: Responsible JavaScript 
date: 2022-05-06T20:41:18.107Z
type: entry
slug: responsible-javascript
---
* By [Jeremy Wagner](../../entry/jeremy-wagner) [#](#628256dd-4ef6-4500-97f8-1227a571bfb8)<a name="628256dd-4ef6-4500-97f8-1227a571bfb8"></a>
* Main takeaway is that it's still an incredibly complex space, and one that a developer has to take control of otherwise poor performance will take control of you. There's a lot of strategies, but I'm still left wondering why focusing on performance is not the default for developers or the platform. [#](#c0a8174e-fdf5-4a00-9c5d-3fffd75c6a4b)<a name="c0a8174e-fdf5-4a00-9c5d-3fffd75c6a4b"></a>
* Wasps! [#](#451b3173-70ba-4d6c-9181-3e702d058ead)<a name="451b3173-70ba-4d6c-9181-3e702d058ead"></a>
* It was great to see talking about a number of issues that affect performance [#](#bbd555a8-9835-4299-a679-3af29c2975d8)<a name="bbd555a8-9835-4299-a679-3af29c2975d8"></a>
  * Thermal Throttling [#](#d54b1d09-6d84-40f6-acd8-d406dca39686)<a name="d54b1d09-6d84-40f6-acd8-d406dca39686"></a>
  * Device Capabilities - Nokia 2 Go ([Android](../../entry/android)) [#](#cbf90525-e1e4-4343-b1f4-1a4255874c8e)<a name="cbf90525-e1e4-4343-b1f4-1a4255874c8e"></a>
* Developers are ultimately responsible [#](#cc8c8329-333f-431d-9bc8-ef40efce54cc)<a name="cc8c8329-333f-431d-9bc8-ef40efce54cc"></a>
* The platform is far more capable now - you don't need so many libraries [#](#285322a5-b9c5-4254-9e65-59f7a59f5998)<a name="285322a5-b9c5-4254-9e65-59f7a59f5998"></a>
* Document your architectural choices and hold your projects to them [#](#b268f17b-e2d5-4f4b-a653-d8a7cd55adb7)<a name="b268f17b-e2d5-4f4b-a653-d8a7cd55adb7"></a>
* Server-first is User-first [#](#d8047eac-69f8-4a3d-9a98-f32159a05e7c)<a name="d8047eac-69f8-4a3d-9a98-f32159a05e7c"></a>
* SPA [#](#7f763276-9b50-4985-94ce-1e32d3709e33)<a name="7f763276-9b50-4985-94ce-1e32d3709e33"></a>
  * Perceptual improvements to performance [#](#0904c7e9-3556-44ed-b739-2a578ab5a866)<a name="0904c7e9-3556-44ed-b739-2a578ab5a866"></a>
  * However they have to use lot's of JS to replace infrastrutuce the browser already provides [#](#e2ccec4a-08ef-4292-88f3-3c201f2a9cfa)<a name="e2ccec4a-08ef-4292-88f3-3c201f2a9cfa"></a>
    * Effective [Caching](../../entry/caching) in a [Service Worker](../../entry/service-worker) might be able to help with the same perceived performance benefits [#](#69f4a1e9-51fa-47d5-8915-38ff3aba7790)<a name="69f4a1e9-51fa-47d5-8915-38ff3aba7790"></a>
  * Use effective [Caching](../../entry/caching) [#](#71615fa9-1bea-41e8-98cd-b9c8a19ba19c)<a name="71615fa9-1bea-41e8-98cd-b9c8a19ba19c"></a>
    * Mentions `immutable`, but I think this is only supported in [Firefox](../../entry/firefox) [#](#4a9363a5-c6c9-4f0f-b904-397c3f1e4677)<a name="4a9363a5-c6c9-4f0f-b904-397c3f1e4677"></a>
  * [Progressive Enhancement](../../entry/progressive-enhancement) [#](#e1f38cc6-ba90-46fd-b95a-82cf8b984f07)<a name="e1f38cc6-ba90-46fd-b95a-82cf8b984f07"></a>
    * `is` - mentions not in [Safari](../../entry/safari) [#](#623ad4b7-7aac-4990-ad7e-593a379918c3)<a name="623ad4b7-7aac-4990-ad7e-593a379918c3"></a>
    * Some interesting code to enhance a form element. Quite liked the submit button demo [#](#8e0050cc-13a3-4b42-815c-eb1e8f25bbff)<a name="8e0050cc-13a3-4b42-815c-eb1e8f25bbff"></a>
* Metrics [#](#bee46139-876f-4057-985e-0c12cf3da75a)<a name="bee46139-876f-4057-985e-0c12cf3da75a"></a>
  * [Lab Metrics](../../entry/lab-metrics) [#](#e0c5e19d-982e-4b70-8d39-7e2785e9e759)<a name="e0c5e19d-982e-4b70-8d39-7e2785e9e759"></a>
  * [Field Metrics](../../entry/field-metrics) [#](#005e49b8-8097-49c5-ade4-ff09d32ae156)<a name="005e49b8-8097-49c5-ade4-ff09d32ae156"></a>
  * [FP](../../entry/fp), [FCP](../../entry/fcp), [LCP](../../entry/lcp) [#](#43948c8b-fd72-4c76-b0c4-91c388d0f32a)<a name="43948c8b-fd72-4c76-b0c4-91c388d0f32a"></a>
  * [CLS](../../entry/cls) [#](#a2cc83ca-24a2-4544-8ff6-87f21ef881d0)<a name="a2cc83ca-24a2-4544-8ff6-87f21ef881d0"></a>
  * [TTI](../../entry/tti), [FID](../../entry/fid), [TBT](../../entry/tbt) [#](#a8975cfe-3039-4adf-af0f-3200512b2c43)<a name="a8975cfe-3039-4adf-af0f-3200512b2c43"></a>
* Tools [#](#82287115-a09e-40cd-ba66-d5d947c77fd7)<a name="82287115-a09e-40cd-ba66-d5d947c77fd7"></a>
  * [Chrome](../../entry/chrome) uses flame charts for tasks, but also has per-frame [#](#7d97669f-992d-44b7-bfeb-7663c65b6e4c)<a name="7d97669f-992d-44b7-bfeb-7663c65b6e4c"></a>
  * [Safari](../../entry/safari) bar chart on a per-frame basis. [#](#4d1b0965-5182-4864-a302-2ade0dd0d65e)<a name="4d1b0965-5182-4864-a302-2ade0dd0d65e"></a>
  * Has a really good explainer of how to use [Chrome DevTools](../../entry/chrome-devtools) for [Loading Performance](../../entry/loading-performance), [Runtime Performance](../../entry/runtime-performance) and how to test on devices [#](#0ee752b1-57b5-4e8f-b28e-ce6d53f4d9ea)<a name="0ee752b1-57b5-4e8f-b28e-ce6d53f4d9ea"></a>
* Responsible feature delivery [#](#2f444970-7a49-4edf-8128-e17917e00556)<a name="2f444970-7a49-4edf-8128-e17917e00556"></a>
  * You should be able to reply in `import` syntax and function [#](#d11369bd-e8f7-46a0-aa57-c5db698ef27c)<a name="d11369bd-e8f7-46a0-aa57-c5db698ef27c"></a>
  * Enables good [code-splitting](../../entry/code-splitting) and useful for selectively loading [polyfills](../../entry/polyfills) [#](#5c333979-63ca-4351-a818-ebd932a0b8a3)<a name="5c333979-63ca-4351-a818-ebd932a0b8a3"></a>
  * [Resource hints](../../entry/resource-hints) [#](#3af48ee8-c9bf-4d3f-ab3b-93c3c91c7217)<a name="3af48ee8-c9bf-4d3f-ab3b-93c3c91c7217"></a>
    * Add to header or head for critical JS so we get a headstart [#](#4da95c48-2388-403a-950f-69dfff98130c)<a name="4da95c48-2388-403a-950f-69dfff98130c"></a>
  * [Save-Data](../../entry/save-data) header [#](#12bf5c44-c514-4056-b2ea-4b1fb91b9a2a)<a name="12bf5c44-c514-4056-b2ea-4b1fb91b9a2a"></a>
    * Understand your users might have it set and respond appropriately, can either think about it on the server or the client. [#](#87f223d8-963c-4570-9461-0793acf37ee1)<a name="87f223d8-963c-4570-9461-0793acf37ee1"></a>
  * [Service Worker](../../entry/service-worker), navigationPreload can help massively improve performance (theres a chart with interesting data) [#](#3c2fff45-57fe-4c9f-8de3-c91ad8b06535)<a name="3c2fff45-57fe-4c9f-8de3-c91ad8b06535"></a>
* Tools [#](#d4f0facf-e3aa-4936-b005-7413cc1cdb34)<a name="d4f0facf-e3aa-4936-b005-7413cc1cdb34"></a>
  * [Transpilers](../../entry/transpilers) [Bundlers](../../entry/bundlers) - be careful can add significant code that you might not have been aware of, but they can have a postivie impact by helping you split code and compress etc. [#](#c2addfe7-b78d-467c-bcd0-590addf59e51)<a name="c2addfe7-b78d-467c-bcd0-590addf59e51"></a>
  * Understand your users browsers and you can make better decisions. [#](#9fc0831e-3a2d-4b46-a67b-fee0f0a36802)<a name="9fc0831e-3a2d-4b46-a67b-fee0f0a36802"></a>
* Use the browser feature as much as possible, [HTML](../../entry/html) and [CSS](../../entry/css) [#](#13a8d08b-5fcd-44f4-b8d9-a12148225a22)<a name="13a8d08b-5fcd-44f4-b8d9-a12148225a22"></a>
* Oberserver API's to react when the user does something - reaches a certain point, then load more code etc. [#](#a23ca58b-3f12-4501-9a57-7f8c855e8b7b)<a name="a23ca58b-3f12-4501-9a57-7f8c855e8b7b"></a>
* Think about Idle time and do things then, can help stop jank in user interactions. [#](#fb335476-9e27-41d8-864a-d09aad0842a4)<a name="fb335476-9e27-41d8-864a-d09aad0842a4"></a>
* 3rd Party JS [#](#f03c8401-aec8-4bb7-b3fb-6e750a3c81e9)<a name="f03c8401-aec8-4bb7-b3fb-6e750a3c81e9"></a>
  * Can be very bad. Developers should take more control. [#](#ce276da2-0397-447b-9b2d-c40ee4b2a791)<a name="ce276da2-0397-447b-9b2d-c40ee4b2a791"></a>
  * Can lead on to a lot of non-performant related issues, security etc. [#](#c2c8e86b-090b-4c42-8cea-a0b70412a439)<a name="c2c8e86b-090b-4c42-8cea-a0b70412a439"></a>

