--- 
layout: post
title: "The future of communications apps is on the web"
date: 2014-08-20 17:15
categories: browsers mobile webapps communications serviceworker
---

SMS is dying. WhatsApp, Line, WeChat, SnapChat and many others are making it 
easier to talk to friends, families and groups. A common feature across these 
apps is: They are all on native platforms and are on the web only to drive users 
to their native app install pages.

[Insert image of download pages.]

I have spoken to a lot of developers about why their apps are only on native 
platforms, and to users about the [features that 
they](http://www.google.com/insights/consumersurveys/view?survey=brtdoucbr2hje&question=2&dataGen=87&tb=rt) 
need and it comes to several key areas: Installability for permanence, 
engagement via push notifications, payments and "it's where the users are".  The 
web for a lot of developers is just a tool to drive users to your installation 
page in the store. 

But what if you didn't have to convert your user into an installed user, your 
user's are already a real user the minute they land on your page?

2015 is the first year where the web stops being just a funnel to an app install 
page. 2015 is the year where the web is an accelerant of growth.

The web in 2015 will offer developers and users two huge benefits:

* **Increased methods for engagement ** &mdash; at the heart of it, the technology is 
  in the browser today and the near future that means we can offer the same 
  features as a native experience.
* **Low friction for user acquisition** &mdash; given a link, a new user could be 
  using the app within seconds, instead of having to go to a market, wait for 
  the download, and then for the app install to happen.

There are a number of features that users expect an app to be able to perform 
for it to be useful:

* **Presence** &mdash; a user must have the confidence that a web based 
  communications app lives on your device. If the user wants, it shouldn't just 
  be a link the user has to open in the browser to start using. It should launch 
  like all apps on your device: from the home screen.
* **Persistence** &mdash; a user must have the confidence that a web based 
  communications apps will be available to work wherever they are. If there is 
  no internet connection, it must still load and present all previous 
  communication and message creation tools.
* **Integration** &mdash; a user must have the confidence that they will never miss 
  anything. Their friend sends them a message, it should notify them of the 
  status via notification exactly as they expect irrespective of if the browser 
  window is open or closed.
* **Media Access** &mdash; a user expects to be able to communicate in mediums 
  other than plain text, they should be able to access the camera, the photo 
  gallery and audio.

The question is: the web is ephemeral with pages being born when a URL is opened 
and dying when the user closes the browser and has little to no access to the 
hardware, how can you get the **Presence, Persistence, Integration, **Media 
Access** (It's been noticed that an acronym for this is A PIMP) required to 
build a next generation communications app? 

Answer: Service Worker and the recent additions to the web platform.

**Presence** — Web App Manifest gives you the entry point into your web app 
and defines how it appears when installed on the system and registration of a 
Service Worker (even a Service Worker that does nothing) means that your web app 
can live in the background asleep and only to be woken when the device needs it 
to be.

**Persistence** &mdash; A Service Worker registration can control and manage every 
request that comes through the web app, this gives an unprecedented level of 
control, we can store the UI and logic permanently and cache the data in the app 
locally, sync back up from the server if required.

**Integration** &mdash; The most interesting area. You will, via Service Worker, be 
able to manage push messaging to your app. Think of this as telecoms signaling. 
Your web app can be asleep before being woken up by the devices push messaging 
service to process the data in the payload. From here you could choose to 
synchronise data in the background so it is fresh and available to the user when 
they next open the app, or trigger a notification to alert the user that they 
need to take action.

**Media Access** &mdash; WebRTC has brought us access to the users microphone and 
camera (with permission) and also a real-time bridge directly to the people we 
want to talk to.  Services like FaceTime and Skype are entirely possible in the 
browser.

At the core, we have fixed many of the big issues.  Today you can go and build 
WhatSnapChap just on the web and it can compete with the majority of 
communications apps today but there are some areas that still need to be 
improved:

* **Contacts Access** &mdash; Many communications apps have access to your address 
  book either so you can send a link to them directly via SMS or email, or so 
  that function can be delegated to the service and used to find other users on 
  their service that you know.
* **Ubiquity** &mdash; Your site will be accessible by anyone who can hit the URL, you 
  have to be happy with that fact that not everyone will be able to use every 
  feature of your app, but they should still be able to access it.  Maybe you 
  don't have push notifications for Gingerbread users on Android browser, but 
  they should still be able to read messages that were synced from a server.  
  It's a choice you will have to make.
* **Payments** &mdash; Web apps aren't yet built into the devices payments 
  platforms so as a developer you have to integrate many third party payments 
  systems, this can present a burden to the developer but also can confuse the 
  user, however when considering the American audience that I asked, Payments 
  weren't a large feature.

The web that we had yesterday was never capable of even trying to take on the 
capabilities of a native application.  Technology is it can, and the web can 
provide a vastly smoother user on-boarding experience. Can I build a SnapChat? 
Yes, absolutely.