---
slug: goodbye-jekyll-hello-hugo
date: 2015-07-31
title: "Goodbye Jekyll, Hello Hugo"
description: "Ruby frustrations and performance have frustrated me for a long time. Experimented with Hugo and ported blog in about 3 hours"
image_header: /images/hellogoodbye.png
---


Me gusta Jekyll. Me ayudó a volver a bloguear y [lo elegí como la tecnología](https://github.com/Google/WebFundamentals/) para compilar [Fundamentos web de Google](https://developers.google.com/web/fundamentals/) con él.

Algo está muy mal: ** Rendimiento **.

Los tiempos de compilación para mi blog personal (alrededor de 400 páginas) toman aproximadamente 45 segundos. Web Fundamentals es incluso peor, con frecuencia se tardan muchos minutos en crear solo un paquete de idioma y admitimos 13 idiomas. Este problema de rendimiento afecta seriamente a nuestro equipo y a nuestro equipo de redacción porque los cambios individuales en un entorno de preparación local tardan más de 40 segundos en ser visibles en el navegador.


* Tal vez * podemos mejorarlo, pero estoy seguro de que no puedo encontrar la manera de hacerlo. No puedo instrumentarlo y constantemente nos topamos con problemas con Ruby (no somos desarrolladores de Ruby) específicamente sobre el control de versiones de Gems y actualizaciones de tiempo de ejecución.

Tenemos una gran deuda técnica con el sitio y nos está llevando a mí y al equipo mucho tiempo solo para mantener las cosas en funcionamiento para un sitio estático. Tengo la corazonada de que es el motor de plantillas y Ruby. Pero esto solo soy yo adivinando.

Estaba buscando generadores de sitios estáticos rápidos y un par de personas en el equipo más amplio han insinuado que [Hugo](http://gohugo.io/) (escrito en Go) es bueno, bien estructurado y rápido.

No entraré mucho en Hugo. Es un generador de sitios estáticos que puede ingerir archivos Markdown (como Jekyll) y escupir un sitio estructurado en función de las plantillas que defina.

Voy a repasar algunos puntos rápidos:


* Mi versión de Jekyll solía tardar 45 segundos +, la construcción del sitio completo de Hugo es de 300-450 ms. 2 órdenes de magnitud más rápido.
* Las plantillas mediante el lenguaje de plantillas de Go se han acostumbrado un poco, pero es * mucho más limpio * que Liquid.
* La paginación fue bastante fácil de integrar aunque tuve algunos problemas con los documentos.
* Los documentos son bastante sólidos, hay algunas muestras donde los ejemplos en una página que se espera que estén relacionados no siempre causan confusión.
* La guía de migración de Jekyll, para una construcción simple de Jekyll, me ayudó la mayor parte del camino.
* Hugo no admitía la sintaxis de nombre de archivo que Jekyll tiene (YYYY-MM-DD-title) para ordenar las publicaciones y tuve que escribir una secuencia de comandos de migración para agregar un atributo `date` a cada página de marcado y también una` slug` atributo.
* Tenía un montón de archivos HTML que no parecían estar incluidos en la matriz .Site.Pages. Nuevamente tuve que convertirlos a todos con un simple script de línea de comandos.

Aún así, el rendimiento es impresionante y mi blog es mucho más rápido y no tiene dependencias de Ruby.

No puedo decir que trasladaremos Web Fundamentals a Hugo, es un gran trabajo. Estoy muy contento con la configuración de desarrollo e implementación local que tengo ahora por ahora.

Crédito de la imagen del título: https://commons.wikimedia.org/wiki/File:Hellogoodbye_logo.svg