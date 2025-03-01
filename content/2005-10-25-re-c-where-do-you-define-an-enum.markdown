---
date: 2005-10-25
published: true
slug: re-c-where-do-you-define-an-enum
summary: In response to a comment on Abhinaba's blog, I argue that verbosity in code
  is generally preferable, especially when defining enums. While Intellisense can
  be helpful, it shouldn't dictate design decisions.  Enums should ideally be defined
  within the class they're used, unless they're shared across multiple classes from
  the outset.  This improves code clarity and makes dependencies explicit. For example,
  separate FileFilter and DirectoryFilter enums within their respective classes are
  better than generic namespace-level filters.
tags:
- C#
- enum
- coding style
- verbosity
- Intellisense
- class design
- best practices
title: 'RE: C# : Where do you define an enum'

---
I have replied again on [Abhinaba's blog](http://blogs.msdn.com/abhinaba/archive/2005/10/24/484120.aspx). <p />You said "I have time again seen that people point to intellisense and other editor features to justify or nullify arguments. But a editor feature can never justify design decisions. Not everyone uses VS editor. Moreover a lot of people have build systems that _do not_ use solutions and rely on make files (nmake) or "sources" "dirs" files (NTBuild). Since there is no sln/proj files for the VS editor to use, intellisense do not work and users open CS files individually to edit. This is not a corner case situation and some teams even in MS uses this approach.". <p />You're right, intellisense can't justify having lengthened/shortend etc Naming conventions, but neither can its use or lack of be used to justify the reverse [I think that makes sense]. I understand that you want to be as verbose as you can in as smaller an area, but I still think verbosity wins the day. <p />Again for your second class, you shouldn't really be ripping the enums out and using them elsewhere [this could cause unintended consequences, at least having to change the class declaration makes it explicit that you know are changing all the enum refeneces], they should be referenced in the context that they are to be used in, and thus I belive having them in the class where it is initially related is the better choice. <p />Obviously [and I might condraticy myself now] if you have many classes from the start that use them I agree with your point. But, if you have a file filter [specific to files] and a directory filter [specific to directories] I would keep them at class level named as filter and not at the namespace level named as FileFilter, DirectoryFilter.<p />

