---
slug: debugging-web-pages-on-the-nokia-8110-with-kaios
date: 2019-03-21T21:41:53.555Z
title: 'Debugging Web Pages on the Nokia 8110 with KaiOS'
link: ''
tags: [links, kaios, debugging, firefox]
---
Nous avons récemment fait beaucoup de développement sur les téléphones polyvalents et cela a été difficile, mais amusant. Le problème le plus difficile est que, sur KaiOS, nous avons trouvé qu’il était impossible de déboguer des pages Web, en particulier sur le matériel dont nous disposions (le Nokia 8110). Le Nokia est un excellent appareil. Il est construit avec KaiOS. Il est basé sur quelque chose qui ressemble à Firefox 48, mais il est verrouillé, il n’existe pas de mode développeur traditionnel comme sur les autres appareils Android, ce qui signifie que vous ne pouvez pas connecter le navigateur de Firefox. WebIDE facilement.

En combinant quelques blogs et en connaissant un peu `adb` j&#39;ai `adb` comment le faire. Notez que d&#39;autres ont pu le faire, mais ce n&#39;est pas documenté au même endroit.

<figure>
  <img src="/images/2019-03-21-debugging-web-pages-on-the-nokia-8110-with-kaios.jpeg">
</figure>

(L&#39;image ci-dessus montre les outils de développement et également la sortie de l&#39;outil de capture d&#39;écran)

Voici les étapes:

1. Connectez un câble USB. Assurez-vous que `adb` installé sur votre ordinateur principal.
2. Téléchargez une copie de [Firefox 48](https://archive.mozilla.org/pub/firefox/releases/48.0.2/) (c’est le seul que j’ai pu me mettre au travail)
3. Activez le &quot;Mode développeur&quot; en entrant `*#*#33284#*#*` partir de votre téléphone (remarque: n&#39;utilisez pas le numéroteur). Vous verrez une petite icône &quot;bug&quot; en haut de l&#39;écran. [[Source](https://groups.google.com/forum/#!topic/bananahackers/MIpcrSXTRBk) ]
4. Connectez votre câble USB
5. Sur votre machine de développement, exécutez les commandes suivantes
1. `adb start-server`
2. `adb devices` pour vérifier que votre téléphone est connecté.
3. `adb forward tcp:6000 localfilesystem:/data/local/debugger-socket` configurer un canal de votre machine à une prise du téléphone. C&#39;est ce que l&#39;EDI Web utilise.
6. Lancez `Web IDE` en ouvrant Firefox, accédez à Outils, puis à Web IDE.
7. Web IDE sera ouvert, cliquez sur &#39;Remote Runtime&#39;, puis sur le bouton d&#39;ouverture contenant &#39;localhost: 6000&#39; in. (Il s&#39;agit du port de transfert tcp).
8. Ouvrez une page du téléphone et vous devriez la voir à gauche. Voila.
