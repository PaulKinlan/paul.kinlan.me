---
slug: challenges-for-web-developers
date: 2018-01-21T13:20:31.000Z
title: "Challenges for web developers"
description: "Summary of the challenges that I beleive we developers face every day."
---


Originalmente escribí esto para articular los desafíos del ecosistema de desarrollador más amplio que mi equipo (Chrome y las relaciones con desarrolladores web) debe abordar para que podamos ayudar a la industria a prosperar, para que podamos ayudar a más personas a construir en la web y para ayudar los desarrolladores crean experiencias que a más personas les encanta usar.

Después de compartir el [manifiesto de Web y DevRel de Chrome](/ web-developer-relations-manifesto /), quería seguir el ritmo de compartir mis pensamientos sobre algunos de los desafíos que queremos ayudar a los desarrolladores a resolver.

En realidad, no envié este artículo, pero ahora que he tenido algo de tiempo y es el año nuevo, pensé que sería un buen momento para compartir esto.

Comprender los desafíos que los desarrolladores enfrentan a diario me ayuda a descubrir cómo podemos cambiar nuestra forma de trabajar para ayudar a la mayor cantidad de desarrolladores posible.

Me encantaría tu comentario. ¿Me equivoco? ¿Ves algún problema más amplio del ecosistema que me he perdido?

Haré artículos más profundos de muchos de estos temas.

## El desarrollo web es fácil de comenzar, pero es difícil progresar y dominar

* El soporte API variable y las prioridades de los proveedores hacen que las experiencias consistentes sean difíciles o imposibles de construir. * Las consideraciones heredadas, por ejemplo, el viejo CMS, las implementaciones existentes significan que hay un gran impulso que debe superarse. * Las peculiaridades de la plataforma y los problemas de compatibilidad causan una gran cantidad de frustración y cantidades innecesarias de pruebas adicionales. * Se crea una gran cantidad de abstracciones que alejan a los desarrolladores de la comprensión de la plataforma. * Falta de primitivas a nivel de plataforma para interacciones similares a las aplicaciones: vistas, modelos, controladores, recicladores, transiciones de héroes, ver transiciones. * Los desarrolladores web deben ser buenos en todo: fuera de línea, accesibilidad, localización, rendimiento, seguridad ...

## Los desarrolladores están entusiasmados con PWA, pero pueden ser difíciles de construir y difíciles de hacer bien

* La falta de soporte del navegador principal para PWA hace que sea difícil justificar la creación de uno * End to end es demasiado difícil de construir una aplicación web progresiva. HTTPS, los trabajadores del servicio son todos difíciles de comenzar. * El valor de PWA no se articula claramente, especialmente a través de los SO (Safari, Desktop, etc.) y esta es una razón simple acerca de por qué no adoptarlo. * Es casi imposible construir un "PWA ejemplar" y realmente a nadie le importa que lo hagan. * Los desarrolladores frecuentemente tienen que comenzar de nuevo y no migran sus experiencias existentes. * Los desarrolladores y las empresas no saben por qué deberían crear una aplicación web progresiva. * La capacidad de búsqueda de las aplicaciones web existentes es un problema enorme. * "Progresivo" no se valora. Difícil ofrecer una experiencia consistente / características que faltan en diferentes navegadores web / sistemas operativos * Las aplicaciones web progresivas que se están construyendo no responden y, por lo tanto, aumentan los costos de mantenimiento ya que tiene que ocuparse de un sitio de escritorio separado

## Es muy difícil construir una experiencia que funcione bien (UI / UX)

* La barra lo suficientemente buena para los desarrolladores es demasiado baja. ¿Lo que es bueno? ¿Por qué es importante? ¿Cómo se llega allí? * Es fácil ser un mal actor cuando se construyen componentes, A11Y, el diseño y el rendimiento son difíciles de construir y los desarrolladores no priorizan. * Los desarrolladores no ven el valor de los componentes web y las herramientas de plataforma para ayudarlos a construir rápidamente * Muchos autores de frameworks no cree que los componentes web deban usarse y esto puede o no ser correcto, simplemente no está claro para los desarrolladores * Los desarrolladores quieren un marco de interfaz de usuario como Bootstrap para eliminar los dolores de la interfaz de usuario y les permite concentrarse en el producto * Las primitivas de muchas experiencias son muy difíciles de construir y construir bien: menús, navegación, transiciones, adquisiciones, enlace de datos, vistas, controladores * Es difícil construir experiencias de rendimiento: los primitivos son un problema (la plataforma no tiene lo que los desarrolladores necesitan). o están ahí, pero nadie sabe ni le importa) * El soporte desigual para las animaciones de API hace que sea imposible para los desarrolladores adoptar nuevas primitivas de plataforma: los primitvos son normalmente fundamentales y casi imposibles de utilizar. Illinois

## Es muy difícil construir un sitio rápido

* Los desarrolladores web están creando experiencias lentas que tienen un UX terrible y no son accesibles. Quieren hacerlo mejor pero no saben cómo * Los desarrolladores y las empresas no priorizan el rendimiento porque no hay una nueva guía clara sobre el impacto que puede tener en su negocio * Los desarrolladores no entienden por qué un sitio es lento * es muy difícil construir un sitio de carga rápida; hay muchas pistolas y muchos navegadores * Los desarrolladores no saben cuáles son los objetivos que deben alcanzar. * Los desarrolladores no tienen la orientación que necesitan para alcanzar las metas establecidas. (El patrón PRPL, la fragmentación basada en rutas, la transmisión son preocupaciones adicionales en este momento y no tienen documentos concretos, etc.) * Las herramientas y los marcos del desarrollador no son rápidos de manera predeterminada y los desarrolladores no saben ni se preocupan: agruparlos es un gran problema. DX & gt; UX * Los desarrolladores no prueban el hardware en el que se ejecutan sus usuarios y por eso se siente "lo suficientemente bueno" * Los desarrolladores no tienen toda la información sobre su base de usuarios y el impacto que sus decisiones tienen en ellos * Los desarrolladores priorizan el rendimiento de la carga más de lo que priorizan el rendimiento "en la página" * Es demasiado difícil lograr que la IU del sitio funcione sin problemas en todos los dispositivos * La depuración pública está aumentando y está desanimando a los desarrolladores. * Los desarrolladores sienten que los estamos golpeando en la cabeza todo el tiempo y así apagar

## Es muy difícil construir un sitio seguro

* La migración a HTTPs es un bloqueador para la adopción de muchas piezas nuevas de tecnología * Los desarrolladores y las empresas no ven la necesidad de hacer que sus sitios sean seguros (es decir, ¿por qué necesito esto para un sitio de noticias?) * Es difícil establecer HTTPS * Todavía puede ser costoso para los desarrolladores configurar un sitio HTTPS, no todos pueden usar LetsEncrypt. Los sitios grandes y pequeños tienen que pagar mucho más por el privilegio * Los desarrolladores no entienden el valor de las "tecnologías seguras" como CSP y ven baja adopción

## Las empresas y los desarrolladores no saben por qué deberían "Web"

* Convertir a un usuario en la web móvil es difícil, por lo que ganar dinero es difícil * Los casos y necesidades comerciales varían según la región, la verticalidad y la audiencia, por lo que son difíciles de aplicar de manera significativa sin invertir mucho más * La aparente falta de capacidades significa que se siente como que no deberías usar la web * La web simplemente se está moviendo a un modelo de aplicación, ¿por qué no simplemente hacer la 'aplicación'? La falta de compatibilidad entre navegadores para API clave hace que sea difícil para las empresas justificar sus inversiones * No es aclarar el valor de la web cuando hay tantas plataformas competidoras

## La web es grumosa y causa a los desarrolladores mucho dolor

* Los navegadores cambian con frecuencia a través de adiciones o eliminaciones tácticas de la plataforma web y no saben lo que está sucediendo, cómo mantenerse al día o cómo cambiar. Esto causa dolor a los desarrolladores * Chrome rompe constantemente la plataforma con sus "intervenciones" * Los ciclos de actualización del navegador crean incertidumbre y "arenas movedizas" * Los jugadores de la plataforma no están todos alineados. Safari, UC, Edge y tienen diferentes prioridades * Los desarrolladores tienen que hacer que todo funcione en todas partes (desde el navegador iOS al UC) y tienen las herramientas, orientación o datos para respaldar sus decisiones

## La web es un ecosistema vibrante, pero ruidoso

* Se genera una gran cantidad de opiniones cada día y también se definen las mejores prácticas que no son ni precisas ni exhaustivas y los desarrolladores buscan que Google y otros presenten una guía unificada. * Hay una gran cantidad de herramientas, bibliotecas y frameworks. construido y los desarrolladores no saben qué elegir * Google tiene una gran cantidad de marcos y los desarrolladores no están seguros de qué usar * Creamos un montón de contenido y no se presenta de manera uniforme * Muchas herramientas y desarrolladores de la competencia no lo hacen saber cuáles deberían usar * Muchos de los marcos y desarrolladores que compiten no saben qué usar. * Muchos de los consejos y desarrolladores que compiten no saben a qué atenerse o confiar.

## La web es global

* Los desarrolladores no solo hablan inglés. Muchos desarrolladores vienen de países a los que nunca nos hemos dirigido: China, India, Indonesia, Tailandia, Pakistán, etc. y necesitamos ayudarlos * Muchos desarrolladores occidentales están viendo la cosecha de experiencias 'Lite' como 'mercados emergentes solamente' y que no son de alta fidelidad

### Actualizaciones Editar 1 (23-ene-2018): Agregar una nota en la parte superior de la página.

Edit 2 (28-ene-2018): Limpiar algunos bits.
