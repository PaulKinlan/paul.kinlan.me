---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: 'Configuring hugo server to server 'mjs' ES modules'
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
By default Hugo doesn't serve .mjs files with the correct content type. In fact it wasn't until recently that hugo could serve more than one file extension per mime-type. It looks like with v0.43 this has been fixed.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]

[Read full post](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

The above code lets me serve mjs files for ES Modules with the correct mime-type (note modules need to be served with 'text/javascript'). This is only needed for local testing, hosting is another issue :)
