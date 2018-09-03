---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA. Applications Web progressives. Frances Berriman et Alex Russell ont inventé le terme "applications Web progressives" en 2015 avec ce que je pense être un post séminal "Applications Web progressives: échapper aux tabulations sans perdre notre âme" -apps-escaping-tabs-sans-perdre-notre-âme /) ".

3 ans plus tard, nous avons parcouru un long chemin. Depuis un ensemble de technologies - Service Worker, Manifest, Ajouter à l'écran d'accueil, Web Push - initialement implémentées dans un seul moteur de navigateur, à une marque qui a commencé à s'imposer dans le secteur avec les entreprises et les développeurs, et tous les principaux les fournisseurs de navigateurs implémentant la majorité de la pile 'PWA'.

Nous avons maintenant [application](https://appsco.pe/) [répertoires](https://pwa-directory.appspot.com/), [outils](https://blog.tomayac.com/ 2018/07/09 / progressive-web-apps-in-the-http-archive-143748) qui nous aident à comprendre combien de PWA il y a dans la nature et une foule d'études de cas sur les avantages des PWA (https://developers.google.com/web/showcase/). Mais qu'est-ce qui définit une PWA? Frances et Alex ont trouvé cette liste de traits:

> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 
> to fit any form factor  
> **Connectivity independent**: Progressively-enhanced with [Service 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> to let them work offline  
> **App-like-interactions**: Adopt a Shell + Content application model to create 
> appy navigations & interactions  
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> process  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Discoverable**: Are identifiable as "applications" thanks to 
> [W3C](https://w3c.github.io/manifest/) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> and Service Worker registration scope allowing search engines to find them  
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> to the home screen through browser-provided 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> allowing users to "keep" apps they find most useful without the hassle of an 
> app store  
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> The social [power of
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> _matters_.


Ce qui est important, cette description a marqué le moment où nous étions tous un peu plus clair sur la façon dont nous voulions voir le Web et nous avons [outils](https://developers.google.com/web/tools/lighthouse/) qui a aidé Nous comprenons si notre site est un "PWA" ou non. Alex est même allé plus loin et a défini certains des [aspects techniques qui font une «PWA» un PWA](https://infrequent.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ).

Avec l'hyperbole de ce post, pourquoi tout le monde ne construit-il pas ça? [Eh bien, ça peut être difficile. Très difficile](/ challenges-for-web-developers /). Nous demandons aux développeurs et aux entreprises de faire beaucoup. Dans certains cas, se concentrer sur AppShell peut être une ré-architecture complète d'un site, dans d'autres cas, ["AppShell" n'est pas l'architecture correcte](/ progressive-progressive-web-apps /). Et dans de nombreux cas, la valeur ou le récit n'est pas toujours clair.

J'ai eu la chance de pouvoir parler directement aux entreprises et aux développeurs de leurs préoccupations concernant le Web, en particulier ce que les entreprises et les développeurs ont dit à propos de PWA:

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Intéressant. Sont-ils différents? Fréquemment pas, mais PWA est une «chose» dont ils ont entendu parler et qui est un autre produit à lancer. Tout comme m. * Sites étaient la version mobile du site de bureau, les PWA peuvent être une autre chose qu'ils doivent lancer.

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


Wah. Ce n'est pas une PWA, c'est simplement une technologie utilisée par les applications natives.

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


Hmmm. Il est clair que nous n’avons pas été en mesure d’expliquer pourquoi il est important que les sites de contenu se déplacent.

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


Huh. Les personnes associent les applications à des installations, et l'idée qu'un site ou une expérience doit agir comme une installation d'applications élimine certaines personnes du concept dans son ensemble. En 2015, il y a eu une discussion très intéressante sur [les carottes](https://trib.tv/2015/10/11/progressive-apps/) que je vous encourage à décrypter.

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


D'accord. C'est assez clair. La valeur pour un utilisateur ou l'entreprise n'est pas là et il suffit d'arrêter une entreprise pour prioriser les caractéristiques d'une PWA.

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


En fait, je l’entends beaucoup de beaucoup de grands développeurs web.

Je vous encourage à consulter les écrits de [Jeremy Keith](https://adactio.com/) qui, depuis un certain temps, poussent le «PW» dans PWA depuis quelque temps et ont dit quelque chose de similaire dans un discours récent:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Mon sentiment personnel est que tout le monde a vraiment raccroché au A dans PWA: «App». C'est le succès et l'échec de la stratégie de marque du concept; "App" est dans le nom, "App" est dans la conscience de nombreux utilisateurs et entreprises et donc les associations sont assez claires.

Pour être absolument clair, moi-même et beaucoup d'autres membres de notre équipe ont insisté sur le terme «App» dans le contexte de PWA, en particulier en ce qui concerne la concurrence avec les expériences natives de Mobile. [Le post d'Andrew Betts](https://trib.tv/2016/06/05/progressively-less-progressive/) avait un bon résumé contre notre positionnement initial, et bien que je ne pense pas que nous ayons eu tort, nous manquer une chance d'aider l'histoire plus large spécifiquement autour des facteurs de forme qui n'étaient pas si centrés sur le mobile.

J'avais l'habitude de demander cela au public lorsque nous parlions du Chrome Web Store. Gmail est-il une application ou un site? Une application, c'est facile. Twitter est-il une application ou un site? Une application .. est-ce? Si je ne fais que lire du contenu, cela ressemble toujours à un site Web. Wikipedia est-il une application ou un site? Un site, absolument; est-ce bien ça? En tant qu'éditeur, cela ressemble beaucoup à un outil.

En fin de compte, je ne pense pas que ce soit vraiment important si un site est une application ou une application est un site. Les gens peuvent créer et créer tout sur le Web: «applications», jeux, bobines VR, magasins de détail ou simplement «sites» traditionnels, et ce, pour tous les cas d'utilisation - médias, divertissement, édition, utilitaires, commerce ...

Si vous différenciez la définition originale de PWA, à l'exception de «installabilité» (voir «sac de carottes»), je ne pense pas que quiconque puisse prétendre que si un développeur améliore son site sur l'un des points référencés par Alex les utilisateurs acquièrent une meilleure expérience et, lorsque les utilisateurs acquièrent une meilleure expérience, ils apprécient de plus en plus le Web et ont un engagement significatif avec le Web et continuent à utiliser le Web. Alors, comment pouvons-nous appliquer le récit PWA de manière à ce que chaque entreprise et développeur sache sur quoi se concentrer?

---

J'ai pensé à un léger pivot basé sur les défis que nous avons rencontrés dans l'industrie, et j'ai essayé de donner la priorité à l'importance des domaines dans lesquels les développeurs et les entreprises peuvent concentrer leurs efforts. (Remarque: je pourrais canaliser [BizKin](https://twitter.com/business_kinlan))

Nous voulons que les entreprises et les développeurs réussissent en exploitant les capacités uniques du Web qui leur permettent de: Atteindre le plus grand nombre d’utilisateurs possible d’un simple clic; Conservez leurs utilisateurs en apportant leurs meilleures expériences sur des appareils avec un seul ensemble de code; et à s'engager de manière significative avec leurs utilisateurs en établissant une relation directe et propre avec eux.

J'ai essayé d'articuler cela comme un ensemble de principes que l'utilisateur devrait ressentir lors de l'utilisation du Web. Votre expérience devrait être: DÉCOUVRIR, SÉCURITAIRE, RAPIDE, LISSE, FIABLE, SIGNIFICATIVE

Rendez-le découvrable: Permettez aux utilisateurs de trouver votre expérience. Le web est constitué de liens et de pages. Idéalement, chaque page et chaque état devrait avoir un lien profond afin que tout le monde puisse y être envoyé, que ce soit un agrégateur, un message, un courrier électronique ou un panneau d'affichage. Le contenu doit être servi pour que tout moteur de rendu puisse le lire.

Rendre les choses sûres: les utilisateurs et les propriétaires de contenu peuvent faire confiance aux expériences créées sur le Web, en protégeant l'identité, la confidentialité et l'intégrité des données.

Faites vite: une fois que l'utilisateur a le lien vers votre site, à l'instant où il le touche, il est dans votre expérience et capable de l'utiliser indépendamment du réseau ou du périphérique dont dispose l'utilisateur.

Rendre les choses plus faciles: lorsque les utilisateurs sont sur votre site, l'expérience est réactive et interactive pour tous les gestes des utilisateurs. Les animations se sentent fluides et nettes, le feedback est instantané, le défilement est soyeux, les navigations sont instantanées. Dans l'idéal, si vous pensez aux performances Web en termes de [RAIL](https://developers.google.com/web/fundamentals/performance/rail), vous vous concentrez sur le «RAI».

Assurez-vous que les utilisateurs de votre site perçoivent le moins d'interruptions possible lorsqu'ils sont confrontés à un réseau ou à des périphériques peu fiables. L'expérience devrait fonctionner et être réactif où que soit l'utilisateur.

Faites-en un sens: vous devez fournir de la valeur et répondre aux besoins de vos utilisateurs grâce à des expériences de grande qualité qui apportent une valeur ajoutée. Cela peut sembler très léger, mais [Dion Almaer l'a bien décrit](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411). L'accent est vraiment mis sur la résolution par votre site d'un besoin pour l'utilisateur, qu'il s'agisse de divertissement, de lissage d'un achat, d'avancement des connaissances ou de réalisation rapide d'une tâche. Tout tourne autour de l'UX.

Une expérience moderne qui répond à ces objectifs de ** rapide, fiable, sûr et fluide **. Il devient progressivement plus ** compatible ** en utilisant les API modernes et hautement détectable ** en exploitant la portée du Web ouvert et au cœur de celui-ci. Une PWA devrait naturellement répondre à chacun de ces «objectifs principaux» en fonction des attentes des utilisateurs et continuer à tirer parti de l’expérience au fur et à mesure que de nouvelles technologies et capacités entrent en jeu.

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> - Progressive Web Tout-en-tout.

C'est là que je veux pousser PWA l'année prochaine. Qu'est-ce que tu penses?

_Merci à Harleen Batra._

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}