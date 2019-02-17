---
slug: we-need-DOM-APIs-in-workers
date: 2018-01-28T13:20:31+01:00
title: "We need DOM APIs in Workers"
description: "If we are to build HTML in Workers then we need some 'DOM' in them."
tags: ['DOM', 'javascript']
---


Ich brauche DOM APIs in Workers aus verschiedenen Gründen als die meisten Leute. Viele Leute möchten, dass das DOM in Workers dafür sorgt, dass das Aktualisieren des DOM den Hauptthread nicht blockiert. Ich brauche es, damit ich XML-Daten effizient parsen und manipulieren kann, um HTML auszugeben, und ich vermute, dass dies viele andere tun.

In einem [letzten Projekt](https://webgdedeck.com/) wollte ich so viel Logik wie möglich zwischen dem Server, dem Service-Mitarbeiter und dem Client teilen. Das Projekt ist im Wesentlichen ein einfacher RSS-Feed-Reader, es dauert RSS-Feeds, analysiert die Daten und fügt sie in eine schöne Reihe von Spalten (ähnlich wie TweetDeck) und auch eine einzelne zusammengeführte Liste.

Das Projekt arbeitet mit den RSS-Feed-Daten an drei Stellen:

1. Auf Client & mdash; Wenn die Seite zum ersten Mal geladen wird, fordert AJAX die RSS-Feed-Daten von einem Proxy-Dienst an, den ich ausführe, und speichert dann die Rohdaten im `window.caches`-Objekt zur späteren Verwendung, bevor sie im Client gerendert werden. 2. Im Service Arbeiter & mdash; 1. Wenn die Hauptseite geladen und der Service-Mitarbeiter installiert wird, lädt der Service-Mitarbeiter die Shell und führt sie in den RSS-Feed-Daten zusammen, sodass beim zweiten Laden keine AJAX-Anforderungen mehr gestellt werden müssen. 1. Wenn vom Client eine Anfrage an den Proxy gestellt wird, fängt der Service-Mitarbeiter, wenn er installiert ist, die Anfrage ab und liefert die Daten von der `window.caches`. Dadurch kann die Site offline arbeiten. 3. Auf dem Server & mdash; Wenn die Seite angefordert wird, können wir einige der auf dem Server zwischengespeicherten Daten übernehmen und sie direkt in die Antwort einbetten, die wir an den Client senden. Durch das Rendern eines Teils des Inhalts direkt vom Server können wir beim ersten Laden ein stabiles Ansichtsfenster haben, was normalerweise für langsamere Verbindungen auf Mobilgeräten (und SpeedIndex) wichtig ist.

In jedem Fall gibt es einen einfachen Prozess, der die RSS-Daten und Maps in ein JSON-Objekt aufnimmt, das ich dann auf eine Vorlage anwenden kann, um HTML zu generieren. Es war eine kritische Anforderung, eine Vorlage und eine einheitliche Logik für den Client, Server und Service-Mitarbeiter zu verwenden. Das Beibehalten einer Gruppe von Vorlagen bedeutet, dass die Eingabedaten an allen Stellen konsistent sein müssen, an denen Daten gerendert werden.

Da ich einen Proxy-Server betreibe, gibt es eine einfache Lösung: Transformiere einfach alle RSS-Feeds in ein konsistentes JSON-Formular auf dem Server. Ich habe das wegen:

* Datentransformationen können intensiv verarbeitet werden. * Datentransformationen können auf dem Client durchgeführt werden, um die gemeinsame Belastung für den Dienst zu reduzieren * am wichtigsten ist, wenn ein RSS-Feed auf https ist und CORS unterstützt, ist es nicht notwendig, den Proxy-Dienst zu durchlaufen. Dies ist der Status, in dem ich zukünftig sein möchte, da der Feed-Reader Inhalte rendern kann, für die möglicherweise die Authentifizierung des Benutzers erforderlich ist.

Die Verarbeitung der Daten auf dem Client ist möglich (und in meinem Fall erwünscht), weil Browser eine wenig benutzte API namens `DOMParser` haben. DOMParser ist wie der Name schon sagt: Ein Parser von Roh-XML und HTML, der ein DOM baut. Sobald Sie ein DOM haben, können Sie damit alles machen, was Sie mit normalen DOMs tun würden (appendChild, getAttribute usw.).


```javascript
let parser = new DOMParser();
let dom = parser.parseFromString('<a><b>hello</b></a>', 'application/xml');
let bString = dom.querySelector('b').textContent;
```


Ziemlich einfache Sachen und ich benutze dies um die RSS-Daten in eine einfache JSON-Struktur zu konvertieren, so dass ich sie an eine Template-Funktion weitergeben kann ([Es ist hier, wenn du daran interessiert bist, den Code zu sehen](https://github.com/ PaulKinlan / webgde-deck / blob / master / src / öffentliche / scripts / data / common.js # L98).)

Dies funktioniert perfekt im Client, aber es gibt kein DOM in Web-Arbeitern, Service-Mitarbeitern oder irgendeinem nativen DOM auf dem Server.

Zum Glück gibt es eine NBM-Bibliothek, die überall funktioniert. [`xml-dom`](https://www.npmjs.com/package/xmldom) ist eine Level-2-konforme Implementierung des W3C-DOM mit einigen Level-3-Features, und es funktioniert so ziemlich wie erwartet. Es ist nicht das Ende der Welt, aber es scheint albern zu sein, 64kb von JS zu importieren, für etwas, das der Browser bereits eingebaut hat.

Ich sehe immer nur den "VDOM" -Anwendungsfall für DOM-APIs in Arbeitern, und obwohl ich denke, dass es ein wichtiger Anwendungsfall ist, stört es einen weiteren wichtigen Anwendungsfall: Datenmanipulation abseits des Hauptthreads. Die Tatsache, dass wir keine Arbeiter verwenden können, um HTML- und XML-Dokumente zu verarbeiten (etwas, was fast jede App zu tun hat), ohne einen großen Teil des Polyfill importieren zu müssen, der nicht mit der gleichen Geschwindigkeit läuft wie eine native Implementierung und wir auf OSS Contributors zu warten, scheint wie etwas, das behoben werden sollte.

Danke an die Leute, die `xml-dom` pflegen. Helden arbeiten.