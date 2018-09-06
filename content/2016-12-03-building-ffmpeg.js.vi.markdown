---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) là một dự án tuyệt vời và nó đã giúp tôi xây dựng một trong những dự án mới nhất của tôi: [Device Frame](https://paulkinlan.github.io/ deviceframe.es/). Về cơ bản nó xây dựng ffmpeg (với một bộ mặc định tốt để giữ kích thước nhỏ & mdash; nhỏ như nó có thể). Nếu bản dựng mặc định không hỗ trợ các bộ lọc và bộ mã hóa mà bạn cần, thì bạn sẽ cần phải tự xây dựng nó.

Đây là một lưu ý cho tôi trong tương lai, nhưng đây là những gì tôi đã làm để nó hoạt động. (Lưu ý: Tôi đã thử trên macOS sierra và đã nhận được lỗi biên dịch).

#### Cài đặt Deps

1. `sudo apt-get cài đặt automake libtool build-essential cmake`



#### Tải xuống ffmpeg.js

1. `git clone git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4.` git submodule update --recursive`



#### Cài đặt Emscripten:

1. Linux: [Tải xuống](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk update` 3.` ./emsdk cài đặt mới nhất `4. Đợi ... 5.` ./emsdk kích hoạt mới nhất` 6. `source. / Emsdk_env.sh`

#### Xây dựng ffmpeg.js

* `làm tất cả`

Nếu có lỗi với fribidi:

* `cd build / fribidi / && ./bootstrap && configure`

Bạn có thể thấy các lỗi như:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Hãy chắc chắn rằng bạn đã cài đặt `libtool`.

#### Làm xong.
