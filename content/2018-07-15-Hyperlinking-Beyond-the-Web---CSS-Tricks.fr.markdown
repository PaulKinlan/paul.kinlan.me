---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain sur CSS Tricks écrit sur un domaine qui me tient à cœur, en reliant:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Lire l'article complet](https://css-tricks.com/hyperlinking-beyond-the-web/).

C'était un excellent article qui couvre tous les différents types de liens hypertexte disponibles pour les applications et les sites. J'ai fait beaucoup de recherches sur cet espace depuis Web Intents et l'état des liens avancés sur le Web laisse beaucoup à désirer, imo.

L'une des raisons pour lesquelles j'aime le Web est que derrière un lien, il y a un accès direct à la ressource, je ne connais aucune autre plateforme capable de combiner le lien et la ressource réelle de la même façon, mais cela pourrait être tellement plus. Le lien standard fournit essentiellement une intention VIEW qui contient l'état (l'url) et le contexte (texte entre les ancres), et vous pouvez pirater les protocoles personnalisés, mais nous devons aller beaucoup plus loin.

* Nous avons besoin d'étendre le vocabulaire à «registerProtocolHandler» pour avoir accès à davantage de schémas natifs. * Tout ce qui est enregistré avec le gestionnaire de protocole doit être étendu au système. * Nous devons pouvoir disposer de sites Web capables de gérer l’ouverture d’une gamme de types de contenu et d’avoir des pages disponibles pour être enregistrées en tant que gestionnaire de fichiers système. * Les développeurs doivent avoir accès à des actions d'ordre supérieur, VIEW est génial, nous avons besoin d'un ensemble d'actions clés convenu, telles que PICK, SAVE, EDIT, afin de mieux comprendre les capacités d'un site ou d'une application. eux avec une sémantique d'ordre supérieur. Android a ceci, Siri l'obtient, les deux utilisant "Intents", le Web devrait aussi l'avoir.

C’est l’une des raisons pour lesquelles je suis très enthousiasmé par les abstractions de messagerie telles que [Comlink](https://github.com/GoogleChromeLabs/comlink) qui éliminent le fardeau de la folie postMessage et vous permettent d’exposer la fonction à d’autres éléments. applications, et puis une fois que vous exposez la fonction, vous devez plus facilement permettre la découverte de cette fonction ... et c'est ce que les liens permettent.
