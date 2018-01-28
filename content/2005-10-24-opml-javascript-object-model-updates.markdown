---
slug: opml-javascript-object-model-updates
date: 2005-10-24
 
title: OPML Javascript Object Model Updates
published: true
---
There have been some minor updates to the OPML Javascript Object Model.  I have added support for an OPML Attribute which are attached to an Outline.  This was done so that it is much more flexible and allows developers to add proper attribute combinations to an Outline.  Furthermore, I borrowed an instanceOf method from some site (if you know the site let me know) which enforce some sort of type checking when inserting OPMLOutlineAttributes to the attribute array.<p />The javascript I borrowed was this:<br />function instanceOf(object, constructor)  while (object != null) {       if (object == constructor.prototype)          return true;       object = object.__proto__;    }    return false; }<p /><table class="TechnoratiHead TagHeader">
<tr><td>Related Tags</td></tr>
<tr class="Technorati"><td>
<a href="https://paul.kinlan.me/tags/Javascript" class="Tag" rel="tag">Javascript</a> <a href="https://paul.kinlan.me/tags/Attribute" class="Tag" rel="tag">Attribute</a> <a href="https://paul.kinlan.me/tags/Instanceof" class="Tag" rel="tag">Instanceof</a> <a href="https://paul.kinlan.me/tags/Constructor" class="Tag" rel="tag">Constructor</a> <a href="https://paul.kinlan.me/tags/Proto" class="Tag" rel="tag">Proto</a> <a href="https://paul.kinlan.me/tags/Prototype" class="Tag" rel="tag">Prototype</a> <a href="https://paul.kinlan.me/tags/Opml" class="Tag" rel="tag">Opml</a> <a href="https://paul.kinlan.me/tags/Object%20Model" class="Tag" rel="tag">Object Model</a>
</td></tr>
</table><br /><table class="TechnoratiHead TagHeader">
<tr><td>Wikipedia Documents</td></tr>
<tr class="Technorati"><td>
<a href="http://en.wikipedia.org/wiki/OPML">Opml</a> ,<a href="http://en.wikipedia.org/wiki/OML">Oml</a> ,<a href="http://en.wikipedia.org/wiki/Dave_Winer">Dave Winer</a> ,<a href="http://en.wikipedia.org/wiki/Outliner">Outliner</a> ,<a href="http://en.wikipedia.org/wiki/Prototype_pattern">Prototype Pattern</a> ,<a href="http://en.wikipedia.org/wiki/Constructor">Constructor</a> ,<a href="http://en.wikipedia.org/wiki/Ajax_(programming)">Ajax (programming)</a> ,<a href="http://en.wikipedia.org/wiki/XMLHttpRequest">Xmlhttp</a> ,<a href="http://en.wikipedia.org/wiki/Dynamic_HTML">Dynamic Html</a>
</td></tr>
</table><div class="blogger-post-footer"><img class="posterous_download_image" src="https://blogger.googleusercontent.com/tracker/8109338-113018329898494159?l=www.kinlan.co.uk%2Findex.html" height="1" alt="" width="1" /></div>

