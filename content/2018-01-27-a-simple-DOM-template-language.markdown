---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31+01:00
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---

In a [recent project](https://webgdedeck.com/), I wanted a simple way to bind
some JSON data to a DOM element without importing any libraries and I think I
came up with a pretty neat solution (in my eyes) that fit all my needs for the
project. 

The solution encodes templating instructions inside DOM data attributes named
`data-bind-*`, which are accessible on the DOM element in the dataset property
and it just so happens to camel-case the attributes automatically (i.e, to set
`innerText` you would have an attribute `data-bind_inner-text` - note the
hyphen).

Here is a sample template from the project:

```html
<template id="itemTemplate">
  <div class="item new" data-bind_id="guid" id="">
    <h3><span data-bind_inner-text="title"></span></h3>
    <p class="description" data-bind_inner-text="content:encoded|description"></p>
    <div>
      <a data-bind_href="link" data-bind_inner-text="pubDate" data-bind_title="title" href="" title=""></a>
      <svg class="share" url="" title="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M18 16c-.8 0-1.4.4-2 .8l-7-4v-1.5l7-4c.5.4 1.2.7 2 .7 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.2 4.2v.6c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3s-1.4-3-3-3z"></path>
      </svg>
    </div>
  </div>
</template>
```

As you can see, we use the `<template>` element to ensure that we can keep our
HTML in the DOM and to keep it inert (this really improves the authoring
experience). Note, it doesn't have to be a template element, it can take anything that
is inside the DOM.

To map the above DOM into an actual element with all the live data applied to it, I 
use the following basic algorithm:

1. Clone the element to bind data on to.
2. Iterate across the elements and for each element:
   1. Check to see if it has an attribute of the form `data-bind_`
   2. Get the keys to lookup on the `data` separated by a "|"
   3. Map the first found key's value from the input `data` directly to the
      node's attribute defined by `data-bind_`
3. Return the new node.

The code for this is pretty simple, if a tad terse.

```javascript
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKeyString = node.dataset[bindAttr];
        let dataKeys = dataKeyString.split("|");
        let bindKey = bindAttr.substr(5);
        for(let dataKey of dataKeys) {
          if(dataKey in data && data[dataKey] !== "") {
            node[bindKey] = data[dataKey];
            break;
          }
        }
      }
    }
  }

  return element;
}
```

I don't expect anyone to use this, but I wanted to show how you can build a data
binding tool for simple tasks without having to resort to a full library or
framework.