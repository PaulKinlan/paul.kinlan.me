---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage пишет о важных изменениях в Add to Homescreen в Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Читать полный пост](https://developers.google.com/web/updates/2018/07/nic68).

У меня были смешанные чувства по этому поводу изначально, потому что так много людей не справились с событием `beforeinstallprompt`, это означало, что внезапно количество установок Web APK упадет довольно значительно, но я думаю, что это действительно правильно.

Цель состоит в том, чтобы уменьшить количество раздражающих подсказок, происходящих в Интернете, и последнее, что нам нужно в отрасли, - это относительно большая подсказка, когда мы думаем, что пользователь может захотеть установить PWA, вместо этого вам теперь нужно подумайте о том, где и когда ** вы ** хотите запросить установку, и вы должны сделать это в ответ на жест пользователя.

Самое главное, что мы (Chrome) внедряем более привычные способы дать пользователю возможность узнать, что опыт может быть установлен, прямо сейчас это небольшая нижняя панель, которая появляется при первой загрузке, и, надеюсь, в будущем мы сможем исследовать более тонкие способы дать пользователю понять, что они могут принять меры.
