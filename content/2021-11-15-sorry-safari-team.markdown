---
date: 2021-11-12 13:00:56.045000+00:00
draft: false
slug: sorry-safari-team
summary: 'I sincerely apologize to the Safari team for misrepresenting their compatibility
  score in our Chrome Dev Summit presentation. Due to a combination of personal circumstances,
  a reliance on outdated Safari Tech Preview data from wpt.fyi, and the rush leading
  up to the event, we displayed an incorrect improvement score (64 => 85 instead of
  64 => 92). This was my mistake, and I take full responsibility.  While we attempted
  to rectify the situation, it was too late to change the presentation.  Our intent
  was never malicious, but rather to highlight the collaborative effort to improve
  web compatibility. I''ve learned valuable lessons from this experience: triple-check
  data, consult with relevant engineers, focus on stable release data, and communicate
  with browser teams transparently.  Going forward, we''ll prioritize broad browser
  support and emphasize the user experience in stable releases.'
tags:
- web compatibility
- chrome
- safari
- chrome dev summit
- apology
- data accuracy
- browser compatibility
- compat 2021
- web platform tests
- interoperability
title: Sorry Safari team

---
I just wanted to spend a couple of moments talking about some of the events over the last couple of days that we're ultimately caused by me.

Before I get into what happened, I just wanted to say sorry to the Safari team over at Apple for any frustration they have with what we shared at Chrome Dev Summit. 

I'm sorry for the misrepresentation of Safari Tech Preview's compatibility score for the [Compat 2021 work](https://wpt.fyi/compat2021?feature=summary).

I've been in and out of hospital this week after nearly slicing my thumb off so I'm late to getting to write about it. No one has asked me to write this, no one has reviewed it. I can see arguments on Twitter and I really want them to stop because it's making us all look bad.

The Chrome Dev Summit is our annual event to show developers what we are working on and what we think will be important for the year ahead. I hear a lot of frustration in the ecosystem that building experiences that work across browsers is one of the top pain points developers have each year and that lead me to wanting to showcase some of the amazing work that all of the browser vendors had done to improve the working lives of developers.

We shared a slide that showed improvements to CSS compatibility across the web. It showed improvements across the board for the [compat 2021](https://web.dev/compat2021/) program that our teams set up and it stated that Safari had jumped from a score of 64 => 85, when in fact what we should have had on the slide is is 64 => **92**.

I know Ben Galbraith wrote on Twitter that he took responsibility for that slide, which I appreciate but ultimately it was me who gave him the data and the talking points and pushed for it to be included in the keynote.

So, how did we get to this point?

I was proud of the work that the browsers had done under this program, so I wanted to put it right at the front of the keynote to show that we're all listening to the needs of developers. The compat 2021 project had objective data for the state of CSS compatibility for the areas that developers care about the most and I felt that it would be broadly uncontentious.

I had been told (at some point earlier) that Apple had indicated that they only want us to use Safari Tech Preview data to showcase any improvements to compatibility scores. Although I  had the opinion that we should only use Stable data because that is what developers are using today, I let it fly because we also frequently talk about things in Canary.

I went to [wpt.fyi ](https://wpt.fyi)which highlights the compatibility scores of browsers based on Web Platform Tests that all the browser vendors agree on (or at least I assume they do) and I saw that all the browsers had improved with regard to the Compat 2021 program, I did some basic checks, I saw that Safari had improved the most and thought that was a great story to present.

I trusted that the data was accurate because it's a set of coded tests that are automatically run and I thought there were no broad issues. I hadn't realised at the time was that the [Safari Tech Preview couldn't be updated and was running a version from earlier in the year](https://github.com/web-platform-tests/wpt/issues/31147). Ironically, if you switch to the [Stable](https://wpt.fyi/compat2021?feature=summary&stable) view you can see that Safari is doing better and if I had checked that score, I would have seen the difference in numbers and raised questions. I didn't do that.

We recorded the keynote in early/mid-October which was a couple of days after #[31147](https://github.com/web-platform-tests/wpt/issues/31147) was identified and raised. I may have been told about this issue, but I didn't recall it and certainly didn't catch that it would impact what we were talking about.

We realised the mistake on the morning of the keynote (November 3rd) and at that point it was too late to change it. I took the decision to go ahead because the numbers weren't the focus of the message we were trying to convey, and broadly they looked great across the board. A member of our team then messaged a member of the Safari team to apologise and explain what had happened but also, hopefully give the team the confidence that we will use the correct data in the future events and communication.

I hadn't seen any negative press or negative developer sentiment to this slide, but it clearly irked the Safari team (which I am very sorry for) and then it was shared on Twitter.

I know some people are attributing malice to this slide. It was absolutely not the intent but I can see -- given the history between the two teams -- why it might be thought that it was intentional. [It was a mistake on my part](https://en.wikipedia.org/wiki/Hanlon%27s_razor).

Compatibility is a shared ecosystem problem. It makes no sense to me that we try and score 1-up points on Compatibility. Just because one browser might be on spec, it also means that same browser might also not be interoperable with other browsers and this means that developers have to deal with the difference irrespective if a browser is "technically correct". Ultimately, we all have to get better together.

I want developers to be more productive so they can build better designs more easily. I want developers to know that the web is getting better and they will be more productive. I don't want finger pointing between two teams and the developer ecosystem. WebKit has made massive strides in improvements to layout compatibility, in part with the support and dedication of Igalia and the wider community. 

What have I learned? (note: there's always more to learn - so this isn't a static list)

* Triple check the data and bring in the engineers working on this to validate before we record.
* I should have messaged all the respective engine teams ahead of time to let them know we were using the data
* I should have stuck to my guns more and pushed to only use data that is focused on what is in the hands of developers, i.e Stable releases. Longer term, I'm going to be directing my teams to focus more on broad browser support in our work and less on newer Chrome-first (/only?) features and I think our wider story should all be based on what users have today, and less on what they might support at some point in the future.
* I would like to still talk about "experimental browsers" because it will give developers a clear picture of where Compatibility and Interop story is heading.
