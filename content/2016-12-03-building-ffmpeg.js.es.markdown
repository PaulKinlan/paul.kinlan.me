---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) es un proyecto increíble y me ayudó a crear uno de mis últimos proyectos: [Device Frame](https://paulkinlan.github.io/ deviceframe.es/). Básicamente construye ffmpeg (con un buen conjunto de valores predeterminados para mantener el tamaño pequeño y lo más pequeño posible). Si la compilación predeterminada no es compatible con los filtros y codificadores que necesita, tendrá que compilarlo usted mismo.

Esto es más una nota para mí en el futuro, pero esto es lo que hice para que funcione. (Nota: probé en macOS sierra y estaba obteniendo errores de compilación).

#### Instalar Deps

1. `sudo apt-get install automake libtool build-essential cmake`



#### Descargar ffmpeg.js

1. `git clone git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4.` git submodule update --recursive`



#### Instalar Emscripten:

1. Linux: [Descargar](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk update` 3.` ./emsdk install latest `4. Espera ... 5.` ./emsdk activate latest` 6. `source. / Emsdk_env.sh`

#### Compilar ffmpeg.js

* `hacer todo`

Si hay errores con fribidi:

* `cd build / fribidi / && ./bootstrap && configure`

Es posible que vea errores como:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Asegúrese de tener `libtool` instalado.

#### Hecho.
