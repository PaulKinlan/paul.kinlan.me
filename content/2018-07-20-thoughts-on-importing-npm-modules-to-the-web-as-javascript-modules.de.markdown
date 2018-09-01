---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
Ich habe Gedanken über die Post, die ich gestern über ES-Module geschrieben habe

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


[Ganzen Beitrag lesen](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

Eines der Dinge, die ich im Originalartikel versuchen und artikulieren wollte, aber ich entschied mich herauszuziehen, dass es im Knoten-Ökosystem eine riesige Menge an Code gibt, der nicht wirklich spezifisch für Node ist, aber eng mit ihm verbunden ist Knoten über Common JS und andere sehr spezifische Knoten-APIs (Puffer, alte URL usw.), dass es sehr mühsam sein wird, sich hochzuziehen und somit die Änderung erforderlich wird, um ES-Module allgegenwärtig zu machen, wird potentiell ziemlich schmerzhaft sein und bis Angesichts der Änderungen im Ökosystem müssen wir viele Conversion-Tools und Bundler einsetzen, um Code auf mehreren Plattformen (Web / Server) sauber zu teilen.

Wir sind dort, wo wir sind, es gab keine importierende Geschichte im Web, wir hatten keinen Haufen der Primitiven, die Node eingeführt hat, und sind jetzt, was viele jetzt für De-facto-Plattform-Anforderungen halten würden, also hoffe ich, dass dies so ist eher eine Anerkennung der Situation als eine Kritik.

Es gibt auch einen Schritt zur Verwendung von '.mjs' als Dateierweiterung, die sowohl für den Knoten als auch für das Web Standard ist. Ich fühle mich jedoch vollkommen wohl dabei. MSJ ist keine Datei, die irgendeine Infrastruktur als "Text / Javascript" erkennt und ich freue mich darauf, dass sie so sortiert wird, dass sie automatisch von jedem Webserver auf dem Planeten erkannt wird Ich muss nicht noch mehr Konfigurationsänderungen an meiner Server-Infrastruktur vornehmen.

Viele lustige Zeiten voraus, ich für meinen Teil freue mich darauf, viel mehr Funktionalität ins Web bringen zu können.
