---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


Ich habe vor kurzem eine Progressive Web App erstellt, die einen [Screencast von Ihrem Android-Gerät und dann das Video in einen Geräterahmen einbricht](https://paulkinlan.github.io/deviceframe.es/) unter Verwendung von [FFMPEG.js](https : //github.com/Kagami/ffmpeg.js) so:

{{<youtube E_U6zvjW8so>}} Es ist mir auch gelungen, [fffmpeg.js] zu erstellen (https://paul.kinlan.me/building-ffmpeg.js/), um relativ einfach benutzerdefinierte optimierte Builds von ffmpeg zu erstellen und führe es im Browser aus.

Die beiden Dinge zusammen bieten meiner Meinung nach eine Menge Möglichkeiten, um einige großartige neue Progressive Web Apps zu entwickeln, die das, was das Web unserer Meinung nach im Hinblick auf die Manipulation von Audio und Video zu bieten hat, vorantreiben.

Es gibt viele Web-basierte Video-Utilities im Internet, aber in meinen Augen sind viele wie alte Websites gebaut und nutzen nicht die Vorteile der Client-Side-Verarbeitung, sie sind mit Werbung beladen und können nicht offline arbeiten .

Ich bin auch sehr interessiert an der Unix-Philosophie von ["Do one thing und mach es gut"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well) also anstatt eine massiv monolithische Videoschnitt-App zu bauen, ich denke, es gibt viele verschiedene Web-Apps, die einfach und schnell erstellt werden können:

* Schneiden Sie ein Video (nehmen Sie 5 Sekunden von der Vorderseite, 3 von der Rückseite usw.) * Beliebiges Videoformat -> GIF * Viele Bilder -> Beliebiges Videoformat * Beliebiges Videoformat -> Beliebiges Videoformat * Hinzufügen eines Wasserzeichens * Größe ändern Video * Video schrumpfen * Wasserzeichen zu einem Video hinzufügen * Videos übereinander überlagern * Videos zusammenfügen * FFMPEG-Spielplatz (Quellen und ein Skript einfügen) * [Wenn Sie Ideen haben, fügen Sie sie zu dieser Liste hinzu](https: // github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

Ich denke, dass ich den Großteil des Codes als ein Benutzeroberflächen-Harness dafür mit meinem [Device Frames Repo auf Github](https://github.com/PaulKinlan/deviceframe.es) habe und in vielen Fällen ist es eine Frage der Anpassung das ffmpeg-Verarbeitungsdiagramm und Aktualisieren der Benutzeroberfläche, um eine Konfiguration zu ermöglichen.

Ich werde in den nächsten Wochen ein paar davon schaffen, falls jemand mitmachen möchte, dann melde dich!