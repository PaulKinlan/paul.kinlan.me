---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Wir haben in letzter Zeit viel an Feature-Handys entwickelt und es war hart, aber lustig. Das Schwierigste ist, dass wir unter KaiOS das Debuggen von Webseiten nicht finden konnten, insbesondere auf der Hardware, die wir hatten (Das Nokia 8110). Das Nokia ist ein großartiges Gerät, es ist mit KaiOS gebaut, von dem wir wissen, dass es auf einer Art Firefox 48 basiert, aber es ist gesperrt. Es gibt keinen herkömmlichen Entwicklermodus wie bei anderen Android-Geräten, was bedeutet, dass Sie keine Verbindung mit Firefox herstellen können Einfach WebIDE.

Durch die Kombination aus ein paar Blogs und ein bisschen Wissen über `adb` ich herausgefunden, wie es geht. Beachten Sie, andere hätten es zwar tun können, aber es ist nicht an einem Ort sauber dokumentiert.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(Bild oben zeigt die DevTools und auch die Ausgabe des Screenshot-Tools)

Hier sind die Schritte:

1. Schließen Sie ein USB-Kabel an. Stellen Sie sicher, dass auf Ihrem `adb` installiert ist. 2. Laden Sie eine Kopie von [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (dies ist die einzige, die ich zum [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) bringen kann). 3. Aktivieren Sie den &quot;Entwicklermodus&quot;, indem Sie `*#*#33284#*#*` über Ihr Telefon `*#*#33284#*#*` (beachten Sie, verwenden Sie keine `*#*#33284#*#*` ). Oben auf dem Bildschirm wird ein kleines Fehlersymbol angezeigt. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ] 4. Schließen Sie Ihr USB-Kabel an. 5. Führen Sie auf Ihrem Entwicklungscomputer die folgenden Befehle aus: 1. `adb start-server` 2. `adb devices` , um zu überprüfen, ob Ihr Telefon angeschlossen ist. 3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` wird ein Kanal von Ihrem Computer zu einer Buchse am Telefon eingerichtet. Dies ist, was die Web-IDE verwendet. 6. Starten Sie `Web IDE` indem Sie Firefox öffnen, gehen Sie zu Tools und dann zur Web-IDE. 7. Die Web-IDE ist geöffnet, klicken Sie auf &quot;Remote Runtime&quot; und klicken Sie auf die Schaltfläche &quot;Öffnen&quot; mit &quot;localhost: 6000&quot;. (Dies ist der TCP-Weiterleitungsport) . 8. Öffnen Sie eine Seite auf dem Telefon und Sie sollten sie auf der linken Seite sehen. Voila.
