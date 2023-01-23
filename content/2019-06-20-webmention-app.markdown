---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
I love the idea of [Webmentions](https://www.w3.org/TR/webmention/), yet I've not had the time to implement it on my site. At a high-level web mentions let you comment, like and reply to other content on the web and have it be visible to that content without being centralised with tools like Disqus (which I am keen to remove from my site).

Web Mentions are split in to two components, the sender and the receiver. The receiver is the site that I am writing a post about and they might have something on their site that shows inbound links or reactions to their blog; and the sender is, well, me. I need to let the remote site that I have written or reacted to some content that they have created.

The rather awesome [Remy Sharp](https://remysharp.com) created [webmention.app](https://webmention.app/) to solve one part of the problem: sending pings. Remy's tool&nbsp; makes it easy to send 'pings' to potential receivers that I have linked to, by simply calling a CLI script.

I host my blog using Zeit using Hugo and the static-builder tool, so it was [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9). I just `npm i webmention` and then call the CLI version of the tool from my `build.sh` file - it really is that simple.

Now when I create a post, it should send a quick ping to all new URL's that I have created some content about their site.

