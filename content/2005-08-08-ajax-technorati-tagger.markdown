---
date: 2005-08-08
published: true
slug: ajax-technorati-tagger
summary: I've created my first AJAX application, an AJAX Technorati Tagger, which
  can be found here.  It allows users to input text, receive suggested Technorati
  tags (powered by Yahoo's web service), and generate a list of related keywords.  It's
  still a work in progress with some bugs, but feedback is welcome!
tags:
- ajax
- technorati
- tags
- yahoo
- web service
- javascript
- application
title: AJAX Technorati Tagger

---
My First AJAX Application is now up (<a href="http://www.kinlan.co.uk/AjaxExperiments/AjaxTag.html">here</a>).<p />Some thanks must go out to Bill Bercik whos <a href="http://www.webpasties.com/xmlHttpRequest/">sample AJAX application</a> I looked at and used a smidging of code from (The AJAX object factory).<p />The way to use the application is to as follows:<ul>
<li>Enter some text into the first page.  This text has to be more that a couple of words.</li>
<li>Click "Submit", this will call the yahoo web service and present the user with a list of "potential" tags for technorati. (There will be a hook in to technorati here at some point in the future).</li>
<li>Select the tags you wish to use and click next (this next step might take a while).</li>
<li>When on the next page it will give the user a list of related keywords (again from Yahoo!), [NOTE: Selecting the search results is not nesecarry because it doesn"t do anything just yet].</li>
<li>Click "Finish", to generate the link list that looks similar to mine at the bottom of this blog entry.</li>
</ul>Anyway all comments, hate mail etc is accepted :)<p />ps.  There are a lot of Bugs to be ironed out. :)<p />

