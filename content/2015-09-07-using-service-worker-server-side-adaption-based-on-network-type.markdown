---
slug: using-service-worker-server-side-adaption-based-on-network-type
date: 2015-09-07T12:20:31+01:00
title: "Using Service Worker for server-side adaption based on network type"
description: "On the web determining and adapting to network type the user is on is incredibly hard. Until now."
---

Following on from my [anecdote about India and developers needing to specialize their sites
for 2g networks](/the-web-in-india-anecdote-3/), I wanted to send network type information 
through on each request so that sites could be responsive to the users network situation, but noted that
 it wasn't possible. Well, Ilya Grigorik pinged me and there were three points he made (see 2-4, I made up point 1.)

1. Ilya is ahead of his time, [he talked about using Service Worker to add Client Hints](https://www.igvita.com/2014/12/15/capability-reporting-with-service-worker/)
   almost a year ago!
2. The Network Information API is in the SW context
3. [MaxDownlink Speed looks like it might now be getting some love](https://code.google.com/p/chromium/issues/detail?id=527449)
4. You can send some network information through to the server by using Service Worker

The ability for you &mdash; the web developer &mdash; to control every network request that 
goes through your page with Service Workers is _incredibly_ powerful especially if you have extra
 client-side information available to you inside the service worker context.
 
Prior to Service Worker the only way that you could annotate each web request made by your page
was to dynamically create the request with a unique URL describing the network type. For example, for any XMLHttpRequest
you could add a custom header, or if you wanted to return a custom stylesheet you would have to 
dynamically insert a `<link rel=stylesheet>` into your page with a custom query string parameter. 
All of these solutions required custom JavaScript to run in the context of your page and would
either block the page from rendering or it would cause a FOUC (Flash of Unstyled Content).

Now with Service Worker you can remove the in-page hacks and simply detect the type of network 
that the user is on for every request that is sent through from the page as follows.

    self.addEventListener("fetch", function(event) {
      var requestURL = new URL(event.request.url);
      
      var dm = 0;
      var navType = "unknown";
      
      if(navigator.connection && navigator.connection.downlinkMax !== false) {
        dm = navigator.connection.downlinkMax;
      }
      
      if(navigator.connection && navigator.connection.type !== false) {
        navType = navigator.connection.type;
      }
      
      if (requestURL.origin == location.origin) {
        // append the MD header, set value to NetInfo's downlinkMax:
        // http://w3c.github.io/netinfo/#downlinkmax-attribute
        event.respondWith(
          fetch(event.request.url, {
            headers: { 
              'MD': dm,
              'Network-Type': navType
            }
          })
        );
      }
    });
   
The above code determines if the user is on any of the following types of networks: cellular, wifi, 
other, none, unknown, bluetooth, ethernet, wimax; and then adds this information to a custom HTTP header 
called Network-Type.

This is extremely useful because today I can differentiate easily between low-latency networks
(Wifi and ethernet) and high latency networks such as a mobile (cellular) network.  It's a great
first step but it's not everything that we would need to be truly responsive to bandwidth and 
latency.  That requires `downlinkMax`.

When `downlinkMax` becomes available to browsers in the NetInfo API it will finally let all
developers control what they send back to the client based on an estimation of the current (theoretical)
maximum network speed of the user.

I have this code running live on my site right now and whilst my site doesn't need a whole lot of adaption, 
but I do plan on serving up highly compressed images over mobile, so that will be the first thing that I do.

I would suggest if you are building sites that are for markets (maybe India as an example) you to serve
up content differently based on the network type then this method of annotating your requests can
be very useful.