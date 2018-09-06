---
slug: ffmpeg-ideas
date: 2016-12-05
title: "Ideas for web apps with FFMPEG and ffmpeg.js"
tags: ["ffmpeg"]
---


Hace poco construí una aplicación web progresiva que toma un [screencast de su dispositivo Android y luego ajusta el video en un marco de dispositivo](https://paulkinlan.github.io/deviceframe.es/) usando [FFMPEG.js](https : //github.com/Kagami/ffmpeg.js) como ese:

{{<youtube E_U6zvjW8so>}} También logré ordenar [building ffmpeg.js](https://paul.kinlan.me/building-ffmpeg.js/) para que, con relativa facilidad, cree compilaciones personalizadas optimizadas de ffmpeg y ejecutarlo en el navegador.

Las dos cosas juntas creo que presentan muchas oportunidades para construir nuevas y pequeñas aplicaciones web progresivas que impulsan lo que creemos que la web es capaz de manipular audio y video.

Hay muchas utilidades de video basadas en web en la web, pero a mi parecer muchas están construidas como sitios web antiguos, y no aprovechan los avances en el procesamiento del lado del cliente, están cargadas de publicidad y no pueden trabajar fuera de línea. .

También estoy muy interesado en la filosofía de Unix de ["Haz una cosa y hazlo bien"](https://en.wikipedia.org/wiki/Unix_philosophy#Do_One_Thing_and_Do_It_Well) así que en lugar de construir una aplicación de edición de video masivamente monolítica, Creo que hay muchas aplicaciones web diferentes que se pueden construir de manera fácil y rápida:

* Recorte un video (tome 5 segundos de frente, 3 de la parte posterior, etc.) * Cualquier formato de video -> GIF * Montón de imágenes -> Cualquier formato de video * Cualquier formato de video -> Cualquier formato de video * Agregue una marca de agua * Cambie el tamaño del video * Reducir video * Agregar marcas de agua a un video * Superponer videos uno encima del otro * Unir videos juntos * FFMPEG área de juegos (soltar fuentes y un guión) * [Si tiene alguna idea agregarlos a esta lista](https: // github.com/PaulKinlan/paul.kinlan.me/edit/master/content/2016-12-05-ffmpeg-ideas.markdown)

Creo que tengo la mayor parte del código en su lugar como un arnés de UI para esto con mi Repo de [Frames de dispositivo en Github](https://github.com/PaulKinlan/deviceframe.es) y en muchos casos es una cuestión de ajuste el gráfico de procesamiento ffmpeg y la actualización de la interfaz de usuario para permitir alguna configuración.

Voy a crear un par de estos en las próximas semanas, si alguien quiere unirse, ¡entonces póngase en contacto!