---
slug: getting-your-app-to-support-web-intents-on-ch
date: 2012-02-08
tags:
- intents
title: Getting your app to support Web Intents on Chrome
published: true
---
<p>Chrome just got Web Intents support in Dev and Canary builds (18 onwards). &nbsp;This is a huge milestone and I am very excited by this first step along the path of building a more connected web of apps.</p>
<p />
<div>A lot of developers have asked me how to get started as it seems some of the demos on <a href="http://demos.webintents.org">http://demos.webintents.org</a> don't register correctly. &nbsp;I have a good answer for that - in short: Chrome doesn't yet detect the intent tag, instead applications currently can only register their support for an action such as "<a href="http://webintents.org/share">share</a>" via the <a href="http://code.google.com/chrome/extensions/manifest.html">Chrome apps manifest</a>.</div>
<p />
<div>The longer version is a little more complex:</div>
<div><ol>
<li>Consensus over the introduction of a new tag in to the spec has not yet been reached.</li>
<li>Working with members of the DAP in the <a href="https://github.com/PaulKinlan/WebIntents/tree/master/tools/chrome">intents task force</a>, it is clear that discovery of applications and services shouldn't only take place by detecting a tag on a web page. &nbsp;What happens if the service you want to "Share" a video too is a TV connected to your local network? Or an external native application wants to be able to support a "Save" action. &nbsp;To enable this important use case the User Agent should be able to determine the services it presents to users, and this is why this is allowed in the <a href="http://dvcs.w3.org/hg/web-intents/raw-file/tip/spec/Overview.html#user-agent-behavior">specification (3rd paragraph)</a>.</li>
</ol></div>
<div>Bringing this closer to home, because the discovery and presentation of an app's capabilities can be managed by the User Agent, and Chrome has the concept of extensions and installed apps we can quickly enable the intents feature by letting developers declare their support for actions in the manifest.</div>
<p />
<div>So what does the declaration in the Chrome apps/extension system look like? &nbsp;It is pretty easy, it is an entry into the manifest called "intents". &nbsp;It looks like:</div>
<p />
<p>{<br />&nbsp;&nbsp;"name": "Share to Gmail&trade;",<br /> &nbsp;&nbsp;"version": "0.0.0.2",<br />&nbsp;&nbsp;"icons" : {<br />&nbsp;&nbsp;&nbsp;&nbsp;"16" : "favicon.ico"<br />&nbsp;&nbsp;},<br />&nbsp;&nbsp;"intents" : {<br />&nbsp;&nbsp;&nbsp;&nbsp;"<a href="http://webintents.org/share">http://webintents.org/share</a>" : {<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type" : ["text/uri-list"],<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"title" : "Share to Gmail",<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"path" : "/launch.html"<br />&nbsp;&nbsp;&nbsp;&nbsp;}<br />&nbsp;&nbsp;}<br />}</p>
<p />
<div>It is that simple. &nbsp;The intent section includes a dictionary of supported action (<a href="http://webintents.org/share">http://webintents.org/share</a>) and in each action object there is an array of data types that the application or extension can handle, the friendly name to appear in the picker and a path to what should be opened when the user selects your app. &nbsp;The client-side code remains exactly the same as it would in a normal web app.</div>
<div>
<p />
<div>In the long term we want applications to be able to declare their capabilities and services directly through their html and this will be done with the Intent tag. &nbsp;However whilst the standardisation work continues we want to make sure that developers today can start building apps that can take advantage of the Web Intent system.</div>
<p />
<div>A lot more examples can be found on the&nbsp;<a href="https://github.com/PaulKinlan/WebIntents/tree/master/tools/chrome">Web Intents Github repository</a>.</div>
<p />
<div>Expect a lot more posts about how to build applications that love each other with Web Intents.</div>
</div>

