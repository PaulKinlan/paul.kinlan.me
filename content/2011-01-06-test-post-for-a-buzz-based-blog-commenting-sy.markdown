---
slug: test-post-for-a-buzz-based-blog-commenting-sy
date: 2011-01-06
 
title: Test post for a Buzz based Blog Commenting system
published: true
---
<p><span style="font-family: arial, helvetica, sans-serif;">There isn't much to see here just yet, but I am just writing this as a test harness for a simple commenting system that I am developing using Buzz affectionatly named commently.</span></p>
<p />
<div><span style="font-family: arial, helvetica, sans-serif;">Maybyly I am taking the naming too far, but this is a simple service that allows you to embed comments into your blogging platform.</span></div>
<div>
<p><span style="font-family: arial, helvetica, sans-serif;">The comments are synchronized with Buzz based on the feed that you push to Buzz.</span></p>
<p><span style="font-family: arial, helvetica, sans-serif;">It is super simple to start, simply embed the following javascript into your blog or website</span></p>
<h2 style="font-family: Times; font-size: medium;">The 10 second "Getting Started" guide</h2>
<span style="font-family: Times; font-size: medium;">
</span><div class="CodeRay">
  <div class="code"><pre>&lt;script&gt; </pre></div>
</div>

<div class="CodeRay">
  <div class="code"><pre>var handler = function(data) 
{ // data is an Buzz activity 
  // data.replies is a list of the replies to the thread 
  // data.likes is a list of the user likes on the thread 
}; </pre></div>
</div>

<div class="CodeRay">
  <div class="code"><pre>&lt;/script&gt;</pre></div>
</div>

<div class="CodeRay">
  <div class="code"><pre>&lt;script src=&quot;http://commently.appspot.com/lib/comments.js?title=[Blog Title]&amp;username=[Username]&amp;callback=handler&quot;&gt;&lt;/script&gt;</pre></div>
</div>


<p><span style="font-family: arial, helvetica, sans-serif;">Simply replace&nbsp;<em>[Username]</em>&nbsp;with your buzz name (paul.kinlan in my case); replace [Blog Title] with a url encoded title of your article as it appears in your ATOM or RSS feed; fill out the "handler" function with logic to construct a nice looking area for the comments.</span></p>
</div>

