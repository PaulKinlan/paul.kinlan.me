---
slug: goodbye-jekyll-hello-hugo
date: 2015-07-31
title: "Goodbye Jekyll, Hello Hugo"
description: "Ruby frustrations and performance have frustrated me for a long time. Experimented with Hugo and ported blog in about 3 hours"
image_header: /images/hellogoodbye.png
---


Ich mag Jekyll. Es hat mir geholfen, mich wieder mit dem Bloggen zu beschäftigen und ich [wählte es als Technologie](https://github.com/Google/WebFundamentals/), um [Google Web Fundamentals](https://developers.google.com/web/fundamentals/) damit zu erstellen.

Etwas ist jedoch ernsthaft falsch: ** Leistung **.

Die Aufbauzeit für meinen persönlichen Blog (ca. 400 Seiten) beträgt ungefähr 45 Sekunden. Web Fundamentals ist sogar noch schlimmer und benötigt oft viele Minuten, um nur ein Sprachpaket zu erstellen, und wir unterstützen 13 Sprachen. Dieses Leistungsproblem betrifft unser Team und unser Redaktionsteam, da einzelne Änderungen in einer lokalen Staging-Umgebung mehr als 40 Sekunden benötigen, um im Browser sichtbar zu sein.


* Vielleicht * können wir es verbessern, aber ich kann es nicht verstehen, wie es geht. Ich kann es nicht instrumentieren und wir stoßen ständig auf Probleme mit Ruby (wir sind keine Ruby-Entwickler) speziell bei der Versionsverwaltung von Gems und Runtime-Updates.

Wir haben eine Menge technischer Schulden mit der Website und es dauert eine Menge Zeit für mich und das Team, nur um die Dinge für eine statische Website laufen zu lassen. Ich habe eine Ahnung, dass es die Templating Engine und Ruby ist. Aber das ist nur ich rate.

Ich habe mich nach schnellen statischen Seitengeneratoren umgeschaut und ein paar Leute aus dem größeren Team haben angedeutet, dass [Hugo](http://gohugo.io/) (geschrieben in Go) gut, gut strukturiert und auch schnell ist.

Ich werde nicht viel zu Hugo gehen. Es ist ein statischer Site-Generator, der Markdown-Dateien (wie Jekyll) aufnehmen und eine strukturierte Site basierend auf den von Ihnen definierten Vorlagen ausspucken kann.

Ich werde einige schnelle Punkte besprechen:


* Mein Jekyll-Build dauerte 45 Sekunden +, der gesamte Build von Hugo ist 300-450ms. 2 Größenordnungen schneller.
* Das Templating über die Go-Templating-Sprache war etwas gewöhnungsbedürftig, aber es ist * viel sauberer * als Liquid.
* Paginierung war ziemlich einfach zu integrieren, obwohl ich einige Probleme mit den Dokumenten hatte.
* Die Dokumente sind ziemlich stark, es gibt einige Beispiele, bei denen Beispiele auf einer Seite, mit denen Sie rechnen würden, nicht immer zu Verwirrung führen.
* Der Jekyll-Migrationsführer für einen einfachen Jekyll-Build hat mich am meisten erreicht.
* Hugo hat die Dateibenennungssyntax Jekylls (JJJJ-MM-DD-title) nicht unterstützt, um Posts zu bestellen, und ich musste ein Migrationsskript schreiben, um jeder Markdown-Seite ein `date`-Attribut und auch einen` slug` hinzuzufügen Attribut.
* Ich hatte eine Menge HTML-Dateien, die anscheinend nicht in das Array .Site.Pages aufgenommen wurden. Wieder musste ich sie alle mit einem einfachen Befehlszeilenskript konvertieren.

Dennoch, Leistung ist lodernd und mein Blog ist viel schneller und hat keine Ruby-Abhängigkeiten.

Ich kann nicht sagen, dass wir Web Fundamentals zu Hugo bewegen werden, es ist ein großer Job. Ich bin sehr zufrieden mit dem Aufbau und der Einrichtung vor Ort, die ich jetzt habe.

Titel Bildnachweis: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg