--- 
layout: post
title: "Living with Web Apps"
date: 2014-08-20 17:15
categories: browsers mobile webapps
---

As a Developer Advocate for Google Chrome and the Web it is my job to build a 
picture of how the Web works and educate developer on how to build for it, but 
also craft a vision for how developers should build for the future starting 
today.

I am a firm believer that we should be building and deploying apps on the web 
powered by a runtime that is the browser. The web offers a medium that is 
frictionless for user to engage with. A user can just visit your URL... you get 
it, but can we go day to day using just the web on mobile?

I decided to spend a day using only the web for all the tasks that people use 
their mobile phone for. No exceptions. Everything interaction that I do **must** 
be via the web.

**TL;DR — the 10 deadly sins of a mobile web app **— You can get stuff done, but 
there are a lot of rough edges that stop you from doing the things that you need 
to. Some of the issues are not anything the developer can do just yet, it is the 
platform that they are fighting against. Luckily, I know what is coming on the 
platform so I am very optimistic that the feature gap will be reduced for Apps 
on the web. 

Ultimately this experiment has shaped the way that I want us (Chrome Developer 
Relations) to get developers building for the web today and tomorrow. 

1. **It's not mobile**: Some of the newer services have good mobile web 
   experiences but there are huge areas where web developers still think desktop 
   first or desktop only.
1. **Lack of focus**: It sometimes feels like Web Apps are often considered as 
   documents with functionality in.  There is some functionality, then a 
   document thanking everyone who helped.  Play 2048 as an example.
1. **Discovery is a massive issue**: Finding great web apps is incredibly hard 
   and I have little confidence that they work well on mobile even when I see a 
   top link in Google.
1. **Everything is ephemeral**: This is great for a lot of experiences; I pick 
   up a site use it once and I am done. There are a huge number of apps — all 
   communications apps for example — where I need the app to live in the 
   background to be able to deliver notifications but they can't.
1. **It's not interconnected**: Everything appears to operate in a silo or 
   everything is tightly coupled to a service. I don't use dropbox, I use drive, 
   now I can't use your service to save my stuff.  I light-weight mechanism for 
   interconnecting apps would really help. 
1. **Everything is monolithic**: I found it incredibly hard to find small 
   self-contained mobile apps that just solved my problem without being a 
   service that I had to sign-up for and adopt. 
1. **Everything needs credential but nothing keeps credentials**: I have to 
   either create an account or re-sign in to everything all the time. I can't 
   tell if it is a hangover from the shared desktop era that means web apps must 
   be logged out after use. This is not something I experience in many mobile 
   apps. I log in once.
1. **It's slow and ugly out there**: There is a serious lack of polish in many 
   experiences; I had very little confidence that the apps would offer what I 
   wanted when I found them and when I used them there were a lot of jarring 
   animations and transitions.
1. **White screens rule the day**: Offline was not a big issue for me, however 
   white pages in transitions really annoyed me; I found myself just waiting for 
   the screen to load and getting frustrated when my entire UI was rebuilt.
1. **The platform has a lot of features, just not the right ones**: This is a 
   meta-point, but if feels like the API space on the web does not yet cater for 
   even the basic type of interaction with my device that I need; Notifications 
   and Push Messaging were greatly missed.

There are about apps that I want to build now. I am sorely tempted to start a 
movement getting people to build **good** utility apps.

## Journal: The Experiment

**11:30 PM — The night before the experiment**  
If I had been smart marketing type person I would have run this experiment on 
Wednesday, but alas I am a simple man with simple ideas.

The night before "Web App Thursday" — an evening I like to now call Shrove 
Wednesday, a day of native app gluttony —  I set up my home screen to launch the 
apps that I use regularly.

![My homescreen](/images/homescreen.jpg)

The first thing that I noticed is the inconsistent usage of launcher icons 
across all service. Services that you would expect to have good "app" icons just 
don't (notably all by the company that I work for — bugs have been raised) many 
services that I relegated to my 2nd screen didn't even have favicons.

It totally slipped my mind that I needed to replace the camera, dialer and SMS. 
Later when I realized to further compound my issues I had an existential crisis 
about the browser being a native app, but I chose to ignore that and keep this 
simple.

With my "workflow" set up I went to bed, watched some QI from the Netflix App 
that was integrated with my Chrome Cast. Bliss...
 
- - -  
**5:53 AM — Youngest son sits on my head to wake me up**  
Seriously. He sits on my head.  
Groggily I roughly remember something about only using the web today before I 
fall back asleep.

**6:00 AM — Web App Thursday. BZZZZ. BZZZZ. BZZZZ**

Alarm wakes me up. Trundle across to my phone to snooze the damn thing and start 
to feel optimistic about my day using only the web on my phone. Now I am not the 
sharpest fork on the shelf, but as I am walking to the loo (phone in hand) I 
realize that I have already failed. Alarm clock is a Native App.

Whilst I deal with the fact that I am a failure I notice that it is impossible 
to find web based alarm clock apps that work on mobile which kind of makes 
sense; There is no API yet that will let you background an app and get it to 
wake up at a specific time. However the more frustrating this is that even 
countdown timers are hard to find and when you do find them in search they are 
all aimed at desktop.

Some people have managed to get around the API issues by using Flash but:

1. Flash is not an option on mobile
1. You have to have the page always open
1. They are ugly

**6:15 AM — ...**  
**6:25 AM — The dead leg walk downstairs**  
Enthused that the rest of my day was likely to be gassing on Twitter or checking 
emails I reset my experiment status. 

At this point I also thought I need a shift in narrative; logging everything by 
time is a pain (I can't find a good app for it). Not only is it hard to write 
like this, but it also really hard to find an app that keeps a time ordered log 
of what happened and when.

It is a lot easier to write based on the tasks that I needed to complete during 
the day.

## Use cases

I took copious notes during the day of things that worked well and areas that 
were frustrating. I have broken the results down into use cases that were 
important to me.

### Being prompted at certain times

I found a couple of Countdown timers but that is about it. Alarms are pretty 
much standard on mobile devices so there is a question about the need to do this 
on the web.  I only wanted to do two things: 

* Set a quick alarm based on a fixed time
* Quickly set a countdown for X minutes

The latter we can do, but I can't find good apps.  The former can't be done when 
the browser is backgrounded.

### Note taking

I did a quick search for a note taking apps on the web and there were a few but 
interestingly my overriding need was something that I could just quickly start 
taking notes in.  I didn't want to sign up for services or cloud integration, I 
just wanted to start taking notes. 

I use Google Keep at work and have never tried it on the web on mobile but I 
thought I should give it a go I couldn't really find anything better quickly.

To my surprise Google Keep works quite well on the mobile web. With a couple of 
exceptions:

1. It can't run full screen like a native app, it doesn't even have a launcher 
   icon.
1. I can't share something to it (like a link) to create a note
1. The navigation bar Janks.
1. Offline... er, no.

### Communicating with People

A lot of my time on my phone is spent communicating with people. Email, Twitter, 
G+ and SMS are my main medium, voice less so. 

During the day Email (gmail in particular) worked well although it is out-dated 
in terms of modern web based UI's with some quirks in the typing experience and 
that focus highlighter is annoying.

Twitter also worked pretty well, I could post, DM and search. It launches 
fullscreen, it feels like an app (heck I can even load it offline) and it loads 
very quickly and provided 90% of what I needed. The web experience on mobile is 
still last years site, it doesn't look like any of the native mobile 
experiences.

Twitter and Email were the first apps that I noticed that the "ephemeral" nature 
of the web significantly hindered my ability to communicate with friends and 
family. Earlier in the day I had turned off system notifications and none of 
these experiences have the ability to live in the background and notify me when 
an interesting interaction occurs. After about 4 hours of a quiet morning I 
ended up turning them back on so at least I knew when I should check for 
updates.

The web is not fully integrated in to the native communication stack. There are 
no dialers. There are no Web based SMS apps and whilst you can just about create 
an SMS from the web, you can't send or read them directly via a web app.  I have 
an open question about 

### Reading News and Content

Hacker News and Reddit are terrible on mobile. Seriously, I don't get why they 
don't even try. I am being hard on Reddit because they have at least[ 
](http://reddit.com/.compact)[.compact](http://reddit.com/.compact) but they 
steer everyone away into apps.

I am an extensive user of Google Play Newsstand app on Android, it does a decent 
job of getting me the content I want to read both Purchased and also "web 
available". I had no idea what to expect checking this site on the mobile web 
and to my surprise I can read my subscription content but it is a bare bones 
experience, there is no 'text' mode (it is only images) and the gestures don't 
work the same.  I was disappointed to find that the "web article" reading mode 
is not supported at all.

Many news sites worked great (even if they did m.\* redirects).  None of them 
felt like "app experiences" and this is interesting because many news sites are 
reporting more engagement and reading inside apps.

### Watching Video and Listening to Audio

I watch a lot of video and listen to podcasts quite frequently and I wasn't 
expecting a huge amount in terms of mobile web experience.

I made sure that I used the mobile web version of YouTube.  It is a pretty good 
experience although it lacks the UX smoothness of the native app.  I did find 
that very frequently the browser wouldn't render any of the visible content (but 
would play the video) and I wasn't able to isolate the exact circumstances.

I was very pleased to find that Google Play Movies works even with protected 
content.  There were a couple of small scrolling issue left to right and the 
media player appears to be YouTube. Whilst the entire UI is very clunky and slow 
it works.

For podcasts Player.fm is my client of choice and it works pretty well on 
mobile. The audio plays even when I background the application, however there 
are no controls to let you play or pause the sound or even get back to the site 
easily once you have backgrounded Chrome.

### Camera

My two sons were doing something cute and I needed to take a photo quickly. As 
far as I can tell there are no "Camera apps" on the web for mobile, ones I found 
were optimized for desktop, used Flash and didn't save directly to my phones 
gallery.

Once I had taken the photos, I wanted to quickly crop the images and apply some 
filters to share them out. Yup. You guessed it. I couldn't find any apps that do 
this.  

This is one of the areas where I completely bailed on the web and it frustrated 
me.  I can't retrieve and modify the photo's on my device in a seamless manner.

I also took some time to think about how a developer might build the camera 
experience and naturally my first thought was to use "getUserMedia" API. If you 
look further into this API then it doesn't offer any [advanced features](https://code.google.com/p/chromium/issues/detail?id=343894) that you expect in a _good_ camera app: focus, flash, zoom etc. It is clear that this API 
has been designed for use in P2P applications and not as a dedicated camera 
experience.

### Gaming

I found **one** great game during the day that took up a good chunk of down 
time:[ ](http://buff.ly/1nLSjtT)[Game about Squares](http://buff.ly/1nLSjtT) is 
a brilliant, simple, mobile optimized game. Don't get me wrong, 2048 is a great 
game and it works on the mobile web however it has a very document feel to it.  
I found that games suffered all the same problems of Apps:  I can't find them, 
they feel like documents rather than apps and more often than not they are still 
desktop games.

## Pervasive Issues over the day

### Lack of Confidence

I really had no confidence in many of the apps that I found. 

* Some experiences I wanted them to load instantly when launched, the white 
  screen for loading felt like I was gambling at every moment.
* I got a white screen so frequently it got really frustrating when 
  transitioning between pages that I couldn't tell if it was Chrome or the App 
  that is causing the problem or just the way we build apps.
* I had no idea that any of the apps would do what I wanted.

### White screens follow me around everywhere 

In nearly every app and site I used I felt like the majority of my time was 
spent waiting for content to load. It was really frustrating, when I use native
apps I very rarely get this.  Whilst I see in natvie apps that there are placeholders
for the content to load I still get to see the entire app UI.

### Jank/Stutter is pervasive 

Watching UI elements move on the screen was toe-curling.   Navigation trays 
seemed to be a big offender during the day.  I would often click on the tray 
icon, wait, and then see a 4fps animation.

That being said, there are some sites that work really well.  The twitter app 
and g+ app both have really great scrolling on my phone.

### Notifications 

I knew going in to this that we don't have background push messaging and 
notifications, but it is not until you don't have them do you realise it is one 
of the primary ways that you engage with your applications on your device.

### Form filling

I tried to book my hotel that I stay in during the week on mobile.  I had to 
bail and go to desktop, it was terrible.  The site wasn't optimised for mobile, 
but at the same time I was just cautious anytime that I had to enter text.

### Sharing Content

There are lots of things that I create on my phone every day and I can't share 
them with any web services.  When I took a picture of the kids I was forced to 
take the photo with an app and share it via an app.  Likewise when I wanted to 
share something from the browser I couldn't share it to any other web 
experience, I kept having to share it to a native app.

Add to this Chrome is pretty poor at sharing content natively.  You can't long press on 
images or links and share them out (these were the only things I needed to share 
in the day).

### Lack of basic device interaction

I get that we have access to geo-location and device orientation, but I also 
found that I wanted to do simple things such as selecting and saving images to 
and from my photo gallery in a near seamless fashion and I couldn't do it.  If I 
was playing audio on a page I would have loved to be able to control that from 
the lock screen and I couldn't do it, I had to go tab hunting.  I also really 
wanted to have a camera app that I could trust and do basic actions on (focus 
and flash) and I couldn't do it.

### Discovery

It is hard to find apps.  It is even hard to find good apps that work well.  It 
felt impossible to find good apps that work well and have a nice user 
experience.  I had to rely on my social network to find apps.  Search sometimes 
did find web apps for some common use-cases, but it doesn't rank quality.  Both 
the Chrome Web Store and Firefox marketplace are not great, CWS is impossible to 
navigate on mobile, FF is a lot better.  Neither let you launch a hosted web app 
directly from an app result.  

This was so frustrating, the only places that I  know has apps and I can't do anything 
with it.

### Lack of small utilities

Most of the time I wanted some small apps to help me complete a task, these 
might exist, but even after deep searches for them the utilities are primarily 
desktop only, horrible user experiences, large services that need registration 
or they don't exist.  There are about 20 simple core utility apps that we should 
build on the web and market them as "the primary" web experiences.
