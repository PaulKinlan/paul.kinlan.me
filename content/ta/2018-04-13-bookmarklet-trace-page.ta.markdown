---
slug: bookmarklet-trace-page
date: 2018-04-12T13:20:31.000Z
title: "Bookmarklet: Chrome DevTools trace page"
tags: ['bookmarklet', 'puppeteer', 'headless chrome']
description: "A simple bookmarklet that will performance trace the current page and open in an hosted devtools instance"
---


<style> .bookmarklet {     background-color: #0D4F8B;     color: white;     padding: 0.2em;     border-radius: 5px;     display: inline-flex;     justify-content: center;     text-decoration: none;     align-items: center; }

புக்மார்க்கெட்: விஜயம் {color: white; } </ style>

உங்கள் புக்மார்க்குகளில் இந்த புத்தகக்குறியை இழுக்கவும் (இந்த பக்கத்தைச் சோதிக்க நீங்கள் புக்மார்க்ஸில் கிளிக் செய்யலாம்).

<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> <a class=bookmarklet href="javascript:(function()%7Bwindow.location%3D'https%3A%2F%2Fchromedevtools.github.io%2Ftimeline-viewer%2F%3FloadTimelineFromURL%3Dhttps%3A%2F%2Fpptraas.com.com%2Ftrace%3Furl%3D'%2BencodeURIComponent(window.location)%7D)()">🔍 ட்ரேஸ் பக்கம்</a>

## இது எப்படி வேலை செய்கிறது

1. ரிமோட் ட்ராஸ் கோப்பை ஏற்றுக்கொள்கிற Chrome DevTools இன் ஹோஸ்ட் செய்யப்பட்ட இடைமுகத்தை துவக்குகிறது. 2. ரிமோட் ட்ராஸ் கோப்பை Chrome + Puppeteer ஐப் பயன்படுத்தி தற்போது சர்வரால் வழங்கப்படும் சேவையகத்தில் உருவாக்கப்பட்டது.
