---
slug: bookmarklet-trace-page
date: 2018-04-12T13:20:31+01:00
title: "Bookmarklet: Chrome DevTools trace page"
tags: ['bookmarklet', 'puppeteer', 'headless chrome']
description: "A simple bookmarklet that will performance trace the current page and open in an hosted devtools instance"
---


<style> .bookmarklet {     background-color: #0D4F8B;     color: white;     padding: 0.2em;     border-radius: 5px;     display: inline-flex;     justify-content: center;     text-decoration: none;     align-items: center; }

.bookmarklet: đã truy cập {color: white; } </ style>

Kéo bookmarklet này vào bookmark của bạn (bạn cũng có thể nhấp vào bookmarklet để kiểm tra trang này).

<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/><path d="M0 0h24v24H0z" fill="none"/></svg> <a class=bookmarklet href="javascript:(function()%7Bwindow.location%3D'https%3A%2F%2Fchromedevtools.github.io%2Ftimeline-viewer%2F%3FloadTimelineFromURL%3Dhttps%3A%2F%2Fpptraas.com.com%2Ftrace%3Furl%3D'%2BencodeURIComponent(window.location)%7D)()">🔍 Trang dấu vết</a>

## Cách này hoạt động

1. Khởi chạy giao diện được lưu trữ của Chrome DevTools chấp nhận tệp theo dõi từ xa. 2. Tệp theo dõi từ xa được tạo bằng Chrome + Puppeteer trên máy chủ hiện được lưu trữ với zeit.
