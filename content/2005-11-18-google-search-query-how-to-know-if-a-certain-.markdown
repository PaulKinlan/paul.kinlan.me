---
slug: google-search-query-how-to-know-if-a-certain-
date: 2005-11-18
 
title: "Google Search Query: how to know if a certain file is a folder in c#"
published: true
---
Someone visited my site from google using the query: how to know if a certain file is a folder in c#<p />I thought I would answer it because it is not on my site and I really belive that if people come to my site they should have a chance to find what they are looking for.<p />Basically, there is a class called "File" in the System.IO namespace, this class exposes a lot of static methods, one of them is GetAttributes [File.GetAttributes(<em>string pathName</em>)].  This static method returns a FileAttributes Enumeration which in turn has a property "Directory".  If the file specified by the PathName parameter is a Directory then the enumeration can be logically tested by performing the following boolean statement.<p />((File.GetAttributes(path) &amp; FileAttributes.Directory) == FileAttributes.Directory<p />This statement will logically [not conditionally] AND the enumeration with the Directory Attribute on the enumeration, this will leave the enumeration with only the Directory Flag set if it is already set, which can then be tested against the attribute directly.  The enumeration is probably specified with the Flags attribute.<p />

