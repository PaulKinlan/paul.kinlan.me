---
date: 2006-02-14
published: true
slug: a-quick-c-question-sealed-classes
summary: This blog post discusses whether sealing a class in C# automatically seals
  its methods as well. The author wants to prevent further extension of an abstract
  class with virtual functions. They wonder if sealing the class alone achieves this
  or if each method needs to be explicitly sealed.
tags:
- c#
- sealed class
- sealed methods
- virtual methods
- abstract class
- inheritance
- jit
title: 'A Quick C# Question: Sealed classes'

---
If you have a sealed class are all the methods inside the sealed class also typed as sealed.<p />I am asking this because I have some virtual functions inside an abstract class that I would like to seal, I don't want the class to be extended so sealing the class makes sense.  Therefore if I just seal the class can all the methods be considered sealed by the JIT'er or do I have to seal the methods too.<p />

