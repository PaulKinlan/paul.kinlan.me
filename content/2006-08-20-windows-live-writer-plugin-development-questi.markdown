---
slug: windows-live-writer-plugin-development-questi
date: 2006-08-20
 
title: Windows Live Writer Plugin Development Question
published: true
---
<p>I am in the process of playing with the SmartContentSource class for creating a plugin.  But I am having some problems.</p> <p>I am debugging my plugin, to see the state of certain objects such as the SmartContent Objects.  My Plugin creates a side bar and manipulates the SmartContent Object, all fine and well.</p> <p>The problem that I am having is that I can determine what text is in the blog post at the moment.  The SmartContent object doesn't have anything, and the object represented by the ISmartContentEditorSite interface doesn't have the whole text or selected text.</p> <p>Does anybody know how to get at this text, because as I see it, if plugins can't see the blog post then there is only a small finite amount of plugins that we as developers can create.</p>

