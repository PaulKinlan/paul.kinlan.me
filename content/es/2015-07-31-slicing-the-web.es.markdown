---
slug: slice-the-web
date: 2015-08-03
title: "SLICE: The Web"
description: "What are the properties that make the web the web?  How can we keep differentiating from native to stay relevant in a mobile world?"
tags: ["headless", "slice", 'headless chrome', 'the headless web']
image_header: "/images/slice.jpg"
---


Se han mantenido muchas conversaciones sobre todos los problemas de la web durante las últimas semanas y, en términos generales, se agrupan en las siguientes categorías:


* Actuación
* [Lumpy](/the-lumpy-web/) navegadores incoherentes
* Paisaje de características que se expande rápidamente.

Quiero dejarlos a un lado por un par de minutos para hablar rápidamente sobre uno de los términos que hemos utilizado en Google para describir rápidamente los aspectos positivos de la web como una plataforma para usuarios y desarrolladores: ** SLICE **.

No puedo encontrar una referencia original para ello, pero los puntos subyacentes que abordaré son bien conocidos. ** SLICE ** fue mencionado en la primera [Cumbre de desarrollo de Chrome](https://developer.chrome.com/devsummit) por Linus Upson en la presentación de 2013. Cuando Linus habló sobre las propiedades de la web, no estaba en el orden correcto para nombrar, pero lo aliento a que vea este video. _Nota_: Brett Cannon, un Microsofter (anteriormente un Googler) también lo mencionó recientemente y es una [buena lectura](http://nothingbutsnark.svbtle.com/going-allin-on-the-mobile-web) y tiene conclusiones muy similares a mi post sobre [Vivir con aplicaciones web](https://paul.kinlan.me/living-with-web-apps/)

{{<youtube 20fGtfnxJuo>}}

<br> Creo que cubre muchos puntos buenos:


* __S__ecure: todos los dominios están en una caja de arena entre sí y los sitios están en una caja de arena lejos de la máquina de los usuarios. El usuario puede ir a cualquier sitio y saber que están seguros.
* __Linkable: puede señalar cualquier página o contenido simplemente compartiendo una URL
* __I__ndexable: como puede vincular a cualquier elemento, si es público puede ser descubierto por cualquier persona o máquina que pueda indexarlo para que sea universalmente reconocible para todos.
* __C__omposable - Iframes y JavaScript nos permiten componer e incorporar rápidamente nuevos sitios, aplicaciones y servicios con sólo ingresar algunos JS y conectar cosas.
* __E__phemeral: no hay nada que instalar, vas a la página e interactúas con ella, sales de la página y cuando lo haces deja de tomar recursos.
**REBANADA**.

Como conjunto de habilidades que encapsula la web, los principios de SLICE son bien conocidos, pero a menudo se olvidan al considerar la competencia de las plataformas nativas.

Como término, me parece que ** SLICE ** es una gran manera de abordar rápidamente los beneficios de la web en la actualidad. Se pierde un par de beneficios importantes de la web, como la capacidad de implementar actualizaciones de forma instantánea y mdash; ** SLUICE ** no es un gran acrónimo y mdash; pero eso está bien, ** SLICE ** como acrónimo funciona bien.

Utilizo el modelo ** SLICE ** como referencia de hacia dónde vamos con el * futuro de la web * y los desafíos que enfrentamos y necesitamos superar para lograrlo.


* __S__ecure - La web debe permanecer en una caja de arena y debe cifrarse de extremo a extremo. También tenemos que determinar cuál es el modelo para garantizar que el usuario tenga el control y saber cómo se otorgan los permisos a las API avanzadas. Por ejemplo, recientemente comenzamos a enviar una [API de Bluetooth](https://developers.google.com/web/updates/2015/07/interact-with-ble-devices-on-the-web?hl=en) ¿cómo le da confianza a los usuarios? que es seguro y seguro de usar.
* __Linkable: comencé esto con Web Intents y, aunque terminó temprano, creo que nos espera una nueva generación de enlaces de contenido, sitios, aplicaciones y experiencias nativas. Algunos de ellos requieren nueva tecnología, algunos de ellos requieren educación.
   * Enlazando con aplicaciones web: voy a sumergirme en esto en otro momento. TL; DR: las páginas de inicio de los productos y las páginas de inicio de sesión no nos ayudan a vincular las aplicaciones web.
   * Enlaces profundos a los medios: los navegadores durante mucho tiempo han podido vincular a cualquier parte de un archivo, pero nadie parece hacerlo.
   * Enlace más profundo al texto: la primera vez que vi esto fue en el blog de Dave Winer, donde se podía vincular a cualquier párrafo; más recientemente, Medium está dando a cada párrafo un vínculo profundo.
   * Vinculación de objetos del mundo real: [La web física](https://google.github.io/physical-web/) para el descubrimiento de "cosas" que nos rodean, y nuevas API para hablar con estas "cosas" reducirá la fricción en nuestra vida cotidiana.
* __I__ndexable: la web sin cabeza, es decir, los analizadores e indexadores son cada vez más avanzados, lo que nos permite comprender más sobre el contenido en la web, ejecutarán JS y comprenderán visualmente cómo se renderiza la página, pero todavía hay muchos problemas:
   * Embedded Schema.org no puede describir semánticamente correctamente (de ahí JSON + LD)
   * Los medios no tienen una gran cantidad de metadatos expuestos en un formato público.
   * Aplicaciones: Web Intent ha intentado ser una forma de describir lo que una aplicación web podría hacer. Ya no tenemos eso y nos falta una forma masiva de describir las capacidades de lo que puede hacer una aplicación web. Tome mi aplicación [airhorn](https://airhorner.com/) como ejemplo, aunque espero que nadie necesite la funcionalidad de bocina en su aplicación, no hay otra manera de buscarla que buscar metadatos y esta es una de las razones por las cuales tenemos páginas de inicio de productos en la web.
   * Los dispositivos conectados a Internet no están siendo indexados y no describen lo que pueden hacer. Es una pieza que falta para mí en la historia de la web física, descubriendo capacidades. Siento que necesitamos un Web Intents para IoT.
* __C__omposable - Sería fácil mencionar solo mencionar componentes web, pero en realidad estamos hablando del ecosistema más amplio de herramientas, bibliotecas y marcos reutilizables:
    * Hay problemas masivos de interoperabilidad en este momento ya que los frameworks intentan apropiarse de toda la pila.
    * Necesitamos resolver la funcionalidad delegada del lado del cliente. Intentos web probaron esto, pero gran parte es posible todavía hoy en la web, pero no lo hacemos. es decir, he creado una aplicación web de código QR snapper, ¿por qué necesita construir una usted mismo para integrarla en su propia aplicación? Simplemente use la mía o cualquier otro servicio preexistente.
* __E__phemeral - Dos palabras: Trabajador de servicio.
  * La instabilidad es la antítesis de Emphemerality. Según su propia definición, cuando instalas algo se convierte en una parte integrada y de larga ejecución del dispositivo. Service Worker puede usar lo mejor de ambos mundos: un término medio que le permite elegir cómo y cuándo el sitio debe integrarse más profundamente en el dispositivo. Combine esto con el manifiesto y el usuario ahora tiene la opción de instalar la "aplicación web" o mantenerla como una interacción necesaria.


** Entonces, ¿qué nos falta? ** Voy a dejar eso para que me diga, sospecho que me estoy perdiendo mucho. Tengo un conjunto de publicaciones de seguimiento en las que hablaré sobre cómo las plataformas nativas están sacando una pieza del modelo ** SLICE ** para ellos mismos, como una forma de afianzar las aplicaciones nativas más en la vida cotidiana de los usuarios y cómo la web puede diferenciar aún más.

Crédito de la imagen: [Justus Hayes](https://commons.wikimedia.org/wiki/File:The_Big_Slice_-_Rome,_Italy.jpg)