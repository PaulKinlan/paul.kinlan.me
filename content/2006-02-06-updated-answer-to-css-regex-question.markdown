---
date: 2006-02-06
published: true
slug: updated-answer-to-css-regex-question
summary: ''
tags: []
title: Updated Answer to CSS Regex Question

---
I gave out a bit of duff information in my last post. Thanks Rasmus!<p />The code should have been:<p />string css = @".class1{color:pink;}.class2{color:blue;}";string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*";MatchCollection arr = Regex.Matches(css, patt);}<p />The "arr" Collection will contain all the class names found in the input string. arr.Count will be the number of matches, and it can be indexed like so:  arr[0].Value etc. etc.<p />Sorry about that :)<p />

