---
slug: are-developers-fixing-issues-identified-in-lighthouse
date: 2021-04-04T01:30:29.419Z
title: Are developers fixing the issue identified by lighthouse
summary: We don't know yet, but we can use HTTP Archive to find out
draft: true
tags: [drafts]
---

* Run HTTP Archive script
  * Extract scores from tests in the LH JSON
  * Aggregate
  * Plot on a per test basis
  * Known-issues: CPU performance caluculation was change a while ago so those tests won't be comparable before and after a certain time.

* We will never know if a person sees a test failure in LH and then fixes it.  There's no connection between the test and the work.
  * One has to assume that people are doing it because of LH because the tests are rather specific.
  * If you fix one test and then another... would that be an indication.