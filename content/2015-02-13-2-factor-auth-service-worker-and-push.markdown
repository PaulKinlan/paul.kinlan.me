--- 
layout: post
title: "2 Factor Auth for physical transactions with Service Worker and Push Notifications"
description: "Is it possible to build a 2 factor authentication system on the web? I think it is."
image_header: /images/card.jpg
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

That's why I was interested when I saw [Visa's Mobile Location Confirmation](http://www.mobilecommercedaily.com/visa-leverages-geo-targeting-to-enhance-travelers-card-payment-experiences)  
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


**Image by [Håkan Dahlström](https://www.flickr.com/photos/dahlstroms/5532389673/in/photolist-9qSWGR-mMfT1o-9WvRRK-5Me5QT-5YFXZz-5TzmbB-miB55-9XGecF-6Xjqjk-4omzhv-9PUh4s-9MLroZ-f26jzH-8BWFpF-9yfYsd-hjAfCC-5PHfun-99Ksnp-kDst8M-ajSWDV-8nhMhE-fmGcDP-5PHfur-5PHfuR-aAQUaM-6XjnD4-6Xoi1q-6XjjpZ-6Xoqz7-2U5fHu-f5T8Wa-nQJ1Pk-nSvuJa-nQEdeb-nQqU5t-eSyYrX-74ERke-coTqB7-ifzi1S-ifCv6N-ifzejJ-9GsSdM-5PFq78-2mpRbt-5wodeb-dSZe91-atMsa1-5PFcqc-dPcqJ1-bP8Pwz)**
