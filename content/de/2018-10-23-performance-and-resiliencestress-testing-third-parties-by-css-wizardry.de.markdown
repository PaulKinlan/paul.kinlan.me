---
slug: performance-and-resiliencestress-testing-third-parties-by-css-wizardry
date: 2018-10-23T09:53:10.359Z
title: 'Performance and Resilience: Stress-Testing Third Parties by CSS Wizardry'
link: https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/
tags: [links, performance, qrcode]
---
Ich war vor ein paar Wochen für den Google Developer Day in China und habe allen meinen [QRCode-Scanner](https://qrsnapper.com) gezeigt, es funktionierte großartig, bis ich offline ging. Wenn der Benutzer offline war (oder teilweise verbunden war), konnte die Kamera nicht starten, was dazu führte, dass QR-Codes nicht ausgelöst werden konnten. Ich brauchte ein ganzes Alter, um herauszufinden, was passierte, und es stellte sich heraus, dass ich irrtümlich die Kamera bei meinem Onload-Ereignis gestartet hatte und die Google Analytics-Anfrage hängen blieb und nicht rechtzeitig gelöst werden konnte. Es war [dieses Festschreiben, das es reparierte](https://github.com/PaulKinlan/qrcode/commit/e3b58c6821fd97defcd959f7d7f3de10ea4f4b12#diff-4a23ac1286faa3273c8cdc9b4bb5078dR578).

> Because these types of assets block rendering, the browser will not paint anything to the screen until they have been downloaded (and executed/parsed). If the service that provides the file is offline, then that&#x2019;s a lot of time that the browser has to spend trying to access the file, and during that period the user is left potentially looking at a blank screen. After a certain period has elapsed, the browser will eventually timeout and display the page without the asset(s) in question. How long is that certain period of time?
> 
> It&#x2019;s 1 minute and 20 seconds.
> 
> If you have any render-blocking, critical, third party assets hosted on an external domain, you run the risk of showing users a blank page for 1.3 minutes.
> 
> Below, you&#x2019;ll see the DOMContentLoaded and Load events on a site that has a render-blocking script hosted elsewhere. The browser was completely held up for 78 seconds, showing nothing at all until it ended up timing out.


[Ganzen Beitrag lesen](https://csswizardry.com/2017/07/performance-and-resilience-stress-testing-third-parties/).

Ich ermutige Sie, den Beitrag zu lesen, weil es viele großartige Einblicke gibt.
