---
slug: xaml-menu-throbbing-
date: 2005-06-03
 
title: XAML Menu Throbbing!
published: true
---
I had a really cool idea (well I thought it was cool anyway).<p />I was going to extend my "GelButton" Menu items XAML Example with some extra functionality.  I was going to make each of the "GelButtons" ever-so-slightly throb when the user hovers over them.  Even if the previous post never gets used I thought it would be a good learning experience.<p />It has been a good learning experience because I have found a few things that can't be done in XAML (May CTP).<br /><ol>
<li>It seems one cannot stop or start an animation in a storyboard based off the actions of a Trigger.</li>
<li>It appears that one cannot apply a generic animation to all controls of a specific type.  (I am going to stop using one refering to me or you :) )  You cannot say I want a Timeline to be run for all menu items.  You (as it appears) have to create a time line for every control.</li>
<li>TargetID is used everywhere in the XAML examples yet it no longer exists, TargetName is the one to use.</li>
</ol><p>Point 3 I can deal with, but points 1 and 2 seem to be fundamental requirements for distinguishing between UI/Presentation and Application implementation.  Ohwell, maybe other people will be able to recognise if this is a problem or correct me if I am wrong :).</p><p>I will post around the Internet and News Groups to see if any workarounds exist or other solutions.</p><p>I may post examples of what I think would be the correct way of doing things (ps I am normally wrong on most occasions ;))</p><p /><br />

