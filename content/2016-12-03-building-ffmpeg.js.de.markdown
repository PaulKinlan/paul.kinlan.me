---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) ist ein erstaunliches Projekt und es hat mir geholfen, eines meiner neuesten Projekte aufzubauen: [Device Frame](https://paulkinlan.github.io/ deviceframe.es/). Es erstellt im Wesentlichen ffmpeg (mit einer guten Anzahl von Standardeinstellungen, um die Größe klein zu halten, so klein wie möglich). Wenn das Standard-Build die benötigten Filter und Encoder nicht unterstützt, müssen Sie es selbst erstellen.

Das ist für mich in der Zukunft eher eine Notiz, aber das habe ich getan, um es zum Laufen zu bringen. (Hinweis: Ich habe versucht, MacOS Sierra und kompilierte Fehler).

#### Installiere Deps

1. `sudo apt-get installieren automake libtool build-essential cmake`



#### Download ffmpeg.js

1. `git Klon git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git Submodul init` 4.` git submodul update --recursive`



#### Installiere Emscript:

1. Linux: [Download](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk update` 3.` ./emsdk install neustes `4. Wait ... 5.` ./emsdk activate latest` 6. `source ./ emsdk_env.sh`

#### Build ffmpeg.js

* `mach alles`

Wenn es Fehler mit Fribidi gibt:

* `cd build / fribidi / && ./bootstrap && configure`

Möglicherweise sehen Sie Fehler wie:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Stellen Sie sicher, dass Sie `libtool` installiert haben.

#### Erledigt.
