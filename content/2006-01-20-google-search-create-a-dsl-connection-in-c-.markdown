---
date: 2006-01-20
published: true
slug: google-search-create-a-dsl-connection-in-c-
summary: This post addresses the Google search query \"create a dsl connection in
  c#\". It clarifies that C# doesn't create DSL-specific connections. Instead, you
  use standard TCP connections via System.Net.Sockets and System.Net, relying on Windows
  to manage the network interface.
tags:
- c#
- dsl
- networking
- tcp
- system.net
- system.net.sockets
- windows
title: 'Google Search: create a dsl connection in c#'

---
A visitor to my site came from google with the following query: "create a dsl connection in c#".<p />My short answer to this would be that you can't create a specific dsl connection in c#.  You just create TCP connections like you would in any programming and Windows will manage what network interface it will go over.<p />look in to System.Net.Sockets and System.Net to see what you can do.  Its not a great answer but I hope that it helps.<p />

