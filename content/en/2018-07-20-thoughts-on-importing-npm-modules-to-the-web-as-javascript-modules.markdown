---
slug: thoughts-on-importing-npm-modules-to-the-web-as-javascript-modules
date: 2018-07-20T12:39:24.232Z
title: 'Thoughts on importing npm modules to the web as JavaScript modules'
link: https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/
tags: [links, npm, mjs, modules, javascript]
---
I've got thoughts on the post I did yesterday about ES Modules

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

[Read full post](https://paul.kinlan.me/importing-npm-modules-to-the-web-as-es6-modules/).

One of the things that I wanted to try and articulate in the original article but I decided to pull out is that there is a huge amount of code in the Node ecosystem that is not really that specific to Node per se but has been tightly coupled with Node via Common JS and other very specific Node API's (Buffer, old URL etc etc) that it's going to take a lot of effort to pull ourselves up and thus the change be required to make ES Modules ubiquitous will be potentially quite painful, and until the ecosystem changes we are going to need to use a lot of conversion tools and bundlers to be able to cleanly share code across multiple platforms (web/server).

We are where we are, there wasn't an importing story on the web, we didn't have a heap of the primitives that Node introduced and are now what many would now consider de-facto platform requirements, so I hope that this is more of an acknowledgement of the situation than a criticism.

There is also a move to use '.mjs' as a file extension that is standard across both node and the web. I feel totally comfortable with this, however .msj is not a file that any infrastructure yet recognises as 'text/javascript' and I'm looking forward to this just being sorted so that it's automatically inferred by every web server on the planet, so I don't have to deploy yet more configuration changes to my serving infrastructure.

Lots of fun times ahead, I for one am looking forward to being able to bring a lot more functionality to the web.
