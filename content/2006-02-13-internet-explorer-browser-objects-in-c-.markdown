---
date: 2006-02-13
published: true
slug: internet-explorer-browser-objects-in-c-
summary: I've found some useful resources for C# developers working with Internet
  Explorer. Rich Crane's code provides a framework for .NET interaction with IE, handling
  the COM interop for you.  While the framework looks promising, it seems to have
  limited browser event support.  For more comprehensive IE integration, including
  toolbars and shell extensions, check out Sky Software's EZShellExtensions.Net and
  Shell MegaPack.Net. These support .NET versions 1.0 through 2.0.
tags:
- internet explorer
- c#
- .net
- com interop
- browser extensions
- shell extensions
- ezshellextensions.net
- shell megapack.net
- rich crane
- sky software
title: Internet Explorer Browser Objects in C#

---
<a href="http://blogs.msdn.com/rich_crane/archive/2006/02/12/530446.aspx">Rich Crane</a> reports that he has posted the Code to Internet Explorer Browser Modules along with some examples.<p />It looks like a pretty cool framework for getting .Net to interact with Internet explorer. I can't wait to have a play, and not have to worry about me handling all the COM interop etc [it is already done in this framework]. I did notice that the number of Browser Events that are available seems to be less than what IE exposes. Maybe I am wrong though.<p />Staying on the subject, <a href="http://www.ssware.com">Sky Software</a> who produce <a href="http://www.ssware.com/ezshell/ezshell.htm">EZShellExtensions.Net</a> and the <a href="http://www.ssware.com/megapack.htm">Shell MegaPack.Net</a> have produced new versions of their software for developers. The EZShellExtensions.Net software allows you to create Internet Explorer toolbands and Internet Explorer vertical and horizontal bands and <a href="http://www.ssware.com/ezshell/shots.htm">most things</a> you would want to do via Shell Extensions in .Net. The ShellMega pack is a collection of their own Shell Extensions that they have created ready for you to use.<p />Both packages support VS.Net 2002 - 2005 so that means it supports the .Net framework v1.0 - v2.0, whilst Rich Cranes project only supports VS 2005 from what I can tell. The prices of the product is quite reasonable for the stuff you get.<p />

