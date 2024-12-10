---
slug: generated-web-apps
date: 2024-09-23T08:53:00
title: Generated Web Apps
published: true genai
- llm
draft: false
tags:
  - web apps
  - generated apps
  - genai
  - llm
  - repl.it
  - websim
  - python
  - flask
  - sqlite
  - postgres
  - javascript
  - webgl
summary: "A collection of generated web apps built using various tools like Repl.it and WebSim.  Repl.it apps include an image analyzer, time zone tracker, rude name checker, image generator, blood pressure tracker, media logger extension, 'The Critic v2', and a countdown timer.  WebSim creations include a 3D globe, a travel site about Lake Toya, and both 2D and 3D space gravity simulators.  Repl.it's preference for Python, Flask, and sqlite, especially the latter due to its apparent overwrite issue upon deployment, is noted.  A preference for Postgres is stated."
---

Following on from my post about the \"[disposable web](https://paul.kinlan.me/the-disposable-web/)\" and building things just for me, I thought it might be useful to collate an evergreen list of all the things that I\'m building (and their code) so that you can see some of the things they do and inspect the code that is produced (I am expecting that there are issues and if you spot any, it would be good to highlight them)

For as much as possible, I try not to change any of the code.

[**Repl.it**](http://Repl.it "http://Repl.it")

* [Image Analyzer](https://image-analyzer-paulkinlan.replit.app/ "https://image-analyzer-paulkinlan.replit.app/") [[code](https://github.com/PaulKinlan/imageanalyzer/commits/main/ "https://github.com/PaulKinlan/imageanalyzer/commits/main/")] - I sometimes need to extract information from images and I just wanted a tool I trust (and also see how well it works with Google Cloud APIs - quite well)

* [TimeZone Tracker](https://replit.com/@paulkinlan/TimeZoneTracker "https://replit.com/@paulkinlan/TimeZoneTracker") [[code](https://github.com/PaulKinlan/TimezoneTracker "https://github.com/PaulKinlan/TimezoneTracker")] - This is simple tool that lets me set up time zones so that I can plan meetings. There are sometimes that I had to step into intervene, like when I asked it to make it a PWA and it kept auto generating the icons (I had my own), or when I couldn\'t get the log into persist (turns out it was the WebView iframe)

* [Rude name checker](https://rude-check-app-paulkinlan.replit.app/) - I've launched products that have names that might mean something rude in another language. I just wanted to see if I could build something simple that might help people. I still remember launching [FriendBoo](https://thenextweb.com/news/wanted-micropodcast-friendfeed-friendboo) and being told that in some languages Boo is the sound of a fart!

* [Image Generator from Prompt in a URL](https://image-gen-paulkinlan.replit.app/) - I really like placekitten, where you can just put in url and get an image. I hadn't seen anyone create a thing where you include the URL + prompt and get an image e.g, [https://image-gen-paulkinlan.replit.app/generate/a+beautiful+landscape+with+mountains+and+a+lake](https://image-gen-paulkinlan.replit.app/generate/a%20beautiful%20landscape%20with%20mountains%20and%20a%20lake) (presumably, because it costs money)

* [BloodPressureTracker](https://pressure-tracker-paulkinlan.replit.app/) [[code](https://github.com/PaulKinlan/BloodPressureTracker)] - A recent health scare has made me need/want to track my blood pressure. I'm not ready to use a full app yet, so this simple interface works for me. It's more robust than a spreadsheet.

* [Media Logger Extension](https://github.com/PaulKinlan/MediaTrackerChromeExtension) - This is a Chrome Extension that records when the user navigates to a page with Audio or Video media and allows you to go back to it and interact with it. I'm a visual and aural person so I wrote this because I frequently want a simple way to quickly discover embedded podcasts or videos and quickly get back to it.

* [The Critic v2](https://critic-app.replit.app/) [[code](https://github.com/PaulKinlan/CriticApp)] - I converted my original "The Critic" that was written with Breadboard to one that was built entirely by the Replit Agent. It's a lot more comprehensive, it includes account management, templates and histories.

* [Countdown Timer](https://countdown-timer.replit.app/) [[code](https://github.com/PaulKinlan/CountdownCrafter)] - I'm taking my parents on a trip to Japan and I wanted a simple homescreen installable web app that lets me configure a countdown timer and share it quickly and easily.

A general note, [repl.it](http://repl.it "http://repl.it") seems to prefer Python, Flask and sqlite. It's not the end of the world with regard to Python and Flask, but I don\'t quite understand why it prefers sqlite, as I understand it, every time you deploy it will overwrite the sqlite file, which seems sub-optimal. I prefer to use postgres and I\'ve been delighted with the agents ability to migrate databases.

[**WebSim**](https://websim.ai "https://websim.ai")

I really like [Web Sim for just spending time browsing around things](https://paul.kinlan.me/fictitious-web/ "https://paul.kinlan.me/fictitious-web/"). I think it highlights the power of the web, in that anyone can create something interactive and just publish out there.

* [3d globe](https://websim.ai/@paul_kinlan/3d-rotating-globe-with-country-outlines-city-popul) - One of our first webgl demos was a spinning globe with pins on it. I wanted to see if it could do this.

* [Lake Toya](https://websim.ai/@paul_kinlan/discover-toya-a-cultural-journey-in-hokkaido "https://websim.ai/@paul_kinlan/discover-toya-a-cultural-journey-in-hokkaido") - I was showing my wife how easy it would be for us to create a site about a recent trip that we had.

* [2d Space Gravity Simulator](https://websim.ai/@paul_kinlan/2d-gravity-simulator-with-infinite-space-2) - Something that I always wanted to build but never had the time.

* [3d Space Gravity Simulator](https://websim.ai/@paul_kinlan/3d-gravity-simulation-with-pan-controls "https://websim.ai/@paul_kinlan/3d-gravity-simulation-with-pan-controls") - I wanted to see what o1-preview could do, it was based on the 2d version.
