---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


Я работал над тем, чтобы упростить продвижение контента на мой статический сайт, и это было веселое упражнение, которое я расскажу больше в другом посте. В этой статье я хочу поделиться конфигурацией `rollup`, которую я использовал для импорта почти любого модуля npm в проект frontend с использованием модулей JavaScript.

Мне нужен был быстрый способ импортировать простой модуль `get-urls` в мой проект. Модуль хорошо протестирован, и он делает то, что мне нужно ... игнорировать тот факт, что его довольно легко реализовать в нескольких строках JavaScript. Проблема была в том, что мой проект построен в ES6, использует модули, и я не хотел связываться с использованием CommonJS (`require`).

Я не мог найти много рекомендаций о том, что делать здесь, поэтому я пошел на эксперимент, и это решение - это решение, с которым я столкнулся:

1. Создайте файл, который импортирует нужный мне модуль npm. `module.exports = require ('get-urls');` Этот модуль будет преобразован в стиль ES6. 2. Создайте конфигурацию сворачивания, которая 1. Импортирует глобальные узлы и встроенные компоненты. 1. Решает все модули npm, необходимые для моего использования этого модуля. 1. Пропустите результаты через плагин `commonjs`, чтобы он теперь был в формате модуля JavaScript. 1. Сжимайте вывод, потому что он огромен: \ 3. Включите связанный файл в ваш проект и радуйтесь.


``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.mjs',
      format: 'es',
      browser: true
    },
  plugins: [
    globals(),
    builtins(),
    resolve({
      preferBuiltins: false,
      browser: true,
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs(),
    closure({
      compilationLevel: 'WHITESPACE',
      languageIn: 'ES6',
      languageOut: 'ES6'
    })
  ]
};
```


Я думаю, что есть, вероятно, лучшие способы, чем это, вывод для относительно простой функции огромен (70kb), но теперь это означает, что я могу использовать модули из npm прямо на моей странице.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Аккуратные ...
