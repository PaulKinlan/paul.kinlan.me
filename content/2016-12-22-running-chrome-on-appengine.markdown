---
slug: running-chrome-on-appengine
date: 2016-12-22T15:20:31+01:00
title: "Running Chrome on AppEngine"
tags: ["headless"]
description: "It's possible in 3 simple steps"
---

I'll let you into a little secret. 7 years ago when I joined Google I thought I
was going to be doing Developer Relations for App Engine. At the time I was a
full-stack web developer building a huge number of web, iPhone and Android apps
all hosted on AppEngine. Instead I was assigned to work 50% on iGoogle and 50%
on Chrome. I loved Chrome as a product but I really disliked iGoogle as a
product &mdash; I almost considered quitting before I even started but Chrome
was cool, we had just started a small team and that was what I fell in love
with and within months I was on it full time.

App Engine was brilliant, I loved that I could build a paid for service and then
let it scale and not have to worry about what we now call DevOps. The problem
with AppEngine was that it only supported Python (soon it would support Java)
and it was heavily sandboxed, meaning that a lot of the interesting things that
I wanted to scale, I couldn't.

Jump forward 7 years and there has been a huge change in the industry especially
around virtualization. Docker is almost ubiquitous and best of all you can 
combine it with App Engine so that you can now host Google Chrome on App Engine
in three simple steps.

### 1. Set up an app

Create an `app.yaml` file that says that you want a [custom runtime and you want
to use the flex environment](https://cloud.google.com/appengine/docs/flexible/custom-runtimes/).

```
runtime: custom
env: flex
```

### 2. Create a docker image that launches headless Chrome

This image originally came from Justin Riberio and I've modified it a bit, but
it takes a build of [Headless
Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md)
(that is a version of Chrome that can run entirely on the command line) and a
simple nodeJS file that connects to Chrome via the DevTools protocol.

```
# Base docker image
FROM ubuntu:16.04
MAINTAINER Paul Kinlan <paulkinlan@google.com>
# MAINTAINER Justin Ribeiro <justin@justinribeiro.com>

# Experimental! 
#
# To run:
# docker run -d --net host --name headless headless_chrome
# 
# Access:
# http://localhost:9222/

# Pull my chrome-headless build
ADD chrome-headless.deb /src/chrome-headless.deb

# Setup deps, install chrome-headless
RUN apt-get update && apt-get install -y \
  build-essential \
  software-properties-common \
  ca-certificates \
  byobu curl git htop man unzip vim wget \
  sudo \
  gconf-service \
  libcurl3 \
  libexif-dev \
  libgconf-2-4 \
  libglib2.0-0 \ 
  libgl1-mesa-dri \
  libgl1-mesa-glx \
  libnspr4 \
  libnss3 \
  libpango1.0-0 \
  libv4l-0 \
  libxss1 \
  libxtst6 \
  libxrender1 \ 
  libx11-6 \ 
  libxft2 \ 
  libfreetype6 \ 
  libc6 \ 
  zlib1g \ 
  libpng12-0 \
  wget \
  apt-utils \
  xdg-utils \
  --no-install-recommends && \
  dpkg -i '/src/chrome-headless.deb' && \
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - && \
  sudo apt-get install -y nodejs && \
  sudo apt-get install -y libnss3 && \
  rm -rf /var/lib/apt/lists/*

COPY ./node_modules /opt/stickmanventures/node_modules
ADD ./index.js /opt/stickmanventures/index.js
ADD ./package.json /opt/stickmanventures/package.json

WORKDIR /opt/stickmanventures/

# expose 8080 so we can connect to it
EXPOSE 8080

CMD ["node", "index.js", "/opt/stickmanventures/chrome-headless/headless_shell" ]
```

### 3. Scale and Profit.

Ok, it is a little more than three steps, you have to have a simple node web app
that can take HTTP requests and forward them on to Chrome. For example, I have
a `/list` end point that will connect to Chrome and return a list of open tabs.

```javascript
app.get('/list', (req, res) => {
  chrome.List((err, tabs) => {
    if (!err) {
      console.log(tabs);
      res.json(tabs);
    }
    else {
      res.json(tabs);
    }
  });
});
```

You also need to implement the health monitoring API so that App Engine knows
it should spin up an new instance of your service. But I hope you at least
get the idea.

## Why?

The next generation of scraper's and tools will all be built by running a real 
web browser against a web page and introspecting everything about it.

* Want to work out what CSS is used on first render? No Problem.
* Want to get accurate first paint times? No biggie.
* Want to analyse all the network requests made by a page? Simples.
* Want to see if there any CSP violations? Great. Not too hard.
* Want to host a version of [Lighthouse](https://github.com/GoogleChrome/lighthouse)? Yep. Cool.

The possibilities are endless. I want to play around with the idea of 0
traditional server and as a user you are always running a version of your web
app client-side, but it just so happens the client is on the server.

## Where can I see this running?

The source for my app is [here](https://github.com/PaulKinlan/chromeonhome/).

## What's next?

I've been playing around with [Google Cloud
Functions](https://cloud.google.com/functions/docs/) (Think Amazon Lambda but on
Google) a [fair bit
recently](https://github.com/PaulKinlan/pushit/tree/master/cloud-functions) and
I think in the near future it might be able to have Chrome running to service
one request. The benefit is that Chrome would only live for the lifetime of the
function call and that means that you could secure and isolate the storage
etc from other users.