---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Рики Монделло из команды Safari недавно поделился заметкой о том, как Twitter использует спецификацию ./well-known/change-password

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

Эта особенность полностью прошла мимо меня, но это хорошая идея: если файл находится в известном месте, может ли браузер предложить пользователю пользовательский интерфейс, который позволяет им быстро сбросить пароль без необходимости навигации по сложному пользовательскому интерфейсу сайтов.

Спецификация обманчиво проста: известный файл просто содержит URL-адрес, по которому пользователь может указать, когда он хочет выполнить действие. Это заставило меня задуматься, можем ли мы предложить больше этих функций:

* Хорошо известное местоположение для моделей согласия на основе GDPR (согласие cookie) - владельцы сайтов могут предложить ссылку на страницу, где пользователь может управлять и потенциально отзывать все файлы cookie и другие элементы согласия с данными.
* Хорошо известное место для управления разрешениями браузера - владельцы сайтов могут предложить пользователям быстрое место для отзыва прав доступа к таким вещам, как геолокация, уведомления и другие примитивы.
* Хорошо известный путь для удаления учетной записи и изменений
* Хорошо известный путь для управления подпиской на рассылку

Этот список можно продолжить .... Мне очень нравится идея простых файлов перенаправления, чтобы помочь пользователям обнаружить общие действия пользователя, и для браузера.

* Обновление: * Я добавил [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .