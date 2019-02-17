---
slug: google-search-create-a-dsl-connection-in-c-
date: 2006-01-20
 
title: "Google Search: create a dsl connection in c#"
published: true
---
A visitor to my site came from google with the following query: "create a dsl connection in c#".<p />My short answer to this would be that you can't create a specific dsl connection in c#.  You just create TCP connections like you would in any programming and Windows will manage what network interface it will go over.<p />look in to System.Net.Sockets and System.Net to see what you can do.  Its not a great answer but I hope that it helps.<p />

