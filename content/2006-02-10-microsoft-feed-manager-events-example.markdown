---
slug: microsoft-feed-manager-events-example
date: 2006-02-10
 
title: Microsoft Feed Manager Events Example
published: true
---
Thanks to Matt Dotson, who gave some code up on GotdotNet that shows how to get the GetWatcher in the Feed Management Api to work.<p />I had a problem the other day with it.  I couldn't get the Watcher attached to the feed.  It was a simple casting problem and my misunderstanding of Interop.<p />Here is my code<p />FeedsManagerClass fmc = new FeedsManagerClass();IFeed f = (IFeed) fmc.GetFeed("Internet Explorer Team Blog");           <strong><em>IFeedEvents_Event</em></strong> ife = (<em><strong>IFeedEvents_Event</strong></em>) f.GetWatcher(FEEDS_EVENTS_SCOPE.FES_ALL, FEEDS_EVENTS_MASK.FEM_FEEDEVENTS );ife.FeedItemCountChanged += new IFeedEvents_FeedItemCountChangedEventHandler(ife_FeedItemCountChanged);ife.FeedDownloadCompleted += new IFeedEvents_FeedDownloadCompletedEventHandler(ife_FeedDownloadCompleted);f.Download();<p />Now my code works.  I was casting to an FeedsWatcherClass rather than the IFeedEvents_Event interface.<p />Silly me.<p />

