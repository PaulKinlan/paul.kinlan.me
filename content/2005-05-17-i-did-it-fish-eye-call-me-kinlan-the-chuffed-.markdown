---
slug: i-did-it-fish-eye-call-me-kinlan-the-chuffed-
date: 2005-05-17
 
title: I did it.... Fish Eye... Call Me Kinlan The Chuffed!!!
published: true
---
It wasn't too hard.... I did take a peak at the code behind the <a href="http://www.jasonwaltman.com/thesis/filter-fisheye.html/tag" rel="tag" target="_blank">fish eye</a> that <a href="http://www.jasonwaltman.com/" target="_blank"><strong><span style="COLOR: #4386ce;">Jason Waltman</span></strong></a> describes. I did this purely because the code I implemented seemed to match the pseduo code that was written but my results were not quite correct. I looked at the code, converted it to c# implemented it as a filter in the Tiger Image Processing Library (Tiger Imaging) for C# <a href="http://www.thecodeproject.com/cs/media/Image_Processing_Lab.asp" target="_blank"><strong><span style="COLOR: #4386ce;">here</span></strong></a> and it worked pretty much the first time it was tan.<p />I understand a bit more about polar co-ordinates now as well :)<p />Basically we have are our normal Cartesian Co-ordinates (x,y) which are used on our screens as pixel locations ((0,0) is the top left, (10,10) is 10 pixels in from the top left etc). Polar co-ordinates are co-ordinates that are specified in Angles and units from the center of a Circle .... I think!<p />So a Polar Co-ordinate (angle = 45, radius = 20) would mean that the point we want is 45 degrees from North and 20 units out from the centre.<p />This is useful in the Fish Eye Effect which needs to work out what pixels will be in the fish eye region.<p />The Fish eye effect has two basic stages<br /><ul>
<li>Work out which pixel should be fish eyed</li>
<li>If a pixel needs to be fish eyed, work out where the pixel should be placed based on where it is in the fish eye's view.</li>
</ul>Hmm.... Don't know if I made too much sense there, but I will comment the code a bit more and then post it as a link.<br />

