---
date: 2021-04-04 01:30:29.419000+00:00
draft: true
slug: are-developers-fixing-issues-identified-in-lighthouse
summary: This post explores whether developers are actively addressing issues highlighted
  by Lighthouse performance audits. By analyzing HTTP Archive data and tracking Lighthouse
  scores over time, we aim to uncover potential improvements.  While directly correlating
  specific fixes to Lighthouse test failures is challenging, we can investigate trends
  and infer the impact of Lighthouse on web development practices.  A key consideration
  is the evolution of Lighthouse itself, such as changes to CPU performance calculations,
  which may affect the comparability of results over time.
tags:
- lighthouse
- performance
- httparchive
- web development
- metrics
- analysis
title: Are developers fixing the issue identified by lighthouse

---

* Run HTTP Archive script
  * Extract scores from tests in the LH JSON
  * Aggregate
  * Plot on a per test basis
  * Known-issues: CPU performance caluculation was change a while ago so those tests won't be comparable before and after a certain time.

* We will never know if a person sees a test failure in LH and then fixes it.  There's no connection between the test and the work.
  * One has to assume that people are doing it because of LH because the tests are rather specific.
  * If you fix one test and then another... would that be an indication.