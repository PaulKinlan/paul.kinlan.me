---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

Actualización de ### : 8 de octubre: problemas importantes con este documento.

Me puse al día con [Jake Archibald](https://jakearchibald.com/) sobre esta publicación porque pensé que tenía algo nuevo, durante la conversación descubrimos muchas cosas que invalidan algunas de estas publicaciones, y también aprendí mucho en el proceso que no creo que la mayoría de los desarrolladores saber.

* Las llamadas a `.append()` y `.appendChild()` adoptan el nodo. Esto hace que el uso de `adoptNode` en esta instancia sea inútil porque el Algoritmo `adoptNode` garantiza que se adopte el nodo. Esto no se mencionó en los documentos de MDN, pero está en el [spec](https://dom.spec.whatwg.org/#concept-node-append) . Necesito regresar y entrenar por qué tuve un problema antes, pero sospecho que fue porque originalmente estaba tratando de agregar un `DocumentFragment` . Esto significa que tanto `w.document.body.appendChild(document.adoptNode(airhornerIframe));` como `w.document.body.appendChild(airhornerIframe);` tendrán el mismo efecto.
* Mientras que los elementos DOM mantendrán su estado (verifique el elemento personalizado), si un iframe se mueve en el DOM, se vuelve a cargar. Período. Esto significa que moverlo entre iframes no mantendrá el estado como lo había probado originalmente, creo que esto se debió al hecho de que el SW cargó la página increíblemente rápido. La API de los portales podría no verse afectada por esto, por lo que en el futuro esta experiencia debería funcionar :)

El concepto de mover elementos entre documentos sigue siendo válido e interesante, pero el beneficio para los iframes no está ahí. Me di cuenta de que los elementos de video se restablecieron cuando se movieron entre ventanas y debería haber sido más diligente al verificar que el iframe en realidad no restableció su estado.

Como siempre, puedes ver las [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### original Cuando me uní a Google en 2010, me topé con un documento que mencionaba un concepto en gmail llamado &#39; [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) &#39;, tenía un nombre genial y el concepto era novedoso.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

El concepto es que muchas aplicaciones tienen que cargar muchos JavaScript complejos incluso para un &#39;componente pequeño&#39; como la ventana de redacción en gmail, podría tener los componentes de la aplicación cargados en un `iframe` que el usuario puede interactuar en la ventana principal, que luego podría &#39;arrancar&#39; y pasar a una nueva ventana cuando los clics usen el botón &#39;componer en una nueva ventana&#39;. No tenía la confianza suficiente para hablar con el autor (y todavía no lo he hecho, ni he buscado en la fuente de Gmail para ver si alguna vez se usó realmente), pero se quedó en mi mente principalmente porque el nombre era enigmático .

Avancé 10 años y estuve en un largo viaje en tren y comencé a investigar un área que no sé mucho sobre la API de `adoptNode` . [lot of ideas](https://nifty-meadowlark.glitch.me/) con un [lot of ideas](https://nifty-meadowlark.glitch.me/) y me di cuenta de que es posible mover elementos DOM, su estado actual y sus controladores de eventos adjuntos a nuevas ventanas. Esto me recordó a los &#39;iframes mágicos&#39; y finalmente me llevó a la idea de que puede crear un iframe emergente (un iframe emergente es un video Picture in Picture pero para elementos iframe)

El código para el iframe emergente es bastante simple:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` permite mover elementos DOM con su estado actual mientras mantiene sus controladores de eventos enlazados existentes, entre documentos en el navegador, que podría ser un nuevo DOM dentro de la ventana actual, o como en el caso de esta demostración, podría estar moviendo un cargado `iframe` en otra ventana que está en el mismo origen. (Ver actualización más arriba).

Mover un iframe es interesante porque significa que no tiene que reiniciar el contenido del iframe, solo se mueve la instancia. Hay un par de inconvenientes:

1. La URL permanece en el origen actual y no en el origen del iframe, aunque esto podría ser algo que la API de `<portal>` podría resolver.
2. Si está moviendo un elemento personalizado, o algo que tiene su lógica alojada en el abridor, si cierra el abridor, la ejecución se detendrá.

Dejando a un lado las desventajas, pensé que este mecanismo de IPC de nivel DOM era muy, muy interesante. [demo page](https://nifty-meadowlark.glitch.me/) con las [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) y avíseme si tiene alguna idea interesante sobre dónde podría usarse.

