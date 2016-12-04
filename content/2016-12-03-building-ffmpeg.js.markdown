---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
---

https://github.com/Kagami/ffmpeg.js is an amazing project and it helped me
building one of my latest projects: [Device
Frame](https://paulkinlan.github.io/deviceframe.es/). It basically builds 
ffmpeg (with a good set of defaults to keep the size small &mdash; as small
as it can be).  If the default build doesn't support the filters and encoders
you need, then you will need to build it yourself.

This is more of a note for me in the future, but this is what I did to get it
working. (Note: I tried on macOS sierra and was getting compile errors).

#### Install Deps

1. `sudo apt-get install automake libtool build-essential cmake`


#### Download ffmpeg.js

1. `git clone git@github.com:Kagami/ffmpeg.js.git`
2. `cd ffmpeg.js`
3. `git submodule init`
4. `git submodule update --recursive`


#### Install Emscripten:

1. Linux: [Download](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz)
2. `./emsdk update`
3. `./emsdk install latest`
4. Wait...
5. `./emsdk activate latest`
6. `source ./emsdk_env.sh`

#### Build ffmpeg.js

* `make all`

If there are errors with fribidi:

* `cd build/fribidi/ && ./bootstrap && configure`

You might see errors like:

```
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Make sure you have `libtool` installed.

#### Done.
