---
slug: rest-and-soap
date: 2005-04-17
 
title: REST and SOAP
published: true
---
I have been playing with Amazons <a href="http://www.amazon.com/gp/browse.html/102-2497589-1043300?_encoding=UTF8&amp;node=3435361">SOAP API </a> as well as Yahoo's <a href="http://developer.yahoo.net/">REST API</a>.  I really like both of these API's.  I will talk about some ideas I have for letting both of these API's interact in a later blog. :) <p />I was looking into using REST in .Net 1.1, it was a bit of hack but it is based off <a href="http://www.mgbrown.com/Downloads.aspx#Yahoo">Martin G. Brown </a>work.  The basic steps are to download an XSD for the response package.  Pass it thorough the XSD.exe tool which will create a Dataset based object which mimics the results.  You can then get the results and process them however you need.<p />Basically we are doing something similar to what WSDL does (obviously we are not creating stubs that WSDL does for the serialization and the communication process).  But it is not too hard to start the communications off. [I will include some code examples for Yahoo].<p />I am yet to look into <a href="http://www.google.co.uk/apis/">Googles API</a>, supposedly it is still a Beta with quite a strict usage limit.  But hey, it might change! :)

