---
slug: challenges-for-web-developers
date: 2018-01-21T13:20:31.000Z
title: "Challenges for web developers"
description: "Summary of the challenges that I beleive we developers face every day."
---


Ich habe dies ursprünglich geschrieben, um die Herausforderungen eines größeren Entwickler-Ecosystems zu artikulieren, das mein Team (Chrome und Web Developer Relations) angehen muss, damit wir der Branche helfen können, damit wir mehr Menschen im Web helfen und helfen können Entwickler bauen Erfahrungen auf, die mehr Menschen lieben.

Nachdem ich das [DevRel-Manifest für Web und Chrome](/ web-developer-relations-manifesto /) geteilt hatte, wollte ich mit meinen Gedanken über einige der Herausforderungen, die wir den Entwicklern bei der Lösung helfen wollen, auf dem Laufenden bleiben.

Ich habe diesen Artikel nicht wirklich versendet, aber jetzt, da ich etwas Zeit hatte und es das neue Jahr ist, dachte ich, es wäre eine gute Zeit, dies zu teilen.

Das Verständnis für die Herausforderungen, mit denen Entwickler jeden Tag konfrontiert werden, hilft mir herauszufinden, wie wir die Art und Weise ändern können, wie wir arbeiten, um so vielen Entwicklern wie möglich zu helfen.

Ich würde dein Feedback lieben. Liege ich falsch? Sehen Sie irgendwelche größeren Ökosystemprobleme, die ich übersehen habe?

Ich werde aus vielen dieser Themen tiefere Artikel machen.

## Web Development ist einfach zu starten, aber schwer zu erreichen und zu meistern

* Variable API-Unterstützung und Herstellerprioritäten machen konsistente Erfahrungen schwierig oder unmöglich zu erstellen. * Ältere Überlegungen, z. B. alte CMS, bestehende Implementierungen bedeuten, dass es eine große Dynamik gibt, die überwunden werden muss. * Quirks und Kompatibilitäts-Probleme der Plattform verursachen eine große Frustration und unnötig viele zusätzliche Tests. * Es wird eine große Anzahl von Abstraktionen erstellt, die Entwickler von einem Verständnis der Plattform abhalten. * Mangel an Primitiven auf Plattform-Ebene für App-ähnliche Interaktionen: Ansichten, Modelle, Controller, Recycler, Heldenübergänge, View-Übergänge. * Web-Entwickler müssen in allem gut sein: Offline, Zugänglichkeit, Lokalisierung, Leistung, Sicherheit ...

## Entwickler freuen sich über PWA, aber sie können schwer zu bauen und schwer zu machen sein

* Das Fehlen der Haupt-Browser-Unterstützung für PWAs macht es schwer, einen zu erstellen. * End-to-End ist es zu schwer, eine progressive Web-App zu erstellen. HTTPS, Service-Mitarbeiter sind alle schwer zu beginnen. * Der Wert von PWA ist insbesondere in Betriebssystemen (Safari, Desktop usw.) nicht klar definiert, und dies ist ein einfacher Grund, warum man es nicht übernehmen sollte. * Es ist fast unmöglich, eine "vorbildliche PWA" zu bauen, und niemand kümmert sich wirklich darum. * Entwickler müssen häufig neu beginnen und ihre vorhandenen Erfahrungen nicht migrieren. * Entwickler und Unternehmen wissen nicht, warum sie eine progressive Web-App erstellen sollten. * Findability von bestehenden Web-Apps ist ein großes Problem. * "Progressiv" wird nicht bewertet. Schwer zu bieten eine konsistente Erfahrung / Funktionen fehlen in verschiedenen Web-Browsern / Betriebssystemen * Die progressive Web-Anwendungen, die gebaut werden, sind nicht ansprechend und damit Wartungskosten erhöhen, da Sie für eine separate Desktop-Website kümmern müssen

## Es ist zu schwer, eine gut funktionierende Erfahrung zu erstellen (UI / UX)

* Die gute Bar für Entwickler ist viel zu niedrig. Was ist gut? Warum ist es wichtig? Wie kommt man dort hin? * Es ist leicht, ein schlechter Akteur zu sein, wenn Komponenten gebaut werden, A11Y, Layout und Performance sind schwer zu erstellen und nicht von Entwicklern priorisiert * Entwickler sehen nicht den Wert in Web-Komponenten und Plattform-Tools, um schnell zu bauen * Viele Framework-Autoren glauben Sie nicht, dass Web-Komponenten verwendet werden sollten und dies kann oder auch nicht korrekt sein - es ist einfach nicht klar für Entwickler * Entwickler wollen ein UI-Framework wie Bootstrap, um die UI Schmerzen zu nehmen und sie auf das Produkt konzentrieren * Die Primitiven für viele Erfahrungen sind zu schwer zu erstellen und zu bauen: Menüs, Navigation, Übergänge, Übernahmen, Datenbindung, Ansichten, Controller * Es ist schwierig, performante Erfahrungen zu erstellen - Primitive sind ein Problem (die Plattform hat nicht, was Entwickler brauchen, oder sie sind da, aber niemand weiß es oder kümmert sich nicht) * Ungleiche Unterstützung für APIs wie Animationen machen es für Entwickler unmöglich, neue Plattform-Primitive zu übernehmen - Primitive sind normalerweise fundamental und fast unmöglich für Polyf il

## Es ist zu schwer eine schnelle Seite zu erstellen

* Webentwickler bauen langsame Erfahrungen auf, die schreckliches UX haben und nicht zugänglich sind. Sie wollen es besser machen, aber sie wissen nicht, wie * Entwickler und Unternehmen priorisieren die Leistung, da es keine neuen klaren Richtlinien für die Auswirkungen auf ihr Geschäft gibt. * Entwickler verstehen nicht, warum eine Website langsam ist ist zu schwer, um eine schnelle Lade-Website zu bauen - es gibt viele Fußfässer und viele Browser * Entwickler wissen nicht, welche Ziele sie erreichen müssen * Entwickler haben nicht die Anleitung, die sie brauchen, um die ihnen gesetzten Ziele zu erreichen (PRPL-Muster, Routebasiertes Chunking, Streaming sind im Moment Randangelegenheiten und haben keine konkreten Dokumente usw.) * Entwicklerwerkzeuge und Frameworks sind standardmäßig nicht schnell und Entwickler wissen es nicht oder kümmern sich nicht - Bündelung ist ein großes Problem - DX & gt; UX * -Entwickler testen nicht auf der Hardware, auf der ihre Benutzer ausgeführt werden und fühlen sich daher "gut genug" an * Entwickler haben nicht alle Informationen über ihre Benutzerbasis und die Auswirkungen, die ihre Entscheidungen auf sie haben * Entwickler priorisieren die Ladeperformance mehr als sie priorisieren "in der Seite" Leistung * Es ist zu schwer, um Ihre Site UI reibungslos über alle Geräte zu betreiben * Public Perf Scham nimmt zu und macht Entwickler-off von fürsorglichen * Entwickler fühlen sich wie wir sie über den Kopf schlagen die ganze Zeit und damit abschalten

## Es ist zu schwer eine sichere Seite zu erstellen

* Migration zu HTTPs ist ein Blocker für die Übernahme vieler neuer Technologien * Entwickler und Unternehmen sehen nicht die Notwendigkeit, ihre Websites zu sichern (dh, warum brauche ich das für eine Nachrichten-Website?) * Es ist schwer zu definieren up HTTPS * Es kann immer noch teuer für Entwickler sein, eine HTTPS-Site einzurichten - nicht jeder kann LetsEncrypt verwenden. Große und kleine Sites müssen viel mehr für das Privileg bezahlen * Entwickler verstehen nicht den Wert von "sicheren Technologien" wie CSP und sie sehen eine geringe Akzeptanz

## Unternehmen und Entwickler wissen nicht, warum sie "Web" sollten

* Die Umstellung eines Nutzers auf das mobile Web ist schwierig, daher ist es schwierig, Geld zu verdienen. * Geschäftsfälle und -bedürfnisse variieren je nach Region, Branche und Publikum. Daher ist es schwierig, sie sinnvoll einzusetzen. * Offensichtlicher Mangel an Fähigkeiten bedeutet dass es sich anfühlt, als ob man das Web nicht benutzen sollte * Web bewegt sich einfach zu einem App-Modell, also warum nicht einfach die 'App' machen * Mangel an browserübergreifender Unterstützung für wichtige APIs macht es Unternehmen schwer, ihre Investitionen zu rechtfertigen * Das ist es nicht Klären Sie den Wert des Internets, wenn es so viele konkurrierende Plattformen gibt

## Das Web ist klumpig und verursacht den Entwicklern viel Schmerz

* Browser ändern sich häufig entweder durch Ergänzungen oder taktische Umzüge der Web-Plattform und sie wissen nicht, was passiert, wie man auf dem Laufenden bleibt oder wie man sich ändert. Das bringt den Entwicklern Schmerzen * Chrome bricht ständig die Plattform mit ihren "Interventionen" * Browseraktualisierungszyklen schaffen Unsicherheit und "Shifting Sands" * Die Plattform-Player sind nicht alle aufeinander abgestimmt. Safari, UC, Edge und haben unterschiedliche Prioritäten * Entwickler müssen alles überall (von iOS bis UC Browser) funktionieren lassen und sie haben die Tools, Anleitungen oder Daten, um ihre Entscheidungen zu sichern

## Das Web ist ein lebendiges Ökosystem, aber laut

* Es wird jeden Tag eine riesige Menge an Meinungen generiert, und es werden auch Best Practices definiert, die weder genau noch umfassend sind. Entwickler suchen Google und andere, um einen einheitlichen Leitfaden zu präsentieren. Es gibt eine große Anzahl von Tools, Bibliotheken und Frameworks gebaut und Entwickler wissen nicht, was sie wählen sollen * Google hat eine große Anzahl von Frameworks und Entwickler sind nicht sicher, was zu verwenden ist * Wir erstellen eine Menge Inhalte und es wird nicht einheitlich dargestellt * Viele konkurrierende Tools und Entwickler nicht wissen, was sie verwenden sollen * Viele konkurrierende Frameworks und Entwickler wissen nicht, welche sie verwenden sollen * Viele konkurrierende Ratschläge und Entwickler wissen nicht, wem sie folgen oder vertrauen sollten

## Das Web ist global

* Entwickler sprechen nicht nur Englisch. Viele Entwickler kommen aus Ländern, die wir nie ins Visier genommen haben: China, Indien, Indonesien, Thailand, Pakistan usw .; und wir müssen ihnen helfen * Viele westliche Entwickler sehen die Ernte von "Lite" -Erfahrungen als "Emerging Market Only" und dass sie keine High-Fidelity sind

### Updates Edit 1 (23-Jan-2018): Hinzufügen einer Notiz oben auf der Seite.

Edit 2 (28-Jan-2018): Bereinigen Sie einige Bits.
