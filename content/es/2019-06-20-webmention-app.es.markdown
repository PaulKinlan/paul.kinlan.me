---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
Me encanta la idea de [Webmentions](https://www.w3.org/TR/webmention/) , pero no he tenido tiempo de implementarla en mi sitio. En una web de alto nivel, las menciones le permiten comentar, dar me gusta y responder a otros contenidos en la web y hacer que sea visible para ese contenido sin estar centralizado con herramientas como Disqus (que estoy dispuesto a eliminar de mi sitio).

Las menciones web se dividen en dos componentes, el emisor y el receptor. El receptor es el sitio sobre el que escribo una publicación y pueden tener algo en su sitio que muestre enlaces entrantes o reacciones a su blog; y el remitente es, bueno, yo. Necesito dejar que el sitio remoto que he escrito o que haya reaccionado a algún contenido que hayan creado.

El increíble [Remy Sharp](https://remysharp.com) creó [webmention.app](https://webmention.app/) para resolver una parte del problema: enviar pings. La herramienta de Remy facilita el envío de &#39;pings&#39; a receptores potenciales a los que me he vinculado, simplemente llamando a un script CLI.

Alojo mi blog usando Zeit usando Hugo y la herramienta de construcción estática, por lo que fue [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Simplemente `npm i webmention` y luego llamo a la versión CLI de la herramienta desde mi archivo `build.sh` ; realmente es así de simple.

Ahora, cuando creo una publicación, debería enviar un ping rápido a todas las URL nuevas en las que he creado algún contenido sobre su sitio.

