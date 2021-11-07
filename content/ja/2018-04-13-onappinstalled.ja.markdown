---
slug: onappinstalled
date: 2018-04-13T13:20:31.000Z
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Chromeは最近（少なくとも[2017](https://crbug.com/621393)では）window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled)を実装しています。ホームスクリーンに追加（Add on Homescreen API）（ `onbeforeinstallprompt`イベントを介して配信されたイベントのprompt（）関数）を使用してプログレッシブウェブアプリケーションをインストールするとトリガされます。

プロンプトとシステムバナーやメニューボタンを使用してプログレッシブウェブアプリをインストールするユーザーとの関わりを確認できるので、非常に便利です。

私はそれを[Airhorner](https://airhorner.com)に追加したので、DevToolsが添付されていればそれを見ることができます。 onbeforeinstallpromptとonappinstalledを管理するコードは以下の通りです。この場合、私はonbeforeinstallpromptを使用してカスタムプロンプトにインストールプロンプトを送り、UIをクリーンアップして基本的な分析を行うために `onappinstalled`を使います。


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

