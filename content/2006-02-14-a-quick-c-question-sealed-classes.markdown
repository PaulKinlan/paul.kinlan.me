---
slug: a-quick-c-question-sealed-classes
date: 2006-02-14
 
title: "A Quick C# Question: Sealed classes"
published: true
---
If you have a sealed class are all the methods inside the sealed class also typed as sealed.<p />I am asking this because I have some virtual functions inside an abstract class that I would like to seal, I don't want the class to be extended so sealing the class makes sense.  Therefore if I just seal the class can all the methods be considered sealed by the JIT'er or do I have to seal the methods too.<p />

