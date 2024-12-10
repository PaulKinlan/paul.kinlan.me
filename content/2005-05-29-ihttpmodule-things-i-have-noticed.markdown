---
date: 2005-05-29
published: true
slug: ihttpmodule-things-i-have-noticed
summary: During the development of a custom IHttpModule, it's important to be aware
  of the timing of context access.  Avoid accessing HttpContext properties directly
  within the Init method, as the context isn't fully initialized yet.  Instead, handle
  events like BeginRequest. Within those event handlers, the HttpContext object provided
  will be fully populated, allowing access to properties such as HttpMethod, QueryString,
  and Form.
tags:
- IHttpModule
- ASP.NET
- C#
- .NET
- HttpApplication
- HttpContext
- BeginRequest
- Init
- QueryString
- Form
- HttpMethod
title: IHttpModule Things I have noticed

---
Something I have learnt today whilst playing with <a href="http://technorati.com/tag/IHttpModule/tag" rel="tag">IHttpModule</a> is that when the Init method is called you shouldn't access the Context method the HttpAplication exposes because it seems like it is not fully constructed (things like the HttpMethod, QueryString and Form properties are not created).<p />However, if you handle an event like such:<p /><span style="FONT-SIZE: 85%;">context.BeginRequest += <span style="COLOR: #3366ff;">new</span> EventHandler(Context_BeginRequest);</span><p />then once you enter the EventHandler, the Context Object (attached to the source parameter) seems to be fully constructed.<p /><span style="FONT-SIZE: 85%;"><span style="COLOR: #3333ff;">private</span> void Context_BeginRequest(<span style="COLOR: #6633ff;">object</span> sender, EventArgs e){_context = ((HttpApplication)sender).Context;</span><p />

