---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
Ich habe viel mit dem [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) in Chrome [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) und ich mag das Potenzial, das es bietet, sehr. Zum Beispiel ein sehr einfaches [QRCode detector](https://qrsnapper.com) ich vor langer Zeit geschrieben habe, verfügt über eine JS-Polyfill, verwendet jedoch die `new BarcodeDetector()` API, falls verfügbar.

Einige der anderen Demos, die ich hier aufgebaut habe, können Sie mit den anderen Funktionen der [Face Detection](https://paul.kinlan.me/face-detection/) API sehen: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) und [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

Ich war angenehm überrascht, als ich am Wochenende über [Jeeliz](https://jeeliz.com) stolperte, und ich war unglaublich beeindruckt von der Leistung ihres Toolkits - vorausgesetzt, ich habe einen Pixel3 XL verwendet, aber die Erkennung von Gesichtern schien wesentlich schneller zu sein, als dies mit der `FaceDetector` API möglich `FaceDetector` .

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Ich habe viel darüber nachgedacht. Dieses Toolkit für die Objekterkennung (und ähnliche) verwendet APIs, die im Web allgemein verfügbar sind, insbesondere Camera access, WebGL und WASM. Diese Funktionen unterscheiden sich von der Shape-Erkennungs-API von Chrome (die nur in Chrome und nicht auf allen Plattformen, auf denen sich Chrome befindet, konsistent sind ) kann verwendet werden, um auf einfache Weise umfassende Erfahrungen zu erstellen und Milliarden von Benutzern mit einer konsistenten Erfahrung auf allen Plattformen zu erreichen.

Augmentation ist der Punkt, an dem es interessant wird (und wirklich das, was ich in diesem Beitrag vorzeigen wollte) und wo Sie Middleware-Bibliotheken benötigen, die jetzt auf die Plattform kommen. Wir können die lustigen, sneakers-ähnlichen Gesichtsfilter-Apps erstellen, ohne dass Benutzer MASSIVE-Apps installieren das Sammeln einer riesigen Datenmenge vom Benutzergerät (da dem System kein Zugriff zugrunde liegt).

Außerhalb der lustigen Demos können sehr fortgeschrittene Anwendungsfälle für den Benutzer schnell und einfach gelöst werden, z.

* Textauswahl direkt von der Kamera oder Foto vom Benutzer
* Live-Übersetzung von Sprachen aus der Kamera
* Inline QRCode Erkennung, damit die Leute nicht ständig WeChat öffnen müssen :)
* Extrahieren Sie Website-URLs oder Adressen automatisch aus einem Bild
* Erkennung von Kreditkarten und Entnahme von Nummern (Benutzer können sich schneller auf Ihrer Website anmelden)
* Visuelle Produktsuche in der Web-App Ihres Shops.
* Barcode-Suche nach weiteren Produktdetails in der Web-App Ihres Stores.
* Schnelles Zuschneiden von Profilfotos auf die Gesichter von Personen.
* Einfache A11Y-Funktionen, damit der Benutzer den in Bildern gefundenen Text hören kann.

Ich habe gerade fünf Minuten damit verbracht, über diese Anwendungsfälle nachzudenken - ich weiß, dass es noch viel mehr gibt -, aber es hat mich aufgefallen, dass wir nicht viele Websites oder Web-Apps sehen, die die Kamera verwenden Benutzer müssen eine App herunterladen, und ich denke nicht, dass wir das noch tun müssen.

** Update ** Thomas Steiner in unserem Team erwähnte in unserem Team-Chat, dass es klingt, als würde mir die aktuelle `ShapeDetection` API nicht gefallen. Ich liebe die Tatsache, dass diese API uns Zugriff auf die [The Lumpy Web](/the-lumpy-web/) Versandimplementierungen der jeweiligen Systeme [The Lumpy Web](/the-lumpy-web/) Wie ich jedoch in [The Lumpy Web](/the-lumpy-web/) schrieb, [The Lumpy Web](/the-lumpy-web/) Webentwickler nach Konsistenz in der Plattform und es gibt eine Reihe von Problemen mit der Shape-Erkennungs-API zusammengefasst werden als:

1. Die API ist nur in Chrome verfügbar
2. Die API in Chrome unterscheidet sich auf allen Plattformen erheblich, da die zugrunde liegenden Implementierungen unterschiedlich sind. Android hat nur Punkte für Orientierungspunkte wie Mund und Augen, wo macOS Konturen hat. Bei Android gibt `TextDetector` den erkannten Text zurück, wohingegen er wie bei macOS einen &#39;Text Presence&#39;-Indikator zurückgibt. Dabei werden nicht alle Fehler erwähnt, die Surma gefunden hat.

Das Web als Vertriebsplattform ist für Erfahrungen wie diese so sinnvoll, dass ich denke, es wäre ein Verdammnis, es nicht zu tun, aber die obigen zwei Gruppierungen von Fragen lassen mich die langfristige Notwendigkeit der Implementierung jedes Features in Frage stellen Die Webplattform nativ, wenn wir gute Lösungen in einem Paket implementieren könnten, das mit den heutigen Funktionen der Plattform wie WebGL, WASM und der zukünftigen Web-GPU ausgeliefert wird.

Jedenfalls liebe ich die Tatsache, dass wir dies im Internet tun können, und ich freue mich darauf, Websites mit ihnen zu sehen.