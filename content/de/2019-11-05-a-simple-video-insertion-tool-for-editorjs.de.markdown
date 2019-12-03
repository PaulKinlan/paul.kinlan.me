---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Ich mag [EditorJS](https://editorjs.io/) wirklich. Damit kann ich eine sehr einfache, im Web gehostete Oberfläche für meinen statischen Hugo-Blog erstellen.

EditorJS hat das meiste, was ich in einem einfachen blockbasierten Editor brauche. Es verfügt über ein Plugin für Header, Code und sogar eine einfache Möglichkeit, Bilder zum Editor hinzuzufügen, ohne dass eine Hosting-Infrastruktur erforderlich ist. Bisher gibt es keine einfache Möglichkeit, Videos zum Editor hinzuzufügen.

Ich nahm das [simple-image](https://github.com/editor-js/simple-image) Plugin-Repository und änderte es (nur ein bisschen), um ein [simple-video](https://github.com/PaulKinlan/simple-video) Plugin ( [npm module](https://www.npmjs.com/package/simple-video-editorjs) ) zu erstellen. Jetzt kann ich problemlos Videos in diesen Blog einbinden.

Wenn Sie mit EditorJS vertraut sind, ist es ziemlich einfach, es in Ihre Projekte aufzunehmen. Installieren Sie es einfach wie folgt

```
npm i simple-video-editorjs
```

Und fügen Sie es dann einfach in Ihr Projekt ein, wie Sie es für richtig halten.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

Der Editor verfügt über einige einfache Optionen, mit denen Sie konfigurieren können, wie das Video auf der Seite gehostet werden soll:

1. Autoplay - Das Video wird automatisch abgespielt, wenn die Seite geladen wird
1. stummgeschaltet - hat das Video standardmäßig keinen Ton (für die automatische Wiedergabe erforderlich)
1. Steuerelemente - Verfügt das Video über die Standard-HTML-Steuerelemente?

Im Folgenden finden Sie ein kurzes Beispiel für ein Video, das eingebettet ist (und einige der Optionen zeigt).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

Wie auch immer, ich hatte Spaß beim Erstellen dieses kleinen Plugins - es war nicht allzu schwer zu erstellen und das einzige, was ich tat, war, die Konvertierung auf base64 zu verschieben, die simple-images verwendet, und stattdessen einfach die Blob-URLs zu verwenden.