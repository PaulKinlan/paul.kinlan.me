---
date: 2019-10-07 20:11:30.489000+00:00
link: ''
slug: using-web-mentions-in-a-static-sitehugo-
summary: This blog post discusses how to integrate Webmentions into a statically generated
  website built with Hugo, hosted on Zeit.  Static sites lack dynamic features like
  comments, often relying on third-party solutions. This post explores using Webmentions
  as a decentralized alternative to services like Disqus. It leverages webmention.io
  as a hub to handle incoming mentions and pingbacks, validating the source and parsing
  page content. The integration process involves adding link tags to HTML, incorporating
  the webmention.io API into the build process, and efficiently mapping mention data
  to individual files for Hugo templates. Finally, a cron job triggers regular site
  rebuilds via Zeit's deployment API, ensuring timely updates with new mentions.
tags:
- webmentions
- hugo
- static site
- zeit
- comments
- webmention.io
- javascript
- performance
- data fetching
- API
- cron
title: Using Web Mentions in a static site (Hugo)

---

My blog is an entirely static site, built with Hugo and hosted with Zeit. This is a great solution for me, a simple blog has a pretty simple deployment process and it loads blazingly fast. 

Statically generated sites do have some drawbacks, the largest is when you need anything dynamic to be integrated into your page (comments for example).&nbsp; Not being able to easily host dynamic content will mean that you end up relying on 3rd party JavaScript that will then get full access to your page and you won't know what it is doing - it could be tracking your users or slowing down your page load.

I recently took my current comment widget (Disqus) off the critical render path by only loading it when the user scrolls to the comments (using `IntersectionObserver`) and whilst this was a reasonable solution to the load performance and tracking problems, I actually wanted to remove Disqus all together.

Enter the [Webmention](https://webmention.net/draft/) spec. Webmention is a specification that describes how a site author can be contacted when another site 'mentions' (or likes) content on your site. This ultimately allows for a decentralised method for discovering content that links to your site, hopefully providing value and insight.

The webmention spec does not describe any data formats that should be used for communicating what the 'mentioning site' has said, that is left up you to parse using standard microformats or other mechanisms to understand the content of the page. This is great, however I believe that it leads to centralised services such as [webmention.io](https://webmention.io/) providing the much needed infrastructure to get the meaning out of the page.

I liked the idea of using Webmention, but it requires a server side setup to get (and possibly store) notifications of when someone mentions your site, this is not always possible with a static builder like I have on my site. The rest of this post will quickly describe how I got likes, mentions and reposts hosted on my Zeit hosted Hugo build.

### Step one - find a webmention hub

I found webmention.io and it does the trick. It handles the incoming pingbacks and mentions, it will also validate that the calling site is actually linking to your content and finally it will parse data out of the page so that you have some understanding of the context.

Webmention.io will validate that you own the site through an open authentication process (it was neat it looks for rel=me that points to an auth provider)

### Step two - tell pages that you can handle mentions

This is as simple as adding the two following `link` tags

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### Step three - integrate the webmention.io API into your site

You have two options here, you can add a widget on to your page that will call the webmention.io API, or you can integrate webmention.io API into your build step. I would like as little 3rd party hosted JS as possible, so I chose the latter. I integrated webmentions in to my deployment process.

I use Hugo because the build is fast, and with that in mind, I had to work out how to integrate the webmention API into Hugo in an optimal way. The hard constraint was to not call the API endpoint for every page on my site, I have a lot of pages, and not a lot of comments yet. 

Luckily the Webmention.io site provides a handy endpoint will let you receive all of the mentions for your domain. The unlucky bit is that this file contains one entry for every action that has been done against your site.

Hugo also has the notion of Data files that can be pulled directly into the template for any given page, so you have to map the Webmention data file to a new structure that makes it easy to read inside a Hugo template.

The process I chose is below, but the summary is that I turn the array from a list of actions to a dictionary of URL's that each contain the actions exposed by the API (like, repost and reply), and the final step is then to split the dictionary of URLs into individual files that are named as the md5 hash of the url.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Once the data is parsed and saved correctly, it is a quick process of setting up the template so that it can be read into the Data attribute of the template.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

If all goes well, you should see some icons at the bottom of the page that are real people interacting with the site.

### Step 4 - publish the site when comments occur

Whilst the above steps will let me aggregate the mentions and render them in the sites output, I still have to ensure that the site is rebuilt regularly so that the comments appear publicly.

I chose to use a simple cron service that will call Zeit's deployment API to force a re-depoly of the site every hour or so.
