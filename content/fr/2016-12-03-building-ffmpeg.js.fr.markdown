---
slug: building-ffmpeg.js
date: 2016-12-03
title: "Building ffmpeg.js for Ubuntu"
tags: ["ffmpeg", 'wasm']
---


[FFMPEG.js](https://github.com/Kagami/ffmpeg.js) est un projet incroyable et il m'a aidé à créer l'un de mes derniers projets: [Device Frame](https://paulkinlan.github.io/ deviceframe.es/). Il construit essentiellement ffmpeg (avec un bon ensemble de valeurs par défaut pour garder la taille petite et aussi petite que possible). Si la version par défaut ne prend pas en charge les filtres et les encodeurs dont vous avez besoin, vous devrez la créer vous-même.

Ceci est plus une note pour moi à l'avenir, mais c'est ce que j'ai fait pour le faire fonctionner. (Note: j'ai essayé sur MacOS Sierra et j'ai eu des erreurs de compilation).

#### Installer Deps

1. `sudo apt-get install automake libtool build-essential cmake`



#### Télécharger ffmpeg.js

1. `git clone git@github.com: Kagami / ffmpeg.js.git` 2.` cd ffmpeg.js` 3. `git submodule init` 4.` git submodule update --recursive`



#### Installez Emscripten:

1. Linux: [Téléchargement](https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz) 2. `./emsdk update` 3.` ./emsdk install Dernière version `4. Attendez ... 5.` ./emsdk activate latest` 6. `source. / Emsdk_env.sh`

#### Build ffmpeg.js

* `tout faire '

S'il y a des erreurs avec fribidi:

* `cd build / fribidi / && ./bootstrap && configure`

Vous pourriez voir des erreurs comme:


```shell
./configure: line 4255: syntax error near unexpected token `2.2'
./configure: line 4255: `LT_PREREQ(2.2)'
```
Assurez-vous d'avoir `libtool` installé.

#### Terminé.
