---
slug: google-search-ebay-asp-net-api-soap-wsdl-part
date: 2006-03-14
 
title: "Google Search: ebay asp.net api soap wsdl [part deux]"
published: true
---
Just following on from one of my previous post about using SOAP requests from ASP.Net to access Ebay.<p />I have finally worked out [it wasn't hard in the end] how to do it.<p />A few things that I had problems with were:<br /><ul>
<li>Most of the request REQUIRE the version attribute to be set</li>
<li>The DetailLevel attribute must be set on some request to enable you to </li>
<li>A Authentication Token is required to send request to Ebay. The Authentication token is used so that the user doesn't need to give their user name and password credentials away to the program. The auth token seems to be a cryptographic hash.</li>
<li>If you are using the WSDL url, you must also provide query string parameters so that Ebay know what to do with the request. [<a href="http://developer.ebay.com/DevZone/SOAP/docs/WebHelp/wwhelp/wwhimpl/js/html/wwhelp.htm">http://developer.ebay.com/DevZone/SOAP/docs/WebHelp/wwhelp/wwhimpl/js/html/wwhelp.htm</a>]</li>
</ul><br />The Code Follows:<p /><br />Ebay.eBayAPIInterfaceService service = new Ebay.eBayAPIInterfaceService();<br />string appId = "APPID"; // use your app ID<br />string devId = "DEVID"; // use your dev ID<br />string certId = "CERTID"; // use your cert ID<br />string endpoint = "https://api.sandbox.ebay.com/wsapi";<br />string callName = "GetSearchResults";<br />string siteId = "0";<p />string version = "437";<br />// Build the request URL<br />string requestURL = endpoint<br />+ "?callname=" + callName<br />+ "&amp;siteid=" + siteId<br />+ "&amp;appid=" + appId<br />+ "&amp;version=" + version<br />+ "&amp;amp;amp;amp;routing=default";<br />// Create the service<p />// Assign the request URL to the service locator.<br />service.Url = requestURL; //"https://api.sandbox.ebay.com/wsapi";<br />// Set credentials<br />service.RequesterCredentials = new Ebay.CustomSecurityHeaderType();<p />service.RequesterCredentials.eBayAuthToken = "MY_TOKEN"; // use your token<br />service.RequesterCredentials.Credentials = new Ebay.UserIdPasswordType();<p />service.RequesterCredentials.Credentials.AppId = appId;<br />service.RequesterCredentials.Credentials.DevId = devId;<br />service.RequesterCredentials.Credentials.AuthCert = certId;<p />Ebay.GetSearchResultsRequestType req = new Ebay.GetSearchResultsRequestType();<p />req.Query = "SSX";<br />req.DetailLevel = new Ebay_Test.com.ebay.developer.DetailLevelCodeType[1];<br />req.DetailLevel[0] = Ebay.DetailLevelCodeType.ReturnAll;<p />req.Version = version;<p />Ebay.GetSearchResultsResponseType resp = service.GetSearchResults(req);<br />//Do some more stuff<p />

