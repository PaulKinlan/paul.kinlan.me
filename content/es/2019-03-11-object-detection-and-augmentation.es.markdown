---
slug: object-detection-and-augmentation
date: 2019-03-11T20:32:18.307Z
title: 'Object Detection and Augmentation'
link: 'https://github.com/jeeliz/jeelizFaceFilter/blob/master/README.md#features'
tags: [links, qrcode, shapedetection]
---
He estado jugando mucho con [Shape Detection API](https://paul.kinlan.me/face-detection/ https://paul.kinlan.me/barcode-detection/ https://paul.kinlan.me/detecting-text-in-an-image/) en Chrome y me gusta mucho el potencial que tiene, por ejemplo, un [QRCode detector](https://qrsnapper.com) muy simple que escribí hace mucho tiempo tiene un polyfill JS, pero usa la API `new BarcodeDetector()` si está disponible.

Puede ver algunas de las otras demostraciones que he construido aquí utilizando las otras capacidades de la API de detección de formas: [Face Detection](https://paul.kinlan.me/face-detection/) , [Barcode Detection](https://paul.kinlan.me/barcode-detection/) y [Text Detection](https://paul.kinlan.me/detecting-text-in-an-image/) .

Me sorprendió gratamente cuando me tropecé con [Jeeliz](https://jeeliz.com) el fin de semana y me impresionó mucho el rendimiento de su conjunto de herramientas, aunque estaba usando un Pixel3 XL, pero la detección de rostros parecía significativamente más rápida de lo que es posible con la API `FaceDetector` .

[Checkout some of their demos](https://jeeliz.com/sunglasses) .

<figure>
  <img src="/images/2019-03-11-object-detection-and-augmentation.jpeg">
</figure>

Me hizo pensar mucho. Este kit de herramientas para la detección de objetos (y otros similares) utiliza API que están ampliamente disponibles en la web, específicamente el acceso a la cámara, WebGL y WASM, que a diferencia de la API de detección de formas de Chrome (que solo está en Chrome y no es consistente en todas las plataformas en las que Chrome está ) se puede utilizar para crear experiencias ricas fácilmente y llegar a miles de millones de usuarios con una experiencia consistente en todas las plataformas.

El aumento es donde se pone interesante (y realmente lo que quería mostrar en esta publicación) y donde necesita las bibliotecas de middleware que ahora están llegando a la plataforma, podemos crear las divertidas aplicaciones de filtro de caras de Snapchat sin que los usuarios instalen aplicaciones MASIVAS esa cosecha gran cantidad de datos del dispositivo de los usuarios (porque no hay acceso subyacente al sistema).

Fuera de las divertidas demostraciones, es posible resolver casos de uso muy avanzados de forma rápida y sencilla para el usuario, como:

* Selección de texto directamente desde la cámara o foto del usuario.
* Traducción en vivo de idiomas desde la cámara.
* Detección de código QR en línea para que las personas no tengan que abrir WeChat todo el tiempo :)
* Extraiga automáticamente las URL del sitio web o la dirección de una imagen
* Detección de tarjeta de crédito y extracción de números (haga que los usuarios se registren más rápido en su sitio)
* Búsqueda visual de productos en la aplicación web de tu tienda.
* Búsqueda de códigos de barras para obtener más detalles del producto en la aplicación web de su tienda.
* Recorte rápido de fotos de perfil en las caras de las personas.
* Funciones simples de A11Y para que el usuario escuche el texto que se encuentra en las imágenes.

Acabo de pasar 5 minutos pensando en estos casos de uso, sé que hay muchos más, pero me parece que no vemos muchos sitios o aplicaciones web que utilizan la cámara, sino que vemos muchos sitios que preguntan a sus usuarios para descargar una aplicación, y no creo que tengamos que hacerlo más.

** Actualización ** Thomas Steiner en nuestro equipo mencionó en nuestro equipo Chat que parece que no me gusta la actual API `ShapeDetection` . Me encanta el hecho de que esta API nos da acceso a las implementaciones de envío nativas de cada uno de los sistemas respectivos. Sin embargo, como escribí en [The Lumpy Web](/the-lumpy-web/) , los Desarrolladores Web anhelan consistencia en la plataforma y hay varios problemas con la API de Detección de Forma que pueden resumirse como:

1. La API solo está en Chrome 2. La API en Chrome es muy diferente en cada plataforma porque sus implementaciones subyacentes son diferentes. Android solo tiene puntos para puntos de referencia como boca y ojos, donde macOS tiene contornos. En Android, `TextDetector` devuelve el texto detectado, mientras que en macOS devuelve un indicador de &#39;Presencia de texto&#39; ... Esto es para no mencionar todos los errores que encontró Surma.

La web como plataforma para la distribución tiene tanto sentido para experiencias como estas que creo que sería negligente que no lo hagamos, pero los dos grupos de problemas anteriores me llevan a cuestionar la necesidad a largo plazo de implementar cada característica en la plataforma web de forma nativa, cuando podríamos implementar buenas soluciones en un paquete que se envía con las características de la plataforma actual como WebGL, WASM y en la futura GPU web.

De todos modos, me encanta el hecho de que podamos hacer esto en la web y espero ver los sitios que se envían con ellos.