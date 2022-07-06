
---
title: Responsible JavaScript 
date: 2022-05-06T20:41:18.107Z
type: entry
slug: responsible-javascript
---
* By [Jeremy Wagner](../../entry/jeremy-wagner) [#](#62bee4d8-f8c1-44f1-983d-d8d3ddb0404a)<a name="62bee4d8-f8c1-44f1-983d-d8d3ddb0404a"></a>
* Main takeaway is that it's still an incredibly complex space, and one that a developer has to take control of otherwise poor performance will take control of you. There's a lot of strategies, but I'm still left wondering why focusing on performance is not the default for developers or the platform. [#](#62bee4d8-3ab8-4402-8e6d-7791862be1d1)<a name="62bee4d8-3ab8-4402-8e6d-7791862be1d1"></a>
* Wasps! [#](#62bee4d8-28e4-4408-88f2-f31e5f0fa2ec)<a name="62bee4d8-28e4-4408-88f2-f31e5f0fa2ec"></a>
* It was great to see talking about a number of issues that affect performance [#](#62bee4d8-b26e-4778-aded-f4ddaf8b19fc)<a name="62bee4d8-b26e-4778-aded-f4ddaf8b19fc"></a>
  * Thermal Throttling [#](#62bee4d8-0e75-42bc-b1cf-51708969bee7)<a name="62bee4d8-0e75-42bc-b1cf-51708969bee7"></a>
  * Device Capabilities - Nokia 2 Go ([Android](../../entry/android)) [#](#62bee4d8-0120-4aaa-82b4-c7cf5ca6bc06)<a name="62bee4d8-0120-4aaa-82b4-c7cf5ca6bc06"></a>
* Developers are ultimately responsible [#](#62bee4d8-9b1f-40a0-94df-64251395144b)<a name="62bee4d8-9b1f-40a0-94df-64251395144b"></a>
* The platform is far more capable now - you don't need so many libraries [#](#62bee4d8-1af8-4994-8085-156f0d6370bc)<a name="62bee4d8-1af8-4994-8085-156f0d6370bc"></a>
* Document your architectural choices and hold your projects to them [#](#62bee4d8-f252-4509-85db-a595f4532908)<a name="62bee4d8-f252-4509-85db-a595f4532908"></a>
* Server-first is User-first [#](#62bee4d8-450f-41aa-b0b3-356aa78e7c35)<a name="62bee4d8-450f-41aa-b0b3-356aa78e7c35"></a>
* SPA [#](#62bee4d8-1147-4e75-9dd5-849dde4755b2)<a name="62bee4d8-1147-4e75-9dd5-849dde4755b2"></a>
  * Perceptual improvements to performance [#](#62bee4d8-65f2-4eeb-9998-1d60b470791c)<a name="62bee4d8-65f2-4eeb-9998-1d60b470791c"></a>
  * However they have to use lot's of JS to replace infrastrutuce the browser already provides [#](#62bee4d8-7621-43f8-854d-7b092911d25d)<a name="62bee4d8-7621-43f8-854d-7b092911d25d"></a>
    * Effective [Caching](../../entry/caching) in a [Service Worker](../../entry/service-worker) might be able to help with the same perceived performance benefits [#](#62bee4d8-bb76-4105-bac4-5c0d26e2cabe)<a name="62bee4d8-bb76-4105-bac4-5c0d26e2cabe"></a>
  * Use effective [Caching](../../entry/caching) [#](#62bee4d8-cc64-4319-97ca-7b3d230b68d9)<a name="62bee4d8-cc64-4319-97ca-7b3d230b68d9"></a>
    * Mentions `immutable`, but I think this is only supported in [Firefox](../../entry/firefox) [#](#62bee4d8-90a5-41b2-a05b-17065dae6e49)<a name="62bee4d8-90a5-41b2-a05b-17065dae6e49"></a>
  * [Progressive Enhancement](../../entry/progressive-enhancement) [#](#62bee4d8-b651-4678-adcb-3ed5247c0efd)<a name="62bee4d8-b651-4678-adcb-3ed5247c0efd"></a>
    * `is` - mentions not in [Safari](../../entry/safari) [#](#62bee4d8-79a9-4ae8-bfb6-4f6134396211)<a name="62bee4d8-79a9-4ae8-bfb6-4f6134396211"></a>
    * Some interesting code to enhance a form element. Quite liked the submit button demo [#](#62bee4d8-6741-4adb-9d6e-2431912db147)<a name="62bee4d8-6741-4adb-9d6e-2431912db147"></a>
* Metrics [#](#62bee4d8-7d42-44d6-99bf-3f5c408cda5c)<a name="62bee4d8-7d42-44d6-99bf-3f5c408cda5c"></a>
  * [Lab Metrics](../../entry/lab-metrics) [#](#62bee4d8-7c7a-4ca6-811b-a7294f92fd60)<a name="62bee4d8-7c7a-4ca6-811b-a7294f92fd60"></a>
  * [Field Metrics](../../entry/field-metrics) [#](#62bee4d8-3ac6-4fd0-bc1f-ab64af6c4e8e)<a name="62bee4d8-3ac6-4fd0-bc1f-ab64af6c4e8e"></a>
  * [FP](../../entry/fp), [FCP](../../entry/fcp), [LCP](../../entry/lcp) [#](#62bee4d8-3dcb-4c80-9539-1cc30a54d85a)<a name="62bee4d8-3dcb-4c80-9539-1cc30a54d85a"></a>
  * [CLS](../../entry/cls) [#](#62bee4d8-c5cf-4a65-bd23-836846833173)<a name="62bee4d8-c5cf-4a65-bd23-836846833173"></a>
  * [TTI](../../entry/tti), [FID](../../entry/fid), [TBT](../../entry/tbt) [#](#62bee4d8-dc99-4ed7-92c1-19d6c7d2e4e1)<a name="62bee4d8-dc99-4ed7-92c1-19d6c7d2e4e1"></a>
* Tools [#](#62bee4d8-9228-4e22-8787-af26e7469c58)<a name="62bee4d8-9228-4e22-8787-af26e7469c58"></a>
  * [Chrome](../../entry/chrome) uses flame charts for tasks, but also has per-frame [#](#62bee4d8-daa1-4936-aa0a-3f29e9d477f9)<a name="62bee4d8-daa1-4936-aa0a-3f29e9d477f9"></a>
  * [Safari](../../entry/safari) bar chart on a per-frame basis. [#](#62bee4d8-eae8-4c76-ba34-d6c7e71b3966)<a name="62bee4d8-eae8-4c76-ba34-d6c7e71b3966"></a>
  * Has a really good explainer of how to use [Chrome DevTools](../../entry/chrome-devtools) for [Loading Performance](../../entry/loading-performance), [Runtime Performance](../../entry/runtime-performance) and how to test on devices [#](#62bee4d8-cc7e-4637-9e7f-7fd267d2dc7a)<a name="62bee4d8-cc7e-4637-9e7f-7fd267d2dc7a"></a>
* Responsible feature delivery [#](#62bee4d8-d61e-4042-94c9-fda52f141a09)<a name="62bee4d8-d61e-4042-94c9-fda52f141a09"></a>
  * You should be able to reply in `import` syntax and function [#](#62bee4d8-a486-40bd-af76-291271b2cb3c)<a name="62bee4d8-a486-40bd-af76-291271b2cb3c"></a>
  * Enables good [code-splitting](../../entry/code-splitting) and useful for selectively loading [polyfills](../../entry/polyfills) [#](#62bee4d8-4808-4a1d-8678-0373e0fe5bc2)<a name="62bee4d8-4808-4a1d-8678-0373e0fe5bc2"></a>
  * [Resource hints](../../entry/resource-hints) [#](#62bee4d8-5911-42a4-814a-4473ea6c4212)<a name="62bee4d8-5911-42a4-814a-4473ea6c4212"></a>
    * Add to header or head for critical JS so we get a headstart [#](#62bee4d8-acb4-4c7e-8097-58a3e3645b71)<a name="62bee4d8-acb4-4c7e-8097-58a3e3645b71"></a>
  * [Save-Data](../../entry/save-data) header [#](#62bee4d8-1ca3-4033-b8e5-793e7ed475d9)<a name="62bee4d8-1ca3-4033-b8e5-793e7ed475d9"></a>
    * Understand your users might have it set and respond appropriately, can either think about it on the server or the client. [#](#62bee4d8-81d9-410e-bf86-123f072c5875)<a name="62bee4d8-81d9-410e-bf86-123f072c5875"></a>
  * [Service Worker](../../entry/service-worker), navigationPreload can help massively improve performance (theres a chart with interesting data) [#](#62bee4d8-d04d-4446-8a5b-c0d879d70045)<a name="62bee4d8-d04d-4446-8a5b-c0d879d70045"></a>
* Tools [#](#62bee4d8-69cd-44cc-8b51-3460aaf65090)<a name="62bee4d8-69cd-44cc-8b51-3460aaf65090"></a>
  * [Transpilers](../../entry/transpilers) [Bundlers](../../entry/bundlers) - be careful can add significant code that you might not have been aware of, but they can have a postivie impact by helping you split code and compress etc. [#](#62bee4d8-1a10-4928-a577-c58c13f54703)<a name="62bee4d8-1a10-4928-a577-c58c13f54703"></a>
  * Understand your users browsers and you can make better decisions. [#](#62bee4d8-3ad6-4dc0-827b-a5e8e178c088)<a name="62bee4d8-3ad6-4dc0-827b-a5e8e178c088"></a>
* Use the browser feature as much as possible, [HTML](../../entry/html) and [CSS](../../entry/css) [#](#62bee4d8-bf6d-42d0-b3cb-88c3e7d456bb)<a name="62bee4d8-bf6d-42d0-b3cb-88c3e7d456bb"></a>
* Oberserver API's to react when the user does something - reaches a certain point, then load more code etc. [#](#62bee4d8-6851-4c0c-b51d-f68a5c67cfba)<a name="62bee4d8-6851-4c0c-b51d-f68a5c67cfba"></a>
* Think about Idle time and do things then, can help stop jank in user interactions. [#](#62bee4d8-fc61-4bb4-b80e-6ae97bf657b1)<a name="62bee4d8-fc61-4bb4-b80e-6ae97bf657b1"></a>
* 3rd Party JS [#](#62bee4d8-22f0-488b-809b-dc93bdb2aa61)<a name="62bee4d8-22f0-488b-809b-dc93bdb2aa61"></a>
  * Can be very bad. Developers should take more control. [#](#62bee4d8-7c1a-4beb-aaac-b5d84edce307)<a name="62bee4d8-7c1a-4beb-aaac-b5d84edce307"></a>
  * Can lead on to a lot of non-performant related issues, security etc. [#](#62bee4d8-3cf9-4f66-b4e7-d3d357696753)<a name="62bee4d8-3cf9-4f66-b4e7-d3d357696753"></a>

