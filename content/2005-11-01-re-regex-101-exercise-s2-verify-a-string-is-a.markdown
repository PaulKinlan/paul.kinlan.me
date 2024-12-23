---
date: 2005-11-01
published: true
slug: re-regex-101-exercise-s2-verify-a-string-is-a
summary: 'In a previous post about verifying a hex number string with regex, there
  was a slight error.  The regex should have been `^[A-Fa-f0-9]+$`.  A further refinement
  to prevent leading zeros (except for the number zero itself) would look like this:
  `^[A-Fa-f1-9][A-Fa-f0-9]*$`.'
tags:
- regex
- hexadecimal
- validation
- regular expressions
- string matching
title: 'RE: Regex 101 Exercise S2 - Verify a string is a hex number'

---
It turns out I made a little mistake.  The regex should be more like ^[A-Fa-f0-9]+$.  The "0" problem might be sorted like this ^[A-Fa-f1-9][A-Fa-f0-9]*$.<p />

