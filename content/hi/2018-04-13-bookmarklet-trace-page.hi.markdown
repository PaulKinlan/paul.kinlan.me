---
slug: bookmarklet-trace-page
date: 2018-04-12T13:20:31+01:00
title: "Bookmarklet: Chrome DevTools trace page"
tags: ['bookmarklet', 'puppeteer', 'headless chrome']
description: "A simple bookmarklet that will performance trace the current page and open in an hosted devtools instance"
---


<style> .bookmarklet {     background-color: #0D4F8B;     color: white;     padding: 0.2em;     border-radius: 5px;     display: inline-flex;     justify-content: center;     text-decoration: none;     align-items: center; }

बुकमार्लेट: विज़िट {रंग: सफेद; } </ style>

इस बुकमार्कलेट को अपने बुकमार्क्स पर खींचें (आप इस पृष्ठ का परीक्षण करने के लिए बुकमार्कलेट पर भी क्लिक कर सकते हैं)।

<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> <a class=bookmarklet href="javascript:(function()%7Bwindow.location%3D'https%3A%2F%2Fchromedevtools.github.io%2Ftimeline-viewer%2F%3FloadTimelineFromURL%3Dhttps%3A%2F%2Fpptraas.com.com%2Ftrace%3Furl%3D'%2BencodeURIComponent(window.location)%7D)()">🔍 ट्रेस पेज</a>

## यह कैसे काम करता है

1. क्रोम DevTools के होस्टेड इंटरफ़ेस लॉन्च करता है जो रिमोट ट्रेस फ़ाइल स्वीकार करता है। 2. वर्तमान में ज़ीट के साथ होस्ट किए गए सर्वर पर क्रोम + Puppeteer का उपयोग कर रिमोट ट्रेस फ़ाइल उत्पन्न होती है।
