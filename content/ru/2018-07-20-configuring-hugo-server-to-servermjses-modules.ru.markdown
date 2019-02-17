---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
По умолчанию Hugo не поддерживает файлы .mjs с правильным типом контента. Фактически, только до недавнего времени hugo мог обслуживать более одного расширения файла на mime-тип. Похоже, что с v0.43 это было исправлено.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Читать полное сообщение](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

Вышеприведенный код позволяет мне обслуживать файлы mjs для ES-модулей с правильным типом mime (модули примечаний должны обслуживаться с помощью «text / javascript»). Это необходимо только для локального тестирования, хостинг - это еще одна проблема :)
