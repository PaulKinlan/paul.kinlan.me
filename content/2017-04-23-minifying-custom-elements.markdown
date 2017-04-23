---
slug: minifiying-a-custom-element-es6-class
date: 2017-04-23T13:20:31+01:00
title: "Minifying a Custom Element that contains inline CSS and HTML"
description: "I couldn't find an easier way, so I built it myself"
---

I've created a [ShareButton web
component](/creating-a-share-button-web-component/), it's not great, but I like
it and I've learned a lot about the Web Component ecosystem whilst I was
creating it.

My main goal with this project was to encapsulate everything inside a single ES6
Class. I did this because I didn't want any non-developer controlled web request
emanating from my element. I think I achieved this, but it came at the expense
of some readability of the code because I had to inline the HTML and CSS that
define the element.

It looked a lot like this:

```
const overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.innerHTML = `
  <div id="urlbar">
    <input type="url" id="url" />
    <button id="copy" aria-label="Copy to clipboard"><slot name="clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16 1H4C3 1 2 2 2 3v14h2V3h12V1zm3 4H8C7 5 6 6 6 7v14c0 1 1 2 2 2h11c1 0 2-1 2-2V7c0-1-1-2-2-2zm0 16H8V7h11v14z"/></svg></slot></button>
    <button id="mailto" aria-lable="Mail to"><slot name="mailto"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg></slot></button>
    <button id="android" aria-label="Share on Android"><slot name="android"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6 18c0 .6.5 1 1 1h1v3.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V19h2v3.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V19h1c.6 0 1-.5 1-1V8H6v10zM3.5 8C2.7 8 2 8.7 2 9.5v7c0 .8.7 1.5 1.5 1.5S5 17.3 5 16.5v-7C5 8.7 4.3 8 3.5 8zm17 0c-.8 0-1.5.7-1.5 1.5v7c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5zm-5-5.8L16.8 1c.2-.3.2-.6 0-.8-.2-.2-.5-.2-.7 0l-1.3 1.4C13.7 1.2 13 1 12 1c-1 0-2 .2-2.7.6L7.8 0H7v1l1.5 1C7 3.2 6 5 6 7h12c0-2-1-3.8-2.5-4.8zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></svg></slot></button>
  </div>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>`;
```

It's not bad, but because I am inlining the HTML and CSS it means that it is a
lot harder to ensure that my element is minified to the best extent that it can
be. In fact, outside of Polymer tooling that focuses on parsing an HTML import,
I could not find any tooling or guidance about deploying a Custom Element that
is optimized (let me know if I am mistaken).

I don't believe that as an element author I should force an entire build chain
and tooling ecosystem on to the users of my element. I also believe that I
should be able to give my users the smallest possible built file that offer's
the user a fast by default experience.

I didn't want any super complex infrastructure that merges seperate CSS and JS
files into one output, I just wanted to have my development build of the custom
element to work exactly the same as my deployed build..... just smaller.

I hope with this article that at least you can see my process and understanding
into how I minified my custom element.

## Compressing ES6 class

I used `babili`. It's a very neat tool that compresses ES6 classes. It's 
still experimental, but I didn't run into any major issues.

```
npm install babili --save-dev
```

You can run it in a number of different ways, I chose to pipe data into it via
STDOUT.

```
cat xyz | babili
```

This worked well, but it leaves the strings alone because it is assuming
(rightly) that the output and formatting of those strings is intentional. If I 
want to get the element to be as small as possible then I need to minify the 
CSS and HTML that is embedded in my element.

So how do you fix a problem like this?

I chose to break the problem into compressing the HTML and compressing the CSS
into two extra steps.

## Compressing inline CSS

I couldn't easily work out a scalable way to infer that a string was CSS and
would require compressing, so I went old school and copied something that I had
seen done in Web Starer Kit - custom markers that define that something needs to
be processed. 

The custom marker would just be a normal comment that is ignored by the browser
but a minifier would also strip out.

I wrote this simple script that reads from STDIN, loads the entire file and then
looks for a custom comment and then uses a simple regex to find the comment and
the content in between before running a replacement function before finally
printing the entire output back to STDOUT.

It includes `clean-css` which seemed like it would do the trick.

```
const CleanCSS = require('clean-css');
const process = require('process');

let input = '';

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if(chunk != null) input += chunk;
})

process.stdin.on('end', () => {
  let cssRe = /\/\*compress\*\/(.|[\n\r])+?\/\*endcompress\*\//;

  let compressedOutput = input.replace(cssRe, (match, p1, offset, string) => {
    let output = new CleanCSS({}).minify(match);
    return output.styles; 
  });
  process.stdout.write(compressedOutput);
  process.exit();
});
```

I had to enhance my inline CSS with a `/*compress*/` and `/*endcompress*/` which
might be a tad confusing for any developer reading the source but it does give
me a lot of flexibility.

## Compressing inline HTML

I did the exact same thing for the HTML minification. The `html-minifier`
package is pretty neat and I played around with it to find some sane defaults
that worked well.

```
const minify = require('html-minifier').minify;
const process = require('process');

let input = '';

process.stdin.on('readable', () => {
  let chunk = process.stdin.read();
  if(chunk != null) input += chunk;
})

process.stdin.on('end', () => {
  let cssRe = /<!--compress-->(.|[\n\r])+?<!--endcompress-->/;

  let compressedOutput = input.replace(cssRe, (match, p1, offset, string) => {
    return minify(match, { removeAttributeQuotes: true, removeComments: true, collapseWhitespace: true });
  });
  process.stdout.write(compressedOutput);
  process.exit();
});
```

## Hooking it all together

The share button has a custom `bulid` script that compresses the CSS, then the
HTML and finally it does the ES6 minification and ensures that the file intended
for distribution and inclusion is as small as possible.

```
  "scripts": {
    "build": "cat share-button.js | node build/compress-css.js | node build/compress-html.js | babili > dist/share-button.min.js"
  }
```

## Integrating it in to my blog

I had intended to write a rant about deploying web components, but it was pretty
simple in the end.

1. Install the element in to my project

```
npm install sharebutton --save
```

2. Add it into my build deployment.
```
install:
- npm install
- cp node_modules/sharebutton/dist/share-button.min.js static/javascripts/share-button.js
```

## What next?

I think it was worth it. The element is now 7917 bytes vs 11700 bytes which is
roughly 33% smaller, so I am happy. I also now have a process that I can use
across my other elements and everything is encapsulted into this one package.

I backed myself into a corner with my choice of inlining the CSS and HTML but I
still think it is the best solution for building custom elements.

The solution presented here will do a good job at minifying the element but it
will not do a great job, for example because the custom element is opaque from 
the outside elements I could do a better job at minifying CSS selectors, ID's
etc but the CSS, HTML and JS are not tightly coupled enough for me to do this
with any confidence.

I would love to get your thoughts on this process and if you have done anything
similar and had better results.