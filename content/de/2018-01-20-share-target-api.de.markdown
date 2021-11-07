---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31.000Z
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
Dieser Artikel ist über ein Jahr zu spät. Es war lange in meinen Entwürfen stecken geblieben, aber ich denke, die Idee ist etwas, was wir bis 2018 lösen müssen. Es stellt sich auch heraus, dass im letzten Jahr andere Themen entstanden sind, die es ein bisschen relevanter machen.

Ich war Anfang 2016 in Indonesien und plauderte mit den Entwicklern und es kam im Gespräch heraus, dass das Internet geschraubt ist (das waren die wörtlichen Worte). Der Kern des Problems bestand darin, dass Benutzer und insbesondere Benutzer, die zum ersten Mal online gehen, Inhalte innerhalb von Silos erstellen. In einigen Fällen sind diese Silos [sehen und fühlen wie das Web] aus (/ rise-of-the-meta- Plattformen /), aber der Inhalt ist immer nur auf diesen Plattformen verfügbar, aber er wird durch die Tatsache verewigt, dass jede native Anwendung die Fähigkeit besitzt um aktiv an jeder Interaktion teilzunehmen, die der Benutzer auf seinem Computergerät hat, aber das Web nicht, und das ist ein Mörder. Es ist unmöglich, Inhalte in Web-Erlebnisse zu bringen, aber es ist einfacher, Inhalte herauszubringen.

Konkret gab es eine Reihe von Szenarien, die wir besprochen haben.

1. Du machst ein Bild auf deiner Kamera-App und möchtest das Bild teilen. Sie drücken Freigabe, aber nur native Apps erscheinen in der Liste. Das Web ist für die Benutzer nicht Teil der Wahl, daher kann das Web diesen Wert niemals erfassen. 2. Sie möchten die aktuelle Seite im Browser freigeben. Sie drücken Freigabe, aber nur native Apps erscheinen in der Liste. Das Teilen von Informationen bedeutet, dass wir den Benutzer aus dem Internet in eine native Erfahrung verlieren. 3. Sie erstellen Inhalte direkt in einer Webseite und möchten sie teilen. Ihre einzige Option besteht darin, ein Widget miteinzubeziehen.

Anfang 2017 sahen wir den Start von [navigator.share](/ navigator.share /), der natives Teilen ins Web brachte (zumindest Chrome-Nutzer). Die Ironie ist, dass die "navigator.share" API den Fluss der Benutzer mit nativen Apps verewigt.

Im Jahr 2018 würde ich es lieben, dass das Internet die Silos, die auf nativen Plattformen verewigt werden, effektiver aufbrechen kann. Das Web muss in der Lage sein, an jeder wichtigen Interaktion des Benutzers mit seinem Gerät teilzunehmen.

Ende 2017 wurde in Chrome auf Android die Funktion "Verbesserte Ergänzung zum Startbildschirm" eingeführt. Dies bedeutet, dass jedes Mal, wenn ein Benutzer Ihre Progressive Web App installiert, ein APK für den Benutzer generiert wird. Ein APK auf Android bedeutet, dass Ihre Webanwendung in jeder Hinsicht als native Anwendung betrachtet wird. In der ersten Iteration von "Verbesserte Ergänzung zum Startbildschirm" bedeutet dies, dass jede Navigation zu einer URL innerhalb des Umfangs Ihrer PWA direkt in der PWA geöffnet wird.

Die Zukunft ist jedoch ein bisschen heller. Chrome arbeitet an der [Freigabeziel-API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md), mit der Sie angeben können, dass Ihre Website am Empfang teilnehmen wird von "Aktien". Das bedeutet, dass jedes Mal, wenn ein Benutzer einen Link freigibt, Ihr PWA aufgelistet werden kann.

Ich bin ziemlich begeistert von dieser Entwicklung, da es bedeutet, dass große Sites wie [Twitter Lite](https://lite.twitter.com) jetzt freigegeben werden können, ohne dass der Benutzer die Native App verwenden muss, sondern Es bedeutet auch, dass kleine Nischenseiten, die nur eine Handvoll Benutzer nutzen können, Teil desselben Ökosystems sein können.

Die API kann noch nicht mit Bildern und Binärdaten umgehen, aber wenn man sich das Android-Ökosystem ansieht, ist die ACTION_SEND-Absicht die am häufigsten verwendete Absicht und dient hauptsächlich nur zum Teilen von Text und Links.

Es ist ein Anfang. Das Netz bricht jeweils ein Silo auf.
