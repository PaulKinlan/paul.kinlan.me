---
date: 2005-07-27
published: true
slug: c-3-0-xml-generics-again
summary: I explored the idea of C# 3.0 XML Generics based on Matt War's blog post.  I'm
  questioning the practicality of defining a generic from an XML Schema within the
  code itself, as it seems redundant compared to simply creating a class. However,
  the concept becomes more intriguing if the generic type could be derived from a
  streamed XML schema, offering dynamic type creation possibilities.
tags:
- C#
- '3.0'
- Generics
- XML
- Schema
- Matt War
- .NET
- Programming
title: C# 3.0 XML Generics Again

---
Now I am certain it was a joke! MattWar made a comment on his <a href="http://blogs.msdn.com/mattwar/archive/2005/07/24/442611.aspx">blog post </a>and one of his <a href="http://blogs.msdn.com/mattwar/archive/2005/07/24/442611.aspx#443661" rel="tag">XML Generics</a> examples' implies that a generic can be defined from an XML Schema.<p />If it is not a joke, I don't really see the point. The type is an XML schema that has to be defined in the code. Why not just create a class? If the type was based off an XML schema that could be streamed into then that might be interesting.<p />

