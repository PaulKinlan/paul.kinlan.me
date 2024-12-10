---
date: 2016-07-15
image_header: /images/credentials.png
slug: credential-management-api
summary: Tired of typing in usernames and passwords? So are your users. Autofill helps,
  but the Credential Management API gives developers more control. It lets you securely
  store and retrieve user credentials, simplifying logins with just a couple of taps.  This
  Chrome-only API allows access to a PasswordCredential object, rather than raw passwords.  It
  works with other improvements like proper autofill fields (`email`, `username`,
  `new-password`, `current-password`) and offers a potential future where landing
  and login pages are obsolete. Imagine a web where users stay logged in seamlessly,
  only re-authenticating when necessary. This post covers how to implement the API,
  including a demo and sample code. Plus, explore how it might combine with the Web
  Payment Request API to streamline e-commerce.
tags:
- Credential Management API
- passwords
- login
- security
- autofill
- user experience
- UX
- Chrome
- web development
- javascript
- API
- e-commerce
- payments
title: Thoughts on the Credential Management API
video_url: /videos/credential-management-api-demo.mp4

---
 
Entering usernames, emails, identifiers and passwords is a massive pain for users.  It's even
worse on mobile as the use has to fiddle around with.

Browsers have done a number of things over the years to help with this problem. We started with
enhancing autofill across browsers by making it more intelligent, more secure but more importantly
synchronised across browsers (so that if you enter data on your desktop it is available instantly
on your mobile). Autofill has helped us make signing up for services more efficient and it has
also improved the accuracy and speed for logging back in to a service.  Everyone should be using it!

As a developer, autofill is great but we don't have any control over it. The [Credential Management API](https://www.w3.org/TR/credential-management-1/) 
is designed to help smooth out that process of signing back into a service. It gives you
programmatic access to the username and password (not strictly true, you get access to an opaque PasswordCredential object)
 for the current user on your site. You can save the details, you can retrieve the details.

There are three API's: `navigator.credentials.get()` and `navigator.credentials.store()` are self explanatory,
`navigator.credentials.requireUserMediation()` is effectively a sign-out button which will require the user
to provide a user gesture again on the site before another `get()` will resolve.

Watch the video at the top of the article to show this in action and how quickly (two taps) that you can 
log back in to a service.

Eiji on my team created a full document "[Streamlining the Sign-in Flow Using Credential Management API](https://developers.google.com/web/updates/2016/04/credential-management-api?hl=en)"
that explains the process and how to implement it.

You can experience a [demo](https://credential-management-sample.appspot.com/) and check out the [sample code](https://github.com/GoogleChrome/credential-management-sample).

This API is Chrome only at the moment, which presents an interesting story: How do you integrate this experience
across all platforms?  It starts with just optimising your account sign-up and sign-in pages, use the
correct [autofill fields so that the browser](https://developers.google.com/web/fundamentals/design-and-ui/input/forms/label-and-name-inputs?hl=en#recommended-input-name-and-autocomplete-attribute-values).
`email`, `username`, `new-password` and `current-password` are normally good ones to ensure you are helping
all browsers do the right thing when it comes to understanding your user's data effectively. Once you have a good
set-up for your forms, it is pretty easy to detect if the API exists, if there are credentials available for the
user and you can then offer a seamless sign-in for the user.

I've a vision for the future where we remove product landing pages and sign-in pages altogether, you land on a site
and you are using the site or app immediately. I want to get to a web where if you want, you are signed in to your websites for as long as needed and you don't have
to re-authenticate every other day but if you do that process is as streamlined as possible. I think the
Credential Management API is a good step in that direction.

There is also an interesting overlap between this API and the Web Payment Request API, which I think
if combined can create a really smooth experience for e-commerce sites.
