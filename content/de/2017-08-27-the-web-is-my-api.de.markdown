---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31.000Z
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com) hat mir viel über die Möglichkeiten des Internets beigebracht. Vor der Zusammenarbeit mit Mike baute ich im Web auf und verstand die Vorteile wie Linkbarkeit und Entdeckung, aber ich hatte nie wirklich ein vollständiges Bild davon, was möglich wäre.

Eine Sache, die Mike sagte, war "[das Web ist meine API](http://softwareas.com/cors-scraping-and-microformats/)", wo er über die Möglichkeit sprach, Ihre Website und Ihre Daten auf einer Seite über Mikroformate und andere strukturierte Daten verfügbar zu machen und direkt darauf zugreifen zu können ein weiterer Browserkontext, der ein einfaches XMLHttpRequest und die CORS API verwendet:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


Es war ungefähr zur selben Zeit, als ich mit der Arbeit an [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) begann, deren Geist ähnlich war. den Benutzern Zugriff auf Daten und Dienste von einem anderen Ursprung zu geben & ndash; aber es war viel komplexer. Ich wollte die Entdeckung von Diensten ermöglichen und dann mit diesen Seiten interagieren. Und Mike wollte das Web dazu bewegen, Zugang zu Daten und Diensten zu ermöglichen. Es blieb bei mir. [Auch wenn ich die ursprüngliche Zuschreibung vergessen habe](https://twitter.com/Paul_Kinlan/status/913000817170534400).

Kürzlich habe ich einen Vortrag für Nordic JS gehalten, bei dem ich hervorgehoben habe, dass wir keine echten truely-vernetzten Dienste im Internet aufbauen, und wenn wir dies tun, folgt ein Modell von meist Server-zu-Server-Interaktionen. Das heißt, eine Website wird mit einem Drittanbieterdienst integriert, indem alle API-Anfragen über ihren Server an den Remotedienst weitergeleitet werden und alle damit verbundenen Komplexitäten verwaltet werden.

{{<figure src = "/ images / server-server.png" title = "Server zu Server - ähnlich wie ein Tunnel zwischen Diensten">}}

Es funktioniert, wir haben das gesamte Web mit diesem erstellt, aber es kann unglaublich komplex sein, wenn Sie Authentifizierung, Autorisierung, Transportprotokolle und verschiedene RPC-Methoden (REST, GraphQL usw.) betrachten. Mike hat etwas viel eleganteres vorgeschlagen, dass wir mit CORS-aktivierten Websites und ein wenig JavaScript direkt mit dem Remote-Service kommunizieren können, indem wir die Site verwenden.

{{<figure src = "/ images / server-rpc.png" title = "Meine schreckliche Zeichnung, die ich Client zu Server beschrieb">}}

Es gab ein paar Probleme, die dazwischen auftraten. Das Hauptproblem ist, dass, obwohl CORS in Browsern weitgehend unterstützt wird, Entwickler es selten verwenden. CORS ist ein Schutz, den wir im Web benötigen, aber es ist schwer einzurichten und zu debuggen, und das "Web als API" wurde nicht wirklich zu viel geschoben.

{{<figure src = "/ images / server-rpc-nope.png" title = "CORS stört den Weg">}}

Wir bewegen uns in eine Welt, in der Seiten im Client mit JS generiert werden und Sitzungen und der Zustand für den Benutzer in dem gesamten auf dem Client verwaltet werden.

Wir benötigen weiterhin die Fähigkeit, von unseren Standorten aus mit einem Remote-Service zu kommunizieren, und ich bin nach wie vor der festen Überzeugung, dass wir unsere Integrationen mit anderen Websites und Apps dezentralisieren müssen. Aber zuerst müssen wir unsere Websites und Apps miteinander verbinden weg, das ist mehr als nur ein Link. Wir benötigen unsere Websites, um ihre Funktionen und Funktionen direkt anderen Benutzern im System zur Verfügung zu stellen.

Jede Website sollte in der Lage sein, eine API, die der Eigentümer der Website kontrolliert, direkt anderen Clients zur Verfügung zu stellen.

{{<figure src = "/ images / client-rpc.png" title = "Kunde zu Kunde">}}

Die gute Nachricht ist, dass wir es schon machen können, wir haben die Primitiven seit mindestens 7 Jahren auf der Plattform (`postMessage` und` MessageChannel`) und seit `window.open` für immer, aber wir benutzen sie nicht Diese Tools interagieren mit Websites aus ähnlichen Gründen, weshalb wir CORS nicht verwenden: Es ist schwierig und es ist fast unmöglich, eine vernünftige API zu definieren, die einfach und konsistent zu verwenden ist und keine großen Bibliotheken von Drittanbietern für jeden Dienst benötigt mit denen du interagieren willst.

Die Plattform ermöglicht Ihnen nur die Kommunikation zwischen Standorten mithilfe der Nachrichtenübergabe, was bedeutet, dass Sie als Service-Eigentümer eine API erstellen müssen, wenn Sie eine Statusmaschine erstellen, die Nachrichten in einem bestimmten Zustand serialisiert, darauf reagiert und dann eine Nachricht sendet Nachricht an den Client zurück und dann müssen Sie eine Bibliothek erstellen, die das für den Entwickler ausführt, der Ihren Dienst verbraucht. Es ist unglaublich komplex und komplex und ich glaube, dass dies einer der Hauptgründe dafür ist, dass wir noch keine weitere Einführung von Web Workers und clientseitigen APIs gesehen haben

{{<figure src = "/ images / window-dx.png" title = "Erfahrung mit Window PostMessage-Entwicklern">}}

Wir haben eine Bibliothek, die hilft: [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink ist eine kleine API, die die APIs `MessageChannel` und` postMessage` in eine API abstrahiert, die aussieht, als ob Sie entfernte Klassen und Funktionen im lokalen Kontext instanziieren. Beispielsweise:


**Webseite**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



** Web-Arbeiter **


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src="/ images / comlink.png" title="Komlink">}}

Wir stellen eine API für den Service zur Verfügung, wir konsumieren die API im Client über einen Proxy.

### Gibt es ein besseres Beispiel?

Ich habe eine [Site erstellt, die einen Pubsubhubbub-Endpunkt abonniert, und wenn sie einen Ping erhält, sendet sie eine JSON-Nachricht](https://rss-to-web-push.glitch.me/) an einen benutzerdefinierten Endpunkt. Ich wollte die Push-Benachrichtigungs-Infrastruktur für diese kleine App nicht verwalten, eine andere Seite, die ich erstellt habe ([webpush.rocks](https://webpush.rocks/)) kann all das tun, ich möchte nur integrieren mit diesem Dienst.

Aber wie bekomme ich die Subskriptions-URL (die Daten, die ich in der Lage sein muss, Benachrichtigungen zu senden), die im Client von webpush.rocks gespeichert sind, zurück in meine Site?

Als ich diese Site anfing, konnte ich nur den Benutzer die Site öffnen lassen und dann die URL zwischen den Seiten kopieren und einfügen. Warum nicht einfach eine API verfügbar machen, die jede Seite benutzen könnte? Das ist, was ich tat.

webpush.rocks definiert eine API mit dem Namen `PushManager`, die eine einzige Methode namens` subscriptionId` enthält. Wenn die Seite geladen wird, wird diese API dem Fenster wie folgt zugänglich gemacht:


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


Die API interagiert mit der API "PushSubscriptionManager" im DOM und gibt eine benutzerdefinierte URL an die aufrufende Site zurück. Die wichtige Sache hier ist, dass, weil es asynchron läuft, ich auf Benutzerüberprüfung warten kann, dass sie die Handlung durchführen möchten (oder nicht).

Zurück auf der aufrufenden Client-Site (die App, die die subscriptionId abrufen möchte). Wenn ein Benutzer auf den Link klickt, erhalten wir einen Verweis auf das gerade geöffnete Fenster und verbinden unseren `Comlink`-Proxy damit. Die Service-API ist nun unserem Client zugänglich und wir können die `PushManager`-API wie einen lokalen Service instanziieren, aber sie interagiert alle mit dem Remote-Instanz-Service im anderen Fenster.


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


Hier ist ein sehr kurzes Video von dem, was passiert. Eine sehr einfache und leichtgewichtige Interaktion, öffnet den Dienst und erhält dann die ID, die er benötigt.

{{<youtube vTYZXx31EHc>}}

Als Dienstanbieter habe ich eine eingeschränkte Funktionalität, die nur auf dem Client verfügbar ist, einer anderen Website zugänglich gemacht, und ich kann sie gleichzeitig sichern und um Zustimmung bitten, bevor ich die Daten mit einem einfachen Schritt an den Benutzer zurücksende um API zu verwenden.

_Das Web ist die API._

Zu Recht lassen wir Seiten nicht das DOM oder den Zustand eines anderen Ursprungs überprüfen oder manipulieren, aber ich setze voraus, dass Sie die wichtigsten Informationen bereitstellen können, wenn Sie die Dienste und Funktionen Ihrer Website kontrollieren können und Dienstleistungen für jeden Kunden, der Ihren Service sicher nutzen möchte (Sie haben die Kontrolle) und ermöglicht Ihnen:


* Konzentriere dich darauf, was du gut kannst.
* Schnelle Datenübertragung zwischen Websites und Apps, da alles im Client vorhanden ist.
* IPC auch wenn offline.
* Code im Ursprungskontext ausführen

### Welche APIs sollten Websites veröffentlichen?

Dies ist etwas, das ich gerne mehr erkunden möchte. Ich habe einige grundlegende Funktionen für einen Push-Benachrichtigungsdienst offengelegt, weil dies die Absicht der Website ist, aber das Wichtigste für mich war, dass ich die Kontrolle darüber hatte, welche Teile des DOM ich anderen Entwicklern zurückgeben wollte.

Ich würde gerne an einen Ort gelangen, an dem jede Seite eine konsistente API für Benutzer verfügbar machen kann und eine Möglichkeit bietet, andere Funktionen und Dienste zu entdecken.

Jeder Websitebesitzer kann nur die Kernfunktionalität für seinen Dienst bereitstellen, sodass wir CRUD-basierte Vorgänge ausführen können. Wir könnten komplexe Interaktionen haben.

Wir könnten zu einem Web gelangen, wo wir Unix-ähnliche Dienste haben, die eine Sache gut machen und ein Benutzer sie alle zusammen auf dem Client verschaltet.

Jeder Standort kann einen VDOM einer Untergruppe der Seite offenlegen, die vom Diensteigner definiert wird, sodass wir eine konsistente Methode zum sicheren Abrufen von Bewegungsdaten basierend auf dem DOM zwischen Standorten haben.

Ich könnte mir vorstellen, dass wir schnellen Zugriff auf alle schema.org-basierten Objekte oder andere strukturierte Daten auf der Seite haben möchten (sie könnten dynamisch generiert werden), wie Mike es in seinem ursprünglichen Beitrag getan hat.

[Comlink](https://github.com/GoogleChromeLabs/comlink) gibt uns die Möglichkeit, Dienste schnell und einfach auf den Plattform-Primitiven zu veröffentlichen und zu konsumieren, die seit Jahren existieren. Wir haben endlich eine Menge Stücke, die es uns ermöglichen, das Web zur API zu machen.

_Das Web ist meine API. Mach es auch zu deinem Schatz._
