---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
Por defecto, Hugo no sirve archivos .mjs con el tipo de contenido correcto. De hecho, no fue hasta hace poco que hugo podía servir más de una extensión de archivo por tipo de mimo. Parece que con v0.43 esto ha sido arreglado.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Leer la publicación completa](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

El código anterior me permite servir archivos mjs para los módulos ES con el tipo de mime correcto (los módulos de notas deben ser servidos con 'text / javascript'). Esto solo es necesario para las pruebas locales, el alojamiento es otro problema :)
