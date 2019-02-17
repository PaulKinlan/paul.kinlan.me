---
slug: we-need-DOM-APIs-in-workers
date: 2018-01-28T13:20:31+01:00
title: "We need DOM APIs in Workers"
description: "If we are to build HTML in Workers then we need some 'DOM' in them."
tags: ['DOM', 'javascript']
---


Necesito DOM APIs en Workers por diferentes razones que la mayoría de las personas. A muchas personas les gustaría que el DOM en Workers haga que la actualización del DOM no bloquee el hilo principal. Lo necesito así que puedo analizar sintácticamente y manipular datos XML _y_ para producir HTML, y sospecho que muchas otras personas lo hacen.

En un [proyecto reciente](https://webgdedeck.com/), quería compartir la mayor cantidad de lógica posible entre el servidor, el trabajador del servicio y el cliente. El proyecto es esencialmente un simple lector de fuentes RSS, toma canales RSS, analiza los datos y los fusiona en un buen conjunto de columnas (al igual que TweetDeck), y también una única lista combinada.

El proyecto funciona con los datos de la fuente RSS en tres lugares:

1. En el cliente y mdash; Cuando la página se carga por primera vez, AJAX solicita los datos de la fuente RSS desde un servicio de proxy que yo ejecuto, y luego almacena en caché los datos brutos en el objeto `window.caches` para su uso posterior antes de presentarlos en el cliente. 2. En el trabajador de servicio & mdash; 1. Cuando se carga la página principal y el trabajador del servicio se instala, el trabajador del servicio carga el shell y se fusiona en los datos de la alimentación RSS para que no se realicen solicitudes AJAX en la 2ª carga, manteniendo el tiempo en el tiempo interactivo alto. 1. Cuando se realiza una solicitud al proxy desde el cliente, el trabajador del servicio, cuando está instalado, interceptará la solicitud y publicará los datos de `window.caches`. Esto permite que el sitio trabaje fuera de línea. 3. En el servidor & mdash; Cuando se solicita la página, podemos tomar algunos de los datos almacenados en caché en el servidor y fusionarlos directamente en la respuesta que enviamos al cliente. Al representar parte del contenido directamente del servidor, podemos tener una ventana gráfica estable en la primera carga, que normalmente es importante para conexiones más lentas en dispositivos móviles (y SpeedIndex).

En cada instancia hay un proceso simple que toma los datos RSS y los mapas en un objeto JSON que luego puedo aplicar a una plantilla para generar HTML. Mantener una plantilla y una lógica unificada en el cliente, servidor y trabajador de servicios fue un requisito fundamental. Mantener un conjunto de plantillas significa que los datos de entrada deben ser coherentes en todos los lugares que representarán los datos.

Debido a que ejecuto un servidor proxy, existe una solución simple: simplemente transforme todas las fuentes RSS en un formulario JSON consistente en el servidor. Lo descarté porque:

* las transformaciones de datos pueden ser intensivas de procesar. * las transformaciones de datos se pueden hacer en el cliente para reducir la carga compartida en el servicio * lo que es más importante, si una fuente RSS está en https y es compatible con CORS, no es necesario pasar por el servicio de proxy. Este es el estado en el que quiero estar en el futuro porque permite que el lector de fuentes muestre contenido que podría requerir la autenticación del usuario.

El procesamiento de los datos en el cliente es posible (y lo deseo en mi caso) porque los navegadores tienen una pequeña API utilizada llamada `DOMParser`. DOMParser es como su nombre lo sugiere: un analizador de XML sin procesar y HTML que construye un DOM. Una vez que tienes un DOM, puedes hacer cualquier cosa con él que harías con los DOM normales (appendChild, getAttribute, etc.).


```javascript
let parser = new DOMParser();
let dom = parser.parseFromString('<a><b>hello</b></a>', 'application/xml');
let bString = dom.querySelector('b').textContent;
```


Bastante simple y uso esto para convertir los datos RSS en una estructura JSON simple para que pueda pasarlo a una función de creación de plantillas ([Está aquí si está interesado en ver el código](https://github.com/ PaulKinlan / webgde-deck / blob / master / src / public / scripts / data / common.js # L98).)

Esto funciona perfectamente en el cliente, pero no existe un DOM en los trabajadores de la web, los trabajadores del servicio, ni ningún DOM nativo del servidor.

Afortunadamente, hay una biblioteca npm que funciona en todas partes. [`xml-dom`](https://www.npmjs.com/package/xmldom) es una implementación que cumple con el Nivel 2 del W3C DOM con algunas características de Nivel 3, y funciona de manera muy similar a lo esperado. No es el fin del mundo, pero parece una tontería tener que importar 64kb de JS, por algo que el navegador ya ha incorporado.

Solo veo el caso de uso de 'VDOM' para DOM API en trabajadores, y aunque creo que es un caso de uso importante, creo que se interpone en el camino de otro caso de usos importante: manipulación de datos fuera del hilo principal. El hecho de que no podemos usar trabajadores para procesar documentos HTML y XML (algo que casi todas las aplicaciones tienen que hacer) sin tener que importar una gran cantidad de polyfill que no se ejecutará a la misma velocidad que una implementación nativa y que confiar en los contribuidores de OSS para mantener parece algo que debería arreglarse.

Gracias a las personas que mantienen `xml-dom`. Los héroes funcionan.