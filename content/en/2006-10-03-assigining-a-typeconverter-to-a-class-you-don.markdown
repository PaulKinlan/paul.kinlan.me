---
slug: assigining-a-typeconverter-to-a-class-you-don
date: 2006-10-03
 
title: Assigining a TypeConverter to a class you don't own
published: true
---
<p>I ran into problems with the XNA Beta1, where by I had a class that had a Vector2 struct in.  The problem with the XNA Vector2 struct is that there is no TypeConverter for it at the moment.  This means that there is no support in the designer.  </p> <p>I initially solved this problem by assigning a type converter to the public property on my class that used the Vector2. (see below)</p><div class="CodeRay">
  <div class="code"><pre>public class A{ private Vector2 v; [TypeConverter(typeof(Vector2Converter))] public Vector2 Vec {  get{ return v; }  set{ v= value} }}</pre></div>
</div>
<br /><p>However, VS2005, when serializing out to code from the designer, it will not obey the TypeConverter on the property, but will try to use the Type's Conveter eventhough the designer will use the TypeConverter on your class to edit the control... clear as mud? :)</p><br /><p>This leads to ugly code in the InitializeCode method that tries to look in the resource file to get the object out.  I didn't like this solution because it looks ugly and is hard to maintain.</p><br /><p>I solved this problem by forcing the TypeConverter on to the Vector2.  In my classes constructor I called the following code I have created.</p><div class="CodeRay">
  <div class="code"><pre>public static void Register&lt;T, TC&gt;() where TC: TypeConverter{ Attribute[] attr = new Attribute[1]; TypeConverterAttribute vConv = new TypeConverterAttribute(typeof(TC));      attr[0] = vConv; TypeDescriptor.AddAttributes(typeof(T), attr);}</pre></div>
</div>
<br /><p>The above code adds the TypeConverter (TC) to the Type (T) so that the designer can serialize to code correctly using my own TypeConverter.  The main thing it is doing is calling: <strong>TypeDescriptor.AddAttributes</strong></p><br /><p>The solution then allows the Designer to serialize to code and it gets rid of having to serialize the object to a resource file.  The solution would look like the code below.</p><div class="CodeRay">
  <div class="code"><pre>public class A {  private Vector2 v;   //Enables Designer support, so it can be edited [TypeConverter(typeof(Vector2Converter))]  public Vector2 Vec {   get{ return v; }   set{ v= value}  }  public A() {  //Enables designer serialization to code  ConverterRegistration.Register&lt;Vector2 , Vector2Converter&gt;(); }}</pre></div>
</div>
<br /><p><br /></p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; float: none; padding-bottom: 0px; margin: 0px; padding-top: 0px;">Tags: <a href="http://www.kinlan.co.uk/tag/c#" rel="tag">c#</a>, <a href="http://www.kinlan.co.uk/tag/.net" rel="tag">.net</a>, <a href="http://www.kinlan.co.uk/tag/TypeConverter" rel="tag">TypeConverter</a>, <a href="http://www.kinlan.co.uk/tag/XNA" rel="tag">XNA</a>, <a href="http://www.kinlan.co.uk/tag/Vector2" rel="tag">Vector2</a>
</div>

