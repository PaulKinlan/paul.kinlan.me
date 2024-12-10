---
date: 2006-02-06
published: true
slug: answer-to-css-regex-question
summary: In a previous post, I shared a regular expression for extracting CSS class
  names, and a reader asked for clarification.  This post addresses the question with
  a corrected regex and C# code example using `Regex.Split` and `Regex.Match`. The
  regex is designed to capture class names from CSS, even those containing escaped
  characters, and the example code demonstrates splitting a CSS string by class names
  and suggests using `Regex.Match` for obtaining the names themselves.
tags:
- css
- regex
- c#
- class names
- parsing
- web development
- regular expressions
title: Answer to CSS Regex Question

---
I have had a question in my <a href="http://www.kinlan.co.uk/2006/02/regex-to-get-class-names-from-css-20.html#c113916701172912826">Comments by Rasmus</a> about CSS Regex for obtaining CSS class names. And rather than post it in the comments, I will post it as abn entry just so everyone can see it.<p />The Regex I gave was\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*<p />I think this is nearly correct and the C# that it is not supposed to work with is:<p />string css = @".class1{color:pink;}.class2{color:blue;}";string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?\\[^\n\r\f0-9a-f]*";string[] arr = Regex.Split(css, patt);}<p />I tried the above code and it worked as Expected, there is an array entry in arr at the index of each class. Therefore each entry in arr contains the text between the class names.<p />Try Regex.Match if you want to get at the names of the classes.  And Check that the | character comes out correctly.<p />

