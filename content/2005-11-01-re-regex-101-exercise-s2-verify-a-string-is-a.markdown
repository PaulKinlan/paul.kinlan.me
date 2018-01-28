---
slug: re-regex-101-exercise-s2-verify-a-string-is-a
date: 2005-11-01
 
title: "RE: Regex 101 Exercise S2 - Verify a string is a hex number"
published: true
---
It turns out I made a little mistake.  The regex should be more like ^[A-Fa-f0-9]+$.  The "0" problem might be sorted like this ^[A-Fa-f1-9][A-Fa-f0-9]*$.<p /><br />

