---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake und das Team erstellten dieses ziemlich beeindruckende benutzerdefinierte Element zum Verwalten des Pinch-Zooms in einem beliebigen HTML-Satz außerhalb der eigenen Pinch-Zoom-Dynamik des Browsers (z. B. Mobile Viewport Zooming). Das Element war eine der zentralen Komponenten, die wir für die von Chrome Dev Summit entwickelte und veröffentlichte [squoosh](https://squoosh.app/) App benötigten (... ich sage &#39;Chrome Dev Summit&#39;) - Jake zeigte es allen beim China Google Developer Day obwohl der Rest des Teams unter Embargo stand;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Ich habe es gerade zu meinem Blog hinzugefügt (es dauerte nur ein paar Minuten). Sie können es in meinem [life](https://paul.kinlan.me/life/img_20170711_063830/) -Abschnitt [life](https://paul.kinlan.me/life/img_20170711_063830/) , wo ich Fotos weitergebe, die ich gemacht habe. Wenn Sie sich auf einem berührungsfähigen Gerät befinden, können Sie das Element schnell zusammenzoomen, wenn Sie ein Trackpad verwenden, das mehrere Fingereingaben verarbeiten kann, was ebenfalls funktioniert.

Dieses Element ist ein hervorragendes Beispiel dafür, warum ich Webkomponenten als Modell für die Erstellung von Komponenten der Benutzeroberfläche liebe. Das `pinch-zoom` Element ist knapp 3kb auf dem Draht (unkomprimiert) und minimiert die Abhängigkeiten für das Erstellen. Es macht nur eine Aufgabe außergewöhnlich gut, ohne dabei eine benutzerdefinierte Anwendungsebene zu binden, die die Verwendung erschwert (ich habe einige Gedanken zur UI-Logik vs App-Logikkomponenten, die ich basierend auf meinen Lernergebnissen aus der Squoosh-App freigeben werde).

Ich würde mir sehr freuen, wenn solche Elemente mehr Aufmerksamkeit und Bekanntheit erlangen würden. Ich könnte mir zum Beispiel vorstellen, dass dieses Element die Bildzoomfunktion ersetzen oder standardisieren könnte, die Sie auf vielen Commerce-Sites sehen, und den Entwicklern den Schmerz für immer nehmen wird.
