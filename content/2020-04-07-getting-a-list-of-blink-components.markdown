---
date: 2020-04-07 09:37:02.482000+00:00
link: ''
slug: getting-a-list-of-blink-components
summary: This post provides a quick way to retrieve and filter the list of Blink components
  from a JSON file hosted by Chromium.  The provided JavaScript snippets demonstrate
  how to fetch and process the component list, filtering for entries that begin with
  \"Bli\". The next step is figuring out how to programmatically get a list of OWNERS.
tags:
- blink
- components
- chromium
- javascript
- fetch
- json
- owners
title: Getting a list of Blink Components

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

