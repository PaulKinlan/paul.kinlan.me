---
date: 2005-08-14
published: true
slug: feedsters-api
summary: The Feedster API has potential, but it's unclear what its purpose is. It
  would be more useful if it allowed content searches and provided metadata about
  searches, such as the number of blogs or pages a term appears in.  Additional features
  like showing top searches and providing search result counts could be valuable.  The
  current API requires a private key, which necessitates a proxy script for security.
  A simpler authentication method like Yahoo's Application ID would be preferred.  Despite
  some limitations, the ability to publish search results as an RSS feed is a nice
  feature.
tags:
- Feedster
- API
- search
- metadata
- RSS
- proxy
- Technorati
- Yahoo
title: Feedsters API

---
I am just sitting here reading about the <a href="http://developers.feedster.com/index.php/Feedster_API" rel="tag">Feedster API</a>, and I am wondering what is the point.<p />I like the idea of them providing an API, but I just don't get what it is this API is supposed to provide.  Is it supposed to be a list of feeds and related data belonging to a site?  I was hoping that they would provide a content search.<p />However syaing that,  you can quickly get do a search by substituting the query paramaters in their own search on their site, like the ones I used to provide.<p />Perhaps I would like to see searches through an API, but I would also like to see more meta data about searches, so for instance if I did a search for Kinlan on feedster through an API it would return information like the number of blogs "Kinlan" is mentioned in.  The number of pages etc.  You could instantly see the popularity of certain searches then (I could have a search that provides my page users with a count of all the people talking about me - Zero at the moment). <p />Also cute little API's that will enable users to see the top searches every hour.  Just little things like that.  I could see a lot of people integrating these features into their sites.  I would.<p />I use the technorati api and the Yahoo API to help me categorize my blog entry.  I used to have links to feedster searches (which I removed because they took me too damn long to create - the query string for searching is MASSIVE).  If I could rate my searches with the number of results before I check the results and other Meta data of my search I would find that quite handy .<p />Publishing search results as an RSS Feed is cool though! :)<p />Also to use the API, I have to provide my private key, this means that I have to hide it, that means that I have to provide a proxy script on my server to get to the results data.  I would like a way that I could get to the API without having to proxy all the requests from my site.  Yahoo make you use an Application ID, that ID doesn't have to be secret it is just for reporting.<p />

