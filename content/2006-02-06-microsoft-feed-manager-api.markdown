---
date: 2006-02-06
published: true
slug: microsoft-feed-manager-api
summary: I'm puzzled why Microsoft's new Feed Manager API is COM-based instead of
  a managed API.  Given their push for managed code in Vista and .NET's excellent
  XML handling, a managed API for RSS (which is XML-based) seems logical.  It's frustrating
  to need interop to use this new feature.
tags:
- microsoft
- rss
- api
- managed code
- com
- .net
- vista
- xml
- interop
- feed manager
title: Microsoft Feed Manager API

---
Is it me or is the<a href="http://msdn.microsoft.com/library/default.asp?url=/library/en-us/feedsapi/rss/overviews/msfeeds_ovw.asp"> Microsoft Feed Manager API  </a>not a Managed API?  I have just read through it and it all seems to be COM based.<p />What has happened to Microsoft "policy" of creating nearly everything for Vista via Managed Code?  Additionally, condsidering RSS is XML and .Net Handles XML like nobodies business I would have thought a managed API was a no-brainer.  All this means that I have to Interop just to use this new feature.... give me a break.<p />Am I being silly?<p />

