---
slug: ephemeral-social-network
date: 2016-06-16T13:20:32+01:00
title: "Ephemeral social or content networks"
description: "If there is no one around to read your tweet, does it make a difference?" 
---

**Note: this is my first draft and I think a dumb idea ;)**

Off the back of the demo I created for [Serverless Sync in Web apps](https://paul.kinlan.me/serverless-sync-in-web-apps/)
I got thinking about a number of other different ideas that you could build.

I am not a smart man, nor a learned man and what I am about to talk about I am pretty sure other
people have thought about, but I want to at least jot my ideas down.

I was thinking about social networks, impact and reach in the context
of distributed networks.  Specifically, I was thinking about BitTorrent and
the lifetime of content on the network based on the premise of [If a tree falls in a forest](https://en.wikipedia.org/wiki/If_a_tree_falls_in_a_forest),
but in the digital age: If you create some content but there is no one to see it, does it exist?

BitTorrent is incredibly interesting. The torrent file defines an identifier to an immutable 
piece of data and the trackers can index them to help other peers discover who might have
the data. Therefore, if you just have a torrent file but no peers, the content doesn't exist 
and the torrent file is just a null pointer.

Now on to what I was thinking.

You have a site that can't accept any input other than that generated directly inside the 
sandbox of the site &mdash; The first version of medium.com was like this, without an API you could only
create content in the site &mdash; the content that you generate will only
be hosted on your machine and not on a centralized server. Every time that you create
some content it gets added to a reverse chronological list of content that you have created.

Seems pretty simple. Now, let's assume that the data only lives for the lifetime you are on
the site. If you close the browser or refresh the page the data is no longer there.

Without out local storage or remote storage, everything is ephemeral. It dies with the host.

Now, if we connect two machines together so that data created on one synchronises with
the other it gets a little more interesting.  Individually, either could refresh or close
and when they came back online the data would re-synchronise.  However if both close
then all the data is lost.

There has been some research that studies popular files [popular files](
https://www.cs.duke.edu/courses/compsci512/spring14/15-744/S07/papers/bittorrent.pdf) and it 
turns out they replicate incredibly well, but at somepoint (looking at the current state of
torrents) it looks like everything disappears.

### Why am I even thinking about this?

I quite like the idea of BitTorrent (still) but for legitimate data scalability issues.

I like the idea of domain-constrained content created in an app deployed through BitTorrent.

I like the idea of emphemerality, kind of like how SnapChat had a short time slot
available to view the content, I like the idea of you can view the content but if
no one has it any more it is gone.

### What's the idea?

I started thinking about creating a self contained podcast network via the web
and BitTorrent. I was wondering  
if you could build a network or stream of all the created content
generated locally by a user on a site that gets syndicated via the network of people
following that person and therefore lives entirely on everyone elses own machines.

Right now, we would need a cental host to store the list of pointers to the content that
is created. This is pretty much how trackers worked in the past when ~~we~~people
were pirating movies and music in the early 2000's. And if you take a quick glance it 
is essentially a tracker, it records a list of torrents that have been created
through the site and users download the content and it's not a million miles away
from Spotify doing it's p2p distribution of content.

Ideally you don't want to have a central tracker, so you would need to maintain a 
list of the latest content created locally or on the network and have that be discoverable
to everyone.

I currently have no clue how to do this. The logistics of getting files to people
seems like it is done already, however getting the list of files to people is harder.  I 
initially thought about creating a single addressable torrent file, but you can't update that
and have keep consistent hashes....

Personally I am quite worried about this idea. Whilst it is neat, you could never
easily vet or see the content that was created through it so it sounds like the ideal
place for criminals :\

Thanks for listening to this random stream of thoughts! I'm off to play a bit.

Note: I thought about Diaspora etc, but they seem to centralize around a set of 
servers or owners rather than distributing across each participant in the network (I
could be wrong of course)
