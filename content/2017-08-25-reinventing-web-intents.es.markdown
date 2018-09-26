---
slug: reinventing-web-intents
date: 2017-08-25T13:20:31+01:00
title: "Reinventing Web Intents"
description: ""
tags: ["intents"]
image_header: /images/bridges.png
---
Nunca superé la [muerte de Web Intents](/what-happened-to-web-intents/). Siempre sentí que todavía hay un problema grave en la web, construimos [silos](/unintended-silos/) que bloquean al usuario en un sitio web y no conectamos nuestras aplicaciones para crear experiencias más enriquecedoras. Tenemos enlaces que nos permiten navegar a otro sitio, pero no conectamos nuestras aplicaciones a la funcionalidad que podemos usar en nuestros sitios. Ya sea que elija una imagen de un servicio en la nube para usarla en su aplicación o edite una imagen en el editor preferido de los usuarios; simplemente no vinculamos nuestros servicios de la forma en que vinculamos nuestras páginas.

[Web Intents](https://en.wikipedia.org/wiki/Web_Intents) fue un intento fallido de solucionarlo. El [Share API](/navigator.share/) resuelve un caso de uso para interconectar sitios y aplicaciones, pero en general el IPC y el descubrimiento del servicio nunca se han resuelto y creo que tengo una solución ... Ok, no tengo una solución, tengo un experimento que estoy increíblemente emocionado.

En el último par de meses, Surma en mi equipo e Ian Kilpatrick estaban trabajando en una cuña para la [Tasklets API](https://github.com/GoogleChromeLabs/tasklets). Tasklets API se diseñó para permitir que exista una API de subprocesos múltiples ligera en la web. Una clase ES6 podría estar expuesta como un 'tasklet' y se podría llamar sin bloquear el hilo principal, ideal para UI. La API Tasklet por sí misma es muy interesante, pero la parte más interesante para mí fue que construyeron un Polyfill utilizando un Web Worker y desarrollaron una forma de exponer la funcionalidad de la clase ES6 que se definió en Worker. Habían abstraído todas las complejidades de la API de postMessage en un paquete ordenado y un modelo sensato para los desarrolladores de JS.

Una de las razones por las que construimos la API de Web Intents fue porque la experiencia del desarrollador de crear una API y un servicio que funcionaba con la API de postMessage era increíblemente compleja, tenía que lidiar con la API de postMessage y luego tenía que administrar un mensaje complejo sistema de procesamiento y máquina de estado asociada.

<figure><img src="/images/worker-dx.png"><figcaption> Trabajador tradicional </figcaption></figure>

Es solo complejo. Es aún peor si quieres tener dos ventanas interactuando entre sí. La ventana que abra tiene que devolver la señal del "abridor" que está listo antes de que pueda comenzar a enviarle mensajes. TL; DR - `window.open` abre` about: blank` antes de que navegue a la URL que usted defina.

<figure><img src="/images/window-dx.png"><figcaption> Ventana postMessage experiencias </figcaption></figure>

Se vuelve aún más complejo cuando quieres pasar mensajes entre varias ventanas o trabajadores en otras ventanas.

<figure><img src="/images/complex-workers.png"><figcaption> Incluso más complejo ... </figcaption></figure>

Creo que esta es una de las principales razones por las cuales las personas exponen las API del lado del cliente. Es muy dificil.

El taskfill polyfill tenía una solución escondida en su interior y pregunté descaradamente a Surma si podía refactorizar la API de Tasklets en una API Proxy simple, un par de horas más tarde aparecía [Comlink](https://github.com/GoogleChromeLabs/comlink/). Comlink es una pequeña API que abstrae las API de MessageChannel y postMessage en una API que parece que crea instancias de clases y funciones remotas en el contexto local. Por ejemplo:


**Sitio web**


```javascript
const worker = new Worker('worker.js');
const api = Comlink.proxy(worker);
const work = await new api.HardWork();
const results = await work.expensive();
```



** Trabajador web **


```javascript
class HardWork {
  expensive() {
    for(let i = 0; i < 1e12; i++)
      sum += /* …omg so much maths… */
    return sum;
  }
}

Comlink.expose({HardWork}, self);
```


Exponemos una API en el servicio, consumimos la API en el cliente a través de un proxy.

Creo que es increíblemente convincente y Comlink en sí mismo tiene la capacidad de revolucionar el uso del trabajador web al mejorar drásticamente la experiencia del desarrollador al proporcionar una API simple para que su equipo pueda usar.

Hacer lo mismo entre ventanas es igual de fácil.

<figure><img src="/images/comlink.png"><figcaption> Comlink </figcaption></figure>

Pero tuve otro pensamiento ... Puedo reinventar una pequeña parte de Web Intents: mejorar el descubrimiento del servicio y facilitar que los desarrolladores interactúen con los servicios.

### Web Intentos?

Una de las cosas buenas de la API de Comlink es que automáticamente intentará usar objetos `Transferibles` para pasar datos entre el cliente y el servicio, y resulta que` MessagePorts` son transferibles. La idea que tuve es que si pudiera crear una API simple diseñada para simplemente devolver un MessagePort basado en algunos criterios (como el verbo) y luego como el cliente, no me importaría de dónde salió ese MessagePort.

Aquí está mi opinión: tendré un sitio que actuará como intermediario y mantendrá una lista de servicios y dónde viven y podrá conectar clientes que soliciten tipos de servicios, algo así.


* Un sitio de servicio podrá decirle al intermediario "Ofrezco servicio X que funciona con datos Y y vive en la página Z"
* Un sitio del cliente podrá decirle al intermediario "Necesito un servicio que haga X en estos datos Y. ¿Qué tiene usted?"

Al trazar esto de vuelta a un diseño aproximado, necesito un Servicio que expone dos métodos: `register` y` pick`.

`register`, bien, registrará el servicio con el intermediario. `pick` por otro lado es un poco más interesante y lo he dividido en un par de pasos.

<figure><img src="/images/webintents-step-1.png"><figcaption> Sitios de conexión </figcaption></figure>

El flujo no es demasiado complejo cuando te sumerges en él. Creé un [envoltorio básico que incluyes en cada servicio y aplicación cliente](https://web-intents.glitch.me/scripts/service.js). El envoltorio maneja la primera interacción con el intermediario y hace algunos arreglos básicos al envolver las complejidades de abrir una ventana al selector de servicio en 'https://web-intents.glitch.me/pick'.

Una vez que el selector está abierto, encontrará todos los servicios que coincidan con los criterios que el usuario necesita, y luego los presentará al usuario como una lista simple. El usuario abre su sitio preferido y detrás de las escenas ese sitio expone su API de vuelta al cliente original a través del intermediario. Finalmente, cuando se complete la conexión y estemos hablando con el servicio elegido, podemos eliminar al intermediario.

<figure><img src="/images/webintents-step-2.png"><figcaption> Eliminando intermediario </figcaption></figure>

El proceso en realidad es un poco más complejo de lo que estoy admitiendo. Bajo el capó estamos pasando muchos MessagePorts entre ventanas, pero los consumidores de la API nunca ven esta complejidad. Lo bueno es que cuando el cliente y el servicio están conectados y hablan directamente a través de un API de servicio bien definido, no saben quién está en ninguno de los extremos. Ordenado.

Debajo hay una inmersión rápida en el código para mostrar qué tan simple es.


** Servicio ** ([demo](https://web-intents-service-1.glitch.me/))

El servicio es relativamente simple, tiene una clase que interactúa con el DOM y registra algunos resultados.

Exponemos la clase `Test` al` ServiceRegistry` y ofrecemos una forma de registrar las capacidades de este servicio.


```javascript
class Test {
  constructor() {}

  outputToPre(msg) {
    let output = document.getElementById('output');
    output.innerText += msg + '\n';
  }
}

let registry = new ServiceRegistry({ Test })
register.onclick = async () => {    
  let resolvedService = await registry.register('test-action','*', location.href);  
};
```



** Cliente ** ([demo](https://web-intents-client.glitch.me/))

El cliente es simple, creamos una instancia del registro y llamamos `pick`.

`pick` se conecta al intermediario y espera a que el usuario seleccione el servicio. Una vez que el usuario selecciona el servicio, el intermediario (`ServiceRegistry`) pasa la API que el servicio remoto ha expuesto al cliente. A continuación, podemos instanciar una instancia de la API remota e invocar métodos sobre ella.


```javascript
let registry = new ServiceRegistry();
let resolvedService = await registry.pick('test-action','image/*');
remote = await new resolvedService.Test();
remote.outputToPre('calling from window.');
```


Estoy bastante satisfecho con esto como un experimento. Aquí hay un video de Service Discovery e invocación del código anterior.

<figure> {{&lt;youtube 1igal-ehMB4&gt;}} <figcaption> demostración de extremo a extremo </figcaption></figure>

Déjame saber lo que piensas. ¿Demasiado?