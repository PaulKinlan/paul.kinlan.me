---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee von This Dot hat einen ordentlichen Livestream organisiert, der viele der Browser-Anbieter dazu brachte, einen Überblick darüber zu geben, woran sie arbeiten:

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder


[Vollständigen Beitrag lesen](https://www.youtube.com/watch?v=67etFbKTOFA).

Ich habe den Livestream sehr genossen und es war toll zu hören, was alle vorhaben. Ich liebe auch die Vision, die Beaker Browser für ein verteiltes Web hat, sie haben seit der letzten Begegnung viel gearbeitet.

Ich empfehle Ihnen, das verlinkte Video anzuschauen, Edge hat eine große Menge an Updates einschließlich voller Service Worker-Unterstützung, variabler Schriftarten und auch WebP eingeführt. Mozilla hat einen großen Fokus auf Web Assembly und Entwickler-Tools, Beaker macht erstaunliche Dinge mit dat: und verteiltes Rechnen und Brave hat sich sehr auf BAT bewegt.

Ich konzentrierte mich auf die Arbeit, die unser Team gerade leistet, und es geht im Wesentlichen um Discovery, Geschwindigkeit und Zuverlässigkeit, UI-Reaktionsfähigkeit, UX - Get thus done, Sicherheit und Datenschutz. Etwas konkreter:

* Discovery - Wir müssen Entwicklern die Erstellung von Sites mit JS erleichtern, die in Headless-Services wie Indexern und Embedders gerendert werden. Das bedeutet, dass wir uns darauf konzentrieren müssen, Entwickler darüber aufzuklären, wie Indexer arbeiten und wie sie gegen sie getestet werden und wie gute SSR-Erfahrungen aufgebaut werden können. * Geschwindigkeit und Zuverlässigkeit - Alle Seiten sollten ein TTI <5s im 3g Netzwerk auf dem Median Gerät haben (MotoG 4/5) und du solltest deine FID (erste Eingangsverzögerung) optimieren. FID ist eine neue Metrik. Daher ist es wichtig zu verstehen, dass es bedeutet, wie Ihre Benutzer Ihre Website in freier Wildbahn erleben, wo TTI schwer zu messen war. FID sollte einfacher sein. Es gibt eine [Polyfill hier, die Sie verwenden können, um FID zu testen](github.com/GoogleChromeLabs/first-input-delay) * UI Responsiveness - Wir möchten das Web überall 60fps sein und es für Entwickler einfacher zu erreichen, so Wir arbeiten daran, & # x2018; FLIP & # x2019; einfacher zu verstehen, Houdini zu entwickeln, so dass wir Entwicklern mehr Kontrolle über das Rendering-Enging geben und schließlich versuchen können, so viel Arbeit wie möglich von "Off-main-thread" über Dinge wie img.decode und Tools wie comlink zur Arbeit zu bringen einfacher zu benutzen. * UX - Erledigen Sie Ihre Aufgaben - Wir möchten die Art und Weise, wie wir über neue Funktionen auf der Plattform sprechen, wirklich ändern. Insbesondere möchten wir zeigen, wo Technologie effektiv genutzt werden sollte, um die Benutzererfahrungen zu verbessern, damit sie ihre Arbeit schnell erledigen können mit so wenig Unterbrechung wie möglich. * Sicherheit und Datenschutz - Ich denke, dass die intelligente Tracking-Vorbeugung von Apple langfristige Auswirkungen auf das Web haben wird und Entwickler mehr über die Entwicklung datenschutzfreundlicher Web-Erlebnisse nachdenken sollten. Wenn überhaupt, macht die DSGVO das Internet zu einer "interessanten" Erfahrung in der EU.

Schließlich war es demütigend und herzerwärmend zu hören, dass jeder [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) zurückbringen möchte :)
