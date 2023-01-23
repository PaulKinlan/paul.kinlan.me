---
slug: onappinstalled
date: 2018-04-13T13:20:31.000Z
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---

Chrome has recently (well at least in [2017](https://crbug.com/621393))
implemented `window.onappinstalled`
[event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled).
It is triggered when a user installs a progressive web app either via the Add to
Homescreen API (the prompt() function on the event delivered via the
`onbeforeinstallprompt` event) _or_ now more importantly via the manual method
of Add to Homescreen.

This is a very useful addition because it allows you to see engagement on the 
prompt vs people who use the system banners or menu buttons to install a 
progressive web app.

I've added it to [Airhorner](https://airhorner.com) so you can see it in action
if DevTools is attached. The code is below that manages `onbeforeinstallprompt`
and `onappinstalled` - in this case I use onbeforeinstallprompt to defer the
install prompt to a custom button, and `onappinstalled` to clean up the UI and
do some basic analytics.

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
