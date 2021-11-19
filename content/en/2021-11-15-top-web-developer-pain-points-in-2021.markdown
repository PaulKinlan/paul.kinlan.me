---
title: Top web developer pain points in 2021
date: 2021-11-15T10:50:44.984Z
draft: false
summary: We survey a part of the ecosystem every quarter. Here are some of our findings.
tags:
  - developersatisfaction
  - devsat
slug: top-web-developer-pain-points-in-2021
---
A little while ago I wrote about understanding the needs of the developer ecosystem by learning about what developers have said their [top challenges are](/thinking-about-developer-satisfaction-and-web-developers/).

The original post was a summary of the results from the [MDN Developer Needs Assessment](https://insights.developer.mozilla.org/) (2019), which unfortunately stopped running in 2020. The information in those surveys was important for our team because it helped us set the direction of the wider Web Platform team, so it was a shame that it stopped. 

To fill in the gap left by Mozilla I set up a survey for our team so we can get a picture of the high-level needs of developers.

Every 3 months we survey a random sample of roughly 700 people across the US, UK and India who identify as a Web Developer or a decision maker for Web Developers and I compare the data to all the previous surveys that we've run to see if there any changes in the trends.

It should be noted that the MDN Survey and our survey are different, they have a different population and slightly different questions (although we try to keep them as similar as possible). Because the population size is different we don't use a Max-Diff approach, rather we ask the participants to pick their top 3 issues. This raise some questions for how to prioritise the data, but when you get deep into  the results the conclusions are really not that far apart.

In 2020 - the survey said that the top areas of frustration that developers have was:

> 1. Browser Compatibility - [The web is lumpy](https://paul.kinlan.me/the-lumpy-web/), it should be a lot smoother. Chrome should continue to ensure it is compatible with the broad web platform; Chrome should work with all browser vendors to help with compatibility; Chrome should help to ensure that we don't have a Chrome-only web.
> 2. Testing - It should be easy to end to end test your sites across all browsers. It's too hard right now.
> 3. Documentation - It should be easy for developers to find the best and most up to date reference material, and also opinionated and validated best practice guidance.
> 4. Debugging - Developers look at debugging as a failure case, we should ensure that developers have all the tools they need to understand the issues they are facing and fix them as quickly as possible.
> 5. Frameworks - We can't escape the fact that a huge number of developers use frameworks, how can we continue to make sure that there is a strong partnership between browser vendors and framework authors? and that developers know how to use these tools effectively.
> 6. Privacy & Security - There is a huge amount of legislation that is slowing developers down, not to mention ecosystem changes that are happen due to effective competition. This change worries developers and we need guidance and tools to help people.

Now in 2021... How does it look?

Drumroll.

Pretty much exactly the same. There are some differences because we measure differently, but the general direction between surveys.

The top 5 issues (%age is how many developers put this in their top 3 issues).

| Challenge | Q1 | Q2 | Q3 |
|--------|:----:|:----:|:----:|
|Keeping up with changes to the web platform/web standards|27%|26%|27%|
|Keeping up with a large number of new and existing tools or frameworks|26%|26%|25%|
|Making a design/experience work the same across browsers|26%|28%|24%|
|Testing across browsers|23%|24%|20%|
|Understanding and implementing security measures|23%|25%|20%|

It's pretty much the same quarter over quarter. 

The value in this data for me is that it tells me where to investigate more, although it doesn't tell me exactly what to fix. 

For example, the interpretation that I've been building up over the last year for this is that there's too much happening for developers both at the platform level and also in the ecosystem of tools (these are always the top issues) and we need to address that. 

It also tells me that there's a gap for developer tooling around testing and cross browser experiences. [Compat 2021](https://web.dev/compat2021/) was one  program that we built based on this data and while I would like to say developers are noticing the results I still think it is too early to tell if this work on improving compatibility across browsers has meaningfully changed developers lives.

### Addendum

Full results for the question: "What are the biggest challenges you face while developing your web site or app? (Select 3)"


| Challenge | Q1 | Q2 | Q3 |
|--------|:----:|:----:|:----:|
||n=698|n=760|n=738|
|Keeping up with changes to the web platform/web standards|27%|26%|27%|
|Keeping up with a large number of new and existing tools or frameworks|26%|26%|25%|
|Making a design/experience work the same across browsers|26%|28%|24%|
|Testing across browsers|23%|24%|20%|
|Understanding and implementing security measures|23%|25%|20%|
|Lack of automation of frequently performed small tasks|15%|17%|18%|
|Unable to create the experiences I want because some capability is not there|15%|13%|18%|
|Lack of knowledge about how to leverage modern web technologies|16%|16%|17%|
|Understanding how to use existing tools/frameworks|16%|14%|17%|
|Hard/impossible to achieve the performance I want|11%|12%|17%|
|Prioritization of web efforts within my organization|15%|16%|16%|
|Supporting old browsers|21%|23%|16^|
|Lack of reference resources or documentation|14%|13%|15%|
|Lack of or poor developer tools|11%|14%|15%|
|Hard/impossible to achieve my desired UI|14%|13%|15%|
|None of the above|3%|1%|1%|

* Interesting to see "Supporting old browsers" dropped significantly.

