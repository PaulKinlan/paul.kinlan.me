---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) - удивительный проект, и это помогло мне построить один из моих последних проектов: [Device Frame](https://paulkinlan.github.io/ deviceframe.es/). Он в основном создает ffmpeg (с хорошим набором значений по умолчанию, чтобы сохранить размер small & mdash, насколько это возможно). Если сборка по умолчанию не поддерживает фильтры и кодировщики, которые вам нужны, тогда вам нужно будет ее самостоятельно создать.

Это скорее примечание для меня в будущем, но это то, что я сделал, чтобы заставить его работать. (Примечание. Я пытался использовать macOS sierra и получал ошибки компиляции).

#### Установка Deps

1. `sudo apt-get install automake libtool build-essential cmake`



#### Загрузить ffmpeg.js

1. `git clone git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4.` git subodule update --recursive`



#### Установите Emscripten:

1. Linux: [Скачать](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk update` 3.` ./emsdk установить последнюю версию `4. Подождите ... 5.` ./emsdk активировать последний` 6. `source. / Emsdk_env.sh`

#### Построить ffmpeg.js

* `make all`

Если есть ошибки с fribidi:

* `cd build / fribidi / && ./bootstrap && configure`

Вы можете увидеть такие ошибки, как:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Убедитесь, что у вас установлен `libtool`.

#### Готово.
