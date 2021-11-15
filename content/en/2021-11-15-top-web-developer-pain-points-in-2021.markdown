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
I little while ago I wrote about understanding the needs of the developer ecosystem by learning about what developers have said their [top challenges are](/thinking-about-developer-satisfaction-and-web-developers/).

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

Pretty much exactly the same. There are some differences because we measure differently.

The top 5 issues (%age is how many developers put this in their top 3 issues).

| Challenge | Q1 | Q2 | Q3 |
|-----------|----|----|----|
|Keeping up with changes to the web platform/web standards|27%|26%|27%|
|Keeping up with a large number of new and existing tools or frameworks|26%|26%|25%|
|Making a design/experience work the same across browsers|26%|28%|24%|
|Testing across browsers|23%|24%|20%|
|Understanding and implementing security measures|23%|25%|20%|

It's pretty much the same quarter over quarter. The interpretation that I've been building up over the last year for this is that there's too much happening for developers both at the platform level and also in the ecosystem of tools (these are always the top issues).

The value in this data for me is that it tells me where to investigate more, although it doesn't tell me exactly what to fix. Compat 2021 was one of the programs we built based on this data and further research.