---
date: 2018-07-20 14:17:29.072000+00:00
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
slug: configuring-hugo-server-to-servermjses-modules
summary: Hugo, by default, doesn't serve .mjs files with the correct MIME type, which
  is necessary for using ES modules.  However, starting with v0.43, you can configure
  Hugo to serve .mjs files correctly by adding the 'mjs' suffix to the 'text/javascript'
  media type in your config file. This allows for proper local testing of ES modules,
  although hosting considerations might differ.
tags:
- hugo
- es modules
- javascript
- web development
- local testing
- mime types
- configuration
title: Configuring hugo server to serve 'mjs' ES modules

---
By default Hugo doesn't serve .mjs files with the correct content type. In fact it wasn't until recently that hugo could serve more than one file extension per mime-type. It looks like with v0.43 this has been fixed.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]

[Read full post](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

The above code lets me serve mjs files for ES Modules with the correct mime-type (note modules need to be served with 'text/javascript'). This is only needed for local testing, hosting is another issue :)
