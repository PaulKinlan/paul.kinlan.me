---
slug: google-search-c-expando
date: 2005-11-07
 
title: "Google Search: c# expando"
published: true
---
One of the queries that came to my site the other day was: <strong>c# expando</strong>. Now you could take this to mean one of several things:<br /><ol>
<li>Creating JavaScript Expando Objects in C#</li>
<li>Creating C# Expando classes for use in C#</li>
<li>Something Else</li>
</ol><p>If it is something else, email me: <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a> and I will see if I can shed any light.</p><p>If however it is choice 1, I know how to do this, but it can be quite a big subject. In IE it is really simple to do, you can simply use an attribute on a class and there you have an expando. Basically an expando is an arbitary object that is attached created at runtime on another. If you want you can also use setAttribute on the object and add a variable that way.</p><p>function Kinlan()<br />{<br />this.Test = 1;<br />}<p />var currKin = new Kinlan();</p><p>currKin .Test = 2;<br />currKin .Bleep = "bleeeep";</p><p>The Object currKin, will have two properties, one test, the other Bleep. It is that simple.</p><p>To do it in C# when creating javascript wouldn't be too different. You would just have to make sure your JavaScript looked like that above. You could also attach new attributes to HTML Elements from C# which would be "expandoesk". Say you had a table t and you wanted to have a flag on it called readyToDelete you could add it to the Page via something similar to:</p><p>HTMLTable t = new HTMLTable();<br />t.ID="testTable";<br />t.Attributes.Add("readyToDelete", "false");<br />...</p><p>The above code would create a HTMLTable with an attribute called readyToDelete with the value false.</p><p>Going back to the begining; if it was option 2, I am not too sure how you would achieve dynamic addition of properties or variables to an object, but I assume it would involve Reflection and a lot of extra leg work. I know that there is also such a thing as an ExtenderProvider, but again I am not too sure how it works [Tooltips in Winforms extend the Class that it is attached too by providing an new Propery called "ToolTip"].</p><p>I have also heard that C# 3.0 may provide this type of functionality but that is just hearsay, I haven't actually read the spec.</p><p>I will look up the Reflection methods; the ExtenderProvider and also C# 3.0 spec.</p><p />

