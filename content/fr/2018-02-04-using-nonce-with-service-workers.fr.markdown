---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31+01:00
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


Dans un [projet récent](https://webgdedeck.com/), je souhaitais partager autant de logique que possible entre le serveur, l'agent de maintenance et le client. Le projet est essentiellement un simple lecteur de flux RSS, il prend des flux RSS, analyse les données et les fusionne dans un bel ensemble de colonnes (un peu comme TweetDeck), ainsi qu’une seule liste fusionnée.

Étant donné que je prends des flux RSS et que je les affiche sur ma page, je dois être aussi sûr que possible que cela ne soit pas néfaste. Je peux désinfecter les entrées autant que je le souhaite, mais je connais mes propres capacités, et je suis certain que certaines personnes pourraient manipuler un flux RSS de telle sorte que je finisse par exécuter des scripts, importer des images ou tout autre tiers contexte de mon site.

La plate-forme Web permet de verrouiller un site via Content-Security-Policy (CSP). CSP peut verrouiller les sources externes à partir desquelles nous pouvons demander des contextes tels que script, styles, images, etc. Vous pouvez même verrouiller la possibilité pour une page d'exécuter des scripts en ligne, ce qui peut empêcher tous les types d'attaques XSS.

C'était assez simple de l'ajouter à l'application.


```
`default-src 'self';`
```


Cependant ... j'ai eu un certain nombre de problèmes.

1. Je génère des styles en ligne sur la page et j'ai donc dû exécuter des scripts en ligne. 2. J'avais besoin d'inclure Google Analytics, qui nécessite l'exécution d'un script en ligne sur la page.

CSP vous permet d'exécuter des scripts et des styles en ligne en vous permettant d'activer une option appelée `unsafe-eval` de scripts, mais cette option permet d'éviter les protections offertes par CSP.

Pour exécuter des scripts en ligne et conserver les protections de CSP, CSP propose quelques outils. Celui que j'ai utilisé s'appelle un "nonce". Le nonce est un identifiant aléatoire que vous définissez sur l'en-tête HTTP CSP et que vous compilez avec un script inline associé.

** Chaîne CSP sur l'en-tête HTTP **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Script en ligne utilisant nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


Le code ci-dessus fonctionne bien et facilite le bon fonctionnement des analyses lorsque nous sécurisons le site avec CSP.

Pour chaque requête Web, vous devez avoir une valeur unique "nonce" et je le fais via le {nonce.analytics} qui est une valeur que je génère sur le serveur et que je applique via un modèle. Si vous réutilisez une valeur nonce, le navigateur refuse d'exécuter le contenu dans le script.

J'ai eu un peu de mal à générer des valeurs de nonce. J'avais besoin de quelque chose qui créerait une valeur unique qui ne serait pas réutilisée par le même utilisateur. Je pensais qu'une valeur nonce du format '[source] - [date.now + request-count]' suffirait.

La source me permet d'ajouter un espace de noms au nonce, et date.now () + un nombre de requêtes toujours croissant me donne un ensemble de valeurs non répétable relativement stable.

Je génère le nonce en utilisant la fonction suivante:


```javascript
function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


Cela semble bon. Cependant, je cache toutes mes pages dans un service worker, ce qui signifie que si je viens tout simplement de servir le contenu du cache, les valeurs de nonce seront réutilisées et donc non exécutées.

Heureusement, je partage la logique entre mon serveur et mon agent de maintenance, ce qui me permet de générer tout ce dont j'ai besoin dans un endroit central de mon code. J'utilise le paramètre 'source' dans ma fonction `generateIncrementalNonce` pour ajouter 'serveur' ou 'service-worker' à la valeur nonce et je l'ai fait dans chacun des gestionnaires de requêtes du serveur et de l'agent de service. L'utilisation de ce paramètre source signifie que je peux garantir qu'une valeur de nonce générée via le serveur ne sera jamais en conflit avec une page chargée via le service worker.

Ce modèle m'a bien servi. Cela m'a permis d'autoriser les scripts en ligne requis pour Google Analytics tout en empêchant tout tiers d'injecter ou d'exécuter du code non fiable dans ma page.

Voici le code que j'ai utilisé dans le projet. Il y a un certain nombre d'endroits différents dans mes pages pour lesquels j'ai besoin de valeurs de nonce, je les génère pour chaque requête et je l'applique ensuite à ma fonction de template et à l'en-tête HTTP en même temps.

#### common.js - logique partagée


```javascript
function generateCSPPolicy(nonce) {
  return `default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}' 'nonce-style-${nonce.inlinedcss}';`;
};

function generateIncrementalNonce(source) {
  let val = 0;
  let max = Math.pow(10, 3); // Date + pow 3 gets us close to max number;

  const generate = () => {
    let now = max * +new Date();
    if(val >= max) val = 0;
    else val++;
    return (source !== undefined ? source : '') + (now + val).toString();
  }

  return generate;
};
```


#### service-worker.js - Récupère le gestionnaire


```javascript
const generator = generateIncrementalNonce('service-worker');
let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

// Call the route handler with all data needed
let response = all(nonce, {
  dataPath: paths.dataPath,
  assetPath: paths.assetPath
}).then(r => setHeader(r, 'Content-Security-Policy', generateCSPPolicy(nonce)));;
e.respondWith(response);
```


#### server.js - gestionnaire de requêtes


```javascript
const generator = generateIncrementalNonce('server');

let nonce = {
  analytics: generator(),
  inlinedcss: generator(),
  style: generator()
};

res.setHeader('Content-Security-Policy', generateCSPPolicy(nonce));

// Call the route handler with all data needed
all(nonce, {
      dataPath: `${paths.dataPath}${hostname}.`,
      assetPath: paths.assetPath 
    })
    .then(response => {
      node.responseToExpressStream(res, response.body)
    });
```