---
slug: the-successes-of-my-first-ajax-application-pa
date: 2005-08-16
 
title: "The Successes of my first AJAX Application: Part 4"
published: true
---
This is the fourth part to my successes and failures when creating an AJAX Experimental application.<p />Part 4: It got me thinking about how to take advantage of the Technorati API.<p />Because the general idea of the application that I was starting to develop was to help automate the creation of Technorati Tags and other Interesting searches, it was a logical step to start to use the Technorati Developer API (<a href="http://developers.technorati.com/wiki/">http://developers.technorati.com/wiki/</a>).<p />Technorati offers about 8 different API's which allow you to create applications based around the data that they collect from their spider. The API's are easy to use, and like the Yahoo! (<a href="http://developer.yahoo.net">http://developer.yahoo.net</a>) API's use the REST method of interacting with web services. This has the advantage of easily being able to construct simple requests through the use of a GET command.<p />Their basic API consist of:<br /><ol>
<li>CosmosQuery: Queries information about who in the "Blogosphere" </li>
<li>SearchQuery: Obtains a list of blogs that contain the query that the REST query provides</li>
<li>GetInfoQuery: Information about a user of Technorati.</li>
<li>OutboundQuery: Who the blog you are searching for links too. </li>
<li>BlogInfoQuery: Information about one particular blog.</li>
<li>TagQuery: Information about the number of blogs, and post that contain a specific tag. As well as a list of the blogs.  </li>
<li>TopTags:  The tags in the popularity range n,m</li>
<li>KeyInfo:  Some usage statistics, such as the number of queries that day.</li>
</ol><p>I used the Tag Query, to help determine how popular certain keywords are. (Pulled back from the Yahoo API).  This helped me to determine which of the tags were important, and also the tags that would help me get the most exposure for a particular entry.</p><p>One thing that this Tag doesn't do, but I think it should, is to return the ranking of the Tag.  There isn't a way to find the relative posistion of this tag.  All you could do is to incrementally search through the TopTags to see where the tag is positioned.</p><p>I didn't take full advantage of the API, because there are some holes in what can be done with it.  One of the features that I would like to see is the "related tags".  The technorati site contains this information and I think would be a real benefit to developers if we could also access this information.</p><p>Unfortuantly the TagQuery is a little slow, it is quite heavy weight, so I had to remove it from the App, however because of this I have a couple of options when I come to redevelop the AJAX application:</p><ol>
<li>Only as the TagQuery to return 1 blog result.  This will reduce the bandwidth and I hope the response time.</li>
<li>Develop a Asynchronus Call manager (I have talked about in Part1: It got me thinking Asynchronosly! <a href="http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application.html">http://www.kinlan.co.uk/2005/08/successes-of-my-first-ajax-application.html</a>).  The call manager will be a queue based priority system, it will work out the most important calls to make first. (It won't be complex).</li>
<li>Ask Technorati to develop a light-weight MetaData interface.</li>
</ol><p>My next application will have to use both of the above points.</p><p>Any Thoughts or guidance you can give me.  Email me: <a href="mailto:paul.kinlan@gmail.com">paul.kinlan@gmail.com</a></p><br />

