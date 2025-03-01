---
date: 2007-03-03
published: true
slug: devweek-day-3-review
summary: DevWeek Day 3 wrapped up my attendance with increasingly advanced sessions.
  Christian Weyer's talks on SOA development using the Webservice Software Factory
  (and its limitations) and integrating WPF, WCF, and WF were insightful, showcasing
  practical applications and upcoming open-source tools. Niels Berglund's LINQ discussion,
  while informative, left me wanting more technical depth and raised concerns about
  tight database coupling. Jeff Prosise's WPF/E presentation highlighted its potential
  for rich web UI but also its current limitations regarding input controls and data
  binding.  The lack of VisualBrush in WPF/E and its similarities with the upcoming
  Flash 9 release were noteworthy discussion points.
tags:
- DevWeek
- DevWeek2007
- SOA
- WPF
- WCF
- WF
- LINQ
- WPF/E
- Webservice Software Factory
- Thinktecture
- Visual Studio
- XAML
- Flash 9
title: DevWeek Day 3 Review

---
<p>Day three was the last day for me (this review is a little late because of my trip back was quite long).  Over the week the lectures seemed to be getting progressively more advanced and this day wasn't and exception.</p> <p>Christian Weyer's first lecture was really really good.  His talk was about developing SOA's using the Webservice Software Factory, it was a good demonstration of the fact that at the moment the Webservice Software Factory is not a Software Factory, it is a set of tools that helps the developers start an Service Orientated Application.  One of his points about why the Webservice Software Factory is not a software factory just yet is that factory doesn't maintain a model of the SOA, rather it is a Guidance package.   I spoke to him about the WSCF (Webservice Contract First Tool) that he made at Thinktecture, he mentioned that it will be Open Source'd soon so that the community can maintain it.  This is good because he demonstrated a DSL tool that he had created which integrates into Visual Studio and does maintain a model of the SOA.</p> <p>Christian Weyer's second lecture was all about integrating WPF, WCF and WF into a single solution, this was a really good lecture because he had created a great sample application (a media library) that developers should be able to learn from.  It was quite a cool application, because it demonstrated how Workflow Foundation can be integrated with Webservice's into the Windows Communication Foundation, and then with WCF he demonstrated how to write different data bindings so that you don't have to simply rely on HTTP Webservice.  Christian said that they will be releasing this sample soon so that the world can see how cool the integrated technologies are.</p> <p>Niels Berglund talk on LINQ was good, it wasn't as technical as I would have liked.  It was a demonstration of LINQ to SQL and how it provides a strongly-typed access to the database. I did learn in the lecture that "LINQ for SQL" should be translated as "LINQ for SQLServer" and that Microsoft are unlikely to make any other Database providers (This was from the mouth of a Microsoft developer in the audience).  I do have reservations about this technology, mainly that you are tightly coupling the database into you application logic.  I would much prefer to use the Conceptual Model provided by LINQ to Entities so that I can abstract my Data Model from my Application model of the data.</p> <p>Jeff Prosise WPF/E talk was another great talk by Jeff,  he basically demonstrated WPF/E and how "easy" it is to create rich UI's in the web browser simply by writing XAML.  I double quoted "easy" because he pointed out that WPF/E at the moment doesn't have any Input Controls or Data binding in, this means that you will have to create them all by hand yourself.  Saying that his sample photo browser was pretty cool.  I did notice that the VisualBrush in WPF is not present in WPF/E so things like reflections (like in his demo) have to be hacked in.  I asked him if he knew if it was planned to be, however he said it is hard to say because he has only just started to work with the WPF/E team.  He also that mentioned that some people in Microsoft are really worried about the upcoming release of Flash (Version 9) because it does very similar declarative mark-up to WPF/E.</p> <p> </p><div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; padding-bottom: 0px; margin: 0px; padding-top: 0px;">Topicala Tags: <a href="http://www.topicala.com/tag/LINQ" rel="tag">LINQ</a>[<a href="http://www.topicala.com/opml/LINQ.opml">OPML</a>], <a href="http://www.topicala.com/tag/WPF" rel="tag">WPF</a>[<a href="http://www.topicala.com/opml/WPF.opml">OPML</a>], <a href="http://www.topicala.com/tag/WPF/E" rel="tag">WPF/E</a>[<a href="http://www.topicala.com/opml/WPF/E.opml">OPML</a>], <a href="http://www.topicala.com/tag/SOA" rel="tag">SOA</a>[<a href="http://www.topicala.com/opml/SOA.opml">OPML</a>], <a href="http://www.topicala.com/tag/Thinktecture" rel="tag">Thinktecture</a>[[OPML](http://www.topicala.com/opml/Thinktecture.opml)], <a href="http://www.topicala.com/tag/Devweek2007" rel="tag">Devweek2007</a>[<a href="http://www.topicala.com/opml/Devweek2007.opml">OPML</a>], <a href="http://www.topicala.com/tag/Devweek" rel="tag">Devweek</a>[<a href="http://www.topicala.com/opml/Devweek.opml">OPML</a>]</div>

