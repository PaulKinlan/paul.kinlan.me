---
slug: xaml-menu-throbbing-answers-to-questions-
date: 2005-06-06
 
title: XAML Menu Throbbing! (Answers to Questions)
published: true
---
I recieved some answers to my questions :) They were quite helpful, so I will document them here just incase they ever help anyone :).<p />1) In the control template you can use RoutedEvents to start and stop a time line. (I don't know how I missed this). You can also use them inside DataTemplates as well.&lt;ControlTemplate.Triggers&gt;&lt;EventTrigger RoutedEvent="Mouse.MouseEnter"&gt;&lt;EventTrigger.Actions&gt;&lt;BeginAction TargetName="Timeline"&gt;&lt;StopAction TargetName="Timeline2"&gt;&lt;EventTrigger.Actions&gt;&lt;/EventTrigger&gt;&lt;/ControlTemplate.Triggers&gt;<p />These triggers are able to be placed inside a style. (link at the bottom to my example)<p />2) Again my mistake, I remember a error I got against the xsd saying TargetName needs to be present, but I must have been mistaken or it could have been another <a href="http://technorati.com/tag/XAML" rel="tag">XAML</a> Element that requires it. Anyway, the following is complety valid and can be used to apply against any control. <p />One thing I have learnt by pure experiment is that you can have storyboards inside a ControlTemplate/DataTemplate. This means that any control that meets the TargetType criteria in the style header can access the storyboard associated with it. For my example I have attached a storyboard that will be available to all MenuItems.<p />3) No answer yet butI presume it will be a while before all the documentation catches up to the implementation.<p />Anyway here is my wobbly menu example:<ul><li><a href="http://www.kinlan.co.uk/source_samples/CheesyWobblymenu.xaml">CheesyWobblymenu.xaml</a></li></ul>
<p></p>
<p />


