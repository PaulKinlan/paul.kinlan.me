---
slug: this-javascript--state-of-browsers---youtube
date: 2018-07-19T15:06:53.251Z
title: 'This.Javascript: State of Browsers - YouTube'
link: https://www.youtube.com/watch?v=67etFbKTOFA
tags: [links, browsers, chrome, mozilla, edge, beaker, brave, pwa]
---
Tracy Lee de This Dot organizó una transmisión en vivo bastante ingeniosa que atrajo a muchos de los proveedores de navegadores para ofrecer una visión general de lo que están trabajando:

> Browser representatives from Brave, Beaker, Edge, Chrome, & Mozilla get together to talk about recent updates and the state of browsers.
> 
> Featured Speakers:
> 
> + Brendan Eich - &#x00a0;Creator of Javascript, Co-founder & CEO at Brave Software
> + Paul Frazee - Works on Beaker Browser
> + Matthew Claypotch - Developer Advocate at Mozilla
> + Paul Kinlan - Senior Developer Advocate at Google
> + Patrick Kettner - Edge at Microsoft
> + Amal Hussein - Senior Open Web Engineer at Bocoup
> + Tracy Lee - GDE,&#x2008;RxJs&#x2008;Core&#x2008;Team, This Dot Co-founder


[Leer la publicación completa](https://www.youtube.com/watch?v=67etFbKTOFA).

Disfruté mucho de la transmisión en vivo y fue genial escuchar lo que todos hacen. También me encanta la visión que tiene el navegador Beaker para una web distribuida, han hecho mucho trabajo desde la última vez que nos conocimos.

Los animo a que miren el video vinculado, Edge ha tenido una gran cantidad de actualizaciones que incluyen soporte técnico completo para trabajadores, fuentes variables y también están presentando WebP. Mozilla tiene un gran enfoque en el ensamblado web y herramientas de desarrollo, Beaker está haciendo cosas increíbles con dat: y la informática distribuida y Brave se ha estado moviendo mucho en BAT.

Me centré en el trabajo que nuestro equipo está haciendo en este momento, y en general se trata de Descubrimiento, Velocidad y Confiabilidad, Receptividad de UI, UX - Hacer las cosas, Seguridad y Privacidad. Un poco más concretamente:

* Descubrimiento: realmente necesitamos facilitar a los desarrolladores la creación de sitios con JS que se procesen en servicios decapitados, como indexadores y embedders. Eso significa que debemos centrarnos en educar a los desarrolladores sobre cómo funcionan los indexadores y cómo probarlos, y también cómo crear buenas experiencias sólidas de SSR. * Velocidad y confiabilidad: todos los sitios deben tener un TTI <5s en una red de 3g en el dispositivo Median (un MotoG 4/5) y debe optimizar su FID (primer retraso de entrada). FID es una nueva métrica, por lo que es importante comprender que pretende representar cómo los usuarios experimentan su sitio en la naturaleza, donde TTI ha sido difícil de medir, FID debería ser más fácil. Hay un [polyfill aquí que puede usar para probar FID](github.com/GoogleChromeLabs/first-input-delay) * Receptividad de la interfaz de usuario: nos gustaría que la web sea de 60 fps en todas partes y que sea más fácil para los desarrolladores lograrlo, por lo que estamos trabajando para hacer & # x2018; FLIP & # x2019; más fácil de entender, construyendo Houdini para que podamos darle a los desarrolladores un mayor control sobre el enging de renderizado y finalmente tratando de mover tanto trabajo como sea posible 'fuera del hilo principal' a través de cosas como img.decode y herramientas como comlink para hacer que los trabajadores más fácil de usar. * UX - Hacer las cosas - Realmente queremos cambiar la forma en que hablamos sobre las nuevas funciones que llegan a la plataforma, específicamente nos gustaría hacer un show donde la tecnología se debe utilizar de manera efectiva para mejorar las experiencias de los usuarios para ayudarles a realizar su trabajo rápidamente con la menor interrupción posible. * Seguridad y privacidad: creo que la prevención de seguimiento inteligente de Apple tendrá un impacto a largo plazo en la web y los desarrolladores deben comenzar a pensar más sobre la creación de privacidad que respalde las experiencias web. En todo caso, GDPR está convirtiendo la web en una experiencia "interesante" en la UE.

Finalmente, fue humillante y reconfortante escuchar que todos quieren traer [Web Intents](https://en.wikipedia.org/wiki/Web_Intents) :)
