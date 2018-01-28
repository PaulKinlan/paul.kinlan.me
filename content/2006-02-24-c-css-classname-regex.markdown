---
slug: c-css-classname-regex
date: 2006-02-24
 
title: C# CSS Classname Regex
published: true
---
As promised, although a little late I have updated the Regex to get CSS classnames via C#.  The problem I had was that it would find file extensions in a url specified by the "url(xyz.png)" in an attribute.<p />I added a little negative look behind and now it seems to work prety well:<p />string css = @"<br />.someclass<br />{<br />background: white url(someimage.png) repeat-x top left;<br />}<br />.someclass2<br />{<br />background: white url ( someimage.png) repeat-x top left;<br />}<br />";<br />MatchCollection arr = Regex.Matches(css, @"(?&lt;!url\s*\(.*)(\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*)");<br />string class1 = arr[0].Value;<br />string class2 = arr[1].Value;<p />

