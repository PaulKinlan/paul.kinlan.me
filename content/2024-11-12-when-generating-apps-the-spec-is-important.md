---
slug: the-spec-is-important
date: 2024-11-12T10:42:00
title: When generating apps the spec is important
published: true
---

I\'ve been [generating a lot of web apps](https://paul.kinlan.me/generated-web-apps/ "https://paul.kinlan.me/generated-web-apps/") recently. It\'s been exhilarating to be able to launch projects (albeit on the small side) that I\'ve always wanted to see be created finally be willed into existence.

Last week on the train back from London I embarked on my largest project yet, [https://tldr.express](https://tldr.express "https://tldr.express"). I\'ve been amazed by Agents like [https://replit.com/](https://replit.com/ "https://replit.com/")\'s that can scaffold out full working experience that have user account registration and deploy in minutes. But how far can I push it?

I love blogs. It\'s one of the reasons that enabled me to get in to Developer Relations. I could connect with people and learn from them and I could share my own learnings (I think I\'ve helped folks)... When I was younger and the blogging scene predated social media, I would trawl Technorati trying to find new feeds and I would refresh my feeds every hour to see if anything new had been posted. Alas, times change, my own time to consume content is getting limited but I still try and make sure that I can track what web developers in the community are creating.

[tldr.express](http://tldr.express "http://tldr.express") is a site meant just for me (but anyone can use it) that tries to create a dashboard of the feeds that you care about the most and send you a summary every morning. It\'s a tool that I\'ve always wanted. But this isn\'t the important bit.

I was amazed how far my first prompt got me.

![Screenshot 2024-11-12 at 11.06.19 AM.png](/images/Screenshot%202024-11-12%20at%2011.06.19%E2%80%AFAM.png)

It created this plan which looked decent.

![Screenshot 2024-11-12 at 11.06.08 AM.png](/images/Screenshot%202024-11-12%20at%2011.06.08%E2%80%AFAM.png)

It scaffolded out a system that would let me register a user, add feeds and have it summarize the content and display them in a nice overview.

![Screenshot 2024-11-12 at 11.13.08 AM.png](/images/Screenshot%202024-11-12%20at%2011.13.08%E2%80%AFAM.png)

It wasn\'t all plain sailing.

* The email didn\'t work, I don\'t want to think about SMTP etc. Huh. You know, I didn\'t specify it. Please use resend.com (boom!)

* It kept asking to use Open AI... Huh. You know, I didn\'t specify clearly to use Gemini (long context windows and price)

* It output raw markdown in the UI. Huh. You know, I didn\'t specify clearly what the output should look like.

* It displayed in processing order and not date of creation.. Huh You know...

All of this without me touching a single line of code. After a day of use, I realised that if anyone found this site and signed up with an email address, it would be easy for them to spam folks. I probably should have specified that we need to validate email addresses.

![Screenshot 2024-11-12 at 11.26.26 AM.png](/images/Screenshot%202024-11-12%20at%2011.26.26%E2%80%AFAM.png)

... and it worked pretty much straight away.

On monday this week I thought I would check the user database... wow 50 sign-ups. That\'s weird the usernames are random.... Bots! Hmm I probably should have added something like Recaptcha in to validate.

![Screenshot 2024-11-12 at 11.26.01 AM.png](/images/Screenshot%202024-11-12%20at%2011.26.01%E2%80%AFAM.png)

Now the bots have stopped.

Reflecting back on this project, as spent a couple of hours prompting replit and configuring services like Google Cloud and Resend, I noticed that configuration more than I did the prompting, and it hit me that I was building the spec I was going along... My chat log is the development of what I probably should have thought about at the start. I have a strong sense that as these tools develop, while it's mind-blowing that we can use a pithy one-line prompt to generate an entire app, we should be spending a lot more time up front designing the spec so that we are able to get further and more accurate output.
