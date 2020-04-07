---
slug: getting-a-list-of-blink-components
date: 2020-04-07T09:37:02.482Z
title: Getting a list of Blink Components
link: ''
tags: [blink]
---

This is mostly for me to remember.

I needed to build a mapping of DevRel support to Blink Components, and I really didn't want to have to manually work out all the components by hand.

If you want to get a list of components in Blink, there is a [file](https://storage.googleapis.com/chromium-owners/component_map.json) that has all the details you need.

If you are Promise inclined, here is a quick way to do it.

```
fetch('https://storage.googleapis.com/chromium-owners/component_map.json')
  .then(body => body.json())
  .then(d=>console.log(Object.keys(d["component-to-team"]).filter(i=>i.startsWith('Bli')).join(',')))
.catch(console.err)
```

If you are async/await inclined, here is the same code.

```
let res = await fetch('https://storage.googleapis.com/chromium-owners/component_map.json');
let body = await res.json();
console.log(Object.keys(body["component-to-team"]).filter(i=>i.startsWith('Bli')).join(','))
```

Now to work out how we get a list of all the OWNERS programatically so that our team will always know the correct people to speak to.

