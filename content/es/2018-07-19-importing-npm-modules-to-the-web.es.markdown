---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


He estado trabajando en una forma de facilitar el envío de contenido a mi sitio estático y ha sido un pequeño ejercicio divertido que compartiré más en otra publicación. En esta publicación, quiero compartir la configuración `rollup` que utilicé para importar casi cualquier módulo npm en un proyecto frontend utilizando módulos de JavaScript.

Necesitaba una forma rápida de importar un módulo simple `get-urls` en mi proyecto. El módulo está bien probado y hace lo que necesitaba ... ignore el hecho de que es bastante fácil de implementar en un par de líneas de JavaScript. El problema que tuve es que mi proyecto está construido en ES6, usa módulos y no quería tener que agruparme usando CommonJS (`require`).

No pude encontrar mucha orientación sobre qué hacer aquí, así que fui al experimento y esta solución es la solución que encontré:

1. Cree un archivo que importe el módulo npm que necesitaba. `module.exports = require ('get-urls');` Este módulo será lo que se convierta en estilo ES6. 2. Cree una configuración de rollup que 1. Importe los nodos globales y los builtins. 1. Resuelve todos los módulos npm necesarios para mi uso de este módulo. 1. Pase los resultados a través del complemento `commonjs` para que ahora esté en formato de módulo de JavaScript. 1. Comprima la salida, porque es enorme: \ 3. Incluya el archivo incluido en su proyecto y alégrese.


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


Creo que hay formas mejores que esta, la salida para lo que es una función relativamente simple es enorme (70kb), pero ahora significa que puedo usar módulos de npm directamente en mi página.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Ordenado...
