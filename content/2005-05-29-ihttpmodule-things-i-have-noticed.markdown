---
slug: ihttpmodule-things-i-have-noticed
date: 2005-05-29
 
title: IHttpModule Things I have noticed
published: true
---
Something I have learnt today whilst playing with <a href="http://technorati.com/tag/IHttpModule/tag" rel="tag">IHttpModule</a> is that when the Init method is called you shouldn't access the Context method the HttpAplication exposes because it seems like it is not fully constructed (things like the HttpMethod, QueryString and Form properties are not created).<p />However, if you handle an event like such:<p /><span style="FONT-SIZE: 85%;">context.BeginRequest += <span style="COLOR: #3366ff;">new</span> EventHandler(Context_BeginRequest);</span><p />then once you enter the EventHandler, the Context Object (attached to the source parameter) seems to be fully constructed.<p /><span style="FONT-SIZE: 85%;"><span style="COLOR: #3333ff;">private</span> void Context_BeginRequest(<span style="COLOR: #6633ff;">object</span> sender, EventArgs e){_context = ((HttpApplication)sender).Context;</span><p />

