---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello hatte kürzlich im Safari-Team eine Mitteilung darüber veröffentlicht, wie Twitter die Spezifikation ./well-known/change-password verwendet.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

Das Feature ist mir völlig übergangen, aber es ist eine nette Idee: Wenn eine Datei an einem bekannten Speicherort vorhanden ist, kann der Browser dem Benutzer eine Benutzeroberfläche bieten, mit der er sein Kennwort schnell zurücksetzen kann, ohne durch die komplexe Benutzeroberfläche der Website navigieren zu müssen.

Die Spezifikation ist täuschend einfach: Die bekannte Datei enthält lediglich die URL, über die der Benutzer zu dem Zeitpunkt gelangt, zu dem er die Aktion ausführen möchte. Dies führt mich zum Nachdenken, können wir weitere dieser Funktionen anbieten:

* Bekannter Ort für DSPVO-basierte Einwilligungsmodelle (Cookie-Einwilligung) - Websitebesitzer können einen Link zu der Seite anbieten, auf der ein Benutzer alle Cookies und andere Dateneinwilligungselemente verwalten und möglicherweise widerrufen kann.
* Bekannter Ort für die Verwaltung von Browser-Berechtigungen - Websitebesitzer können Benutzern einen schnellen Ort bieten, um Berechtigungen für Dinge wie Geo-Standort, Benachrichtigungen und andere Grundelemente zu widerrufen.
* Ein bekannter Pfad zum Löschen und Ändern von Accounts
* Ein bekannter Pfad für die Verwaltung von Mailinglisten-Abonnements

Die Liste geht weiter ... Ich mag die Idee, einfache Umleitungsdateien zu erstellen, um Benutzern zu helfen, häufige Benutzeraktionen zu erkennen, und dem Browser eine Möglichkeit zu bieten, sie aufzurufen.

* Update: * Ich habe ein [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) hinzugefügt.