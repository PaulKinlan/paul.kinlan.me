---
layout: post
title: "Traffic-lights with CSS"
date: 2013-01-04 12:28
comments: true
categories: css
published: true
---

Just before Christmas I wanted to build a site that helped developers understand the impact that using Web Platform features would have on there potential reach.
For example, if I used WebGL what is my target reach and what additional features can I use without impacting my potential audience figures.  

I launched [iwanttouse.com](http://iwanttouse.com). Sweet. Anyway, that is not the point of this post.  One of the features of this site is.

One of the core features I wanted to implement was a traffic light system that graded the features like a traffic light. Green = Good, Red = Bad, Amber = Be Warned.  

My original implementation was just using some simple CSS classes.

    .good {
      color: green;
    }

    .ok {
      color: amber;
    }

    .bad {
      color: red;
    }

I knew this was bad, but using RGB I couldn't work out sanely how to grade between 255,0,0, 255,126,0 and 0,255,0 without having logic in my code that looked like:

    if (support < 25%) then .bad
    if (support >25% and support < 75%) then .ok
    if (support > 75%) then .good

added to that, I wanted the color to be more red than amber if it was at 35%.

Anyway, after a little chat with the awesome [Paul Lewis](http://twitter.com/aerotwist), he mentioned that [HSL](http://www.css3.info/preview/hsla/) (Hue, Saturation, Light) color scheme would be good for this problem
because naturally the Hue value (0-359) rotates from Red, through Amber to Green (0 = Red, 45 = Amber, 90 = Green)

<span style="color: hsla(0, 50%, 50%, 1)">Red = `color: hsla(0, 50%, 50%, 1)`</span>
<span style="color: hsla(45, 50%, 50%, 1)">Amber = `color: hsla(45, 50%, 50%, 1)`</span>
<span style="color: hsla(90, 50%, 50%, 1)">Green = `color: hsla(90, 50%, 50%, 1)`</span>

It is then simple given a value for percentage support to map that to 0-90 range and produce your traffic light colors.

    element.styles.color = "hsla(" + ((percentage / 100) * 90) + ", 50%, 50%)";

