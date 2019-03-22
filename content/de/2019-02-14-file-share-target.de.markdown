---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Ich habe oft gesagt, dass Web-Apps, um effektiv in der Welt der Apps zu bestehen, in alle Orte integriert werden müssen, an denen Benutzer Apps erwarten. Inter-App-Kommunikation ist eines der wichtigsten fehlenden [data out of their silo](/unintended-silos/) Webplattform. [data out of their silo](/unintended-silos/) ist die gemeinsame Nutzung der nativen Ebenen eine der letzten fehlenden Funktionen: Web-Apps müssen in der Lage sein, [data out of their silo](/unintended-silos/) in andere Websites und Apps zu integrieren. Sie müssen auch in der Lage sein, Daten von anderen nativen Apps und Websites zu erhalten.

Die File Share Target-API ist ein entscheidender Faktor für eine API, die sich jetzt in Chrome Canary befindet. Die API erweitert das [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) sodass Apps und Websites einfache Links und Text für Websites [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) , indem sie in die [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) integriert werden.

Dieses sehr statische [share links](/web-share-target-api/) verwendet die Web Share Target API, so dass ich schnell [share links](/web-share-target-api/) finden kann, das ich für jede Android-Anwendung und ab letzter Woche für [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) interessant [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . In diesem Beitrag geht es darum, wie ich das gemacht habe (und Jake Archibald Code gestohlen hat - tbf. Er hat eine Menge der Fehler für eine Integration in [squoosh.app](https://squoosh.app/) .)

Das [File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) ist eine sehr neuartige API, da es vollständig progressiv ist. Wenn Ihre Anwendung Form `POST` Anforderungen verarbeiten kann, können Sie diese API problemlos integrieren. Der grundlegende Ablauf `POST` aus: Wenn der Benutzer Ihre Anwendung aus der nativen `POST` auswählt, sendet Chrome eine Formular- `POST` Anforderung an Ihren Server.

Um Unterstützung für das Teilen von Dateien in Ihre Web-App hinzuzufügen, müssen Sie zwei Dinge tun:

1. Unterstützung für die Freigabe von Dateien über die Manifestdatei erklären
2. `POST` Anforderung von Form `POST` in Ihrem Service Worker.

Das Manifest erklärt dem Hostsystem, wie die Freigabe von der Hostanwendung zur Web-App zugeordnet werden soll. Im Manifest unten heißt es im Wesentlichen &quot;Wenn ein Benutzer eine Datei des Typs&quot; image / * &quot;freigibt, stellen Sie eine Formular-POST-Anforderung an&quot; / share / image / &quot;und benennen Sie die Daten als&quot; Datei &quot;.

* manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

Sobald der Benutzer sich für Ihre Webanwendung freigibt, sendet Chrome die Webanforderung mit den Dateidaten als Nutzlast an Ihre Site.

Es wird empfohlen, dass Sie die POST-Anforderung in Ihrem Service-Worker so behandeln, dass 1) sie schnell ist, 2) das Netzwerk nicht verfügbar ist. Sie können dies wie folgt tun:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Oben gibt es ein paar interessante Dinge, die sich schnell wie folgt zusammenfassen lassen:

* Rendern Sie die Benutzeroberfläche als Ergebnis der `POST` Anforderung, indem Sie eine Umleitung durchführen.
* Lesen Sie die Daten, die über das Formular über `event.request.formData()`
* Senden Sie die Daten an das geöffnete Fenster (dies ist die Benutzeroberfläche, an die wir den Benutzer im ersten Punkt weitergeleitet haben).

Es liegt ganz bei Ihnen, was Sie mit den Daten tun, die an Ihren Servicemitarbeiter `postMessage` meiner App musste ich sie jedoch direkt in der Benutzeroberfläche `postMessage` sodass ich das von dem Benutzer verwendete Fenster und `postMessage` die Daten dort.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

Und das ist es auch schon. Wenn Sie bereits einen API-Endpunkt für Ihre Webformulare haben, ist dies eine einfache, aber leistungsstarke Ergänzung, die Sie auf Ihrer Website vornehmen können.

Die Web Share Target API ist ein unglaublich leistungsfähiges Plattform-Primitiv, das eine weitere Barriere beseitigt, die Web-Apps auf ihren Host-Plattformen hatten.