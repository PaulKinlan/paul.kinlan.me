---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Chrome a récemment (bien au moins en [2017](https://crbug.com/621393)) implémenté `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web / API / Window / onappinstalled). Il est déclenché lorsqu'un utilisateur installe une application Web progressive via l’API Add to Homescreen (la fonction prompt () sur l’événement fourni via l’événement `onbeforeinstallprompt`) ou plus important encore via la méthode manuelle Add to Homescreen.

Ceci est un ajout très utile, car il vous permet de voir l'engagement sur l'invite par rapport aux personnes qui utilisent les bannières système ou les boutons de menu pour installer une application Web progressive.

Je l'ai ajouté à [Airhorner](https://airhorner.com) afin que vous puissiez le voir en action si DevTools est attaché. Le code ci-dessous gère `onbeforeinstallprompt` et` onappinstalled` - dans ce cas, j'utilise onbeforeinstallprompt pour reporter l'invite d'installation à un bouton personnalisé et `onappinstalled` pour nettoyer l'interface utilisateur et effectuer des analyses de base.


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

