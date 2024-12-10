---
date: 2015-07-31
description: Ruby frustrations and performance have frustrated me for a long time.
  Experimented with Hugo and ported blog in about 3 hours
image_header: /images/hellogoodbye.png
slug: goodbye-jekyll-hello-hugo
summary: Frustrated with Jekyll's slow build times, especially for larger sites like
  Web Fundamentals, I explored Hugo as an alternative static site generator.  While
  Jekyll served me well initially, the performance issues with Ruby and its templating
  engine became a major bottleneck. Hugo, being written in Go, offered significantly
  faster build speeds, taking milliseconds compared to Jekyll's seconds/minutes.  The
  migration process involved some adjustments, such as adapting to Go's templating
  language, handling pagination, and addressing inconsistencies in documentation and
  file naming conventions. However, the dramatic performance improvement makes Hugo
  a compelling option for my personal blog, though migrating Web Fundamentals is a
  larger undertaking to consider separately.
tags:
- jekyll
- hugo
- static site generator
- performance
- migration
- blogging
- go
- ruby
- web development
- templating engine
- build times
title: Goodbye Jekyll, Hello Hugo

---

I do like Jekyll. It has helped me get back into blogging and I [chose it as the technology](https://github.com/Google/WebFundamentals/)
to build [Google Web Fundamentals](https://developers.google.com/web/fundamentals/) with it.

Something is seriously wrong though: **Performance**. 

Build times for my personal blog (about 400 pages) take roughly
45 seconds. Web Fundamentals is even worse, frequently taking many many minutes to
build just one language pack and we support 13 languages. This performance problem
seriously affects our team and our writing team because single changes in a local staging
environment take upwards of 40 seconds to be visible in the browser. 

*Maybe* we can improve it, but I sure as heck can't work out how to do it. I can't instrument it
and we constantly hit issues with Ruby (we are not Ruby devs) specifcally around versioning of Gems and
runtime updates.

We have a lot of technical debt with the site and it is taking me and the team a lot time just to 
keep things running for a static site. I have a hunch it is the templating engine and Ruby. 
But this is just me guessing.

I was looking around for fast static site generators and a couple of people on the wider team have 
hinted that [Hugo](http://gohugo.io/) (written in Go) is good, well structured and also fast. 

I wont' go into Hugo to much.  It is a static site generator that can ingest Markdown files (like Jekyll) 
and spit out a structured site based on the templates that you define.

I will go over some quick points:

* My Jekyll build used to take 45 seconds+, the Hugo entire site build is 300-450ms. 2 orders of magnitude faster.
* Templating via the Go templating language took a little getting used to but it is *lot cleaner* than Liquid.
* Pagination was pretty easy to integrate although I had some trouble with the docs.
* The docs are pretty strong, there are some samples where examples on a page you would expect to be related
  are not always sometimes causing confusion.
* The Jekyll migration guide, for a simple Jekyll build got me most of the way.
* Hugo didn't support the file naming syntax Jekyll has (YYYY-MM-DD-title) for ordering of posts and I had to 
  write a migration script to add a `date` attribute to every markdown page and also a `slug` attribute.
* I had bunch of HTML files that didn't seem to get included in the .Site.Pages array.  Again I had to convert them all with 
  a simple command-line script.

Still, Performance is blazing and my blog is a lot quicker and has no Ruby dependencies.

I can't say that we will move Web Fundamentals to Hugo, it's a big job. I am very happy with the local
build and deployment set up that I have now for now.

Title Image Credit: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg