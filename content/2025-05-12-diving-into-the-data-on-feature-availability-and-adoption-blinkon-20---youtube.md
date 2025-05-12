---
title: "Annie Sullivan: Diving into the Data on Feature Availability and Adoption"
date: 2025-05-12T14:17:06.325Z
link: https://www.youtube.com/watch?v=DdnFlyx0dU0
---
Link: [Diving into the Data on Feature Availability and Adoption [BlinkOn 20] - YouTube](https://www.youtube.com/watch?v=DdnFlyx0dU0)

This is a great talk from Annie Sullivan at BlinkOn 20 about the availability and adoption of web features. Annie discusses the importance of understanding how features are used in the wild, and how this can inform the development of new features.

I took a few notes on the talk, which I thought were interesting and linked to them below:

* **Core Web Vitals:** Discusses work on improving web page quality metrics (LCP, INP, CLS) using HTTP Archive data to identify and fix issues [[00:00:21]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=21s), [[00:00:50]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=50s) and how this was the groundwork for the talk.
* **Baseline Data:** A baseline dashboard by the WebDX community group provides metadata on web features, including their availability status and [[00:03:32]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=212s) and how Annie would use this aligned with usage data to understand the adoption of web features (rest of the talk)
* **Key Findings:**
    * Wider availability leads to higher adoption [[00:05:56]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=356s) <-- We all had a feeling this was the case, but it's nice to see it backed up with data.
    * Feature adoption isn't significantly skewed by website popularity [[00:06:15]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=375s).
    * 1) we can do splits on data easily, 2) HTML and JavaScript features show clearer adoption patterns than CSS [[00:07:19]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=439s).
    * HTTP Archive data aligns well with real Chrome usage data [[00:09:27]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=567s).
* **Analysis Tools:** Uses HTTP Archive and BigQuery to analyze feature usage [[00:10:14]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=614s).
* **Adoption Factors:**
    * Site-building platforms (e.g., WordPress) [[00:12:54]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=774s).
    * Third-party embeds (e.g., YouTube) [[00:08:52]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=532s).
    * Progressive enhancement with fallbacks [[00:17:43]](http://www.youtube.com/watch?v=DdnFlyx0dU0&t=1063s).

Our team has long been pushing to understand API usage and how collaborating with site-building platforms can help us understand the impact of our work (selfishly for me), but I do think broadly that this type of insight helps us get more investment in to the web platform and helps us prioritize the right things.
