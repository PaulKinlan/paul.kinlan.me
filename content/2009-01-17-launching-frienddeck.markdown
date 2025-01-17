---
date: 2009-01-17
published: true
slug: launching-frienddeck
summary: I'm excited to announce the launch of FriendDeck, a new tool inspired by
  TweetDeck that enhances the FriendFeed experience.  Built on Google App Engine and
  using jQuery, FriendDeck lets you create persistent searches to track topics in
  real-time, rather than just seeing your friends' posts. This is particularly helpful
  for monitoring developing events, as demonstrated by Neville Hobson's use of FriendDeck
  during the US Airways Hudson River landing. FriendDeck supports a simple query language
  for searching by keyword, user likes/comments/friends, URLs, domains, and FriendFeed
  rooms.  It also allows posting to FriendFeed directly from the application.  Each
  deck auto-refreshes every minute, and new features like inline commenting are coming
  soon. Check it out at www.frienddeck.com!
tags:
- FriendFeed
- FriendDeck
- Social Media
- Real-time Search
- Google App Engine
- jQuery
- API
- TweetDeck
title: Launching FriendDeck

---
<p>I have been beavering away at a lot of social network API's recently which lead me first to Twitter's API and then onto FriendFeed's API.  I really like FriendFeed's API, it is very meticulous in the data it aggregates and makes available to developers.</p> <p>So after a couple of hours playing with the API I endeavoured on my first major project with FriendFeed. I named the project <strong><a href="http://www.frienddeck.com">FriendDeck</a></strong>, the basic premise is that there is no similar tool available for FriendFeed that works like TweetDeck.</p> <p>FriendDeck is entirely hosted on the <strong>Google App Engine</strong> and in the most part is entirely UI driven through liberal use of <strong>jQuery</strong>.</p> <p>The main problem that I have with FriendFeed is that you see all your friends posts, which is great in the most part, but I want to be able to see posts on the general topics that I am interested in as they occur around the world.  So FriendDeck's first focus is to allow you to search FriendFeed and always be up-to date on the topics you are interested without ever leaving the browser or refreshing the page.</p> <p>You get an ever refreshing view on the parts of the real-time web that you are interested in, and not what all your friends are interested in.</p> <p>A great example of its use was described by <a href="http://friendfeed.com/neville">Neville Hobson</a>, where he was tracking the real-time web using FriendDeck with regards to the US Airways Crash into the Hudson river.  His screen-shot of his Deck can be seen <a href="http://i.friendfeed.com/3db96c3806e0efcc683d3cfa98803d7f612b2aef">here</a></p> <p>I made the decision early on that I wanted as much of the User Interaction to be done through the Query box so I designed a very basic language to support multiple types of queries.</p> <p>The most basic query is a general topic search and this can be achieved by typing any text into the Query box.</p> <p>You can post to FriendFeed from FriendDeck, (if you are logged in) by stating the command <strong>say:here is my comment</strong>.</p> <p>You can also view a list of a user’s likes by using the query <strong>likes:{username}</strong> for example <strong>likes:kinlan</strong>, you can also see a users comments by typing <strong>comments:{username}</strong> in the query box. A user’s friends can be obtained by querying <strong>friends:{username}</strong>. A list of posts relating to a URL can be found by using the query <strong>url:{url}</strong> (so <strong>url:www.frienddeck.com</strong>) and likewise a list of posts about a domain can be found using the query <strong>domain:{domain}</strong>.  If you are associated with a room you can view all the latest posts by using the command <strong>rooms:{roomname},</strong> for example<strong> rooms:frienddeck</strong>  </p><p>Every minute each of your decks will auto refresh (I fixed a bug tonight that was causing them not to refresh correctly) so you will always get the latest information.  </p><p>A few new features will be available soon, such as inline commenting. You can currently see a list of all the comments by clicking on the comments count. Your comments being highlighted red.  </p><p>I am always keen to hear peoples comments so please feel free to get in contact.</p> <p> </p> <p>FriendDeck: <a href="http://www.frienddeck.com">www.frienddeck.com</a></p> <p> </p> <div class="wlWriterSmartContent" style="padding-right: 0px; display: inline; padding-left: 0px; float: none; padding-bottom: 0px; margin: 0px; padding-top: 0px;">A Topical Search Engine Tags: <a href="http://www.atopical.com/FriendDeck" rel="tag">FriendDeck</a>, <a href="http://www.atopical.com/FriendFeed" rel="tag">FriendFeed</a>, <a href="http://www.atopical.com/Google%20App%20Engine" rel="tag">Google App Engine</a>, <a href="http://www.atopical.com/GAE" rel="tag">GAE</a>, <a href="http://www.atopical.com/jQuery" rel="tag">jQuery</a>
</div>  

