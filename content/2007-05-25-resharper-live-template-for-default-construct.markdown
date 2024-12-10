---
date: 2007-05-25
published: true
slug: resharper-live-template-for-default-construct
summary: This post introduces a ReSharper Live Template to expedite creating default
  constructors in C#.  The template, activated by typing \"dc\", automatically inserts
  a public default constructor for the containing class, saving developers keystrokes
  and time.  An example demonstrates its usage.
tags:
- Resharper
- Live Templates
- C#
- Constructors
- Productivity
- Code Generation
- IDE
- Templates
title: Resharper Live Template for Default Constructor

---
I have created a simple Resharper Live Template for saving typing time when you want to create a default constructor.<p />The basic templzate is:<strong>Abbreviation</strong>: dc<strong>Description</strong>: Create a Default Constructor<strong>Available</strong>: everywhere<strong>Template</strong> <strong>Text</strong>:<span style="color: #3366ff;">public</span> <span style="color: #cc6600;">$CLASSNAME$</span>(){<p />}<p /><strong>Template Variables</strong>:<strong>Name</strong>:CLASSNAME<strong>Value</strong>: Containing type name<strong>Editable</strong> Occurence: false<p />See the image below as an example:<p />[[posterous-content:CGnzHzyzixIvAcGwmqBs]]<p />Topicala Tags:[Resharper](http://www.topicala.com/tag/Resharper), [Live Templates](http://www.topicala.com/tag/Live%20Templates)

