---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
Tengo pensamientos sobre la publicación que hice ayer sobre los módulos ES

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


[Leer la publicación completa](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

Una de las cosas que quería probar y articular en el artículo original pero decidí retirar es que hay una gran cantidad de código en el ecosistema del Nodo que no es tan específico para el Nodo per se, pero se ha unido estrechamente con Nodo a través de Common JS y otras API de Nodo muy específicas (Buffer, antigua URL, etc.) que requerirá un gran esfuerzo para elevarnos y, por lo tanto, el cambio necesario para hacer que los Módulos ES ubicuos sea potencialmente muy doloroso, y hasta los cambios en el ecosistema vamos a necesitar usar muchas herramientas de conversión y paquetes para poder compartir código de manera limpia en múltiples plataformas (web / servidor).

Estamos donde estamos, no había una historia importadora en la web, no teníamos un montón de las primitivas que presentó Node y ahora son lo que muchos considerarían como requisitos de plataforma de facto, así que espero que esto sea así. más un reconocimiento de la situación que una crítica.

También hay un movimiento para usar '.mjs' como una extensión de archivo que es estándar tanto en el nodo como en la web. Me siento totalmente cómodo con esto, sin embargo .msj no es un archivo que ninguna infraestructura reconozca como 'text / javascript' y estoy esperando que esto sea ordenado para que sea inferido automáticamente por cada servidor web del planeta, por lo que No tengo que implementar aún más cambios de configuración en mi infraestructura de servicio.

Muchos tiempos de diversión por delante, por mi parte, estoy deseando poder traer mucha más funcionalidad a la web.
