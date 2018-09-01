---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31+01:00
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---


En un [proyecto reciente](https://webgdedeck.com/), quería una forma simple de vincular algunos datos JSON a un elemento DOM sin importar ninguna biblioteca y creo que se me ocurrió una solución bastante ordenada (en mi opinión ) que se ajustan a todas mis necesidades para el proyecto.

La solución codifica instrucciones de plantillas dentro de los atributos de datos DOM denominados `data-bind- *`, que son accesibles en el elemento DOM en la propiedad del conjunto de datos y simplemente sucede que camel-case los atributos automáticamente (es decir, para establecer `innerText` tendría un atributo `data-bind_inner-text` - tenga en cuenta el guión).

Aquí hay una plantilla de muestra del proyecto:


```html
<template id="itemTemplate">
  <div class="item new" data-bind_id="guid" id="">
    <h3><span data-bind_inner-text="title"></span></h3>
    <p class="description" data-bind_inner-text="content:encoded|description"></p>
    <div>
      <a data-bind_href="link" data-bind_inner-text="pubDate" data-bind_title="title" href="" title=""></a>
      <svg class="share" url="" title="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path fill="none" d="M0 0h24v24H0z"></path><path d="M18 16c-.8 0-1.4.4-2 .8l-7-4v-1.5l7-4c.5.4 1.2.7 2 .7 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3v.7l-7 4C7.5 9.4 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.2 4.2v.6c0 1.6 1.2 3 2.8 3 1.6 0 3-1.4 3-3s-1.4-3-3-3z"></path>
      </svg>
    </div>
  </div>
</template>
```


Como puede ver, usamos ` <template> `elemento para garantizar que podamos mantener nuestro HTML en el DOM y mantenerlo inerte (esto realmente mejora la experiencia de autoría). Tenga en cuenta que no tiene que ser un elemento de plantilla, puede tomar cualquier cosa que esté dentro del DOM.

Para asignar el DOM anterior en un elemento real con todos los datos en vivo aplicados, uso el siguiente algoritmo básico:

1. Clona el elemento para vincular los datos a. 2. Itere a través de los elementos y para cada elemento: 1. Verifique si tiene un atributo de la forma `data-bind_` 2. Obtenga las claves para buscar en los` datos` separados por un "|" 3. Asigne el valor de la primera clave encontrada de la entrada `datos` directamente al atributo del nodo definido por` data-bind_` 3. Devuelva el nuevo nodo.

El código para esto es bastante simple, por más breve que sea.


```javascript
const applyTemplate = (templateElement, data) => {
  const element = templateElement.content.cloneNode(true);    
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, () => NodeFilter.FILTER_ACCEPT);

  while(treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    for(let bindAttr in node.dataset) {
      let isBindableAttr = (bindAttr.indexOf('bind_') == 0) ? true : false;
      if(isBindableAttr) {
        let dataKeyString = node.dataset[bindAttr];
        let dataKeys = dataKeyString.split("|");
        let bindKey = bindAttr.substr(5);
        for(let dataKey of dataKeys) {
          if(dataKey in data && data[dataKey] !== "") {
            node[bindKey] = data[dataKey];
            break;
          }
        }
      }
    }
  }

  return element;
}
```


No espero que nadie use esto, pero quería mostrar cómo se puede construir una herramienta de enlace de datos para tareas simples sin tener que recurrir a una biblioteca o marco completo.