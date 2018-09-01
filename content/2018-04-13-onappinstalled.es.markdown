---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Chrome recientemente (al menos en [2017](https://crbug.com/621393)) implementó `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web / API / Window / onappinstalled). Se activa cuando un usuario instala una aplicación web progresiva a través de la API Agregar a la pantalla de inicio (la función prompt () del evento entregado a través del evento `onbeforeinstallprompt` _or_ ahora más importante a través del método manual Agregar a pantalla de inicio.

Esta es una adición muy útil porque le permite ver el compromiso en el mensaje frente a las personas que utilizan los banners del sistema o los botones de menú para instalar una aplicación web progresiva.

Lo he agregado a [Airhorner](https://airhorner.com) para que pueda verlo en acción si se conecta DevTools. El código está abajo que administra `onbeforeinstallprompt` y` onappinstalled`; en este caso, uso onbeforeinstallprompt para diferir el mensaje de instalación a un botón personalizado, y `onappinstalled` para limpiar la interfaz de usuario y hacer algunos análisis básicos.


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

