---
date: 2005-06-03
published: true
slug: xaml-menu-throbbing-
summary: 'I had this cool idea to add some throbbing action to my GelButton menu items
  in XAML.  I wanted them to subtly pulse when hovered over.  Turns out, it''s harder
  than I thought!  I''ve learned some limitations in XAML (May CTP): you can''t start/stop
  storyboards from triggers, apply a single animation to all controls of a type, and
  TargetID is deprecated in favor of TargetName.  Points 1 & 2 are especially problematic
  as they blur the lines between UI and application logic.  I''m going to look for
  workarounds and see if others have solutions.  Might even post my (probably wrong)
  ideas on how things *should* work.'
tags:
- xaml
- menu
- animation
- storyboard
- trigger
- ui
- presentation
- gelbutton
- limitations
- xaml-limitations
- may-ctp
- targetid
- targetname
title: XAML Menu Throbbing!

---
I had a really cool idea (well I thought it was cool anyway).<p />I was going to extend my "GelButton" Menu items XAML Example with some extra functionality.  I was going to make each of the "GelButtons" ever-so-slightly throb when the user hovers over them.  Even if the previous post never gets used I thought it would be a good learning experience.<p />It has been a good learning experience because I have found a few things that can't be done in XAML (May CTP).<ol>
<li>It seems one cannot stop or start an animation in a storyboard based off the actions of a Trigger.</li>
<li>It appears that one cannot apply a generic animation to all controls of a specific type.  (I am going to stop using one refering to me or you :) )  You cannot say I want a Timeline to be run for all menu items.  You (as it appears) have to create a time line for every control.</li>
<li>TargetID is used everywhere in the XAML examples yet it no longer exists, TargetName is the one to use.</li>
</ol><p>Point 3 I can deal with, but points 1 and 2 seem to be fundamental requirements for distinguishing between UI/Presentation and Application implementation.  Ohwell, maybe other people will be able to recognise if this is a problem or correct me if I am wrong :).</p><p>I will post around the Internet and News Groups to see if any workarounds exist or other solutions.</p><p>I may post examples of what I think would be the correct way of doing things (ps I am normally wrong on most occasions ;))</p><p />

