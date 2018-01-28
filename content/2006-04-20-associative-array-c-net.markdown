---
slug: associative-array-c-net
date: 2006-04-20
 
title: Associative Array C# .Net
published: true
---
A visitor to my site from google was looking for: associative array c# .net.<p />The only thing I can say about this really is that an associative array in C# is just a hash table.<p />The hash table associates a key of type object with an associated object.<br />For Example:<p />Hashtable ht = new Hashtable();<br />ht.Add("testKey", "AssociatedData");<br />MessageBox.Show(ht["testKey"]);<p />

