---
date: 2006-02-10
published: true
slug: microsoft-feed-manager-events-example
summary: I had trouble getting the GetWatcher method of the Feed Management API to
  work. Thanks to Matt Dotson's code on GotDotNet, I resolved the issue. The problem
  was a casting error; I was casting to FeedsWatcherClass instead of the IFeedEvents_Event
  interface. The corrected code now successfully attaches the watcher to the feed
  and handles FeedItemCountChanged and FeedDownloadCompleted events.
tags:
- Microsoft Feed Manager
- Feed Management API
- GetWatcher
- IFeedEvents_Event
- C#
- .NET
- Interop
- FeedsWatcherClass
- FeedItemCountChanged
- FeedDownloadCompleted
- Matt Dotson
- GotDotNet
title: Microsoft Feed Manager Events Example

---
Thanks to Matt Dotson, who gave some code up on GotdotNet that shows how to get the GetWatcher in the Feed Management Api to work.<p />I had a problem the other day with it.  I couldn't get the Watcher attached to the feed.  It was a simple casting problem and my misunderstanding of Interop.<p />Here is my code<p />FeedsManagerClass fmc = new FeedsManagerClass();IFeed f = (IFeed) fmc.GetFeed("Internet Explorer Team Blog");           <strong><em>IFeedEvents_Event</em></strong> ife = (<em><strong>IFeedEvents_Event</strong></em>) f.GetWatcher(FEEDS_EVENTS_SCOPE.FES_ALL, FEEDS_EVENTS_MASK.FEM_FEEDEVENTS );ife.FeedItemCountChanged += new IFeedEvents_FeedItemCountChangedEventHandler(ife_FeedItemCountChanged);ife.FeedDownloadCompleted += new IFeedEvents_FeedDownloadCompletedEventHandler(ife_FeedDownloadCompleted);f.Download();<p />Now my code works.  I was casting to an FeedsWatcherClass rather than the IFeedEvents_Event interface.<p />Silly me.<p />

