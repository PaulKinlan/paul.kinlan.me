---
date: 2019-06-20 12:33:04.370000+00:00
link: https://remysharp.com/2019/06/18/send-outgoing-webmentions
slug: webmention-app
summary: 'I''ve added Webmention support to my blog!  I''m excited about Webmentions
  because they allow decentralized commenting and reactions, unlike Disqus which I''m
  looking to remove.  Sending webmentions involves two parts: the sender and the receiver.  I
  used Remy Sharp''s webmention.app tool to simplify the sending process.  Integrating
  it into my Zeit/Hugo blog was super easy - I just installed the package and added
  a call to the CLI in my build script.  Now, whenever I publish a post, it automatically
  pings any URLs I''ve linked to.'
tags:
- webmentions
- blogging
- indieweb
- hugo
- zeit
- javascript
- web-development
title: Webmention.app

---
I love the idea of [Webmentions](https://www.w3.org/TR/webmention/), yet I've not had the time to implement it on my site. At a high-level web mentions let you comment, like and reply to other content on the web and have it be visible to that content without being centralised with tools like Disqus (which I am keen to remove from my site).

Web Mentions are split in to two components, the sender and the receiver. The receiver is the site that I am writing a post about and they might have something on their site that shows inbound links or reactions to their blog; and the sender is, well, me. I need to let the remote site that I have written or reacted to some content that they have created.

The rather awesome [Remy Sharp](https://remysharp.com) created [webmention.app](https://webmention.app/) to solve one part of the problem: sending pings. Remy's tool&nbsp; makes it easy to send 'pings' to potential receivers that I have linked to, by simply calling a CLI script.

I host my blog using Zeit using Hugo and the static-builder tool, so it was [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9). I just `npm i webmention` and then call the CLI version of the tool from my `build.sh` file - it really is that simple.

Now when I create a post, it should send a quick ping to all new URL's that I have created some content about their site.

