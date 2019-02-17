---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing npm modules to the web as JavaScript modules'
tags: [npm, rollup, javascript]
---


Ich habe an einem Weg gearbeitet, um es einfacher zu machen, Inhalte in meine statische Seite zu pushen, und es war eine lustige kleine Übung, die ich in einem anderen Beitrag mehr teilen werde. In diesem Post möchte ich die 'Rollup'-Konfiguration teilen, die ich verwendet habe, um fast jedes npm-Modul in ein Frontend-Projekt mit JavaScript-Modulen zu importieren.

Ich brauchte einen schnellen Weg, um ein einfaches Modul `get-urls` in mein Projekt zu importieren. Das Modul ist gut getestet und es tut was ich brauche ... ignoriere die Tatsache, dass es ziemlich einfach in ein paar Zeilen JavaScript zu implementieren ist. Das Problem, das ich hatte, ist, dass mein Projekt in ES6 gebaut wird, Module verwendet und ich nicht mit CommonJS (`require`) bündeln wollte.

Ich konnte nicht viel Anleitung dazu finden, was ich hier tun sollte, also ging ich zum Experimentieren und diese Lösung ist die Lösung, auf die ich gestoßen bin:

1. Erstellen Sie eine Datei, die das benötigte npm-Modul importiert. `module.exports = require ('get-urls');` Dieses Modul wird in den ES6-Stil konvertiert. 2. Erstellen Sie eine Rollup-Konfig 1. Importieren Sie die Knoten Globals und Builtins. 1. Behebt alle npm-Module, die für die Verwendung dieses Moduls erforderlich sind. 1. Übergeben Sie die Ergebnisse über das Plugin `commonjs`, so dass es nun im JavaScript-Modulformat vorliegt. 1. Komprimieren Sie die Ausgabe, weil sie riesig ist: 3. Fügen Sie die gebündelte Datei in Ihr Projekt ein und freuen Sie sich.


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


Ich denke, es gibt wahrscheinlich bessere Möglichkeiten als dies, die Ausgabe für eine relativ einfache Funktion ist riesig (70kb), aber es bedeutet jetzt, dass ich Module von npm direkt auf meiner Seite verwenden kann.


```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.mjs';
    ...
```


Ordentlich...
