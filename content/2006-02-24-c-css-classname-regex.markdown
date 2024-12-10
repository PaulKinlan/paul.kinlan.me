---
date: 2006-02-24
published: true
slug: c-css-classname-regex
summary: I've updated my C# regex for extracting CSS class names to correctly handle
  URLs in CSS properties like `url(someimage.png)`.  The previous version incorrectly
  matched file extensions. The improved regex uses a negative lookbehind assertion
  `(?<!url\s*\(.*)` to prevent matching class names within `url()` declarations.  It
  now accurately extracts class names, even with variations in spacing within the
  `url()` function.
tags:
- c#
- regex
- css
- classnames
- parsing
- negative lookbehind
title: C# CSS Classname Regex

---
As promised, although a little late I have updated the Regex to get CSS classnames via C#.  The problem I had was that it would find file extensions in a url specified by the "url(xyz.png)" in an attribute.<p />I added a little negative look behind and now it seems to work prety well:<p />string css = @".someclass{background: white url(someimage.png) repeat-x top left;}.someclass2{background: white url ( someimage.png) repeat-x top left;}";MatchCollection arr = Regex.Matches(css, @"(?&lt;!url\s*\(.*)(\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*)");string class1 = arr[0].Value;string class2 = arr[1].Value;<p />

