---
slug: using-web-mentions-in-a-static-sitehugo-
date: 2019-10-07T20:11:30.489Z
title: 'Using Web Mentions in a static site (Hugo)'
link: ''
tags: [webmentions, hugo]
---

Mon blog est un site entièrement statique, construit avec Hugo et hébergé avec Zeit. C&#39;est une excellente solution pour moi, un simple blog a un processus de déploiement assez simple et son chargement est extrêmement rapide.

Les sites générés statiquement présentent certains inconvénients, le plus important étant lorsque vous avez besoin d&#39;intégrer quelque chose de dynamique dans votre page (commentaires, par exemple). Ne pas être en mesure d&#39;héberger facilement du contenu dynamique signifie que vous finirez par vous fier à du code JavaScript tiers qui obtiendra alors un accès complet à votre page. Vous ne saurez pas ce qu&#39;il fait. Cela peut être le suivi de vos utilisateurs ou le ralentissement de votre page. charge.

J&#39;ai récemment enlevé mon widget de commentaire actuel (Disqus) du chemin de rendu critique en ne le chargeant que lorsque l&#39;utilisateur fait défiler les commentaires (à l&#39;aide de `IntersectionObserver` ). `IntersectionObserver` que ce soit une solution raisonnable aux problèmes de performances de chargement et de suivi, je souhaitais en fait le supprimer. Disqus tous ensemble.

Entrez la spécification [Webmention](https://webmention.net/draft/) . Webmention est une spécification qui décrit comment un auteur de site peut être contacté lorsqu&#39;un autre site &quot;mentionne&quot; (ou aime) le contenu de votre site. Cela permet en fin de compte de mettre au point une méthode décentralisée pour découvrir le contenu qui renvoie à votre site, en apportant une valeur ajoutée et une visibilité.

La spécification webmention ne décrit aucun format de données qui devrait être utilisé pour communiquer ce que le &quot;site de mention&quot; a dit, il vous reste à analyser à l&#39;aide de microformats standard ou d&#39;autres mécanismes permettant de comprendre le contenu de la page. C’est formidable, mais j’estime que cela conduit à des services centralisés tels que [webmention.io](https://webmention.io/) fournissent l’infrastructure indispensable pour tirer le [webmention.io](https://webmention.io/) parti de la page.

J&#39;ai aimé l&#39;idée d&#39;utiliser Webmention, mais cela nécessite une configuration côté serveur pour obtenir (et éventuellement stocker) des notifications lorsque quelqu&#39;un mentionne votre site. Ce n&#39;est pas toujours possible avec un constructeur statique comme celui que j&#39;ai sur mon site. Le reste de cet article décrira rapidement comment j&#39;ai hébergé des mentions J&#39;aime, des mentions et des reprises sur mon build Hugo hébergé sur Zeit.

### étape - trouver un hub Webmention

J&#39;ai trouvé webmention.io et ça fait l&#39;affaire. Il gère les pingbacks entrants et les mentions, il va également valider que le site appelant est en train de créer un lien vers votre contenu et enfin, il analysera les données en dehors de la page afin que vous compreniez le contexte.

Webmention.io validera que le site vous appartient par le biais d&#39;un processus d&#39;authentification ouvert (il était soigné, il recherche rel = me qui pointe vers un fournisseur d&#39;authentification)

### étape - indiquez aux pages que vous pouvez gérer les mentions

C’est aussi simple que d’ajouter les deux balises `link` suivantes

```html
<link rel="webmention" href="https://webmention.io/paul.kinlan.me/webmention">
<link rel="pingback" href="https://webmention.io/paul.kinlan.me/xmlrpc">
```

### étape - intégrez l’API webmention.io dans votre site

Vous avez deux options ici, vous pouvez ajouter un widget sur votre page qui appellera l&#39;API webmention.io ou intégrer l&#39;API webmention.io dans votre étape de construction. Je voudrais aussi peu de JS hébergé par une tierce partie que possible, alors j&#39;ai choisi ce dernier. J&#39;ai intégré des webmentions dans mon processus de déploiement.

J&#39;utilise Hugo parce que la construction est rapide et, dans cet esprit, je devais trouver un moyen d&#39;intégrer de manière optimale l&#39;API Webmention dans Hugo. La contrainte majeure était de ne pas appeler le point de terminaison de l&#39;API pour chaque page de mon site. J&#39;ai beaucoup de pages et pas encore beaucoup de commentaires.

Heureusement, le site Webmention.io fournit un point de terminaison pratique qui vous permettra de recevoir toutes les mentions de votre domaine. Le malheur est que ce fichier contient une entrée pour chaque action effectuée contre votre site.

Hugo a également la notion de fichiers de données pouvant être insérés directement dans le modèle pour une page donnée. Vous devez donc mapper le fichier de données Webmention sur une nouvelle structure facilitant la lecture dans un modèle Hugo.

Le processus que j&#39;ai choisi est présenté ci-dessous, mais le résumé consiste à transformer le tableau d&#39;une liste d&#39;actions en un dictionnaire d&#39;URL contenant chacune les actions exposées par l&#39;API (telles que, republication et réponse), et la dernière étape consiste à: divisez le dictionnaire des URL en fichiers individuels nommés hachage md5 de l&#39;URL.

```javascript
"use strict";

const fs = require('fs');
const fetch = require('node-fetch');
const md5 = require('md5');

const processMentionsJson = (data) => {
  const urlData = {};
  data.children.forEach(item => {
    const wmProperty = item["wm-property"];
    const url = item[wmProperty];

    if(url in urlData === false) urlData[url] = {};
    const urlDataItem = urlData[url];

    if(wmProperty in urlDataItem === false) urlDataItem[wmProperty] = [];
    urlDataItem[wmProperty].push(item);
  });

  console.log(urlData);

  // For each URL in the blog we now have a JSON stucture that has all the like, mentions and reposts
  if(fs.existsSync('./data') === false) fs.mkdirSync('./data');
  Object.keys(urlData).forEach(key => {
    const item = urlData[key];
    const md5url = md5(key);
    console.log(key, md5url)
    fs.writeFileSync(`./data/${md5url}.json`, JSON.stringify(item));
  });
}

(async () => {
  const mentionsUrl = new URL(process.argv[2]); // Fail hard if it's not a uRL

  const mentionsResponse = await fetch(mentionsUrl);
  const mentiosnJson = await mentionsResponse.json();

  processMentionsJson(mentiosnJson);
})();
```

Une fois les données analysées et enregistrées correctement, il s&#39;agit d&#39;un processus rapide de configuration du modèle afin qu&#39;il puisse être lu dans l&#39;attribut Données du modèle.

```html
{{ $urlized := .Page.Permalink | md5 }}
{{ if index .Site.Data $urlized }}
  {{ $likes := index (index .Site.Data $urlized) "like-of" }}
  {{ $replys := index (index .Site.Data $urlized) "in-reply-to" }}
  {{ $reposts := index (index .Site.Data $urlized) "repost-of"}}
  <h4>Likes</h4>
  {{ range $i, $like := $likes }}
    <a href="{{$like.url}}"><img src="{{ $like.author.photo}}" alt="{{ $like.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Reposts</h4>
  {{ range $i, $repost := $reposts }}
    <a href="{{$repost.url}}"><img src="{{ $repost.author.photo}}" alt="{{ $repost.author.name }}" class="profile photo"></a>
  {{end}}

  <h4>Comments and Replies</h4>
  {{ range $i, $reply := $replys }}
    <a href="{{$reply.url}}"><img src="{{ $reply.author.photo}}" alt="{{ $reply.author.name }}" class="profile photo"></a>
  {{end}}
{{end}}
```

Si tout se passe bien, vous devriez voir des icônes au bas de la page qui sont de vraies personnes qui interagissent avec le site.

### Étape 4 - publiez le site lorsque des commentaires apparaissent

Bien que les étapes ci-dessus me permettent d&#39;agréger les mentions et de les rendre dans la sortie des sites, je dois tout de même m&#39;assurer que le site est reconstruit régulièrement pour que les commentaires soient publiés.

J&#39;ai choisi d&#39;utiliser un simple service cron qui appellera l&#39;API de déploiement de Zeit pour forcer un nouveau dépôt du site toutes les heures environ.
