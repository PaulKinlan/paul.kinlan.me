---
slug: pinch-zoom-element
date: 2019-01-13T17:21:19.288Z
title: 'pinch-zoom-element'
link: https://www.webcomponents.org/element/pinch-zoom-element
tags: [links, web components, custom element]
---
Jake y el equipo construyeron este elemento personalizado bastante impresionante para administrar el zoom de pellizco en cualquier conjunto de HTML fuera de la propia dinámica de zoom-pellizco del navegador (piense en el zoom de la vista desde una ventana móvil). El elemento fue uno de los componentes centrales que necesitábamos para la aplicación [squoosh](https://squoosh.app/) que creamos y lanzamos en Chrome Dev Summit (... digo &#39;lanzado en Chrome Dev Summit&#39;: Jake se lo mostró a todos en el China Developer Day de China aunque el resto del equipo estaba bajo embargo;) ...)

> install: `npm install --save-dev pinch-zoom-element`
> 
> ```HTML
> <pinch-zoom>
>   <h1>Hello!</h1>
> </pinch-zoom>
> ```

[Read full post](https://www.webcomponents.org/element/pinch-zoom-element) .

Acabo de agregarlo a mi blog (me tomó solo un par de minutos), puedes verlo en mi sección &#39; [life](https://paul.kinlan.me/life/img_20170711_063830/) &#39; donde comparto las fotos que tomé. Si se encuentra en un dispositivo táctil, puede hacer un zoom rápido en el elemento, si está utilizando un trackpad que puede manejar múltiples entradas de dedo que también funcionan.

Este elemento es un gran ejemplo de por qué me encantan los componentes web como modelo para crear componentes de interfaz de usuario. El elemento `pinch-zoom` tiene poco menos de 3kb en el cable (sin comprimir) y dependencias mínimas para la construcción y simplemente hace un trabajo excepcionalmente bien, sin vincular ninguna lógica personalizada de nivel de aplicación que haga que sea difícil de usar (tengo algunas ideas sobre la lógica de UI componentes de la lógica de la aplicación vs que compartiré en base a mis aprendizajes de la aplicación Squoosh).

Me encantaría ver que elementos como estos adquieran mayor conciencia y uso, por ejemplo, podría imaginar que este elemento podría reemplazar o estandarizar la funcionalidad de zoom de imagen que se ve en muchos sitios de comercio y quitarle el dolor a los desarrolladores.
