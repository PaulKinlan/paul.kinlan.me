---
slug: sockets-usecases-on-the-web
date: 2016-08-12
title: "Use-cases for sockets API on the web"
---

Owen Campbell-Moore, one of Chrome's PM's for Progressive Web Apps and new APIs asked the following question, and
instantly Surma (that is the only name we know for him) said "Sockets"

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/owencm">@owencm</a> Network connections. Like writing an SSH client as a PWA.</p>&mdash; Surma (@DasSurma) <a href="https://twitter.com/DasSurma/status/763904521441570816">August 12, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I also threw in my two pennies, and Marcos Ceres asked for use-cases.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/annevk">@annevk</a> <a href="https://twitter.com/Paul_Kinlan">@Paul_Kinlan</a> <a href="https://twitter.com/DasSurma">@DasSurma</a> <a href="https://twitter.com/owencm">@owencm</a> I&#39;d still be interested in a good list of fun things that people want to build but can&#39;t.</p>&mdash; Marcos Caceres (@marcosc) <a href="https://twitter.com/marcosc/status/763995753354178564">August 12, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

So here is a list of Apps that people have told me they want to build to host inside a browser.  It includes 
client apps but also Services and Servers.

### Outgoing connections

The TL;DR is anything normally has to proxy and convert web requests via a web server to another host.

* E-mail client connecting directly to IMAP server, POP3, SMTP without a HTTP/WebSocket bridge
* SSH client - to connect to a server without relay
* RDP client
* IRC client - again to connect directly
* FTP client (and other file transfer clients)
* Video Streaming client - connect directly to RTMP server.
* BitTorrent client (needs incoming data too)
* XMPP Client
* Connect to Bitcoin/Blockchain server
* Multicast client (and server) to stream video to everyone on the Network
* MDNS Discovery service to discover local devices
* Connect to a time server
* Direct connect to MQTT server.
* ADB over Wifi - Someone wanted to use Cyanogen's way of debugging their Android device and connecting to it
* Connect to DNS service and query it, was to be used for verifying that a record had been set to prove ownership
* Many games that have multiplayer.

### Incoming connections

Mostly the TL;DR here is, a server for everything in the above list.

* IRC server
* BitTorrent client
* HTTP Server for simple local testing.
* HTTP Server to host electron style apps (where the server and client are distinct)
* SMTP service (yes - people have asked me that they want to host this in the browser)

If you have any other examples let me know and I can include them here.
