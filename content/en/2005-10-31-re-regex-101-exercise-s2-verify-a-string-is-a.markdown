---
slug: re-regex-101-exercise-s2-verify-a-string-is-a
date: 2005-10-31
 
title: "RE: Regex 101 Exercise S2 - Verify a string is a hex number"
published: true
---
Eric Gunnerson Ask a Question about a simple question about Regular Expressions: <blockquote>
<p>Welcome to week #2 of our class. This is a simple one:</p>
<p><em>S2 - Verify a string is a hex number</em></p>
<p class="BodyTextFirst" style="MARGIN: 6pt 0in;">Given a string, verify that it contains only the digits 0-9 and the letters a through f (either in uppercase or lowercase).</p>
<p class="BodyTextFirst" style="MARGIN: 6pt 0in;">Answer/discussion on Friday...</p>
[[posterous-content:uBElaDAHtglzaibhbbqx]]
</blockquote><i>[Via [MSDN Blogs](http://blogs.msdn.com/ericgu/archive/2005/10/31/487405.aspx)]</i><p />My answer for this would have to be<p />^[A-Fa-f0-9]*$ <p />However I know that it means that you can start a number with a 0 which may or may not be what he wants.<p />

