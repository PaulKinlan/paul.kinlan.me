---
slug: re-c-where-do-you-define-an-enum
date: 2005-10-24
 
title: "RE: C# : Where do you define an enum"
published: true
---
There is an interesting article over on Abhinaba's weblog about where you would place the declaration of the enum.  I personally don't agree with his argument.  He says that his ideal way of defining the placement of an enum is at the level of the class and not inside the class.<p />His basic argument that typing the class name infront of the enum can become a pain.  I don't really care that it can be a pain, that is what intelisense is there for.  Having the enum defined in the class is better in my opinion because it means that there will be fewer abiguity problems if you need to use another enum with the same name from another class.  It is, in my opinion also easier to read.<p />Anyway, below is a snippet of his journal entry.   To see what he has to say visit his blog, and see if you agree with me or not.<p />Email me: [paul.kinlan@gmail.com](mailto:%20paul.kinlan@gmail.com)<p /><blockquote>
<p>Frequently while designing classes that have methods which accept enums as parameters, a common question arrises on where to define the enum. Whether to define it inside the class or in the same level as the class. </p>
<br /><p>Lets consider a class Folder which has a method List. It accepts a enum Filter and based on it prints the name of all files or directories in the Folder. We can define the enum at the same level as the Folder as below</p>
<div class="CodeRay">
  <div class="code"><pre></pre></div>
</div>

<p>enum Filter</p>
<p>{</p>
<p>    File,</p>
<p>    Dir</p>
<p>}</p>
<p>class Folder</p>
<p>{</p>
<p>    public Folder(string path) { /* ... */ }</p>
<p>    public void List(Filter filter) { /* ... */ }</p>
<p>}</p>
<p>Folder folder = new Folder("c:\");</p>
<p>folder.List(Filter.File);</p>
<br /><p>Or define it inside the Folder class as in</p>
<div class="CodeRay">
  <div class="code"><pre></pre></div>
</div>

<p>class Folder</p>
<p>{</p>
<p>    public enum Filter</p>
<p>    {</p>
<p>        File,</p>
<p>        Dir</p>
<p>    }</p>
<p>    public Folder(string path) { /* ... */ }</p>
<p>    public void List(Filter filter) { /* ... */ }</p>
<p>}</p>
<p> </p>
<p>Folder folder = new Folder(@"c:\");</p>
<p>folder.List(<strong>Folder.</strong>Filter.File);</p>
<p>...</p>
</blockquote><br /><i>[Via [MSDN Blogs](http://blogs.msdn.com/abhinaba/archive/2005/10/24/484120.aspx)]</i><p />

