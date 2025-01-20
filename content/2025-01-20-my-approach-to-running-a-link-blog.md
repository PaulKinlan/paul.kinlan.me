---
title: "Simon Willison: My approach to running a link blog"
date: 2025-01-20T19:09:03.332Z
link: https://simonwillison.net/2024/Dec/22/link-blog/
---
[My approach to running a link blog](https://simonwillison.net/2024/Dec/22/link-blog/)

I really like Simon's approach to running a link blog and his principles really resonate with me

> I always include the names of the people who created the content I am linking to, if I can figure that out. Credit is really important, and it’s also useful for myself because I can later search for someone’s name and find other interesting things they have created that I linked to in the past. If I’ve linked to someone’s work three or more times I also try to notice and upgrade them to a dedicated tag.

Lifting people up is something that I've always valued (and valued when folks did it on my content). I probably lost my way at the start of my DevRel career - parts of the DevRel job ladder include being Industry influential. I took that to mean being an expert in web development and while I think I'm reasonable and I've built a great team, I love seeing other people succeed and I love sharing their work.

> I try to add something extra. My goal with any link blog post is that if you read both my post and the source material you’ll have an enhanced experience over if you read just the source material itself.

This was actually something I struggled with in my first iteration of my link blog. I'm still not sure I can always provide more value than the original author but also I have a hunch that linking out of sites is a dying art.

Simon also had a bit about the technology behind his link blog:

> The technology behind my link blog is probably the least interesting thing about it. It’s part of my simonwillisonblog Django application—the main model is called Blogmark and it inherits from a BaseModel defining things like tags and draft modes that are shared across my other types of content (entries and quotations).

This blog is entirely static (Hugo) and I've been butting my head up against the wall. Static is neat, but it's not enough. If you want to add Activity Pub, well you have to bend Hugo a long way. Add a link blog? Well, that's not too hard given it's structure but it also means having to make a full git-commit to the repo, and this was something that slowed me down last time.