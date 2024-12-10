---
date: 2005-06-25
published: true
slug: changing-styles-with-the-times-answers-and-th
summary: I've been discussing how to load styles and new UI designs into an Avalon
  application, specifically focusing on the challenge of connecting the UI to the
  code-behind class when loading XAML at runtime.  While the XAML loader can parse
  properties, it doesn't automatically handle event delegate generation and element
  naming like compiled code/BAML. One idea is to have UI designers create BAML, allowing
  the app to load new compiled XAML and use the same code-behind class.  Another approach
  involves designing multiple layouts sharing the same code-behind class.  I'm also
  exploring loading a XAML file with resources at runtime and assigning them dynamically.  More
  to come on my findings!
tags:
- Avalon
- XAML
- UI
- Styles
- Runtime
- BAML
- WPF
title: Changing Styles with the times (Answers and Thoughts)

---
I had a really good set of conversations about the issue of loading styles and new UI designs into an Avalon app. Thanks go out to Micheal Latta and Jason [MobiForm]<p />Here's some of the conversation and some comments I have around them.<p /><blockquote class="posterous_medium_quote"><p>It is certanly possible to load different UI controls into a window at run-time. AVPad does this now to a degree. The real issue is going to be hooking the UI up to the code behind class(es). Loading XAML at runtime will not benifit from the event delegate generation and element naming that exist in the compiled code/BAML combination. If the XAML loader parses all properties and retains those as properties at run-time you could do a pass on the parse tree to hook these things up at run-time. I expect to see many applications offering this type of pluggable UI model as Avalon sinks into the developer community. --Michael</p></blockquote><p>Essentially what is being implied here is that you can load up XAML at runtime but you will have to re-hook up the properties and the events at run-time because the loader. However, I have been thinking that getting the people who change the UI to create BAML is not all of a problem really. Therefore the app will be able to load a new compiled XAML file and use the same UI class on the backend.</p><p>An example might be we design two layouts each different from each other however they both share the same code-behind class:</p><p>&lt;window class="AvalonApplication1.Window1" xmlns="http://schemas.microsoft.com/winfx/avalon/2005" x="http://schemas.microsoft.com/winfx/xaml/2005" text="AvalonApplication1"&gt;<p />&lt;window class="AvalonApplication1.Window1" xmlns="http://schemas.microsoft.com/winfx/avalon/2005" x="http://schemas.microsoft.com/winfx/xaml/2005" text="AvalonApplication2"&gt; </p><p>This might work, I haven't tried it yet. </p><p>I am looking into loading a <a href="http://www.kinlan.co.uk/2005/06/changing-styles-with-times.html" rel="tag">XAML</a> file that simply contains resources at runtime and then assigning them also at runtime. I will let you know of the results.</p>

