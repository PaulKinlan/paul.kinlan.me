---
slug: opml-javascript-object-model-updates
date: 2005-10-24
 
title: OPML JavaScript Object Model Updates
published: true
---
There have been some minor updates to the OPML JavaScript Object Model.  I have added support for an OPML Attribute which are attached to an Outline.  This was done so that it is much more flexible and allows developers to add proper attribute combinations to an Outline.  Furthermore, I borrowed an instanceOf method from some site (if you know the site let me know) which enforce some sort of type checking when inserting OPMLOutlineAttributes to the attribute array.<p />The javascript I borrowed was this:function instanceOf(object, constructor)  while (object != null) {       if (object == constructor.prototype)          return true;       object = object.__proto__;    }    return false; }<p />

