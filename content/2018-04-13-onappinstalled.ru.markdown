---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Недавно Chrome (ну, по крайней мере, в [2017](https://crbug.com/621393)) реализовал `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled). Он запускается, когда пользователь устанавливает прогрессивное веб-приложение либо с помощью API Add to Homescreen API (функция prompt () в событии, отправленном через событие `onbeforeinstallprompt`) _or_ теперь более важно с помощью ручного метода Add to Homescreen.

Это очень полезное дополнение, потому что оно позволяет вам видеть участие в приглашении против людей, которые используют системные баннеры или кнопки меню для установки прогрессивного веб-приложения.

Я добавил его в [Airhorner](https://airhorner.com), чтобы вы могли увидеть его в действии, если DevTools прилагается. Код ниже, который управляет `onbeforeinstallprompt` и` onappinstalled` - в этом случае я использую onbeforeinstallprompt, чтобы отложить запрос на установку к пользовательской кнопке и `onappinstalled`, чтобы очистить пользовательский интерфейс и сделать некоторые основные аналитики.


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

