---
date: 2006-03-14
published: true
slug: google-search-ebay-asp-net-api-soap-wsdl-part
summary: 'This post is a follow-up to my earlier one about using SOAP requests in
  ASP.Net to access the eBay API. I''ve finally figured out how to make it work!  A
  few key things to note: most requests need the \"version\" attribute, some require
  the \"DetailLevel\" attribute, and you''ll need an eBay Authentication Token (a
  cryptographic hash) for security.  When using the WSDL URL, remember to include
  query string parameters so eBay knows what to do. I''ve included some sample C#
  code demonstrating how to build the request URL, set credentials, and handle the
  response.'
tags:
- ebay
- api
- asp.net
- soap
- wsdl
- c#
- authentication
- security
- web services
- integration
title: 'Google Search: ebay asp.net api soap wsdl [part deux]'

---
Just following on from one of my previous post about using SOAP requests from ASP.Net to access Ebay.<p />I have finally worked out [it wasn't hard in the end] how to do it.<p />A few things that I had problems with were:<ul>
<li>Most of the request REQUIRE the version attribute to be set</li>
<li>The DetailLevel attribute must be set on some request to enable you to </li>
<li>A Authentication Token is required to send request to Ebay. The Authentication token is used so that the user doesn't need to give their user name and password credentials away to the program. The auth token seems to be a cryptographic hash.</li>
<li>If you are using the WSDL url, you must also provide query string parameters so that Ebay know what to do with the request. [<a href="http://developer.ebay.com/DevZone/SOAP/docs/WebHelp/wwhelp/wwhimpl/js/html/wwhelp.htm">http://developer.ebay.com/DevZone/SOAP/docs/WebHelp/wwhelp/wwhimpl/js/html/wwhelp.htm</a>]</li>
</ul>The Code Follows:<p />Ebay.eBayAPIInterfaceService service = new Ebay.eBayAPIInterfaceService();string appId = "APPID"; // use your app IDstring devId = "DEVID"; // use your dev IDstring certId = "CERTID"; // use your cert IDstring endpoint = "https://api.sandbox.ebay.com/wsapi";string callName = "GetSearchResults";string siteId = "0";<p />string version = "437";// Build the request URLstring requestURL = endpoint+ "?callname=" + callName+ "&amp;siteid=" + siteId+ "&amp;appid=" + appId+ "&amp;version=" + version+ "&amp;amp;amp;amp;routing=default";// Create the service<p />// Assign the request URL to the service locator.service.Url = requestURL; //"https://api.sandbox.ebay.com/wsapi";// Set credentialsservice.RequesterCredentials = new Ebay.CustomSecurityHeaderType();<p />service.RequesterCredentials.eBayAuthToken = "MY_TOKEN"; // use your tokenservice.RequesterCredentials.Credentials = new Ebay.UserIdPasswordType();<p />service.RequesterCredentials.Credentials.AppId = appId;service.RequesterCredentials.Credentials.DevId = devId;service.RequesterCredentials.Credentials.AuthCert = certId;<p />Ebay.GetSearchResultsRequestType req = new Ebay.GetSearchResultsRequestType();<p />req.Query = "SSX";req.DetailLevel = new Ebay_Test.com.ebay.developer.DetailLevelCodeType[1];req.DetailLevel[0] = Ebay.DetailLevelCodeType.ReturnAll;<p />req.Version = version;<p />Ebay.GetSearchResultsResponseType resp = service.GetSearchResults(req);//Do some more stuff<p />

