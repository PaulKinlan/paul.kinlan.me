---
slug: bookmarklet-trace-page
date: 2018-04-12T13:20:31+01:00
title: "Bookmarklet: Chrome DevTools trace page"
tags: ['bookmarklet', 'puppeteer', 'headless chrome']
description: "A simple bookmarklet that will performance trace the current page and open in an hosted devtools instance"
---


<style> .bookmarklet {     background-color: #0D4F8B;     color: white;     padding: 0.2em;     border-radius: 5px;     display: inline-flex;     justify-content: center;     text-decoration: none;     align-items: center; }

.bookmarklet: посетил {color: white; } </ style>

Перетащите этот букмарклет в закладки (вы также можете нажать на букмарклет, чтобы проверить эту страницу).

<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> <a class=bookmarklet href="javascript:(function()%7Bwindow.location%3D'https%3A%2F%2Fchromedevtools.github.io%2Ftimeline-viewer%2F%3FloadTimelineFromURL%3Dhttps%3A%2F%2Fpptraas.com.com%2Ftrace%3Furl%3D'%2BencodeURIComponent(window.location)%7D)()">🔍 Страница трассировки</a>

## Как это работает

1. Запускает размещенный интерфейс Chrome DevTools, который принимает удаленный файл трассировки. 2. Удаленный файл трассировки создается с помощью Chrome + Puppeteer на сервере, в настоящее время размещенном с zeit.
