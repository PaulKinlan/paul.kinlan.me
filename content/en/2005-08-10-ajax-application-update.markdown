---
slug: ajax-application-update
date: 2005-08-10
 
title: AJAX Application Update
published: true
---
I was looking at how Microsofts" Start.com (<a href="http://www.start.com/myw3b" rel="tag">www.start.com/myw3b</a>) pulls in data from web feeds that are not on there own servers and it seems that they have a script that forwards on the request to the remote server and passes it back as their own. <p />Essentially the request is tunneled through their systmen and passed back to the client.<p />This is done so because browsers such as Firefox and Internet Explorer (in certain configurations) will not allow a website to get data from another domain.  Which, for security reasons makes sense I suppose.<p />It therefore seems that for my AJAX Application I will have to take the hit of the added bandwidth for the data that will returned from Yahoo and Technorati.<p />I don"t think I can perform a Redirect on the XMLHttpRequest, as that will probably cause many more problems.<p />

