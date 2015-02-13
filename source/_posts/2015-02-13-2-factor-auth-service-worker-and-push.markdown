--- 
layout: post
title: "2 Factor Auth for physical transactions with Service Worker and Push Notifications"
date: 2015-02-11 08:15
description: "Is it possible to build a 2 factor authentication system on the web? I think it is."
categories: browsers mobile webapps 
---
I will always have a soft spot for Fraud Detection, it was my first "big corp" 
software engineering role and I learnt a lot about building scalable systems and 
"intelligent" systems. 

One of the areas that I researched at the time was connecting a person's online 
location to their application, in this case it was simply making sure mortgage 
applications where tied to the UK (simple IP address check-ups worked pretty 
well). When I moved to a telecom's service company, we were researching 
out-of-band auth and geo-location for credit card transactions. The idea was 
simple, send the user an SMS when a purchase happens and get them to click on a 
link to validate 1) they agreed to the transaction, 2) roughly locate the user 
to their IP location, or if we were lucky use the geolocation API's (we also 
tried to do cell tower lookups, but they were astonishingly expensive).

That's why I was interested when I saw [Visa's Mobile Location Confirmation](http://www.mobilecommercedaily.com/visa-leverages-geo-targeting-to-enhance-travelers-card-payment-experiences)**  
 service.

I am not yet sure if this is all done in the background (i.e, no user prompt), 
however if it requires a user gesture, this system is entirely possible to build 
on the web especially with [Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) and [Push messaging](https://gauntface.com/blog/2014/12/15/push-notifications-service-worker).

The way that I imagine it working:

1. User is on their banking site. It registers a ServiceWorker and requests 
   access to push you notifications and also requests access for their Geo 
   location.
1. Bank registers user on the back end with the Visa system
1. Any transaction that occurs on the card, it sends a push notification to the 
   phone.
1. Service Worker sends a `fetch` to the server, the IP address is picked up 
   and Geolocated.
1. Service Worker posts a notification to the phone to alert the user
1. User clicks on it and opens up a page (for the bank), confirms transaction, 
   geo-location is picked up and sent through to Visa to corroborate the IP 
   address look-up and the physical location of the point of the transaction.
1. Transaction is either accepted, declined, or put into a queue for further 
   checks.

I think this process is pretty cool, the user gets two factor authentication (or 
maybe it is three factor when you combine in location).

