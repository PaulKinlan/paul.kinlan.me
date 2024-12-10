---
date: 2005-10-24
published: true
slug: opml-javascript-object-model-updates
summary: 'I''ve updated the OPML JavaScript Object Model to support OPML Attributes
  for Outlines, increasing flexibility for developers.  I''ve also incorporated an
  instanceOf method (source unknown - please let me know if you recognize it!) to
  add type checking when inserting OPMLOutlineAttributes into the attribute array.
  The added instanceOf function is as follows:


  ```javascript

  function instanceOf(object, constructor)  while (object != null) {       if (object
  == constructor.prototype)          return true;       object = object.__proto__;    }    return
  false; }

  ```'
tags:
- opml
- javascript
- object model
- attributes
- outline
- instanceof
- type checking
- update
title: OPML JavaScript Object Model Updates

---
There have been some minor updates to the OPML JavaScript Object Model.  I have added support for an OPML Attribute which are attached to an Outline.  This was done so that it is much more flexible and allows developers to add proper attribute combinations to an Outline.  Furthermore, I borrowed an instanceOf method from some site (if you know the site let me know) which enforce some sort of type checking when inserting OPMLOutlineAttributes to the attribute array.<p />The javascript I borrowed was this:function instanceOf(object, constructor)  while (object != null) {       if (object == constructor.prototype)          return true;       object = object.__proto__;    }    return false; }<p />

