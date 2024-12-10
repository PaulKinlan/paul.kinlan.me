---
date: 2005-11-05
published: true
slug: c-query-from-google
summary: 'This post addresses the C# problem of checking if a string contains a number.
  Two approaches are suggested: using the Convert class with specific data types like
  `Convert.ToInt16`, `Convert.ToInt32`, `Convert.ToFloat`, etc., and using regular
  expressions like `^[0-9]+$` or `^[\d]+$` for whole number strings. The post aims
  to help C# programmers effectively perform this type of string validation.'
tags:
- c#
- string
- number
- validation
- regex
- convert
title: C# Query from Google

---
One of the queries that someone entered in to Google and found my site was:<strong>c# test a string to see if it is a number</strong>:I suppose there are a couple of ways that this can be done.<p />If you know the datatype that you want to convert it to [i.e you know the numeric range] you can use the Convert class.<strong>Convert.ToInt16 (short), Convert.ToInt32 (int), Convert.ToFloat (floats). etc etc</strong><p />You could also use a regex along the lines of:<p />/^[0-9]+$/or/^[\d]+$/<p />both of the above regex's will check to see if it is a numeric string. (Whole numbers only though).<p />Anyone who is looking for <strong>c# test a string to see if it is a number</strong>; I hope you find this usefull.<p />

