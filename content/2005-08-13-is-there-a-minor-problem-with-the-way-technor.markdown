---
date: 2005-08-13
published: true
slug: is-there-a-minor-problem-with-the-way-technor
summary: I noticed a lack of referrals from Technorati and discovered my blogs weren't
  showing up in tag searches.  The problem stemmed from my Technorati AJAX application,
  which was using single quotes instead of double quotes around the href attribute
  in the tag links. I've corrected the issue by changing the single quotes to double
  quotes in my application, and hopefully, this will resolve the problem with Technorati.
  While my application is now fixed, it raises the question of whether Technorati
  should be able to handle both single and double quotes.
tags:
- technorati
- tags
- parsing
- single quotes
- double quotes
- ajax
- blogging
- referrals
- HTML
title: Is there a minor problem with the way technorati parses URLs

---
I was looking through my logs today, and I noticed that I had not had a single referal over the past day from technorati.  I investigated a bit more and I noticed none of my blogs are in any of the tag searches on Technorati.... This is odd I thought.<p />It is my Technorati AJAX application that creates the tag information for a post now.  So there must be a problem there.  I checked the HTML and I noticed that a link had the following &lt;a href='blurb' rel='tag'&gt;. hmmm the only thing that is slightly off there is the apostrophe instead of the double quote.  I changed it so now it looks like &lt;a href="blurb" rel="tag"&gt;.  Hopefully this will sort it out!.<p />Should Technorati be able to parse single quotes around a anchor as well as double quotes?<p />ps My application is fixed now too.<p />

