---
slug: c-query-from-google
date: 2005-11-05
 
title: C# Query from Google
published: true
---
One of the queries that someone entered in to Google and found my site was:<br /><strong>c# test a string to see if it is a number</strong>:<br />I suppose there are a couple of ways that this can be done.<p />If you know the datatype that you want to convert it to [i.e you know the numeric range] you can use the Convert class.<br /><strong>Convert.ToInt16 (short), Convert.ToInt32 (int), Convert.ToFloat (floats). etc etc</strong><p />You could also use a regex along the lines of:<p />/^[0-9]+$/<br />or<br />/^[\d]+$/<p />both of the above regex's will check to see if it is a numeric string. (Whole numbers only though).<p />Anyone who is looking for <strong>c# test a string to see if it is a number</strong>; I hope you find this usefull.<p />

