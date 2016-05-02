---
slug: what-were-the-ux-issues-with-web-intents
date: 2016-01-17T13:20:32+01:00
title: "What were the UX issues with Web Intents?"
description: ""
image_header: "/images/noinstalls.png"
---

A question came up the other day in the office: "Everyone keeps saying Web
Intents died because of the UX, but no one has actually said what the issues
were". I looked back over a bunch of my notes and blog posts and it's
correct, I don't think we documented the holistic set of UX  issues that we
faced.

##### Wide array of actions and data types

We never optimized for the user intent and all were treated equally: Sharing
== Viewing == Picking == Editing == Any other intent, and this caused a number of
issues.  When the user triggers an action they are presented with a generic
box with a list of things that they could click and almost 0 context. There were no affordances
for the language and the phrasing of what we wanted the user to do.  If they 
wanted to "pick an image", we could have  displayed a little file
picker with a photo or something to that effect. Given the scope of all the 
possible user actions and data types it became impossible for us to make a
simple experience for the user. This is one of the reasons why I have suggested in the past that we
start small and solve one specific user action (Share perhaps),  solve that UX
and then focus on another and another and then try to generalize a solution
if one is required.

##### Expecting a return?

One specific issue was with how to wait for data return** &mdash; App A opens App B but 
needs data from a long running operation. If the user closes App A then there is 
no return path for the data and it will be lost. App B could save the data incrementally or 
locally but what you really wanted was some sort of stacking conntext so that you could 
return data from App B and it would be delivered to App A.  We didn't solve this. 

We could have made it so that apps opened modal, but that required a massive change to Chrome
and as we all know modality is bad on the web so that is out.

##### Knowing to expect data will returned

Android has `startActivityForResult` which has a very clear meaning for the developer requesting 
an action to be completed: Start this and expect a result back.  We didn't have this in the API
so we couldn't make any affordences for it in the UI.

We could have also made it explicit in the registration of the service so that it could say
"I can return data" so that the system can understand that a service wants to return data
and if a calling app expects only show those.  I have seen a lot of people have suggesting 
new APIs to solve this issue: using postMessage, custom protocols etc. The problem os that 
it creates a lot of choice for developers to make either designing their app or 
and every new option reduces the chance that a calling app

Which leads on to the next problem.

##### Open Intents == Lots of Schema and Protocols

By having an open way of registering for and triggering Intents meant that we had as many
different new APIs as the user could think of.  It turns out standardizing these is incredibly
hard.

Take sharing for instance, it seems pretty easy. Wrong. It depends on what you are sharing.
If you are sharing a link, a document, a movie or an image.  Each have different requirements
for how the data should be passed between the apps because every single data type will have different
types of meta-data that would be required.

Actually how do you defined the data-type for a link? Is it text/plain, text/uri-list or something else? 
I won't tell you how much we got caught up in just this one little area.

Best of all because it is an open ecosystem there is no way to enforce it so that neither the
apps that made the call or returned the data would have any confidence that any data was 
delivered.  If the app has no confidence the user will have no confidence and there is a 
massive UX breakdown there.

##### Always be picking

The user was in control of the app they used to complete an action, but that meant the user
 needed to make a choice every time an action was made by the users.  We had followed 
Android's model for Intents at the time &mdash; it was only later that Android allowed you to pin an Activity
to handle an Intent. 

In summary, there was a lot of steps to launch an app and the user couldn't 
set a default handler. 

##### Launching Apps

Not being able to set a default app was one problem, another problem that we faced is that
unlike on mobile, on desktop lots of users like to control how a site is launched, is it inline,
is it replacing a window, is it openging a new tab etc. 

We designed a way to target windows and the API then had either open in new window 
or embed in picker. There was a lot of choice for the developer and no control for the user 
and the user wouldn't know how any one experience would open, some sharing experiences 
would open a new window, some would just embed inline in the picker.

##### 0 confidence

We didn't provide a solution to the problem that `registerProtocolHandler`
also faces: No fallbacks. 

If there is no app installed that can handle the
users intent, you couldn't tell from the API and there were no clean ways to
default to a system experience or a chrome provided experience. When we
launched VIEW for RSS feeds intent we got rid of the default handler (which
was just display XML)  and this incensed the community although massively
opened up the RSS reader ecosystem and driving a  huge number of installs to a
couple of Apps that handled the Intent.  Developers need confidence that they
are not going to leave their users hanging or that they are going to have to
provide a solution themselves.

More specifically we had a way of falling back.  We developed a way to query
the Chrome Web Store for apps that could handle a certain intent. If there was
an app in the Chrome Web Store you  could then install it inline (I liked
this), there was however, little confidence in the  rating of the apps, why it
was ranked the way it was or what the App actually did.

Registration of Intents if there was an <intent> tag on the page was automatic
and wasn't  incredibly hard to spoof, we later then moved it to the Chrome Web
Store and the manifest.

The API was a new API thus had 0 ecosystem around it (hence my current looks
into intent: URI syntax).

Small piece of trivia. The logo used to indicate that a web app can handle a
specific protocol handler was actually the original Web Intents logo.

[Todo: Insert image]