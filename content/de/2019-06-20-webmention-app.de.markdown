---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
Ich liebe die Idee von [Webmentions](https://www.w3.org/TR/webmention/) , aber ich hatte nicht die Zeit, sie auf meiner Website umzusetzen. Bei allgemeinen Web-Erwähnungen können Sie andere Inhalte im Web kommentieren, mögen und darauf antworten und sie für diese Inhalte sichtbar machen, ohne mit Tools wie Disqus (die ich unbedingt von meiner Website entfernen möchte) zentralisiert zu werden.

Web-Erwähnungen sind in zwei Komponenten unterteilt, den Absender und den Empfänger. Der Empfänger ist die Site, über die ich einen Beitrag schreibe, und sie haben möglicherweise etwas auf ihrer Site, das eingehende Links oder Reaktionen auf ihren Blog anzeigt. und der Absender ist gut ich. Ich muss die entfernte Site, die ich geschrieben oder auf einen von ihnen erstellten Inhalt reagiert habe, freigeben.

Die ziemlich genial [Remy Sharp](https://remysharp.com) erstellt [webmention.app](https://webmention.app/) einen Teil des Problems zu lösen: Senden Pings. Mit Remys Tool können Sie ganz einfach &quot;Pings&quot; an potenzielle Empfänger senden, mit denen ich verbunden bin, indem Sie einfach ein CLI-Skript aufrufen.

Ich habe mein Blog mit Zeit unter Verwendung von Hugo und dem Static-Builder-Tool [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) , also war es [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Ich habe nur `npm i webmention` und rufe dann die CLI-Version des Tools aus meiner `build.sh` Datei auf - es ist wirklich so einfach.

Wenn ich jetzt einen Beitrag erstelle, sollte er einen kurzen Ping an alle neuen URLs senden, die ich zu ihrer Website erstellt habe.

