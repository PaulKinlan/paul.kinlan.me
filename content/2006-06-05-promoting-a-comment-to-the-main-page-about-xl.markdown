---
date: 2006-06-05
published: true
slug: promoting-a-comment-to-the-main-page-about-xl
summary: I'm highlighting a comment from Mike Champion, XLinq's program manager at
  Microsoft, addressing the issue of querying large XML files with XLinq.  He discusses
  their current investigation into this problem and seeks feedback on how large XML
  documents are typically structured. Specifically, he asks about the structure of
  my 900MB XML file to better understand user needs and design appropriate solutions
  within XLinq.  He mentions exploring options like a LINQ-queryable XmlReader or
  a lazy evaluation approach similar to XStreamingElement, while aiming for simplicity
  and avoiding dependencies on schemas or XPath. He's open to further discussion via
  his blog's contact form.
tags:
- XLinq
- XML
- Microsoft
- Large Files
- Querying
- Performance
- Streaming
- XmlReader
- XStreamingElement
- Mike Champion
title: Promoting a Comment to the Main Page about XLinq

---
Because at the moment I can't syndicate my comments through blogger, I thought I would promte a comment from Mike Champion (The program manager for XLinq) to the front page of my blog.  So other people get the chance to see this issue more publically and so you (the reader) can respond too if you so wish.<p />I will be trying to reply to the comment properly by the end of the week, I am on vacation at the moment so I will try and do some thinking when I get chance :) But I will respond properly.<p />Anyway, here is the comment.<p /><blockquote>Hi, I'm the program manager for XLinq at Microsoft. I wanted to let you know that we are looking into this very problem right now. It would be good to hear from you and others in more detail about how your big XML file is structured. Your idea of having a LINQ-queryable XmlReader stream is one we have considered, but that doesn't really leverage the rest of XLinq. We'd prefer something akin to the XStreamingElement class in the May CTP, where a repeated element structure is evaluated "lazily". The trick is to define the structure of the streaming input without a) requiring a schema, b) requiring the user to learn a different technology such as XPath (remember that XLinq is not necessarily aimed at an audience of XML experts who already know such things), and c) making it so complex that users might as well use XmlReader to do the job. <p />Specific question: does your 900MB document have a regular structure, e.g. is it 900,000 1K elements that have the same structure, 900 1MB documents with varying structures, one big amorphous thing, or what? Is there some less structured "header" information at the beginning before any regular repeating structure begins? I think we'll be able to offer something that is simple to use and powerful for the case where large documents consist of many relatively well-structured top-level elements, but we're wondering how much complexity beyond that we can feasibly support before saying "just use XmlReader".<p />Thanks! You can contact me via the "contact us" form at blogs.msdn.com/mikechampion if you want to follow up, or leave a comment in one of the entries there. 
</blockquote><p />

