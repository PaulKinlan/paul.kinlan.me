---
date: 2006-09-02
published: true
slug: what-you-can-t-do-in-windows-live-writer
summary: 'I''ve been exploring Windows Live Writer plugins and hit a snag: the API
  doesn''t let plugins access the post''s text. This severely limits plugin functionality,
  preventing things like automated tagging or microformat integration. I''ve raised
  this issue on the Windows Live Writer forum and with Microsoft''s Joe Cheng, emphasizing
  the need for text access to enable a wider range of plugins. I encourage other developers
  to voice similar concerns to Microsoft.'
tags:
- windows live writer
- plugins
- api
- microformats
- text access
- microsoft
title: What you can't do in Windows Live Writer

---
<p>A short while ago I wanted to convert my ajax tagger in to a Windows Live Writer Plugin.</p> <p>After some silly mistakes creating sample plugins I started to learn how the API works and some the short falls of the current API.</p> <p>The main thing I noticed was that you cannot access the text of the post inside your plugin.  You cannot access the selected text either.</p> <p>I pinged off an email to the Window Live Writer Forum</p> <blockquote class="posterous_medium_quote"> <p>I am in the process of playing with the SmartContentSource class for creating a plugin.  But I am having some problems. </p>
<p>I am debugging my plugin, to see the state of certain objects such as the SmartContent Objects.  My Plugin creates a side bar and manipulates the SmartContent Object, all fine and well. </p>
<p>The problem that I am having is that I can determine what text is in the blog post at the moment.  The SmartContent object doesn't have anything, and the object represented by the ISmartContentEditorSite interface doesn't have the whole text or selected text. </p>
<p>Does anybody know how to get at this text, because as I see it, if plugins can't see the blog post then there is only a small finite amount of plugins that we as developers can create.</p>
</blockquote> <p>And this was the response that I got from Joe Cheng at Microsoft.  </p><blockquote class="posterous_medium_quote"> <p>Right now, the plugin model is just about inserting objects.  Can you share what your idea for a plugin is? </p>
<p>It's not as simple as saying "whole text" or "selected text", blog posts are composed of a pretty rich set of objects from MSHTML and from our own framework.  If we can understand your specific scenario it would help us figure out the right way to design these interfaces. </p>
<p>Thanks...</p>
</blockquote> <p>Which is straight to the point.  I have let them know of the ideas of the things that I wanted to do. </p><p>I would also suggest that if you have any other ideas for plugin for Windows Live Writer that you cannot create in the current implementation of the API, then let them know as quick as you can so that we can get a big bit of ground support so that are requests will be taken notice of. </p><p>I belive we need access to the text of the plugin because without it we will be very limited to the number and types of plugins that we can create. </p><p>For instance we would not be able to mark up posts with microformats as easily.  We will not be able to respond to the content and meaning of the post, so for instance we would not be able to create an automated tagger that simply looks at the content of a post and works out the topics (much like my Ajax Tagger <a href="http://ajaxtag.kinlan.co.uk/">http://ajaxtag.kinlan.co.uk/</a>). </p><p>tags: <a href="http://www.kinlan.co.uk/tag/microformat" rel="tag">microformat</a>, <a href="http://www.kinlan.co.uk/tag/windowslivewriter" rel="tag">windowslivewriter</a>, <a href="http://www.kinlan.co.uk/tag/windows+live+writer" rel="tag">windows live writer</a>, <a href="http://www.kinlan.co.uk/tag/microsoft" rel="tag">microsoft</a>, <a href="http://www.kinlan.co.uk/tag/live" rel="tag">live</a>, <a href="http://www.kinlan.co.uk/tag/plugin" rel="tag">plugin</a>, <a href="http://www.kinlan.co.uk/tag/api" rel="tag">api</a></p>

