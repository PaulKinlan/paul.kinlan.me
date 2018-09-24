---
slug: slice-the-web
date: 2015-08-03
title: "SLICE: The Web"
description: "What are the properties that make the web the web?  How can we keep differentiating from native to stay relevant in a mobile world?"
tags: ["headless", "slice", 'headless chrome', 'the headless web']
image_header: "/images/slice.jpg"
---


In den letzten Wochen gab es eine Menge Gespräche über alle Fragen des Internets und sie gruppieren sich grob in die folgenden Kategorien:


* Leistung
* [Lumpy](/the-lumpy-web/) inkonsistente Browser
* Schnell expandierende Feature-Landschaft.

Ich möchte diese für ein paar Minuten beiseite legen, um schnell über einen der Begriffe zu sprechen, die wir in Google verwendet haben, um die positiven Aspekte des Webs als Plattform für Benutzer und Entwickler schnell zu beschreiben: ** SLICE **.

Ich kann keine originale Referenz dafür finden, aber die grundlegenden Punkte, auf die ich eingehen werde, sind bekannt. ** SLICE ** wurde beim ersten [Chrome Dev Summit](https://developer.chrome.com/devsummit) von Linus Upson in der Keynote 2013 erwähnt. Als Linus über die Eigenschaften des Webs sprach, war es nicht in der richtigen Reihenfolge für die Benennung, aber ich ermutige Sie, dieses Video anzuschauen. _Note_: Brett Cannon, ein Microsofter (ehemals ein Googler) hat es kürzlich auch erwähnt und es ist ein [gut lesen](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web) und hat weitgehend ähnliche Schlussfolgerungen zu meinem Post über [Leben mit Web-Apps](https://paul.kinlan.me/living-with-web-apps/)

{{<youtube 20fGtfnxJuo>}}

<br> Ich denke, es deckt viele gute Punkte ab:


* __S__ecure - Alle Domains sind voneinander isoliert und die Sites sind vom Benutzer-Rechner entfernt. Der Benutzer kann zu jeder Website gehen und weiß, dass sie sicher sind.
* __L__inkable - Sie können auf eine beliebige Seite oder einen Teil des Inhalts zeigen, indem Sie einfach eine URL teilen
* __I__ndexable - Da Sie eine Verknüpfung zu einem beliebigen Objekt herstellen können, kann es von einer beliebigen Person oder Maschine, die es indizieren kann, öffentlich gemacht werden, um es für jedermann allgemein zugänglich zu machen.
* __C__omposable - Iframes und JavaScript ermöglichen es uns, neue Websites, Apps und Dienste schnell zu erstellen und einzubetten, indem wir einfach JS einfügen und Dinge zusammenfügen.
* __E__phemeral - Es gibt nichts zu installieren, Sie gehen auf die Seite und interagieren mit ihr, verlassen die Seite und wenn Sie dies tun, hört es auf Ressourcen aufzunehmen.
**SCHEIBE**.

Als eine Reihe von Fähigkeiten, die das Web verkörpert SLICE-Prinzipien sind bekannt, aber oft vergessen, wenn die Konkurrenz der nativen Plattformen zu berücksichtigen.

Als einen Begriff finde ich, dass ** SLICE ** eine großartige Möglichkeit ist, die Vorteile des Webs heute schnell zu nutzen. Es fehlen einige wichtige Vorteile des Internets, wie die Möglichkeit, Updates sofort bereitzustellen. ** SLUICE ** ist kein großes Akronym & mdash; aber das ist ok, ** SLICE ** als Akronym funktioniert gut.

Ich verwende das ** SLICE ** -Modell als Grundlage für die Zukunft des Webs * und die Herausforderungen, vor denen wir stehen und die wir überwinden müssen, um dorthin zu gelangen.


* __S__ecure - Das Web sollte im Sandkasten bleiben und es sollte Ende-zu-Ende-verschlüsselt sein. Wir müssen auch herausfinden, was das Modell ist, um sicherzustellen, dass der Benutzer die Kontrolle über die Berechtigungen für erweiterte APIs hat. Zum Beispiel haben wir vor Kurzem begonnen, eine [Bluetooth API] zu liefern (0) dass es sicher und sicher zu bedienen ist.
* __L__inkable - Ich habe das mit Web Intents begonnen und obwohl es früh beendet wurde, glaube ich, dass wir für eine weitere Generation von Inhalten, Websites, Apps und nativen Erfahrungen verantwortlich sind. Einige davon erfordern neue Technologien, einige erfordern Bildung.
   * Link zu Web Apps: Ich werde dieses Mal zu einem anderen Zeitpunkt tauchen. TL, DR - Produkt-Zielseiten und Anmeldeseiten helfen uns nicht bei der Verknüpfung mit Web-Apps.
   * Deep linking in media: Browser für eine lange Zeit konnten zu jedem Teil einer Datei verknüpfen, aber niemand scheint es zu tun.
   * Tieferes Verlinken zum Text: Das erste Mal, dass ich das sah, war Dave Winers Blog, wo du zu jedem Absatz verlinken kannst, in jüngerer Zeit gibt Medium jedem Absatz einen tiefen Link.
   * Real-World-Objekte verknüpfen: [Das physische Web](https://google.github.io/physical-web/) für die Entdeckung von "Dingen" um uns herum und neue APIs für das Gespräch mit diesen "Dingen" werden die Reibung in unserem Alltag reduzieren.
* __I__ndexable - Das kopflose Web, d. H. Parser und Indexer, werden immer weiter entwickelt, um mehr über den Inhalt im Web zu erfahren. Sie führen JS aus und verstehen visuell, wie die Seite gerendert wird, aber es gibt noch viele Probleme:
   * Embedded Schema.org kann semantisch nicht korrekt beschreiben (daher JSON + LD)
   * Media verfügt nicht über eine große Menge an Metadaten in einem öffentlichen Format.
   * Apps: Web Intent versuchte, eine Art zu beschreiben, die beschreibt, was eine Web-App tun könnte. Wir haben das nicht mehr und wir vermissen massiv die Möglichkeiten einer Web-App. Nehme meine [airhorn app](https://airhorner.com/) als Beispiel, obwohl ich erwarte, dass niemand Horn-Funktionalität in ihrer App benötigt, es gibt keine Möglichkeit, sie zu finden, außer nach Metadaten zu suchen, und das ist einer der Gründe, warum Wir haben Produktzielseiten im Internet.
   * Internet Connected-Geräte werden nicht indexiert und beschreiben nicht, was sie tun können. Es ist ein fehlendes Stück für mich in der Physical Web Story, die Fähigkeiten entdeckt. Ich habe das Gefühl, dass wir ein Web Intents für IoT brauchen.
* __C__omposable - Es wäre leicht zu erwähnen, nur Web Components zu erwähnen, aber wir sprechen über das breitere Ökosystem wiederverwendbarer Tools, Bibliotheken und Frameworks:
    * Es gibt derzeit massive Interop-Probleme, da Frameworks versuchen, den gesamten Stack zu besitzen.
    * Wir müssen die delegierte Funktionalität auf der Clientseite lösen. Web Intents hat das versucht, aber vieles ist noch heute im Web möglich, aber wir tun es nicht. Ich habe eine QR-Code-Snapper-Web-App erstellt, warum müssen Sie eine selbst erstellen, um sie in Ihre eigene App zu integrieren, verwenden Sie einfach meine oder einen anderen bereits bestehenden Dienst.
* __E__phemeral - Zwei Worte: Service Worker.
  * Installierbarkeit ist die Antithese der Emphemeralität. Wenn man etwas installiert, wird es zu einem lang laufenden und integrierten Teil des Geräts. Service Worker kann das Beste aus beiden Welten nutzen: einen Mittelweg, auf dem Sie wählen können, wie und wann die Site tiefer in das Gerät integriert werden soll. Kombinieren Sie dies mit dem Manifest, und der Benutzer hat nun die Wahl, die "Web-App" zu installieren oder sie so zu speichern, wie sie benötigt wird.


Was vermissen wir? Ich werde das für dich verlassen, um es mir zu sagen. Ich vermute, dass ich viel vermisse. Ich habe eine Reihe von Follow-up-Posts, in denen ich darüber sprechen werde, wie native Plattformen ein Stück aus dem ** SLICE ** -Modell herausnehmen, um native Apps weiter in den Alltag der Nutzer und in das Web zu integrieren kann noch weiter differenzieren.

Bildquelle: [Justus Hayes](https://commons.wikimedia.org/wiki/File:The_Big_Slice_-_Rome,_Italy.jpg)