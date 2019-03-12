---
slug: got-web-performance-problemsjust-wait
date: 2019-03-09T08:10:52.804Z
title: 'Got web performance problems? Just wait...'
link: 'https://twitter.com/kosamari/status/1104021989881270272'
tags: [links, performance, developing markets]
---
Vi un tweet de un buen amigo y colega, [Mariko](https://twitter.com/kosamari) , acerca de las pruebas en una gama de dispositivos de gama baja que lo mantienen realmente conectado a tierra.

El contexto del tweet es que estamos analizando cómo es el desarrollo web cuando construimos para usuarios que viven diariamente en estas clases de dispositivos.

<figure>
  <img src="/images/2019-03-09-got-web-performance-problemsjust-wait.jpeg">
</figure>

El equipo está haciendo mucho trabajo ahora en este espacio, pero pasé un día construyendo un sitio y fue increíblemente difícil hacer que algo funcionara a un nivel de rendimiento incluso ligeramente razonable. Estos son algunos de los problemas que encontré:

* Las rarezas de la ventana gráfica, y la reintroducción misteriosa de 300 ms de retraso de clics (puede funcionar alrededor).
* Grandes repintados de pantalla completa, y es lento.
* La red es lenta
* La memoria está restringida, y los GC subsiguientes bloquean el hilo principal por varios segundos
* Ejecución increíblemente lenta de JS
* La manipulación de DOM es lenta

Para muchas de las páginas que estaba creando, incluso en una conexión wifi rápida las páginas tardaron varios segundos en cargarse, y las interacciones posteriores fueron simplemente lentas. Fue difícil, involucró intentar alejarme lo más posible del hilo principal, pero también fue increíblemente gratificante a nivel técnico ver cambios en los algoritmos y la lógica que no habría hecho con todo mi desarrollo web tradicional. Grandes mejoras en el rendimiento.

No estoy seguro de qué hacer a largo plazo, sospecho que una gran cantidad de desarrolladores con los que trabajamos en los mercados más desarrollados tendrá una reacción &quot;No estoy construyendo sitios para usuarios en [insertar país x]&quot;, y en un de alto nivel es difícil discutir esta afirmación, pero no puedo ignorar el hecho de que 10 de los millones de nuevos usuarios ingresan a la informática cada año y usarán estos dispositivos y queremos que la web sea * la * plataforma de elección para contenido y aplicaciones para que no estemos contentos con [rise of the meta platform](https://paul.kinlan.me/rise-of-the-meta-platforms/) .

Vamos a tener que seguir presionando en el rendimiento durante un largo tiempo por venir. Seguiremos creando herramientas y guías para ayudar a los desarrolladores a cargar rápidamente y tener interfaces de usuario fluidas :)
