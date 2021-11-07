---
slug: onappinstalled
date: 2018-04-13T13:20:31.000Z
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Chrome hat kürzlich (zumindest in [2017](https://crbug.com/621393)) `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled) implementiert. Es wird ausgelöst, wenn ein Benutzer eine progressive Web-App entweder über das Add to Homescreen API (die Funktion prompt () für das über das Ereignis 'onbeforeinstallprompt' ausgelieferte Ereignis) _oder_ noch wichtiger über die manuelle Methode Add to Homescreen installiert.

Dies ist ein sehr nützlicher Zusatz, da Sie dadurch die Interaktion mit Personen erkennen können, die die Systembanner oder Menüschaltflächen verwenden, um eine progressive Webanwendung zu installieren.

Ich habe es zu [Airhorner](https://airhorner.com) hinzugefügt, damit Sie es in Aktion sehen können, wenn DevTools angehängt ist. Der Code ist unten, der `onbeforeinstallprompt` und` onappinstalled` verwaltet - in diesem Fall verwende ich onbeforeinstallpromp, um die Installationsaufforderung auf eine benutzerdefinierte Schaltfläche zu verschieben, und `onappinstalled`, um die Benutzeroberfläche zu bereinigen und einige grundlegende Analysen durchzuführen.


```javascript
const Installer = function(root) {
  let promptEvent;

  const install = function(e) {
    if(promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice
        .then(function(choiceResult) {
          // The user actioned the prompt (good or bad).
          // good is handled in 
          promptEvent = null;
          ga('send', 'event', 'install', choiceResult);
          root.classList.remove('available');
        })
        .catch(function(installError) {
          // Boo. update the UI.
          promptEvent = null;
          ga('send', 'event', 'install', 'errored');
          root.classList.remove('available');
        });
    }
  };

  const installed = function(e) {
    promptEvent = null;
    // This fires after onbeforinstallprompt OR after manual add to homescreen.
    ga('send', 'event', 'install', 'installed');
    root.classList.remove('available');
  };

  const beforeinstallprompt = function(e) {
    promptEvent = e;
    promptEvent.preventDefault();
    ga('send', 'event', 'install', 'available');
    root.classList.add('available');
    return false;
  };

  window.addEventListener('beforeinstallprompt', beforeinstallprompt);
  window.addEventListener('appinstalled', installed);

  root.addEventListener('click', install.bind(this));
  root.addEventListener('touchend', install.bind(this));
};
```

