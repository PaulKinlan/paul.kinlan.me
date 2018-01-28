---
slug: just-downloaded-xna-beta-and-i-had-to-change-
date: 2006-08-30
 
title: Just Downloaded XNA Beta and I had to change the template code to get it to work
published: true
---
<p>I think I am probably in a minority with the XNA, I am running on a really old athlon with a Geforce 2MX and I had to change some code because of a Device Creation Exception.</p> <p>If you get some errors, check the inner exceptions and see if it is your device, i.e. Graphics Card that is causing the problems. </p> <p>In my case my device doesn't support MultiSampling on the Backbuffer so I had to add the following line to the InitilizeComponent in the Game object.</p> <p>Before:</p> <p align="left">this.graphics =  new Microsoft.Xna.Framework.Components.GraphicsComponent(); </p> <p align="left">this.GameComponents.Add(this.graphics); </p><p align="left">After:</p> <p align="left">this.graphics =  new Microsoft.Xna.Framework.Components.GraphicsComponent(); </p> <p align="left">this.graphics.AllowMultiSampling = false;</p> <p align="left">this.GameComponents.Add(this.graphics);</p> <p align="left">I hope this helps.</p> <p> </p> <p>ps if anyone wants to donate any hardware email me ;)</p> <p><a href="http://www.kinlan.co.uk/tag/xna" rel="tag" target="_blank">xna</a>, <a href="http://www.kinlan.co.uk/tag/directx" rel="tag" target="_blank">directx</a></p>

