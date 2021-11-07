---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31.000Z
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
Ich bin nie über den [Tod von Web Intents] hinweggekommen (0). Ich habe immer das Gefühl, dass es im Internet immer noch ein ernstes Problem gibt, wir bauen [Silos](/what-happened-to-web-intents/), die den Benutzer auf einer Website sperren und wir verbinden unsere Apps nicht miteinander, um reichere Erfahrungen zu sammeln. Wir haben Links, die es uns ermöglichen, zu einer anderen Website zu navigieren, aber wir verbinden unsere Apps nicht mit Funktionen, die wir auf unseren Websites verwenden können. Sei es die Auswahl eines Bildes von einem Cloud-Dienst, um es in Ihrer App zu verwenden, oder die Bearbeitung eines Bildes im vom Benutzer bevorzugten Editor. Wir verlinken unsere Dienste nicht so, wie wir unsere Seiten verlinken.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) war ein gescheiterter Versuch, das zu beheben. Die [Share API](/navigator.share/) löst einen Anwendungsfall für die Verbindung von Sites und Apps, aber im Allgemeinen wurden IPC und Service Discovery noch nie gelöst und ich denke, ich habe eine Lösung ... Ok, ich habe keine Lösung, das habe ich ein Experiment, auf das ich unglaublich gespannt bin.

In den letzten Monaten arbeiteten Surma in meinem Team und Ian Kilpatrick an einem Shim für die [Tasklets API](https://github.com/GoogleChromeLabs/tasklets). Die Tasklets-API wurde entwickelt, um es zu ermöglichen, dass Multi-Thread-APIs mit geringem Gewicht im Web existieren. Eine ES6-Klasse könnte als "tasklet" verfügbar gemacht werden und Sie könnten sie aufrufen, ohne den Hauptthread zu blockieren - großartig für UIs. Die Tasklet-API selbst ist sehr interessant, aber das interessanteste Stück für mich war, dass sie ein Polyfill mit einem Web Worker erstellt haben und eine Möglichkeit entwickelt haben, die Funktionalität der ES6-Klasse, die im Worker definiert wurde, verfügbar zu machen. Sie hatten alle Komplexitäten der postMessage-API in ein ordentliches Paket und ein vernünftiges Modell für JS-Entwickler abstrahiert.

Einer der Gründe, warum wir die Web Intents API erstellt haben, war, dass die Entwicklererfahrung beim Erstellen einer API und eines Dienstes, der mit der postMessage API arbeitete, unglaublich komplex war. Sie müssen mit der postMessage API umgehen und dann eine komplexe Nachricht verwalten Verarbeitungssystem und zugehörige Zustandsmaschine.

<figure><img src="/images/worker-dx.png"><figcaption> Traditionelle Arbeiter </figcaption></figure>

Es ist einfach komplex. Es wird noch schlimmer, wenn zwei Fenster miteinander interagieren sollen. Das Fenster, das Sie öffnen, muss dem "Öffner" signalisieren, dass es bereit ist, bevor Sie mit dem Senden beginnen können. TL; DR - `window.open` öffnet 'about: blank', bevor es zur von Ihnen definierten URL navigiert.

<figure><img src="/images/window-dx.png"><figcaption> Window PostMessage Erfahrungen </figcaption></figure>

Es wird noch komplexer, wenn Sie Nachrichten zwischen mehreren Fenstern oder Arbeitern in anderen Fenstern weitergeben möchten.

<figure><img src="/images/complex-workers.png"><figcaption> Noch komplexer ... </figcaption></figure>

Ich denke, das ist einer der Hauptgründe, warum Leute clientseitige APIs aufdecken. Es ist zu schwer.

Das tablets polyfill hatte eine Lösung, die darin vergraben war und ich fragte Surma frech, ob er die tablets API in eine einfache Proxy API umgestalten könnte, ein paar Stunden später erschien [Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink ist eine kleine API, die die MessageChannel- und postMessage-APIs in eine API abstrahiert, die aussieht, als würden Sie Remote-Klassen und -Funktionen im lokalen Kontext instanziieren. Beispielsweise:


**Webseite**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```



** Web-Arbeiter **


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


Wir stellen eine API für den Service zur Verfügung, wir konsumieren die API im Client über einen Proxy.

Ich denke, es ist unglaublich überzeugend und Comlink an sich hat die Fähigkeit, die Nutzung von Web-Mitarbeitern zu revolutionieren, indem es die Entwicklererfahrung drastisch verbessert, indem es seinem Team eine einfache API zur Verfügung stellt.

Das Gleiche zwischen Fenstern ist genauso einfach.

<figure><img src="/images/comlink.png"><figcaption> Komlink </figcaption></figure>

Aber ich hatte einen anderen Gedanken ... Ich kann einen kleinen Teil von Web Intents neu erfinden: Verbesserung der Service-Erkennung und Erleichterung der Interaktion zwischen Entwicklern und den Services.

### Web Intents?

Eine der Besonderheiten der Comlink-API besteht darin, dass automatisch versucht wird, "übertragbare" Objekte zu verwenden, um Daten zwischen dem Client und dem Dienst zu übertragen, und es stellt sich heraus, dass "MessagePorts" übertragbar sind. Die Idee, die ich hatte, ist, dass wenn ich eine einfache API erstellen könnte, die nur einen MessagePort basierend auf einigen Kriterien (wie Verb) zurückgeben soll, dann als Client, wäre mir egal, woher dieser MessagePort kam.

Hier ist mein Gedanke: Ich werde eine Website haben, die als ein Mittelmann fungiert und eine Liste von Dienstleistungen und wo sie leben wird, und in der Lage sein wird, Kunden zu verbinden, die nach Arten von Dienstleistungen fragen, so ähnlich.


* Eine Service-Site wird in der Lage sein, dem mittleren Mann zu sagen "Ich biete Service X an, der auf Daten Y arbeitet und auf Seite Z lebt"
* Eine Client-Site wird in der Lage sein, dem mittleren Mann zu sagen: "Ich brauche einen Dienst, der X auf diesen Daten ausführt. Y. Was hast du?"

Wenn ich dies auf ein grobes Design zurückgebe, brauche ich einen Service, der zwei Methoden verfügbar macht: "Registrieren" und "Pick".

"Registrieren", wird den Dienst gut beim mittleren Mann registrieren. `Pick` auf der anderen Seite ist ein wenig interessanter und ich habe es in ein paar Schritten aufgeteilt.

<figure><img src="/images/webintents-step-1.png"><figcaption> Websites verbinden </figcaption></figure>

Der Fluss ist nicht übermäßig komplex, wenn Sie hineintauchen. Ich habe einen [grundlegenden Wrapper erstellt, den Sie in jede Service- und Client-Anwendung einfügen](https://web-intents.glitch.me/scripts/service.js). Der Wrapper wickelt die erste Interaktion mit dem Zwischenhändler ab und kümmert sich um die einfache Handhabung, indem er die Komplexität des Öffnens eines Fensters für den Dienstpicker unter "https://web-intents.glitch.me/pick" umschließt.

Sobald der Picker geöffnet ist, findet er alle Dienste, die den Kriterien entsprechen, die der Benutzer benötigt, und präsentiert sie dann dem Benutzer als eine einfache Liste. Der Benutzer öffnet seine bevorzugte Site und hinter den Kulissen stellt diese Site ihre API über den Mittelsmann wieder dem ursprünglichen Client zur Verfügung. Wenn die Verbindung schließlich hergestellt ist und wir mit dem gewählten Dienst sprechen, können wir den Mittelsmann entfernen.

<figure><img src="/images/webintents-step-2.png"><figcaption> Zwischenhändler wird entfernt </figcaption></figure>

Der Prozess ist etwas komplizierter als ich es mir vorstelle. Unter der Haube passieren wir eine Vielzahl von MessagePorts zwischen Fenstern, aber die Konsumenten der API sehen niemals diese Komplexität. Das Gute ist, dass, wenn der Client und der Dienst verbunden sind und sie direkt über eine nette Service-definierte API sprechen und sie nicht wirklich wissen, wer auf beiden Seiten ist. Ordentlich.

Unten ist ein kurzer Einblick in den Code, um zu zeigen, wie einfach es ist.


** Service ** ([Demo](https://web-intents-service-1.glitch.me/))

Der Dienst ist relativ einfach, er hat eine Klasse, die mit dem DOM interagiert und einige Ausgaben protokolliert.

Wir stellen die "Test" -Klasse der `ServiceRegistry` zur Verfügung und bieten eine Möglichkeit, die Fähigkeiten dieses Dienstes zu registrieren.


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```



** Client ** ([demo](https://web-intents-client.glitch.me/))

Der Client ist einfach, wir erstellen eine Instanz der Registrierung und rufen `pick` auf.

`Pick` verbindet sich mit dem Mittelsmann und wartet darauf, dass der Benutzer den Dienst auswählt. Sobald der Benutzer den Dienst auswählt, übergibt der Zwischenhändler (`ServiceRegistry`) die API, die der Remote-Dienst dem Client zur Verfügung gestellt hat. Wir können dann eine Instanz der Remote-API instanziieren und Methoden darauf aufrufen.


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


Ich bin sehr zufrieden damit als ein Experiment. Hier ist ein Video von der Service Discovery und dem Aufruf des obigen Codes.

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption> End-to-End-Demo </figcaption></figure>

Lass mich wissen was du denkst. Zu viel?