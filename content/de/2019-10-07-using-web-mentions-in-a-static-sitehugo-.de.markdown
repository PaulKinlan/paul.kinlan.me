---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Mein Blog ist eine komplett statische Seite, die mit Hugo erstellt und mit Zeit gehostet wurde. Dies ist eine großartige Lösung für mich. Ein einfaches Blog hat einen ziemlich einfachen Bereitstellungsprozess und wird blitzschnell geladen.

Statisch generierte Websites haben einige Nachteile. Die größte ist, wenn Sie etwas Dynamisches benötigen, das in Ihre Seite integriert werden soll (z. B. Kommentare). Wenn Sie dynamische Inhalte nicht einfach hosten können, verlassen Sie sich auf JavaScript von Drittanbietern, das dann uneingeschränkten Zugriff auf Ihre Seite erhält und Sie wissen nicht, was es tut - es kann sein, dass Ihre Benutzer verfolgt werden oder Ihre Seite verlangsamt wird Belastung.

Ich habe kürzlich mein aktuelles Kommentar-Widget (Disqus) aus dem kritischen `IntersectionObserver` indem `IntersectionObserver` es nur `IntersectionObserver` habe, wenn der Benutzer zu den Kommentaren `IntersectionObserver` (mit `IntersectionObserver` ), und `IntersectionObserver` dies eine vernünftige Lösung für die Probleme beim Laden und Verfolgen war, wollte ich es eigentlich entfernen Disqus alle zusammen.

Geben Sie die [Webmention](https://webmention.net/draft/) Spezifikation ein. Webmention ist eine Spezifikation, die beschreibt, wie ein Site-Autor kontaktiert werden kann, wenn eine andere Site Inhalte auf Ihrer Site erwähnt (oder mag). Dies ermöglicht letztendlich eine dezentrale Methode zum Auffinden von Inhalten, die auf Ihre Website verweisen, und bietet hoffentlich einen Mehrwert und Einblick.

In der Webmention-Spezifikation werden keine Datenformate beschrieben, die für die Übermittlung der auf der &quot;Erwähnung&quot; genannten Informationen verwendet werden sollten. Sie können diese nur mithilfe von Standard-Mikroformaten oder anderen Mechanismen analysieren, um den Inhalt der Seite zu verstehen. Das ist großartig, aber ich glaube, dass es zu zentralisierten Diensten wie [webmention.io](https://webmention.io/) die die dringend benötigte Infrastruktur bereitstellen, um die Bedeutung der Seite zu [webmention.io](https://webmention.io/) .

Ich mochte die Idee, Webmention zu verwenden, aber es erfordert eine serverseitige Einrichtung, um Benachrichtigungen zu erhalten (und möglicherweise zu speichern), wenn jemand Ihre Site erwähnt. Dies ist mit einem statischen Builder wie meinem auf meiner Site nicht immer möglich. Der Rest dieses Beitrags wird schnell beschreiben, wie ich auf meinem von Zeit gehosteten Hugo Build Likes, Erwähnungen und Reposts erhalten habe.

### Schritt eins - Finden Sie einen Webmention-Hub

Ich habe webmention.io gefunden und es macht den Trick. Es verarbeitet eingehende Pingbacks und Erwähnungen, überprüft außerdem, ob die aufrufende Site tatsächlich mit Ihrem Inhalt verknüpft ist, und analysiert schließlich Daten aus der Seite, damit Sie den Kontext besser verstehen.

Webmention.io überprüft anhand eines offenen Authentifizierungsprozesses, ob Sie Eigentümer der Website sind (es war ordentlich, nach rel = me zu suchen, das auf einen Authentifizierungsanbieter verweist).

### Schritt zwei - ### Sie den Seiten mit, dass Sie mit Erwähnungen umgehen können

Dies ist so einfach wie das Hinzufügen der beiden folgenden `link` Tags

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Schritt drei - Integrieren Sie die webmention.io-API in Ihre Site

Sie haben hier zwei Möglichkeiten: Sie können Ihrer Seite ein Widget hinzufügen, das die webmention.io-API aufruft, oder Sie können die webmention.io-API in Ihren Erstellungsschritt integrieren. Ich möchte, dass so wenig wie möglich von einem Drittanbieter JS gehostet wird, und entschied mich für Letzteres. Ich habe Webmentionen in meinen Bereitstellungsprozess integriert.

Ich benutze Hugo, weil der Build schnell ist, und in diesem Sinne musste ich herausfinden, wie ich die Webmention-API optimal in Hugo integrieren kann. Die harte Einschränkung bestand darin, den API-Endpunkt nicht für jede Seite auf meiner Website aufzurufen. Ich habe viele Seiten und noch nicht viele Kommentare.

Glücklicherweise bietet die Website Webmention.io einen praktischen Endpunkt, über den Sie alle Erwähnungen für Ihre Domain erhalten. Das Pech ist, dass diese Datei einen Eintrag für jede Aktion enthält, die gegen Ihre Site ausgeführt wurde.

Hugo hat auch die Idee von Datendateien, die direkt in die Vorlage für eine bestimmte Seite gezogen werden können, sodass Sie die Webmention-Datendatei einer neuen Struktur zuordnen müssen, die das Lesen in einer Hugo-Vorlage erleichtert.

Der gewählte Prozess ist unten, aber die Zusammenfassung ist, dass ich das Array von einer Liste von Aktionen in ein Wörterbuch von URLs verwandle, die jeweils die von der API bereitgestellten Aktionen enthalten (wie, repost und reply), und der letzte Schritt ist dann zu Teilen Sie das URL-Wörterbuch in einzelne Dateien auf, die als MD5-Hash der URL bezeichnet werden.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Sobald die Daten analysiert und korrekt gespeichert wurden, können Sie die Vorlage schnell so einrichten, dass sie in das Datenattribut der Vorlage eingelesen werden kann.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Wenn alles gut geht, sollten unten auf der Seite einige Symbole angezeigt werden, die reale Personen darstellen, die mit der Site interagieren.

### Schritt 4 - Veröffentlichen Sie die Site, wenn Kommentare auftreten

Mit den oben genannten Schritten kann ich die Erwähnungen zwar zusammenfassen und in der Site-Ausgabe wiedergeben, ich muss jedoch weiterhin sicherstellen, dass die Site regelmäßig neu erstellt wird, damit die Kommentare öffentlich angezeigt werden.

Ich habe mich für einen einfachen Cron-Dienst entschieden, der die Zeit-Bereitstellungs-API aufruft, um etwa jede Stunde eine erneute Depolyierung der Site zu erzwingen.
