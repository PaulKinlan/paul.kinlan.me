---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello over on the Safari team just recently shared a note about how Twitter is ./well-known/change-password spec.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793).

The feature completely passed me by but it is a neat idea: given a file in a well-known location, can the browser offer a UI to  the user that allows them to quickly reset their password without having to navigate the sites complex UI..

The spec is deceptively simple: the well known file simply contains the URL to direct the user to when they want to perform the action. This lead me in to thinking, can we offer more of these features:

* A well known location for GDPR-based consent models (cookie consent) - site owners could offer a link to the page where a user can manage and potentially revoke all cookies and other data consent items.
* A well known location for browser permission management - site owners could offer a quick place for users to be able to revoke permissions to things like geo-location, notifications and other primitives.
* A well known path for account deletion and changes
* A well known path for mailing list subscription management

The list goes on.... I really like the idea for simple redirect files to help users to discover common user actions, and for a way for the browser to surface it up.

*Update:* I added an [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473).