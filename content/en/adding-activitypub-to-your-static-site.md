+++
date = 2022-12-16T14:16:15Z
draft = true
slug = "adding-activity-pub-to-your-static-site"
summary = "This is a short post about I added A"
tags = []
title = "Adding ActivityPub to your static site"

+++
My blog is built on Hugo and hosted on Vercel. It mostly works well.

I wanted to have my blog automatically publish posts that I create in a way that I didn't need to spin up an instance of Mastodon. 

I got a minimal version of it working. You can discover my page, follow my account, and it will post updates when my blog deploys a new page.

The biggest learning that I had was that ActivityPub is a Message protocol. You can't just output a feed of posts and be done (I tried) - so even if you are a statically generated site you need a Server component because you need to POST message replies to people who send a 'Follow' request to your account and POST to the people who follow your account to 'Create' a 'Note'.

To see it all in action, you can subscribe to my blog on any ActivityPub system by following this account: @paul@paul.kinlan.me < try it.

While I had fun, I will say that I found it **very** hard to get started - I found the spec hard to read; testing was almost impossible (there seem to be no easy test harnesses to determine if you are building a compatible client) so I had to test against a live instance; and there is little documentation of what messages should look like; and I hit snags in all places. 

Hopefully this post will help you get started if you want to go down a similar path.

My implementation uses Hugo to create my posts and feed data, Vercel Serverless functions to handle in bound messages, and Firebase Firestore to store the data.

This post will assume that you know the terminology of ActivityPub, but I will try and link to the relevant part of the spec. I also made a lot of assumptions that I am a single user host.

### Discovery

[Mastodon uses Web Finger](https://docs.joinmastodon.org/spec/webfinger/) to discover where to look for your servers Actor configuration. WebFinger files are served from a `./well-known/webfinger` file. I created serverless function which returns the required WebFinger configuration. [Code](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/api/well-known/webfinger.ts)

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    
    export default function (req: VercelRequest, res: VercelResponse) {
      res.statusCode = 200;
      res.setHeader("Content-Type", `application/jrd+json`);
      res.end(`{  
        "subject": "acct:paul@paul.kinlan.me",
        "aliases": [
          "https://status.kinlan.me/@paul"
        ],
        "links": [
          {
            "rel": "self",
            "type": "application/activity+json",
            "href": "https://paul.kinlan.me/paul"
          }
        ]
      }`);
    }

The JSON above describes a number of aliases for my ActivityPub account '@paul@paul.kinlan.me' and it points to where I host my ActivityPub Actor information.

**Note**: You need to make sure you are sending the correct MIME types.

Why do I have a serverless function for static content? Vercel... That's why. I couldn't set the `Content-Type` configuration properly for any static file in the `.well-known` folder. In the future if I add multiple accounts I will need to parse the query string to be able to target the `links` and `subject` fields correctly/

Next you need to create an [Actor](https://www.w3.org/TR/activitypub/#actor-objects). The Actor is a configuration file that tells ActivityPub servers where to find many core functions such as the 'inbox' (which will recieve messages from other clients), 'outbox' that contains all the messages that a user has created (like an RSS feed), 'publicKey' for verifying messages, etc.

I did this in two phases.

1. I generate the Actor file with a hugo template
2. I serve that file with the correct content-type.

#### 1. Generating the Actor file

I created a [new layout](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/layouts/index.activity.ajson): `layouts/`**`index.activity.ajson`**

    {
      "@context": ["https://www.w3.org/ns/activitystreams",
                   {"@language": ""en-GB"}],
      "type": "Person",
      "id": "{{ $.Site.BaseURL }}",
      "outbox": "{{ $.Site.BaseURL }}outbox",
      "inbox": "{{ $.Site.BaseURL }}inbox",
      "preferredUsername": "{{$.Site.Author.name}}",
      "name": "{{$.Site.Author.name}} - {{$.Site.Title}}",
      "summary": "{{$.Site.Params.Description}}",
      "icon": {
        "type":"Image",
        "mediaType":"image/png",
        "url": "{{ $.Site.BaseURL }}images/me.png"
      }
    }

I configured the `mediaTypes`, `outputFormats` and `outputs` [in my config.toml as so](https://github.com/PaulKinlan/paul.kinlan.me/blob/main/config.toml).

    [mediaTypes]
    [mediaTypes."application/activity+json"]
    suffixes = ["ajson"]
    
    [outputFormats]
    [outputFormats.ACTIVITY]
    mediaType = "application/activity+json"
    notAlternative = true
    baseName = "activity"
    
    [outputs]
    home = ["HTML", "RSS", "ACTIVITY"]

#### 2. Serving the Actor file

    import type { VercelRequest, VercelResponse } from '@vercel/node';
    import { join } from 'path';
    import { cwd } from 'process';
    import { readFileSync } from 'fs';
    
    /*
      This returns a list of posts for the single user 'Paul'.
    
      It's a GET request. This doesn't post it to anyone's timeline.
    */
    export default function (req: VercelRequest, res: VercelResponse) {
      // All of the outbox data is generated at build time, so just return that static file.
      const file = join(cwd(), 'public', 'outbox.ajson');
      const stringified = readFileSync(file, 'utf8');
    
      res.statusCode = 200;
      res.setHeader("Content-Type", `application/activity+json`);
    
      return res.end(stringified);
    };
    

### Following

### Posting