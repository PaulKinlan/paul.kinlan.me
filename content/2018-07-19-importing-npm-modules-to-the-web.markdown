---
slug: importing-npm-modules-to-the-web-as-es6-modules
date: 2018-07-19T18:06:53.251Z
title: 'Importing NPM Modules to the web as ES6 Modules'
tags: [npm, rollup, javascript]
---

I've been working on a way to make it easier to push content into my static site
and it's been a fun little exercise that I will share more in another post. In
this post I want to share the `rollup` config that I used to import nearly any
NPM module in to a frontend project using ES6 Modules.

I needed a quick way import a simple module `get-urls` into my project. The
module is well tested and it does what I needed ... ignore the fact that it's
pretty easy to implement in a couple of lines of JavaScript. The problem I had
is that my project is built in ES6, uses modules and I didn't want to have to
bundle up using CommonJS (`require`).

I couldn't find a lot of guidance on what to do here, so I went to experiement
and this solution is the solution I came across:

1. Create a file that imports the NPM module I needed. `module.exports =
   require('get-urls');` This module will be what converted to ES6 style.
2. Create a rollup config that
   1. Imports the node globals, and builtins.
   1. Resolves all npm modules required for my usage of this module.
   1. Pass the results through the `commonjs` plugin so that it's now in ES6
      Module format.
   1. Compress the output, because it's huge :\
3. Include the bundled file in your project and rejoice.

``` javascript
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import closure from 'rollup-plugin-closure-compiler-js';

export default {
  input: 'static/javascripts/get-urls.js',
  output: {
      file: 'static/javascripts/get-urls.bundle.js',
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

I think there are probably better ways than this, the output for what is a
relatively simple function is huge (70kb), but it now means that I can 
use modules from NPM directly in my page.

```
<script type="module">
    import getUrls from '/javascripts/get-urls.bundle.js';
    ...
```

Neat...