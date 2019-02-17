---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain über CSS Tricks schreibt über ein Gebiet, das mir am Herzen liegt:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Ganzen Beitrag lesen](https://css-tricks.com/hyperlinking-beyond-the-web/).

Dies war ein großartiger Artikel, der alle Arten von Hyperlinks behandelt, die für Apps und Websites verfügbar sind. Seit Web Intents habe ich viel über diesen Raum geforscht und der Zustand fortgeschrittener Verlinkungen im Web lässt viel zu wünschen übrig, imo.

Einer der Gründe, warum ich das Web liebe, ist, dass hinter einem Link der direkte Zugriff auf die Ressource steht, ich kenne keine andere Plattform, die den Link und die tatsächliche Ressource auf die gleiche Weise kombinieren kann, aber es könnte soooo viel sein Mehr. Der Standard-Link bietet im Wesentlichen eine VIEW-Absicht, die den Status (die URL) und den Kontext (Text zwischen den Ankern) enthält, und Sie können damit benutzerdefinierte Protokolle hacken, aber wir müssen noch viel weiter gehen.

* Wir müssen das Vokabular zu `registerProtocolHandler` erweitern, um mehr Zugriff auf mehr native Schemata zu erhalten * Alles, was mit dem Protokoll-Handler registriert wird, muss systemweit sein. * Wir müssen in der Lage sein, Websites zu haben, die in der Lage sein müssen, eine Reihe von Inhaltstypen zu öffnen und Seiten zur Verfügung zu haben, die als Systemdatei-Handler registriert werden können. * Wir müssen den Entwicklern Aktionen höherer Ordnung zur Verfügung stellen, VIEW ist großartig, wir brauchen eine abgestimmte Menge von Kernaktionen wie PICK, SAVE, EDIT, damit wir die Fähigkeiten einer Site oder App besser verstehen und erweitern können sie mit höherer Semantik. Android hat das, Siri bekommt es, beide verwenden 'Intents', das Web sollte es auch haben.

Dies ist einer der Gründe, warum ich so begeistert von Messaging-Abstraktionen wie [Comlink](https://github.com/GoogleChromeLabs/comlink) bin, die die Last des PostMessage-Wahnsinns beseitigen und Sie darüber nachdenken lassen, andere zu exponieren Apps, und sobald Sie die Funktion verfügbar machen, müssen Sie die Erkennung dieser Funktion leichter aktivieren ... und das ist, was Verbindungen ermöglichen.
