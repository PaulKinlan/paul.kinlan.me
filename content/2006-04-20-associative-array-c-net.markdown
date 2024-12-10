---
date: 2006-04-20
published: true
slug: associative-array-c-net
summary: A quick explanation of associative arrays in C# .NET, clarifying that they
  are simply hash tables.  A basic code example demonstrates adding and retrieving
  a key-value pair.
tags:
- c#
- .net
- associative array
- hash table
- dictionary
- key-value pair
title: Associative Array C# .Net

---
A visitor to my site from google was looking for: associative array c# .net.<p />The only thing I can say about this really is that an associative array in C# is just a hash table.<p />The hash table associates a key of type object with an associated object.For Example:<p />Hashtable ht = new Hashtable();ht.Add("testKey", "AssociatedData");MessageBox.Show(ht["testKey"]);<p />

