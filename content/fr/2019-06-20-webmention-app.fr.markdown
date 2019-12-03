---
slug: webmention-app
date: 2019-06-20T12:33:04.370Z
title: 'Webmention.app'
link: 'https://remysharp.com/2019/06/18/send-outgoing-webmentions'
tags: [links, webmention, zeit, hugo]
---
J&#39;aime l&#39;idée de [Webmentions](https://www.w3.org/TR/webmention/) , mais je n&#39;ai pas encore eu le temps de la mettre en œuvre sur mon site. Sur un site Web de haut niveau, les mentions vous permettent de commenter, de répondre à d’autres contenus sur le Web et de les rendre visibles sans les centraliser avec des outils tels que Disqus (que je souhaite supprimer de mon site).

Les mentions Web sont divisées en deux composants, l&#39;expéditeur et le destinataire. Le destinataire est le site sur lequel j&#39;écris un article et il se peut qu&#39;il y ait quelque chose sur leur site qui montre des liens entrants ou des réactions à leur blog; et l&#39;expéditeur est bien moi. Je dois laisser le site distant que j&#39;ai écrit ou réagi au contenu qu&#39;ils ont créé.

[Remy Sharp](https://remysharp.com) plutôt génial, [Remy Sharp](https://remysharp.com) créé [webmention.app](https://webmention.app/) pour résoudre une partie du problème: l&#39;envoi de pings. L&#39;outil de Remy facilite l&#39;envoi de &quot;pings&quot; aux destinataires potentiels que j&#39;ai liés, en appelant simplement un script CLI.

J&#39;organise mon blog en utilisant Zeit en utilisant Hugo et l&#39;outil static-builder, donc [relatively trivial for me to add in support for webmention app](https://github.com/PaulKinlan/paul.kinlan.me/commit/541cf5db0b48b1eb75bedfa326406f887e57e1a9) . Je viens de `npm i webmention` , puis j&#39;appelle la version CLI de l&#39;outil à partir de mon fichier `build.sh` . C&#39;est aussi simple que cela.

Maintenant, lorsque je crée un article, il devrait envoyer un ping rapide à toutes les nouvelles URL pour lesquelles j&#39;ai créé du contenu sur leur site.

