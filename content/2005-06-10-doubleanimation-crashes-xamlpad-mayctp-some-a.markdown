---
date: 2005-06-10
published: true
slug: doubleanimation-crashes-xamlpad-mayctp-some-a
summary: DoubleAnimation crashes in XAMLPad (May CTP) when animating Width or Height
  without specifying both \"From\" and \"To\" values, or when a base value isn't set.
  This is because the animation infers these values from the base value, which may
  not be available until layout execution.  Setting the Width or Height on the element
  or in a style usually resolves the issue. However, I encountered a case where animating
  a MenuItem's width failed even after attempting to set a default width through a
  style.  A suggested solution involved explicitly setting the width on the element,
  as the animation infers the 'To' value from the base value, which needs to be available
  for a smooth transition. I then tried setting a default Width on the MenuItem Style
  and the crash still occurs in XAMLPad. My next step is to test this in a WinFX application.
tags:
- xaml
- xamlpad
- doubleanimation
- animation
- winfx
- crash
- width
- height
- menuitem
- style
- layout
- mayctp
title: 'DoubleAnimation Crashes XAMLPad (MayCTP): Some Answers To Questions'

---
I posted around some news groups to find an answer about my crash and a I recieved the following reply from Mike Hillbert.<p /><blockquote>When you're animating Width or Height, you have to specify both the From and the To, or you have to have specified the base value somewhere (e.g. on the element itself).<p />That's because when you don't specify the From or To it gets inferred from the base (unanimated) value.  And in the case of Width and Height, the base value often isn't known until later when layout runs.<p />For example, in this page<p />&lt;Page ...&gt;    ...    &lt;Page.Storyboards&gt;       &lt;SetterTimeline TargetName="btn" Path="(Button.Width)" &gt;            &lt;DoubleAnimation From="50"  /&gt;       &lt;/SetterTimeline&gt;    &lt;/Page.Storyboards&gt;    ...    &lt;Button Width="100" Name="btn" Background="Blue"&gt;Click&lt;/Button&gt;    ...&lt;/Page&gt;<p />the button's width is explicitly set on the &lt;Button&gt;, so the animation implicitly takes the width to 100 (from 50).  But if you don't have the Width set in the &lt;Button&gt;, and don't have it anywhere else (e.g. in a Style), you have to have the From on the DoubleAnimation.</blockquote><p />I think it basically sums up the problem quite simply.  I wasn't giving the actual MenuItem a width, the "Owner Draw" elements in the Visual Tree had a width but the actual menu item didn't.  Funnily enough (Well it is not that funny), I tried the suggested fixes and the crash was still occuring.  I also tried the following bit of XAML which is supposed to give every control that meets the style criteria a width of 200:<p /><blockquote class="posterous_short_quote">&lt;Style TargetType="{x:Type MenuItem}" x:Key="{x:Type MenuItem}" &gt; &lt;Setter Property="Width" Value="200" /&gt; ... ...</blockquote><p />I think my next course of action is to try and get this in a proper WinFX application rather than just XAMLPad.

