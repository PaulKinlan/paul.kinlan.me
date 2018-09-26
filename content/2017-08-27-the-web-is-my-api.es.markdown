---
slug: the-web-is-my-api
date: 2017-08-27T13:20:31+01:00
title: "The Web is my API"
image_header: /images/bridges.png
tags: ["intents"]
---


[Michael Mahemoff](http://softwareas.com) me enseñó mucho sobre las posibilidades de la web. Antes de trabajar con Mike, construí en la web y comprendí los beneficios, como la capacidad de enlace y el descubrimiento, pero nunca tuve una idea completa de lo que sería posible.

Una cosa que Mike dijo fue "[la Web es mi API](http://softwareas.com/cors-scraping-and-microformats/)", donde habló sobre la posibilidad de exponer su sitio y sus datos en una página a través de microformatos y otros datos estructurados y poder acceder a él directamente desde otro contexto de navegador más, utilizando una simple XMLHttpRequest y la API CORS:

>Anyway, what’s cool about this is you can treat the web as an API. The Web is
>my API. "Scraping a web page" may sound dirtier than "consuming a web service",
>but it’s the cleaner approach in principle. A website sitting in your browser
>is a perfectly human-readable depiction of a resource your program can get hold
>of, so it’s an API that’s self-documenting. The best kind of API. But a whole
>HTML document is a lot to chew on, so we need to make sure it’s structured
>nicely, and that’s where microformats come in, gloriously defining lightweight
>standards for declaring info in your web page. There’s another HTML5 tie-in
>here, because we now have a similar concept in the standard, microdata.


Fue más o menos al mismo tiempo que comencé a trabajar en [Web Intents](https://en.wikipedia.org/wiki/Web_Intents), cuyo espíritu era el mismo & mdash; otorgar a los usuarios acceso a datos y servicios de otro origen & mdash; pero fue mucho más complejo. Quería habilitar el descubrimiento de servicios y luego interactuar con esas páginas. Y Mike quería mover la web para proporcionar acceso a datos y servicios. Me quedó pegado. [Incluso si olvidé la atribución original](https://twitter.com/Paul_Kinlan/status/913000817170534400).

Hace poco hice una presentación para Nordic JS donde resalté que no construimos realmente servicios interconectados truley en la web, y cuando lo hacemos sigue un modelo de interacciones principalmente de servidor a servidor. Ese es un sitio web que se integrará con un servicio de terceros enrutando todas las solicitudes API a través de su servidor al servicio remoto y administrando todas las complejidades que esto conlleva.

{{<figure src = "/ images / server-server.png" title = "Servidor a servidor, como construir un túnel entre servicios">}}

Funciona, tenemos toda la web construida con esto, pero puede ser increíblemente complejo cuando considera la autenticación, la autorización, los protocolos de transporte y los diferentes métodos RPC (REST, GraphQL, etc.). Mike estaba proponiendo algo mucho más elegante, con sitios habilitados para CORS y un poco de JavaScript, podemos hablar directamente con el servicio remoto utilizando el sitio.

{{<figure src = "/ images / server-rpc.png" title = "Mi terrible dibujo que describí Client to Server">}}

Hubo un par de problemas que surgieron en el medio. El problema principal es que, aunque CORS es ampliamente compatible con los navegadores, los desarrolladores rara vez lo usan. CORS es una protección que necesitamos en la web pero es difícil de configurar y depurar, y la "Web como API" realmente no se ha presionado demasiado.

{{<figure src = "/ images / server-rpc-nope.png" title = "CORS se interpone en el camino">}}

Nos estamos moviendo a un mundo donde los sitios se están generando en el cliente con JS y las sesiones y el estado para el usuario se administran completamente en el cliente.

Todavía necesitamos la capacidad de comunicarnos desde nuestros sitios a un servicio remoto, y sigo creyendo firmemente que necesitamos descentralizar nuestras integraciones con otros sitios y aplicaciones, pero lo primero que debemos hacer es conectar nuestros sitios y aplicaciones en conjunto. de distancia que es más que solo un enlace. Necesitamos nuestros sitios para exponer sus capacidades y funcionalidades directamente a otras ventanas en el sistema de los usuarios.

Cada sitio web debe poder exponer una API que el propietario del sitio controla, directamente a otros clientes.

{{<figure src = "/ images / client-rpc.png" title = "Cliente a cliente">}}

La buena noticia es que ya podemos hacerlo, hemos tenido los primitivos en la plataforma durante al menos 7 años (`postMessage` y` MessageChannel`), y desde siempre `window.open`, pero no los usamos estas herramientas para interactuar con los sitios por razones similares por las que no usamos CORS: es difícil y es casi imposible definir una API sana que sea simple y consistente de usar y que no requiera recurrir a enormes bibliotecas de terceros para cada servicio con el que quieres interactuar

La plataforma solo te permite comunicarte entre sitios mediante el envío de mensajes, lo que significa que, como propietario del servicio, si quisieras crear una API, debes construir una máquina de estado que serialice los mensajes en algún estado, reaccione y luego envíe un mensaje. mensaje de vuelta al cliente y luego tiene que crear una biblioteca que haga eso para el desarrollador que consume su servicio. Es increíblemente complejo y complejo, y creo que es una de las razones principales por las que no hemos visto una mayor adopción de Web Workers y API del lado del cliente.

{{<figure src = "/ images / window-dx.png" title = "Ventana de la experiencia de desarrollador de postMessage">}}

Tenemos una biblioteca que ayuda: [Comlink](https://github.com/GoogleChromeLabs/comlink).

Comlink es una pequeña API que abstrae las API `MessageChannel` y` postMessage` en una API que parece que está creando instancias de clases y funciones remotas en el contexto local. Por ejemplo:


**Sitio web**


```javascript
// Set up.
const worker = w.open('somesite');
const api = Comlink.proxy(w);

// Use the API.
const work = await new api.Test();
const str = await work.say('Yo!');
console.log(str);
```



** Trabajador web **


```javascript
class Test {
  say() {
    return `Hi ${this.x++}, ${msg}`;
  }
}

// Expose the API to anyone who connects.
Comlink.expose({Test}, window);
```


{{<figure src = "/ images / comlink.png" title = "Comlink">}}

Exponemos una API en el servicio, consumimos la API en el cliente a través de un proxy.

### ¿Hay un mejor ejemplo?

Construí un [sitio que se suscribe a un punto final pubsubhubbub y cuando recibe un ping envía un mensaje JSON](https://rss-to-web-push.glitch.me/) a un punto final definido por el usuario. No quería administrar la infraestructura de notificación de inserción para esta pequeña aplicación, otro sitio que construí ([webpush.rocks](https://webpush.rocks/)) puede hacer todo eso, solo quiero usar integrar con ese servicio.

Pero, ¿cómo puedo obtener la URL de suscripción (la información que necesito para poder enviar notificaciones) retenida en el cliente de webpush.rocks en mi sitio?

Cuando inicialmente construí este sitio, todo lo que podía hacer era dejar que el usuario abriera el sitio y luego copiar y pegar el URL entre las páginas. ¿Por qué no solo exponer una API que cualquier sitio podría usar? Eso fue lo que hice.

webpush.rocks define una API llamada `PushManager` que tiene un único método` `subscriptionId`. Cuando la página se carga, expone esta API a la ventana de la siguiente manera:


```javascript
class PushManager {
  constructor() {
  }

  async subscriptionId() {
    //global var ick...
    let reg = await navigator.serviceWorker.getRegistration();
    let sub = await reg.pushManager.getSubscription();
    if(sub) {
        return `${location.origin}/send?id=${sub.endpoint}`;
    }
    else {
        return ``;
    }
  }
}

Comlink.expose({PushManager}, window);
```


La API interactúa con la API `PushSubscriptionManager` en el DOM y devuelve una URL personalizada al sitio llamante. Lo importante aquí es que, debido a que se ejecuta de forma asíncrona, puedo esperar a que el usuario verifique que desea realizar la acción (o no).

De vuelta en el sitio del cliente llamante (la aplicación que quiere obtener el subscriptionId). Cuando un usuario hace clic en el enlace, obtenemos una referencia a la ventana que acabamos de abrir y conectamos nuestro proxy `Comlink`. La API de servicio ahora está expuesta a nuestro cliente y podemos instanciar la API `PushManager` como si fuera un servicio local, pero todo está interactuando con el servicio de instancia remota en la otra ventana.


```javascript
let endpointWindow = window.open('', 'endpointUrlWindow');

let pushAPI = Comlink.proxy(endpointWindow);
let pm = await new pushAPI.PushManager();
let id = await pm.subscriptionId();

// Update the UI.
endpointUrlEl.value = id;
```


Aquí hay un video muy rápido de lo que está sucediendo. Una interacción muy simple y ligera, abre el servicio y luego obtiene la identificación que necesita.

{{<youtube vTYZXx31EHc>}}

Como proveedor de servicios, he expuesto un conjunto restringido de funcionalidades que solo está disponible en el cliente para otro sitio y puedo asegurarlo y solicitar el consentimiento del usuario al mismo tiempo antes de devolver los datos al usuario, todo con un simple para usar API.

_La Web es la API._

Muy correctamente, no permitimos que los sitios inspeccionen o manipulen el DOM o el estado de otro origen, pero postulo que si usted tiene control sobre los servicios y la funcionalidad de su sitio y cómo los usuarios interactúan con él, puede exponer la información más importante. y servicios a cualquier cliente que quiera usar su servicio de forma segura (usted tiene el control) y le permite:


* Concéntrate en lo que eres bueno.
* Rápida transferencia de datos entre sitios y aplicaciones porque todo está en el cliente.
* IPC incluso sin conexión.
* Ejecutar código en el contexto de origen

### ¿Qué API deberían exponer los sitios?

Esto es algo que me gustaría explorar más. Expuse algunas funcionalidades básicas a un servicio de Notificaciones Push porque esa es la intención del sitio, pero la pieza importante para mí fue que tenía el control de las partes del DOM que quería devolver a otros desarrolladores.

Me gustaría llegar a un lugar donde cada sitio pueda exponer una API consistente a los usuarios y una forma de descubrir otras funcionalidades y servicios.

Cada propietario de un sitio podría exponer solo la funcionalidad principal a su servicio para que podamos realizar operaciones basadas en CRUD. Podríamos tener interacciones complejas.

Podríamos llegar a una web donde tenemos servicios como Unix que hacen bien una cosa y un usuario los reúne todos juntos en el cliente.

Cada sitio podría exponer un `VDOM` de un subconjunto de la página que está definido por el propietario del servicio para que tengamos una forma consistente de extraer datos de movimiento basados ​​en el DOM entre sitios de forma segura.

Me imagino que podríamos desear un acceso rápido a todos los objetos basados ​​en schema.org u otros datos estructurados en la página (podrían generarse dinámicamente) como lo hizo Mike en su publicación original.

[Comlink](https://github.com/GoogleChromeLabs/comlink) nos brinda una manera de exponer y consumir servicios rápida y fácilmente sobre las primitivas plataformas que han existido durante años. Finalmente tenemos muchas piezas en su lugar que nos permiten hacer de la Web la API.

_La web es mi API. Hazlo tuyo también._
