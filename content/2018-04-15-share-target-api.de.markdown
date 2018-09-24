---
slug: web-share-target-api
date: 2018-04-15T13:20:31+01:00
title: "Web Share Target API"
tags: ['pwa', 'intents', 'web intents']
description: "Share Target API is now in Chrome breaking down one of the last silos of native platforms"
---


Ich mache mir ständig Sorgen, dass wir auf der Web - Plattform [unbeabsichtigte Silos](/unintended-silos) erstellen, indem es das Ein - und Auslagern von Daten aus Webseiten und Apps erschweren, noch wichtiger ist, dass die Daten nur in eine Richtung fließen: von der Web zu Apps, da Apps überall dort sein können, wo Benutzer sie auf ihren Geräten erwarten.

Es hat mich sehr gefreut, dass Chrome mit der Arbeit an der Web Share Target API (0) begonnen hat, die die Arbeit an [navigator.share](/breaking-down-silos-with-share-target-api) ergänzt. Mit `navigator.share` können Sie Informationen von Ihrer Website an jede App auf dem Benutzergerät weitergeben, die" Shares "(` Intent.ACTION_SEND` im Android-Sprachgebrauch) empfangen kann. Das Web Share-Ziel lässt Ihre Website (oder PWA ) Sag 'Ich möchte auch in diesem Spiel spielen'.

Ich freue mich sehr, dass diese Arbeit jetzt in Chrome Canary für Android verfügbar ist.

Die Web Share Target API ist eine kleine API, die Sie in Ihrem Web App Manifest definieren. Wenn Sie jemals `registerProtocolHandler` verwendet haben, werden Sie feststellen, dass es keine Millionen Meilen entfernt ist. Sie definieren eine URL-Vorlage, die eine Anzahl von Variablen enthält, die ersetzt werden, wenn der Benutzer die Aktion aufruft.

Zuerst erstellen Sie eine 'Objekt'-Eigenschaft namens `share_target`, die eine Eigenschaft namens` url_template` enthält, die den Pfad hat, der geöffnet werden soll, wenn der Benutzer unseren Dienst auswählt. Unter Android können Sie die drei Namen der Substitution verwenden: * `{title}` - äquivalent zu `.title` in der navigator.share API oder` Intent.EXTRA_SUBJECT` von einer Android Intent. * `{text}` - äquivalent zu `.text` in der navigator.share API oder` Intent.EXTRA_TEXT` von einer Android Intent. * `{url}` - äquivalent zu `.url` in der navigator.share API oder den rohen Daten von einem Android Intent.

Du kannst dies heute versuchen, indem du [Twitter's PWA](https://mobile.twitter.com/) installierst. [Das Manifest von Twitter befindet sich unten](https://mobile.twitter.com/manifest.json):


```javascript
{
    ...
    "name": "Twitter Lite",
    "share_target": {
        "url_template": "compose/tweet?title={title}&text={text}&url={url}"
    },
    ...
}
```


Im Moment gibt es einige Einschränkungen:

* Sie können nur einen pro Manifest haben, dh bei Twitter können sie keinen 'Anteil an DM' haben. * Es werden einige Erweiterungen vorgeschlagen, z. B. ein Service-Worker-Ereignis namens `navigator.actions`, das ausgelöst wird, ohne dass eine Benutzeroberfläche geöffnet werden muss. Sie sind jedoch noch nicht implementiert. * Sie können nur "Text" teilen, dh wenn Sie einen Datenblock teilen möchten, müssen Sie diesen mit einer URL speichern, die dann geteilt wird. * Es funktioniert nur auf Android. * Sie müssen die PWA installieren lassen, damit Sie kein Laufwerk durch Registrierung eines Freigabeziels erstellen können. Wenn Chrome ein "Web-APK" generiert, sieht es sich nun das `share_target` an, um zu sehen, ob es den nativen` <intent-filter> `registrieren soll. * Es ist noch nicht standardisiert als Teil der Manifest-Spezifikation. : / oh - und es könnte sich auch ändern (0).

Abgesehen von den Einschränkungen ist dies eine ziemlich erstaunliche Ergänzung der Web-Plattform, die den Beginn der Überwindung der riesigen Barrieren darstellt, die das Web hinsichtlich der Integration auf den Host-Plattformen hat.

Wenn Sie Updates für diese API verfolgen möchten, lesen Sie [Chrome Status](https://www.chromestatus.com/feature/5662315307335680).
