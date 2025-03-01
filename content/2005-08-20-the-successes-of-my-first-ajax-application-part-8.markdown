---
date: 2005-08-20
published: true
slug: the-successes-of-my-first-ajax-application-part-8
summary: This post, part 8 of a series about my first AJAX application, discusses
  my return to Perl programming after a year of focusing on C# and .Net.  I needed
  to solve cross-domain scripting issues when calling a web service directly from
  the webpage. My solution involved proxying the request through a Perl script on
  my server, which also hid my developer tokens.  I found Perl's libraries easy to
  use and effective for this task.  Future plans include more Perl scripting to aggregate
  data from different blogs and web services, leveraging the proxy to combine multiple
  calls and enhance functionality. I also learned a valuable lesson about using \"content()\"
  methods for POST operations instead of the query string.
tags:
- AJAX
- Perl
- Cross-domain scripting
- Web services
- Proxy
- C#
- .Net
- Linux
- RSS feeds
- Data aggregation
title: 'The Successes of my first AJAX Application: Part 8'

---
This is the 8th installment about my Successes and Failures of my first AJAX application: It got me thinking about Perl again!<p />I have been looking forward to this post, I don’t especially know why. When I was 16, I started a small company (which I left, but is now doing well – oh well), it was called PCBware (Paul, Chris and Ben)ware. Its name is now <a href="http://www.Switchmedia.co.uk">www.Switchmedia.co.uk</a> (they host my Blog for me). One of the things that we did an amazing amount of was Perl. All our systems were written in Perl, it was fun. Anyway, as it transpires, other things have happened to me and I am heavily involved in C# and .Net application development now.<p />I stopped using Perl about 1 year ago and have not touched it since. That is until I did this AJAX application.<p />If you have ready some of my posts recently you will see that I was struggling with Cross Domain scripting, basically I needed to call a web service directly from the web page. Unfortunately, Firefox won’t allow this and IE will (if you are running in an unsecured manner), so the only thing that I could do was to proxy the request through a script on my server and pass the results back to the client. This had a couple of benefits, firstly it got the cross site scripting to work correctly and secondly it allowed me to hide my Developer Tokens, which for some API is key.<p />I will post my scripts in the next few posts. If you spot any problems let me know, because it is vital that I understand why I have made mistakes.  <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a><p />Anyway, back to the subject. I really enjoyed my re-entrance into Perl, the libraries are numerous and really quite easy to use. The scripts are really simple, but they helped me no end. The scripts are based around LWP and CGI.<p />In the next version of my Web app, I will need to create more scripts, but I am hoping to provide more services, such as knitting differing blogs together to aggregate the data better.  I also need to create one script for each different type of Web Service that I am going to allow the application to consume. <p />Controlling the access to the Web Service through a proxy script will allow me to do a couple of cool things, like I said earlier, I could join RSS feeds together better.  I could also aggreagte multiple calls to a web service in one single call through the proxy.  I have lots and lots of options.<p />I hit some problems with my understanding and some simple mistakes both with the client code and the server code. <strong>HINT</strong>, if you are performing a post operation, there are normally <em>"content()"</em> methods that allow you to pass in masses of data. Initially I was putting all this on the query string which is the wrong thing to do.<p />I am really looking forward to doing a bit more Perl for the next version of the application.  Also the reason why I am not doing it in .Net is because I am hosted on a Linux Box.<p />

