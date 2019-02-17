---
slug: serverless-sync-in-web-apps
date: 2016-06-14T13:20:32+01:00
title: "Serverless Data Sync in Web Apps with Bit Torrent"
image_header: "/images/web-torrent-header.png"
tags: [pwa, web app, torrent, webrtc]
---

TL;DR - [Here is a demo](https://bt-voice-memos.appspot.com/share?seeds=magnet%3A%3Fxt%3Durn%3Abtih%3Abd1ba69e6051ee5ea8065a9a270a2703a9d8915a%26dn%3DHello%2BWorld.webm%26tr%3Dudp%253A%252F%252Fexodus.desync.com%253A6969%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%26tr%3Dudp%253A%252F%252Ftracker.internetwarriors.net%253A1337%26tr%3Dudp%253A%252F%252Ftracker.leechers-paradise.org%253A6969%26tr%3Dudp%253A%252F%252Ftracker.openbittorrent.com%253A80%26tr%3Dwss%253A%252F%252Ftracker.btorrent.xyz%26tr%3Dwss%253A%252F%252Ftracker.fastcast.nz%26tr%3Dwss%253A%252F%252Ftracker.openwebtorrent.com%26tr%3Dwss%253A%252F%252Ftracker.webtorrent.io) [Code](https://github.com/paulkinlan/voice-memos)

Our team has built a lot of Progressive Web Apps recently to demonstrate 
how we think they can be built: [Airhorner](https://airhorner.com), 
[Voice Memos](https://voice-memos.appspot.com), [Guitar Tuner](https://guitar-tuner.appspot.com),
[SVG-OMG](https://jakearchibald.github.io/svgomg/) are a few that spring to mind. One thing 
that is common across all of these sites is that they have no server component to store and 
synchronise data.  We built these sites as examples and reference implementations of the types
of experiences that we can deliver on the web, they were never intended to 
be full "Apps" that you would build as a business.

I recently had an idea for another Web App that was inspired by
Ben Thompson's [Future of Podcasting](https://stratechery.com/2016/the-future-of-podcasting/)
PodCast. I wanted to make Pod Casting as simple as visiting your site and
pressing a record button on the page (I did something similar years ago 
called [FriendBoo](http://thenextweb.com/2009/07/20/wanted-micropodcast-friendfeed-friendboo/#gref) 
but that had to use the PSTN telephone system).

Technically we have all the parts of the web platform to help us: Service Worker
to make it work offline, Blob and IndexedDB to store chunks of data locally
and Media Stream Recorder to take Microphone input and record it to a file.  Finally
we have the power of the URL to allow us to access the web app from anywhere
there is a browser and an internet connection.

Once you have access to the web, you would expect that the data you recorded from one
device would be stored on a server somewhere and then be available again later from any machine
that you access the site. Traditionally you create a web service that will store the data on a server somewhere and
you would manage all that infrastructure to support all your users. 

However, I'm not in the mood to create a service that requires storage and retrieval 
of data from a service (getting that through our legal teams will be a nightmare) so 
everything would have to be stored locally inside the web app. The big question is 
how do you get your data out and shared to another instance of your web app on another device?

[Voice Memos](https://voice-memos.appspot.com/) created by Paul Lewis is another example of this. 

<figure>
<img src="/images/voice-memos.png" style="max-width: 100%">
<figcaption>All the data is local to the app</figcaption>
</figure>

The data is recorded and stored locally which means if you want to sync it with your other
devices or share it with a friend, you can't.

There are solutions, for example we could dynamically encode the audio file as base64 and
create a custom URL &mdash; but that's not scalable.

It was a bit of a conundrum and one that I wanted to solve. I set up some simple requirements for
what I would like to see:

* The user should be able to share a simple url that would point to their local data,
* The user should not have to manually save the data outside of their browser or web app,
* There should be no "backend" that stores the data,
* Synchronisation should ideally happen peer to peer.

Now. Step back 6 months. I was at [ColdFront conference](https://2016.coldfrontconf.com/) [last year](https://2015.coldfrontconf.com/) and I saw a 
talk by [Feross Aboukhadijeh](https://github.com/feross) about Web RTC Data Channel, BitTorrent and how 
he started a project called [WebTorrent](https://webtorrent.io/). It was a great talk, but I didn't hook things 
up in my head until recently about the potential of what he was talking about.

Now I think I have the start of a solution through the use of WebTorrent.io.

<figure>
<img src="/images/webtorrent.png" style="max-width: 100%">
<figcaption>Web Torrent</figcaption>
</figure>

I won't explain WebTorrent too much other than to say that it combines BitTorrent style
distributed data delivery with WebRTC and it is rather spectacular.  I do encourage you 
all to check it out though.

The theory I had was that if the user's client could act as a peer in the Torrent network, it would
be then able to seed some of the data that is local to the web site, the user could generate a torrent link that could be shared 
either with another one of their devices or with another user and then the "remote" instance of the
web app will fetch the data from the "client" instance.

* User vists page
* User does some work
* User saves it to IndexedDB
* User clicks "Share" and it generates a "magnet:" URL and then
  starts to seed the Audio Blob.
* User shares or opens the URL in another browser.
* Site parses magnet URL and connects to tracker.
* Site finds peers from the tracker, connects to peer(s) and downloads data.

<figure>
<img src="/images/torrent-process.png" style="max-width: 100%">
<figcaption>Rough flow of data</figcaption>
</figure>

For 1:1 connections this might be a bit of an overkill, I could just create a WebRTC signalling 
service and deliver the messages to the other instance to get the data from one client to another.

The interesting thing with this approach is that it scales nicely when sharing data to more than one
person.

### Applying this to a real world sample

I briefly mentioned [Voice Memos](https://voice-memos.appspot.com/) earlier. It was a great 
reference application for me to try and integrate my theory in to a working app.  It
is close to my idea of a podcasting app and it is also in need of a way to synchronise
data between clients because it has no server-based backing store for the recordings.

<figure>
<img src="/images/web-torrent-header.png" style="max-width: 100%">
<figcaption>Voice memos</figcaption>
</figure>

I didn't make too many changes other than adding in a "Share" button. You can check out the 
demo on [BitTorrent Voice Memos](https://bt-voice-memos.appspot.com/).  Record a simple
audio file, save it, then share it - the "Share" will generate a URL that you can 
send to another device or send to another person.

I'm quite pleased with the output. In all this demo took only a couple of 
hours to get ready.

Here is a quick run down of some of the major things that I had to do.

Add in the `webtorrent.min.js` script used to power all the magic.

```
<script src="https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js"></script>
```

Create a singleton instance of the `WebTorrent` API that can be used across
all of my other classes (inspired by Paul Lewis).

```
export default function TorrentInstance () {

  if (typeof window.TorrentInstance_ !== 'undefined')
    return Promise.resolve(window.TorrentInstance_);

  window.TorrentInstance_ = new WebTorrent();

  return Promise.resolve(window.TorrentInstance_);
}
```

Seed all the memos &mdash; this is currently a little overkill, but it got the demos
working.  The `this.memos` is an Array Instance of VoiceMemos that were stored
in our IndexedDB.
```
 seed () {
    this.memos.forEach((memo) => {
      // Seed the memo.
      TorrentInstance().then(torrentClient => {
        torrentClient.seed(
          memo.audio, // Audio is a blob, but that is ok.
          {
            name: `${memo.title}.webm`,
            comment: memo.description || '',
            creationDate: memo.time || Date.now()
          },
          torrent => {
            console.log(torrent);
            memo.torrentURL = torrent.magnetURI;
            memo.put();
          });
      });
    });
  }
```

When the user clicks the Share button, create a custom URL that will contain all the details
needed to get access to the torrent and stream the data into another client.

```
onShareButtonClick(e) {
    MemoModel.get(this.memoId).then( (memo) => {
      return `/share?seeds=${encodeURIComponent(memo.torrentURL)}`;
    }).then(uri => {
      history.pushState({}, "Share seed", uri)
    });
  }
```

We need to run some custom logic to fetch the torrent when we detect that the 
user has entered a URL that contains the torrent information.  The Voice Memos
app has a custom router which looks for a url that starts with '/share'.
```
router.add('share',
          (url) => this.fetchTorrent(location.search.slice(1)),
          (out) => console.log(out)
         )
```

Now we need to parse out the torrent information, and then using the 
WebTorrent API fetch the file from the BitTorrent network.  

Once it has been fetched we have to then get the file data out of the Blob using a rather
hacky XMLHttpRequest.

```
fetchTorrent(url) {
  const seeds = new URLSearchParams(url);
  let seedURLs = seeds.getAll('seeds');

  for(let seedURL of seedURLs) {
    TorrentInstance().then(torrentClient => {

      torrentClient.add(seedURL, {}, torrent => {
        var file = torrent.files[0];

        file.getBlob((err, audioData) => {         
          const newMemo = new MemoModel({
            audio: audioData,
            volumeData: audioData, // Assuming pre-normalised
            title: torrent.name.replace(/\.webm$/, ""),
            torrentURL: torrent.magnetURI,
            description: ""
          });

          newMemo.put();
        });
      });
    });
  }
}
```

**Edit: Above code has been updated after a new method to WebTorrent was added**

### Wrapping up

I will end this all by saying that this is a massive hack and it shouldn't be used for private data - right now if goes out on the network if people have the URL to the torrent
then it will be accessible.

I do think the concept is important, the ability to synchronise data and have no middle-man or
server logic in our web apps is an important concept and we should actively consider how we build such 
experiences.

I'm off to keep playing with this...


**Edits**

* Removing some seed check logic. 