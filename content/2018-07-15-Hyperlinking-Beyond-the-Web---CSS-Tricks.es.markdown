---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain en CSS Tricks escribe sobre un área cercana a mi corazón, vinculando:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Leer publicación completa](https://css-tricks.com/hyperlinking-beyond-the-web/).

Este fue un gran artículo que cubre todos los diferentes tipos de hipervínculos disponibles para aplicaciones y sitios. He estado investigando mucho sobre este espacio desde que los Intents Web y el estado de los enlaces avanzados en la web dejan mucho que desear, imo.

Una de las razones por las que amo la web es que detrás de un enlace está el acceso directo al recurso, no conozco ninguna otra plataforma que pueda combinar el enlace y el recurso real de la misma manera, pero podría ser tan mucho Más. El enlace estándar proporciona esencialmente un intento de VISTA que contiene el estado (la url) y el contexto (texto entre los anclajes), y puede hackear con él los protocolos personalizados, pero tenemos que ir mucho más allá.

* Necesitamos expandir el vocabulario a `registerProtocolHandler` para tener más acceso a más esquemas nativos * Todo lo que se registra con el manejador de protocolo necesita estar en todo el sistema. * Necesitamos poder tener sitios web para poder manejar la apertura de una variedad de tipos de contenido y tener páginas disponibles para registrar como manejador de archivos del sistema. * Necesitamos tener acciones de mayor orden disponibles para los desarrolladores, VIEW es excelente, necesitamos un conjunto acordado de acciones centrales como PICK, SAVE, EDIT para que podamos entender más efectivamente las capacidades de un sitio o de una aplicación, y la capacidad de extender ellos con semántica de orden superior. Android tiene esto, Siri lo está obteniendo, ambos usando 'Intents', la Web debería tenerlo también.

Esta es una de las razones por las que estoy tan entusiasmado con las abstracciones de mensajes como [Comlink](https://github.com/GoogleChromeLabs/comlink) que eliminan la carga de la locura postMessage y le permiten pensar en exponer la función a otra aplicaciones, y luego una vez que expone la función necesita habilitar más fácilmente el descubrimiento de esa función ... y eso es lo que permiten los enlaces.
