---
date: 2006-03-13
published: true
slug: google-search-ebay-asp-net-api-soap-wsdl
summary: I'm exploring the eBay API using ASP.NET and SOAP.  It's proving a bit cumbersome
  due to its monolithic structure.  Ideally, each API call would have its own WSDL
  and SOAP interface for easier management.  Currently, I'm stuck on generating a
  User Token for authentication, having tried my developer account, regular eBay account,
  and a new account without success.  Any advice on obtaining a User Token would be
  greatly appreciated!
tags:
- ebay
- api
- asp.net
- soap
- wsdl
- authentication
- user token
- c#
- .net
title: 'Google Search: ebay asp.net api soap wsdl'

---
a reader visited my site the other day with the following search query: ebay asp.net api soap wsdl.<p />I have been trying to use the Ebay api and I have been finding it a little bit awkward to use. It appears to be a massivly monotlithic piece of API. I would have prefered that each API call have its owb WSDL and thus its own SOAP interface. This way I onlyt need to worry about the using and importing a very small stub.<p />I will post some code I have tomorrow but I am yet to determine if it works because for the life of me I cannot create a User Token for authenticating the request. I have tried three things none of which worked:<ol>
<li>I have tried using my Ebay Developer Account</li>
<li>I have also tried my normal ebay account</li>
<li>I have also created a brand new ebay account.</li>
</ol><p>None of the above accounts work (it keeps aying my password is incorrect).  Has anyone had any luck getting a User token for use in the API?</p>

