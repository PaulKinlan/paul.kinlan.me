---
slug: breaking-down-silos-with-share-target-api
date: 2018-01-20T13:20:31.000Z
title: "Breaking down silos by sharing more on the web"
tags: ["intents", "silo", "share"]
image_header: /images/share_mobile_handler.png
---
Este artículo tiene más de un año de retraso. Estuvo atascado en mis borradores durante mucho tiempo, sin embargo, creo que la idea es algo que tenemos que resolver en 2018. También resulta que han surgido otros problemas en el último año que lo hacen un poco más relevante.

Estuve en Indonesia a principios de 2016 charlando ociosamente con los desarrolladores y surgió en la conversación que la web está jodida (eran las palabras literales). El quid de la cuestión fue que los usuarios de hoy, y específicamente los usuarios que se están conectando por primera vez, están creando contenido dentro de silos. En algunos casos, estos silos [se ven y se sienten como la web](/ rise-of-the-meta-platforms /) pero el contenido solo está disponible en esas plataformas, pero se perpetúa por el hecho de que cada aplicación nativa tiene la capacidad para participar activamente en cada interacción que el usuario tiene en su dispositivo informático, pero la web no, y eso es un asesino. Es imposible incluir contenido en las experiencias web, pero es más fácil sacar el contenido.

Más concretamente, hubo una serie de escenarios que discutimos.

1. Toma una foto en la aplicación de su cámara y desea compartir la imagen. Presiona compartir, pero solo las aplicaciones nativas aparecen en la lista. La web no es parte de la elección de los usuarios, por lo que la web nunca puede capturar ese valor. 2. Desea compartir la página actual en el navegador. Presiona compartir, pero solo las aplicaciones nativas aparecen en la lista. El hecho de compartir información significa que estamos perdiendo un usuario de la web a una experiencia nativa 3. Usted crea un contenido directamente dentro de una página web y desea compartirlo, su única opción es incluir un widget que comparta.

A principios de 2017 vimos el lanzamiento de [navigator.share](/ navigator.share /) que trajo el intercambio nativo a la web (bueno, los usuarios de Chrome al menos). La ironía es que la API `navigator.share` perpetúa el flujo de los usuarios que usan aplicaciones nativas.

En 2018, me encantaría que la web fuera más efectiva para romper los silos que se perpetúan en las plataformas nativas. La web debe poder participar en cada interacción importante que el usuario tenga con su dispositivo.

A fines de 2017, se lanzó "Mejorado para agregar a la pantalla de inicio" en Chrome para Android. Esto significa que cada vez que un usuario instala su `Progressive Web App` se genera una APK real para el usuario. Una APK en Android significa que, para todos los fines y propósitos, su aplicación web se considera una aplicación nativa. En la primera iteración de "Mejorado agregar a la pantalla de inicio", todo lo que significa es que cada navegación a una url dentro del alcance de su PWA se abrirá directamente en el PWA.

El futuro es un poco más brillante. Chrome está trabajando en [Share target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) que le permite declarar que su sitio participará en la recepción de "acciones". Eso significa que cada vez que un usuario comparte un enlace, su PWA podrá aparecer en la lista.

Estoy muy entusiasmado con este desarrollo porque significa que los sitios grandes como [Twitter Lite](https://lite.twitter.com) ahora se podrán compartir sin la necesidad de que el usuario use la aplicación Native, pero también significa que pequeños sitios de nicho que solo un puñado de usuarios podrían usar también pueden ser parte del mismo ecosistema.

La API no puede manejar imágenes y datos binarios todavía, pero mirando el ecosistema de Android, el intento ACTION_SEND es el intento más utilizado y es principalmente solo para compartir texto y enlaces.

Es un comienzo. La web está rompiendo un silo a la vez.
