---
slug: updated-answer-to-css-regex-question
date: 2006-02-06
 
title: Updated Answer to CSS Regex Question
published: true
---
I gave out a bit of duff information in my last post. Thanks Rasmus!<p />The code should have been:<p />string css = @"<br />.class1{<br />color:pink;<br />}<br />.class2{<br />color:blue;<br />}";<br />string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*";<br />MatchCollection arr = Regex.Matches(css, patt);<br />}<p /><br />The "arr" Collection will contain all the class names found in the input string. arr.Count will be the number of matches, and it can be indexed like so:  arr[0].Value etc. etc.<p />Sorry about that :)<p /><br />

