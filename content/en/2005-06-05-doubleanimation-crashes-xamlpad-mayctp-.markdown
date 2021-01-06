---
slug: doubleanimation-crashes-xamlpad-mayctp-
date: 2005-06-05
 
title: DoubleAnimation Crashes XAMLPad (MayCTP)
published: true
---
Has anyone experienced a crash with XAMLPad (I have not tried creating a complete app yet) where by if I have to following:<p />&lt;settertimeline path="(MenuItem.Width)" name="Timeline"&gt;&lt;doubleanimation autoreverse="True" duration="0:0:0.5" to="150" from="100"&gt;&lt;/settertimeline&gt;<p />And I remove the "From" Attribute it causes XAMLPad to crash.<p />&lt;settertimeline path="(MenuItem.Width)" name="Timeline"&gt;&lt;doubleanimation autoreverse="True" duration="0:0:0.5" to="150"&gt;&lt;/settertimeline&gt;<p />This timeline is used to do a basic animation of the width on a menu item. I am not including the "From" attribute because I want the default value of the MenuItem's width to be the start value. Is this the correct thing to do? Some examples that I have seen say this is possible.<p />Context: The Timeline is within a Style on HeaderTemplates DataTemplate Element (because I am cusom drawing the control)<p />Example XAML can be found at <a href="http://www.kinlan.co.uk/sample_sources/XAMLAnimationCrash.xaml">http://www.kinlan.co.uk/sample_sources/XAMLAnimationCrash.xaml</a>

