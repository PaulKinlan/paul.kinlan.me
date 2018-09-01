---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


In einem [letzten Projekt](https://webgdedeck.com/) wollte ich so viel Logik wie möglich zwischen dem Server, dem Service-Mitarbeiter und dem Client teilen. Das Projekt ist im Wesentlichen ein einfacher RSS-Feed-Reader, es dauert RSS-Feeds, analysiert die Daten und fügt sie in eine schöne Reihe von Spalten (ähnlich wie TweetDeck) und auch eine einzelne zusammengeführte Liste.

Da ich RSS Feeds nehme und auf meiner Seite zeige, muss ich so sicher wie möglich sein, dass es nichts ruchloses tut. Ich kann die Eingabe so gut wie möglich bereinigen, aber ich kenne meine eigenen Fähigkeiten, und ich bin mir sicher, dass Leute einen RSS-Feed so manipulieren könnten, dass ich am Ende Skripte ausführen und Bilder oder andere Drittanbieter importieren würde Kontext meiner Website.

Die Web-Plattform bietet die Möglichkeit, eine Site über Content-Security-Policy (CSP) zu sperren. CSP kann die externen Quellen, von denen wir einen Kontext anfordern können, wie Skripte, Stile, Bilder usw. sperren. Sie können sogar die Fähigkeit einer Seite sperren, Skripte in-line auszuführen - was alle Arten von XSS-Angriffstypen verhindern kann.

Es war ziemlich einfach, es der App hinzuzufügen.


```
`default-src 'self';`
```


Allerdings .... Ich hatte eine Reihe von Problemen.

1. Ich generiere Styles inline auf der Seite und musste Skripte inline ausführen. 2. Ich musste Google Analytics einbeziehen, für das ein Inline-Skript auf der Seite ausgeführt werden muss.

Mit CSP können Sie Skripte und Styles inline ausführen, indem Sie eine Option mit dem Namen `unsafe-eval` von Skripten aktivieren, dies umgeht jedoch alle Schutzfunktionen, die CSP bietet.

Zum Ausführen von Inline-Skripts und zum Schutz von CSP bietet CSP eine Reihe von Tools. Der eine, den ich benutzt habe, heißt "Nonce". Bei der Nonce handelt es sich um eine zufällige ID, die Sie im CSP-HTTP-Header festlegen und die mit einem zugeordneten Inline-Skript übereinstimmt.

** CSP-Zeichenfolge im HTTP-Header **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Inline-Skript mit Nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


Der obige Code funktioniert gut und macht es einfach, Analytics korrekt zu betreiben, wenn wir die Site mit CSP sichern.

Für jede einzelne Web-Anfrage müssen Sie einen eindeutigen 'Nonce'-Wert haben, und ich tue dies über die `{nonce.analytics}`, was ein Wert ist, den ich auf dem Server erzeuge und über eine Vorlage anwende. Wenn Sie einen Nonce-Wert erneut verwenden, verweigert der Browser die Ausführung des Inhalts im Skript.

Ich hatte ein wenig Probleme beim Erzeugen von Nonce-Werten. Ich brauchte etwas, das einen einzigartigen Wert erzeugen würde, der nicht von demselben Benutzer wiederverwendet werden würde. Ich fühlte, dass ein Nonce-Wert des Formats '[source] - [date.now + request-count]' genügen würde.

Die 'Quelle' ermöglicht es mir, einen Namespace zu der Nonce hinzuzufügen, und date.now () + eine ständig ansteigende Anforderungsanzahl gibt mir eine relativ stabile, nicht wiederholbare Menge von Werten.

Ich erzeuge das Nonce mit der folgenden Funktion:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


Sieht gut aus. Ich speichere jedoch alle meine Seiten in einem Service Worker, was bedeutet, dass die Nonce-Werte wiederverwendet und somit nicht ausgeführt werden, wenn ich den Inhalt einfach aus dem Cache übergebe.

Zum Glück bin ich eine Share-Logik zwischen meinem Server und meinem Service-Mitarbeiter, die es mir ermöglicht, alles, was ich brauche, an einer zentralen Stelle meines Codes zu generieren. Ich benutze den "source" -Parameter in meiner `generateIncrementalNonce` -Funktion, um 'Server' oder 'Service-Worker' dem Nonce-Wert voranzustellen, und dies in jedem der Anforderungshandler sowohl im Server als auch im Service-Worker. Die Verwendung dieses Quellparameters bedeutet, dass ich garantieren kann, dass ein Nonce-Wert, der über den Server generiert wird, niemals mit einer Seite kollidiert, die über den Service-Mitarbeiter geladen wird.

Dieses Muster hat mir gut gedient. Dadurch konnte ich die erforderlichen Inline-Skripts für Google Analytics zulassen, während Dritte daran gehindert wurden, nicht vertrauenswürdigen Code in meine Seite einzufügen oder auszuführen.

Unten ist der Code, den ich im Projekt verwendet habe. Es gibt eine Reihe von verschiedenen Stellen auf meinen Seiten, auf denen ich Nonce-Werte benötige. Ich erzeuge sie für jede Anfrage und setze sie gleichzeitig auf meine Template-Funktion und den HTTP-Header.

#### common.js - gemeinsame Logik


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - Fetch-Handler


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - Anforderungshandler


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```