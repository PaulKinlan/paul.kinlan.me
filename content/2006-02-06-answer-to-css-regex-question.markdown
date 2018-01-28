---
slug: answer-to-css-regex-question
date: 2006-02-06
 
title: Answer to CSS Regex Question
published: true
---
I have had a question in my <a href="http://www.kinlan.co.uk/2006/02/regex-to-get-class-names-from-css-20.html#c113916701172912826">Comments by Rasmus</a> about CSS Regex for obtaining CSS class names. And rather than post it in the comments, I will post it as abn entry just so everyone can see it.<p />The Regex I gave was<br />\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*|[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?|\\[^\n\r\f0-9a-f]*<p />I think this is nearly correct and the C# that it is not supposed to work with is:<p /><br />string css = @"<br />.class1{<br />color:pink;<br />}<br />.class2{<br />color:blue;<br />}";<br />string patt = @"\.[-]?[_a-zA-Z][_a-zA-Z0-9-]*[^\0-\177]*\\[0-9a-f]{1,6}(\r\n[ \n\r\t\f])?\\[^\n\r\f0-9a-f]*";<br />string[] arr = Regex.Split(css, patt);<br />}<p />I tried the above code and it worked as Expected, there is an array entry in arr at the index of each class. Therefore each entry in arr contains the text between the class names.<p />Try Regex.Match if you want to get at the names of the classes.  And Check that the | character comes out correctly.<p />

