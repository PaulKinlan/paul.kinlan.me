---
slug: onappinstalled
date: 2018-04-13T13:20:31+01:00
title: "onappinstalled - for when an app is installed."
tags: ['pwa']
description: "Use onappinstalled to detect when a progressive web app is installed."
---


Chrome gần đây (ít nhất là trong [2017](https://crbug.com/621393)) đã triển khai `window.onappinstalled` [event](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled). Nó được kích hoạt khi người dùng cài đặt ứng dụng web tiến bộ thông qua API Add to Homescreen (hàm prompt () trên sự kiện được gửi qua sự kiện `onbeforeinstallprompt`) _or_ giờ đây quan trọng hơn thông qua phương thức thủ công của Add to Homescreen.

Đây là một bổ sung rất hữu ích vì nó cho phép bạn thấy sự tương tác trên dấu nhắc so với những người sử dụng các biểu ngữ hệ thống hoặc các nút menu để cài đặt một ứng dụng web tiến bộ.

Tôi đã thêm nó vào [Airhorner](https://airhorner.com) để bạn có thể thấy nó hoạt động nếu DevTools được đính kèm. Đoạn mã dưới đây quản lý `onbeforeinstallprompt` và` onappinstalled` - trong trường hợp này tôi sử dụng onbeforeinstallprompt để trì hoãn lời nhắc cài đặt cho nút tùy chỉnh và `onappinstalled` để xóa giao diện người dùng và thực hiện một số phân tích cơ bản.


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

