---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
У меня есть мысли о том, что я сделал вчера о ES-модулях

> I needed a quick way import a simple module get-urls into my project. The module is well tested and it does what I needed &#x2026; ignore the fact that it&#x2019;s pretty easy to implement in a couple of lines of JavaScript. The problem I had is that my project is built in ES6, uses modules and I didn&#x2019;t want to have to bundle up using CommonJS (require).
> 
> I couldn&#x2019;t find a lot of guidance on what to do here, so I went to experiement and this solution is the solution I came across:
> 
> 1. Create a file that imports the npm module I needed. module.exports = require('get-urls'); This module will be what&#x2019;s converted to ES6 style.
> 2. Create a rollup config that
>     1. Imports the node globals, and builtins.
>     2. Resolves all npm modules required for my usage of this module.
>     3. Pass the results through the commonjs plugin so that it&#x2019;s now in JavaScript module format.
>     4. Compress the output, because it&#x2019;s huge :
> 3. Include the bundled file in your project and rejoice.


[Читать полное сообщение](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

Одна из вещей, которые я хотел попытаться сформулировать в оригинальной статье, но я решил вытащить ее, заключается в том, что в экосистеме узла существует огромное количество кода, который на самом деле не является специфическим для узла как такового, но был тесно связан с Узел через Common JS и другие очень специфичные API-интерфейсы узлов (Buffer, старый URL и т. Д. И т. Д.), Которые потребуют больших усилий, чтобы вытащить себя, и, таким образом, изменение должно было сделать, чтобы ES-модули повсеместно были потенциально весьма болезненными, и до тех пор, пока изменения экосистемы, нам нужно будет использовать множество инструментов преобразования и связующих, чтобы иметь возможность совместного использования кода на нескольких платформах (веб-сервере).

Мы там, где мы находимся, в Интернете не было импортирующей истории, у нас не было кучи примитивов, которые вводил узел, и теперь многие из них теперь будут рассматривать де-факто требования к платформе, поэтому я надеюсь, что это скорее признание ситуации, чем критика.

Существует также переход на использование «.mjs» в качестве расширения файла, которое является стандартным как для узла, так и для Интернета. Я чувствую себя полностью комфортно с этим, однако .msj не является файлом, который любая инфраструктура еще признает как «text / javascript», и я с нетерпением жду, чтобы это просто было отсортировано, чтобы оно автоматически выводилось на каждом веб-сервере на планете, поэтому Мне не нужно развертывать еще больше изменений конфигурации в моей обслуживающей инфраструктуре.

Много веселых раз вперёд, я с нетерпением жду возможности получить гораздо больше функциональности в Интернете.
