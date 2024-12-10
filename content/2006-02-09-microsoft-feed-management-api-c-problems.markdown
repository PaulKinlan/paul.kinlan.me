---
date: 2006-02-09
published: true
slug: microsoft-feed-management-api-c-problems
summary: I'm having trouble using the Microsoft Feed Management API in IE7 Beta 2.
  Specifically, I can't create a FeedFolderWatcher object to track feed item count
  changes.  The error I'm getting suggests the required COM class (CLSID {281001ED-7765-4CB0-84AF-E9B387AF01FF})
  isn't registered on my system.  I'm looking for help troubleshooting this issue.
  Is it an installation problem, or is there a broader problem with the API itself?  Any
  insights or code examples (especially a C# screensaver example) would be greatly
  appreciated.
tags:
- Microsoft Feed Management API
- MFM
- IE7
- C#
- COM
- FeedFolderWatcher
- CLSID
- Error 80040154
- RSS
- Feeds
- Troubleshooting
title: Microsoft Feed Management API c# problems

---
I am trying to use the Microsoft Feed Management API in IE7 Beta 2 and I am trying to hook up the a feed watcher event to see when the counts of items in a feed change.<p />However, I can't get past the following line:FeedFolderWatcher fwc = new FeedFolderWatcherClass();<p />I get the exception:Retrieving the COM class factory for component with CLSID {281001ED-7765-4CB0-84AF-E9B387AF01FF} failed due to the following error: 80040154<p />Which from what I can tell the CLSID is not installed on my system.<p />What can I do?  Is this an install problem or a problem with the MFM API?Does anybody have the full screen saver c# example so that I can see what is going on?<p />

