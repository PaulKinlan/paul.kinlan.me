---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Hemos estado haciendo mucho desarrollo en teléfonos con funciones recientemente y ha sido difícil, pero divertido. Lo más difícil es que en KaiOS fue imposible depurar las páginas web, especialmente en el hardware que teníamos (el Nokia 8110). El Nokia es un gran dispositivo, está construido con KaiOS, y sabemos que se basa en algo similar a Firefox 48, pero está bloqueado, no hay un modo de desarrollador tradicional como el que usas en otros dispositivos Android, lo que significa que no puedes conectar Firefox. WebIDE fácilmente.

A través de una combinación de leer un par de blogs y saber un poco sobre `adb` , descubrí cómo hacerlo. Tenga en cuenta que otros podrían haberlo hecho, pero no están documentados en un solo lugar.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(La imagen de arriba muestra los DevTools y también la salida de la herramienta de captura de pantalla)

Aquí están los pasos:

1. Conecte un cable USB. Asegúrese de que tiene `adb` instalado en su máquina principal.
2. Descargue una copia de [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (este es el único al que podría llegar a trabajar)
3. Active el &#39;Modo de desarrollador&#39; ingresando `*#*#33284#*#*` desde su teléfono (tenga en cuenta que no use el marcador). Verá un pequeño ícono de &#39;error&#39; en la parte superior de la pantalla. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ]
4. Conecte su cable USB
5. En su máquina de desarrollo ejecute los siguientes comandos
1. `adb start-server`
2. `adb devices` para comprobar si su teléfono está conectado.
3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` configura un canal desde su máquina a una toma del teléfono. Esto es lo que utiliza el IDE web.
6. Inicie `Web IDE` abriendo Firefox, vaya a Herramientas y luego a IDE web
7. El IDE web estará abierto, haga clic en &#39;Tiempo de ejecución remoto&#39; y haga clic en el botón de abrir que tiene &#39;localhost: 6000&#39; (este es el puerto de reenvío de TCP).
8. Abra una página en el teléfono, y debería verla a la izquierda. Voila
