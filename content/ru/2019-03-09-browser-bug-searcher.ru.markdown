---
slug: browser-bug-searcher
date: 2019-03-09T07:49:18.044Z
title: 'Browser Bug Searcher'
link: 'https://browser-issue-tracker-search.appspot.com/?q=Web%20Share'
tags: [links, bugs, lumpy]
---
Я только размышлял над некоторыми из [work our team has done](https://twitter.com/ChromiumDev) и нашел проект 2017 года, который создали Роберт Найман и Эрик Бидельман. [Browser Bug Searcher!](https://browser-issue-tracker-search.appspot.com/?q=Web%20Share) .

Невероятно, что с помощью всего нескольких нажатий клавиш у вас есть отличный обзор ваших любимых функций во всех основных браузерных движках.

<figure>
  <img src="/images/2019-03-09-browser-bug-searcher.jpeg">
</figure>

[Source code available](https://github.com/GoogleChrome/browser-bug-search) .

Это фактически выдвигает на первый план одну из проблем, с которыми я сталкиваюсь с трекерами ошибок crbug и webkit: у них нет простого способа получать потоки данных в таких форматах, как RSS. Я хотел бы иметь возможность использовать мой агрегатор [topicdeck](https://github.com/PaulKinlan/topicdeck) с категориями ошибок и т. Д., Поэтому у меня есть панель со всеми интересующими меня вещами, основанная на последней информации от каждого из трекеров ошибок.
