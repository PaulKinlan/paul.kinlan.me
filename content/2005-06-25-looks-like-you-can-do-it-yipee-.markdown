---
date: 2005-06-25
published: true
slug: looks-like-you-can-do-it-yipee-
summary: I found a way to dynamically load resource files for skinning XAML apps!  It's
  surprisingly easy. One method involves simply loading a resource and assigning it
  to the application. Another example demonstrates loading \"Style\" resources at
  runtime, allowing for dynamic visual trees and other customizations.  Check out
  the links for more details and code examples.
tags:
- xaml
- skinning
- resources
- runtime
- dynamic loading
- styles
- visual trees
- application
title: Looks like you can do it! Yipee!

---
I was looking around the Internet to see if anyone has automatically loaded a resource file so that you can skin an XAML app.<p />It turns out that it has been done and is quite easy.<p /><a href="http://www.dave5.com/blog/Trackback.aspx?guid=47778bf9-abaf-46a9-aeee-d37ae2658fbe">http://www.dave5.com/blog/Trackback.aspx?guid=47778bf9-abaf-46a9-aeee-d37ae2658fbe</a> shows a simple method (I think based on the link below).  Simply it loads a resource and then assigns it to the application.<p /><a href="http://blogs.msdn.com/mitchw/articles/68541.aspx">http://blogs.msdn.com/mitchw/articles/68541.aspx</a>: shows a more complete example of how to load a "Style" resource at runtime.  In the styles you can have new visual trees and the like that you would have in any application.<p />Some code to load XAML at runtime can be found

