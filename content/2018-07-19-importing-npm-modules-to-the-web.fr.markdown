---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


J'ai travaillé sur un moyen de rendre plus facile la diffusion de contenu sur mon site statique et ce fut un petit exercice amusant que je partagerai davantage dans un autre article. Dans cet article, je souhaite partager la configuration `rollup` que j'ai utilisée pour importer presque tous les modules npm dans un projet frontend utilisant des modules JavaScript.

J'avais besoin d'un moyen rapide d'importer un simple module `get-urls` dans mon projet. Le module est bien testé et il fait ce dont j'avais besoin ... ignorez le fait qu'il est assez facile à implémenter en quelques lignes de JavaScript. Le problème que j'ai eu est que mon projet est construit dans ES6, utilise des modules et que je ne voulais pas avoir à regrouper en utilisant CommonJS (`require`).

Je n'ai pas trouvé beaucoup de conseils sur ce qu'il faut faire ici, alors je suis allé à l'expériement et cette solution est la solution que j'ai trouvée:

1. Créez un fichier qui importe le module npm dont j'ai besoin. `module.exports = require ('get-urls');` Ce module sera ce qui sera converti au style ES6. 2. Créez une configuration de cumul 1. Importe les globales de noeud et les commandes intégrées. 1. Résout tous les modules npm requis pour mon utilisation de ce module. 1. Transmettez les résultats via le plug-in `commonjs` afin qu'il soit maintenant au format de module JavaScript. 1. Compressez le résultat, car il est énorme: \ 3. Incluez le fichier fourni dans votre projet et réjouissez-vous.


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


Je pense qu'il y a probablement de meilleurs moyens que cela, la sortie pour une fonction relativement simple est énorme (70kb), mais cela signifie maintenant que je peux utiliser des modules de npm directement dans ma page.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Soigné...
