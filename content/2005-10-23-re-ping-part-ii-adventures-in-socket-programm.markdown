---
date: 2005-10-23
published: true
slug: re-ping-part-ii-adventures-in-socket-programm
summary: Part two of my C# Ping tutorial is now available!  This installment dives
  into the structure of Ping packets and their place in the communication stack.  It
  explores the fundamentals of how ping works, from sending echo packets to receiving
  echo responses and using response time to determine network connectivity.
tags:
- c#
- ping
- tutorial
- socket programming
- networking
- .net
- system.net
title: 'RE: Ping Part II: Adventures in Socket programming using System.Net'

---
The second part of the C# Ping Tutorial is up.  At the moment it doesn't have much in the way of solid implementation, but this is a series of posts so expect more.  It is quite a good post because he talks about what Ping packets look like and where they are on the communications stack.<p />Anyway to quote the post.<blockquote class="posterous_medium_quote">Let us start out by looking at requirements of the Ping client. Basically, the task of the tool is to find out if a specified server is alive, and on the network. The way it achieves this is by sending an echo packet to the server. The server responds with an echo response. If the server responds within a certain time interval, then we can assume that there is network connectivity from the client to the server. If it doesnt respond, then it could indicate a variety of things that could be wrong</blockquote><i>[Via [MSDN Blogs](http://blogs.msdn.com/feroze_daud/archive/2005/10/23/483976.aspx)]</i><p />

