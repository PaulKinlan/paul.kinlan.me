---
date: 2005-11-24
published: true
slug: google-search-c-instanceof
summary: This post addresses the search query \"c# instanceof\" by clarifying that
  C# uses \"is\" and \"as\" keywords instead of \"instanceof\" for type checking and
  casting.  The \"is\" keyword checks an object's type, while \"as\" performs a safe
  cast, returning null if the cast fails, unlike an explicit cast which throws an
  exception.
tags:
- c#
- instanceof
- is
- as
- type checking
- casting
- csharp
- programming
- .net
title: 'Google Search: c# instanceof'

---
A couple of people have come to my site with the query "c# instanceof". I know how I get found for this. I copied an "instanceof" javascript method and talked about it in one of my entries.<p />The only relation to c# that I can think of would be the "is" and "as" keywords.<p />"is" can be used to test what type of object an object reference is. For instance [no pun intend, or thought of I think :)] a developer could write:if(m_car is MiniCooper){...<p />they would be saying that if the m_car variable is of the type MiniCooper then do something.<p />The "as" keyword is used to "cast" a type to another type. So you could write<p>if(m_car is MiniCooper){MiniCooper mc = m_car as MiniCooper;</p><p>The "as" keyword is slightly differnt to the Explicit cast (MiniCooper mc = (MiniCooper) m_car; because if the cast dosn't work with an "as" then the mc local variable will be null, rather than throwing an "InvalidCastException".</p><p>I hope this helps.</p><p />

