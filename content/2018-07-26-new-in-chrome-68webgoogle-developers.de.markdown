---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage schreibt über wichtige Änderungen an Add to Homescreen in Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Vollständigen Beitrag lesen](https://developers.google.com/web/updates/2018/07/nic68).

Ich hatte ursprünglich gemischte Gefühle, weil so viele Leute nicht mit dem `beofinstallprompt'-Ereignis umgehen, was bedeutete, dass plötzlich die Anzahl der Installationen von Web-APKs erheblich sinken würde, aber ich denke, es ist tatsächlich das Richtige.

Das Ziel ist es, die Anzahl der lästigen Aufforderungen im Web zu reduzieren, und das letzte, was wir in der Branche brauchen, ist eine relativ große Eingabeaufforderung, wenn wir denken, dass der Benutzer vielleicht eine PWA installieren möchte Denken Sie darüber nach, wo und wann ** Sie ** eine Installation anfordern möchten und Sie dies als Reaktion auf eine Benutzergeste tun müssen.

Das Schöne daran ist, dass wir (Chrome) mehr Ambient-Möglichkeiten einführen, um den Benutzer wissen zu lassen, dass eine Erfahrung installiert werden kann. Jetzt ist es die kleine untere Leiste, die beim ersten Laden erscheint und hoffentlich in der Zukunft erkundet werden kann subtilere Möglichkeiten, den Benutzer wissen zu lassen, dass er Maßnahmen ergreifen kann.
