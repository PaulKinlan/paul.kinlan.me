
---
title: ActivityPub 
date: 2022-12-13T10:28:07.916Z
type: entry
slug: activitypub
---
* Useful links for learning how the system works (it's quite hard imo)
  * Spec: [ActivityPub](https://w3c.github.io/activitypub/)
  * Related Specs: [Activity Streams 2.0](https://www.w3.org/TR/activitystreams-core/#activities) [Activity Vocabulary](https://www.w3.org/TR/activitystreams-vocabulary/)
  * Test Suite: There is no test suite - [https://test.activitypub.rocks/](https://test.activitypub.rocks/) fails
  * Communities
    * [SocialHub - ActivityPub Special Interest Group](https://socialhub.activitypub.rocks/)
  * Protocol guides
    * [How to make friends and verify requests: Implementing an ActivityPub inbox - Official Mastodon Blog](https://blog.joinmastodon.org/2018/07/how-to-make-friends-and-verify-requests/)
    * [How to implement a basic ActivityPub server - Official Mastodon Blog](https://blog.joinmastodon.org/2018/06/how-to-implement-a-basic-activitypub-server/)
  * Things Mastodon network cares about
    * [ActivityPub - Mastodon documentation](https://docs.joinmastodon.org/spec/activitypub/)
    * [WebFinger - Mastodon documentation](https://docs.joinmastodon.org/spec/webfinger/)
  * Things I've learnt
    * Mastodon broadcasts Delete's across the widest known set of networks it can to clear up user data. HT: [Erin: "@paul@status.kinlan.me Mastodon broadcasts user d…" - queer.af](https://queer.af/@erincandescent/109525630699219101)
  * Other bits
    * [rwot5-boston/activitypub-decentralized-distributed.md at master · WebOfTrustInfo/rwot5-boston · GitHub](https://github.com/WebOfTrustInfo/rwot5-boston/blob/master/topics-and-advance-readings/activitypub-decentralized-distributed.md) < I found this a little easier to read about the process
    * HTTP Signature - I couldn't get this imported with ES-Modules, I had to host a copy myself and remove some null-coalescing [paul.kinlan.me/lib/http-signature at main · PaulKinlan/paul.kinlan.me · GitHub](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/lib/http-signature)
    * [GitHub - digitalbazaar/jsonld-signatures: An implementation of the Linked Data Signatures specification for JSON-LD. Works in the browser and Node.js.](https://github.com/digitalbazaar/jsonld-signatures) and [Making sense of RsaSignature2017 - Server to Server - SocialHub](https://socialhub.activitypub.rocks/t/making-sense-of-rsasignature2017/347)
    * [fediverse/delightful-activitypub-development: A curated list of developer resources related to ActivityPub and the Fediverse. -  delightful-activitypub-development - Codeberg.org](https://codeberg.org/fediverse/delightful-activitypub-development)
* 

