---
slug: google-search-find-file-extension-with-regex-
date: 2006-03-08
 
title: "Google Search: find file extension with regex in c#"
published: true
---
I have had a search to my page where I know the reader probably didn't find what they were looking for.<p />This post is to hopefully let that user find the information that they are looking for better.<p />The Search term was "find file extension with regex in c#".<p />A simple regex that could be used in C# to find file extensions is:<p />.+\.([^.]+)$<p />This will find an extension that is at the end of the string. To find an extension anywhere in a string you can use:<p />.+\.([^.]+)\s<p />A regex to find a three letter extension at the end of a line:<p />.+\.([^.]{3})$<p />To find a three letter extension anywhere in a string you can use:<p />.+\.([^.]{3})\s<p />

