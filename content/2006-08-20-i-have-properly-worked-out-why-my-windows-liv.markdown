---
date: 2006-08-20
published: true
slug: i-have-properly-worked-out-why-my-windows-liv
summary: I finally figured out why my Windows Live Writer plugins weren't working!
  It turns out that new classes added via the Solution Explorer default to \"internal\"
  access.  Making the class \"public\" fixed the issue and now the plugins work perfectly.
tags:
- windows live writer
- plugins
- C#
- .NET
- access modifiers
- internal
- public
- troubleshooting
- coding
title: I have Properly Worked out Why My Windows Live Write Plugin Was Not Working

---
<p>In two of my previous post I have talked about not being able to get the Windows Live Writer Plugins to work.</p> <p>It was all because I was adding new classes in via the solution explorer, and when doing this the class is "made" with out an access modifier, which means that it is "internal" by default and thus wouldn't be reflected (or what ever mechanism the Windows Live Writer tool uses).  I made the class public and voila!</p>

