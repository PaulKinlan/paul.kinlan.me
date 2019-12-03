---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

Realmente me gusta <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . Me permite crear una interfaz muy simple alojada en la web para mi blog estático de Hugo.

EditorJS tiene la mayor parte de lo que necesito en un simple editor basado en bloques. Tiene un complemento para encabezados, código e incluso una forma simple de agregar imágenes al editor sin requerir infraestructura de alojamiento. No tiene una manera simple de agregar videos al editor, hasta ahora.

Tomé el <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> repositorio de complementos de <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> y lo cambié (solo un poco) para crear un <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> complemento <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ( <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ). Ahora puedo incluir videos fácilmente en este blog.

Si está familiarizado con EditorJS, es bastante simple incluirlo en sus proyectos. Simplemente instálelo de la siguiente manera

```
npm i simple-video-editorjs
```

Y luego simplemente inclúyalo en su proyecto como mejor le parezca.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

El editor tiene algunas opciones simples que le permiten configurar cómo se debe alojar el video en la página:

1. Reproducción automática: el video se reproducirá automáticamente cuando se cargue la página
1. silenciado: el video no tendrá sonido activado de forma predeterminada (necesario para la reproducción automática)
1. controles: el video tendrá los controles HTML predeterminados.

A continuación se muestra un ejemplo rápido de un video que está incrustado (y que muestra algunas de las opciones).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

De todos modos, me divertí creando este pequeño complemento: no fue demasiado difícil de crear y lo único que hice fue diferir la conversión a base64 que usan imágenes simples y en su lugar solo usar las URL de Blob.