---
slug: file-drop
date: 2018-11-26T10:10:10.000Z
title: file-drop custom element
description: A simple drag and drop custom element that accepts files
tags: ['custom element', 'web component']
---

I'm rather proud of the team - Jake, Surma, Mariko, Jason, Ewa and Mustafa - who
created the [squoosh.app](https://squoosh.app/) project for Chrome Dev Summit.
It's been great to see some of the press around it, and it's a testament to the
team about how fluid and smooth the entire interface is - a lot of work went in
to the interaction design and maintaining 60FPS everywhere  (not to mention the
codecs that they brought to the web).

My own contribution to the project was the `<file-drop>` custom element. I'm
constantly frustrated by how hard it can be to get data in to a web application
in the way that a user expects and I didn't want this application to have the
same issues, so I created a simple `custom element` that acts as a drop target
for files filterable by mime-type.

Many custom elements exist for this type of interaction, but one thing that I am
quite proud of is that we managed to keep it under 1kb compressed, it has a
simple API (configuration, events and styling) and we worked out a neat way to
build the elements that I hope others in the industry will try and use.

You can try it inline on this page, and you can get the file from
[https://github.com/GoogleChromeLabs/file-drop/](https://github.com/GoogleChromeLabs/file-drop/)
and you can install it with `npm i file-drop-element`.

<script src='https://unpkg.com/file-drop-element@0.0.9/dist/filedrop.umd.js'></script>
<style>

  file-drop {
    border-radius: 2em;
    padding: 2em;
    border: dotted black 2px;
    margin: 2em;
    display: inline-block;
  }

  file-drop.drop-valid {
    background-color: green;
  }

  file-drop.drop-invalid {
    background-color: red;
  }
</style>
<file-drop id="dropTarget">Drop a file here</file-drop>

<script>
dropTarget.addEventListener('filedrop', (e) => {
  dropTarget.textContent = e.file.name;
});
</script>

It's also pretty simple to use:

### You can import it as an ES6 module

Copy from `node_modules` in to a local directory.

```
<script src='file-drop.mjs' type='module'></script>

<file-drop>

  Drop file here

</file-drop>
```

### You can use it directly as a UMD, for non-ES6 Module supporting browsers

```
<script src='filedrop.umd.js'></script>

<file-drop>

  Drop file here

</file-drop>
```

### You can be notified when a file is dropped

```
<file-drop id="dropTarget">Drop a file here</file-drop>

<script>
dropTarget.onfiledrop = (e) => {
  dropTarget.textContent = e.file.name;
};
</script>
```

### You can allow certain files to be dropped on the element

The element will accept any `drop` event that has the `.dataTransfer` object
populated with _any_ file. If you want to control the types of files that 
can be dropped on to the element, use the same syntax that `<input>` elements
use when the `accept` attribute is set, that is:

* `<file-drop>` - any file
* `<file-drop accept='image/*'>` - all images
* `<file-drop accept='image/png'>` - only Images that have the MIME-type of a PNG.

### You can control some of the styling so that you can validate the input type

The element an `inline` display element and it can be controlled like any normal
element. The element does not use Shadow DOM so there are no internal elements
to style.

The element will add two classes `drop-valid` and `drop-invalid` to the element
depending on the mime-type of the file that is currently being dragged over the
element.

```
<style>

file-drop.drop-valid {
  background-color: green;
}

file-drop.drop-invalid {
  background-color: red;
}

</style>
```
