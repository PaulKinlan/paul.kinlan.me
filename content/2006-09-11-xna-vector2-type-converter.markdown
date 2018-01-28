---
slug: xna-vector2-type-converter
date: 2006-09-11
 
title: XNA Vector2 Type Converter
published: true
---
I was messing around with the XNA development environment the other day and I started to make a componenet that I thought would be pretty cool to use.  I got to the point where my Component had a Vector2 public property that I could use in other components but also change it in the Game Designer.<p />The only problem was that Vector2 is a struct and doesn't have any way to change the values of the Vector 2 in the designer.<p />I thought it was about time I started to learn a bit more about type converters, so I created one for this project based on the above problem.<p /><a href="http://www.kinlan.co.uk/source_samples/Vector2Converter.cs">Vector2Converter</a> is a Type convert that should be added to your exposed Vector2 Public Properties.  Once you have it on your property, you will be able to change it through the Game Designer using comma notation. i.e you will see it in the designer as {X: 0, Y: 0}, you can change it by typing in something like: 50, 100 which will then convert the output to {X: 50, Y: 100}.<p />Anyway, I have provided the code [<a href="http://www.kinlan.co.uk/source_samples/Vector2Converter.cs">http://www.kinlan.co.uk/source_samples/Vector2Converter.cs</a>] so you can change it for things like Vector3's and the like.<p />Enjoy.<p /><a href="http://www.kinlan.co.uk/tag/XNA" rel="tag">XNA</a> <a href="http://www.kinlan.co.uk/tag/TypeConverter" rel="tag">TypeConverter</a> <a href="http://www.kinlan.co.uk/tag/.Net" rel="tag">.Net</a> <a href="http://www.kinlan.co.uk/tag/C#" rel="tag">C#</a>

