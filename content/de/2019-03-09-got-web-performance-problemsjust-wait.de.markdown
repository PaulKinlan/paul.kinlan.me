---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
Ich habe einen Tweet von einem guten Kumpel und Kollegen [Mariko](https://twitter.com/kosamari) , in dem es darum ging, mit einer Reihe von Low-End-Geräten zu testen, was Sie wirklich auf dem [Mariko](https://twitter.com/kosamari) hält.

Der Kontext des Tweets ist, dass wir untersuchen, wie Web Development aussieht, wenn Benutzer für Benutzer erstellen, die täglich mit diesen Geräteklassen leben.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

Das Team arbeitet derzeit sehr viel in diesem Bereich, aber ich habe einen Tag damit verbracht, eine Website zu bauen, und es war unglaublich schwer, alles auf einem nur halbwegs vernünftigen Niveau funktionieren zu lassen.

* Viewport-Kuriositäten und mysteriöse Wiedereinführung von 300ms Klickverzögerung (kann umgangen werden).
* Große Neulackierung des gesamten Bildschirms, und es ist langsam.
* Das Netzwerk ist langsam
* Der Speicher ist eingeschränkt, und nachfolgende GCs sperren den Haupt-Thread für mehrere Sekunden
* Unglaublich langsame JS-Ausführung
* Die DOM-Manipulation ist langsam

Bei vielen Seiten, die ich erstellte, dauerte das Laden mehrerer Seiten, selbst bei einer schnellen WLAN-Verbindung, und die nachfolgenden Interaktionen waren einfach nur langsam. Es war schwer, den Versuch zu unternehmen, so viel wie möglich vom Hauptthread abzubringen, aber es war auch auf technischer Ebene unglaublich erfreulich, Änderungen in den Algorithmen und der Logik zu sehen, die ich bei meiner herkömmlichen Web-Entwicklung nicht gemacht hätte große leistungsverbesserungen.

Ich bin mir nicht sicher, was langfristig zu tun ist, ich vermute, dass eine große Bandbreite von Entwicklern, mit denen wir in den weiter entwickelten Märkten zusammenarbeiten, eine Reaktion haben wird: &quot;Ich baue keine Websites für Nutzer in [Land x einfügen]&quot; Auf hoher Ebene ist es schwer, mit dieser Aussage zu streiten, aber ich kann nicht die Tatsache ignorieren, dass jedes Jahr zehn Millionen neuer Benutzer zum Computing kommen und sie diese Geräte verwenden werden, und wir möchten, dass das Web die * Plattform * ist Die [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) Wahl für Inhalte und Apps, damit wir mit dem [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) nicht [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Wir werden noch lange Zeit die Leistung steigern müssen. Wir werden weiterhin Tools und Anleitungen erstellen, mit denen Entwickler schneller laden und reibungslose Benutzeroberflächen haben können :)
