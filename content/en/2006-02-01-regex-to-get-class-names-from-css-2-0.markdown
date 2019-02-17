---
slug: regex-to-get-class-names-from-css-2-0
date: 2006-02-01
 
title: Regex To Get Class Names From CSS 2.0
published: true
---
I have just read part of the CSS 2.0 spec and to tie in with one of <a href="http://www.kinlan.co.uk/2006/01/css-c-token-reader.html">my side projects </a>about creating a CSS 2.0 parser in c#, I have created a regex [based off the spec] that should find all the class names in a CSS file.<p />\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*<p />I intend to create more regex's over the next few days to parse all the other elements that appear inside the CSS spec. Then once these are done I should be able to have a stab at creating a full <a href="http://www.kinlan.co.uk/2006/01/css-c-token-reader.html">CSS 2.0 parser</a>.<p />

