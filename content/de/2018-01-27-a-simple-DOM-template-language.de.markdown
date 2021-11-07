---
slug: a-simple-DOM-template-language
date: 2018-01-27T13:20:31.000Z
title: "A simple clientside templating langauge"
tags: ["templating", 'javascript']
description: "Templating libraries needn't be so hard"
---


In einem [letzten Projekt](https://webgdedeck.com/) wollte ich einen einfachen Weg, um einige JSON-Daten an ein DOM-Element zu binden, ohne irgendwelche Bibliotheken zu importieren, und ich denke, dass ich eine ziemlich saubere Lösung gefunden habe (in meinen Augen ) die alle meine Bedürfnisse für das Projekt erfüllen.

Die Lösung codiert Vorlagenanweisungen innerhalb von DOM-Datenattributen mit dem Namen `data-bind- *`, die auf dem DOM-Element in der Datenmengeneigenschaft zugreifbar sind, und geschieht so, dass die Attribute automatisch camel-case werden (dh "innerText" Sie setzen) hätte ein Attribut `data-bind_inner-text` - notieren Sie den Bindestrich.

Hier ist eine Beispielvorlage aus dem Projekt:


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


Wie Sie sehen können, verwenden wir die ` <template> `Element, um sicherzustellen, dass wir unseren HTML-Code im DOM behalten und ihn inaktiv halten können (dies verbessert die Authoring-Erfahrung). Beachten Sie, dass es sich dabei nicht um ein Vorlagenelement handeln muss, sondern um alles, was sich im DOM befindet.

Um das obige DOM in ein tatsächliches Element mit allen Live-Daten zu übertragen, verwende ich den folgenden grundlegenden Algorithmus:

1. Klonen Sie das Element, an das Daten gebunden werden sollen. 2. Iteriere über die Elemente und für jedes Element: 1. Prüfe, ob es ein Attribut der Form "Datenbindung_" hat. 2. Erhalte die Schlüssel, um nach den "Daten" zu suchen, getrennt durch ein "|" 3. Ordnen Sie den Wert des ersten gefundenen Schlüssels aus der Eingabe "data" direkt dem durch "data-bind_" definierten Attribut des Knotens zu. 3. Geben Sie den neuen Knoten zurück.

Der Code dafür ist ziemlich einfach, wenn auch ein bisschen knapp.


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


Ich erwarte nicht, dass irgendjemand dies nutzt, aber ich wollte zeigen, wie Sie ein Datenbindungstool für einfache Aufgaben erstellen können, ohne auf eine vollständige Bibliothek oder ein vollständiges Framework zurückgreifen zu müssen.