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
> **[Responsive](http://alistapart.com/article/responsive-web-design)**[:](http://alistapart.com/article/responsive-web-design) 

> to fit any form factor  
> to fit any form factor  

> **Connectivity independent**: Progressively-enhanced with [Service 
> **Connectivity independent**: Progressively-enhanced with [Service 

> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 
> Workers](http://www.html5rocks.com/en/tutorials/service-worker/introduction/) 

> to let them work offline  
> to let them work offline  

> **App-like-interactions**: Adopt a Shell + Content application model to create 
> **App-like-interactions**: Adopt a Shell + Content application model to create 

> appy navigations & interactions  
> appy navigations & interactions  

> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 
> **Fresh**: Transparently always up-to-date thanks to the Service Worker update 

> process  
> process  

> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  
> **Safe**: Served via TLS (a Service Worker requirement) to prevent snooping  

> **Discoverable**: Are identifiable as "applications" thanks to 
> **Discoverable**: Are identifiable as "applications" thanks to 

> [W3C](https://w3c.github.io/manifest/) 
> [W3C](https://w3c.github.io/manifest/) 

> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 
> [Manifests](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) 

> and Service Worker registration scope allowing search engines to find them  
> and Service Worker registration scope allowing search engines to find them  

> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 
> **Re-engageable**: Can access the re-engagement UIs of the OS; e.g. [Push 

> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  
> Notifications](https://developers.google.com/web/updates/2015/03/push-notificatons-on-the-open-web)  

> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 
> **[Installable](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en)**[: 

> to the home screen through browser-provided 
> to the home screen through browser-provided 

> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 
> prompts](https://developers.google.com/web/updates/2015/03/increasing-engagement-with-app-install-banners-in-chrome-for-android?hl=en), 

> allowing users to "keep" apps they find most useful without the hassle of an 
> allowing users to "keep" apps they find most useful without the hassle of an 

> app store  
> app store  

> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.
> **Linkable**: meaning they're zero-friction, zero-install, and easy to share.

> The social [power of
> The social [power of

> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)
> URLs](http://www.theatlantic.com/technology/archive/2012/10/dark-social-we-have-the-whole-history-of-the-web-wrong/263523/)

> _matters_.
> _matters_.


Ce qui est important, cette description a marqué le moment où nous étions tous un peu plus clair sur la façon dont nous voulions voir le Web et nous avons [outils](https://developers.google.com/web/tools/lighthouse/) qui a aidé Nous comprenons si notre site est un "PWA" ou non. Alex est même allé plus loin et a défini certains des [aspects techniques qui font une «PWA» un PWA](https://infrequent.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ).

Avec l'hyperbole de ce post, pourquoi tout le monde ne construit-il pas ça? [Eh bien, ça peut être difficile. Très difficile](/ challenges-for-web-developers /). Nous demandons aux développeurs et aux entreprises de faire beaucoup. Dans certains cas, se concentrer sur AppShell peut être une ré-architecture complète d'un site, dans d'autres cas, ["AppShell" n'est pas l'architecture correcte](/ progressive-progressive-web-apps /). Et dans de nombreux cas, la valeur ou le récit n'est pas toujours clair.

J'ai eu la chance de pouvoir parler directement aux entreprises et aux développeurs de leurs préoccupations concernant le Web, en particulier ce que les entreprises et les développeurs ont dit à propos de PWA:


> We've got our site... but we are also making a PWA.
> We've got our site... but we are also making a PWA.



> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)
> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Intéressant. Sont-ils différents? Fréquemment pas, mais PWA est une «chose» dont ils ont entendu parler et qui est un autre produit à lancer. Tout comme m. * Sites étaient la version mobile du site de bureau, les PWA peuvent être une autre chose qu'ils doivent lancer.


> I've got a PWA. It just does Push notifications.
> I've got a PWA. It just does Push notifications.



> &mdash; Too many people.
> &mdash; Too many people.


Wah. Ce n'est pas une PWA, c'est simplement une technologie utilisée par les applications natives.


> I'm only building a blog... it's not a PWA
> I'm only building a blog... it's not a PWA



> &mdash; Many bloggers we spoke to.
> &mdash; Many bloggers we spoke to.


Hmmm. Il est clair que nous n’avons pas été en mesure d’expliquer pourquoi il est important que les sites de contenu se déplacent.


> I don't care about making it installable.. I don't need a Service Worker.
> I don't care about making it installable.. I don't need a Service Worker.



> &mdash; Many publishers we spoke to.
> &mdash; Many publishers we spoke to.


Huh. Les personnes associent les applications à des installations, et l'idée qu'un site ou une expérience doit agir comme une installation d'applications élimine certaines personnes du concept dans son ensemble. En 2015, il y a eu une discussion très intéressante sur [les carottes](https://trib.tv/2015/10/11/progressive-apps/) que je vous encourage à décrypter.


> I don't need an app on desktop. I just need users to click 'checkout'
> I don't need an app on desktop. I just need users to click 'checkout'



> &mdash; Many retailers we spoke to.
> &mdash; Many retailers we spoke to.


D'accord. C'est assez clair. La valeur pour un utilisateur ou l'entreprise n'est pas là et il suffit d'arrêter une entreprise pour prioriser les caractéristiques d'une PWA.


> Progressive Web Apps are just better sites.
> Progressive Web Apps are just better sites.



> &mdash; Many developers we speak to.
> &mdash; Many developers we speak to.


En fait, je l’entends beaucoup de beaucoup de grands développeurs web.

Je vous encourage à consulter les écrits de [Jeremy Keith](https://adactio.com/) qui, depuis un certain temps, poussent le «PW» dans PWA depuis quelque temps et ont dit quelque chose de similaire dans un discours récent:


> There's a common misconception that making a Progressive Web App means
> There's a common misconception that making a Progressive Web App means

> creating a Single Page App with an app-shell architecture. But the truth is
> creating a Single Page App with an app-shell architecture. But the truth is

> that literally any website can benefit from the performance boost that results
> that literally any website can benefit from the performance boost that results

> from the combination of HTTPS + Service Worker + Web App Manifest.
> from the combination of HTTPS + Service Worker + Web App Manifest.



> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 

> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Mon sentiment personnel est que tout le monde a vraiment raccroché au A dans PWA: «App». C'est le succès et l'échec de la stratégie de marque du concept; "App" est dans le nom, "App" est dans la conscience de nombreux utilisateurs et entreprises et donc les associations sont assez claires.

Pour être absolument clair, moi-même et beaucoup d'autres membres de notre équipe ont insisté sur le terme «App» dans le contexte de PWA, en particulier en ce qui concerne la concurrence avec les expériences natives de Mobile. [Le post d'Andrew Betts](https://trib.tv/2016/06/05/progressively-less-progressive/) avait un bon résumé contre notre positionnement initial, et bien que je ne pense pas que nous ayons eu tort, nous manquer une chance d'aider l'histoire plus large spécifiquement autour des facteurs de forme qui n'étaient pas si centrés sur le mobile.

J'avais l'habitude de demander cela au public lorsque nous parlions du Chrome Web Store. Gmail est-il une application ou un site? Une application, c'est facile. Twitter est-il une application ou un site? Une application .. est-ce? Si je ne fais que lire du contenu, cela ressemble toujours à un site Web. Wikipedia est-il une application ou un site? Un site, absolument; est-ce bien ça? En tant qu'éditeur, cela ressemble beaucoup à un outil.

En fin de compte, je ne pense pas que ce soit vraiment important si un site est une application ou une application est un site. Les gens peuvent créer et créer tout sur le Web: «applications», jeux, bobines VR, magasins de détail ou simplement «sites» traditionnels, et ce, pour tous les cas d'utilisation - médias, divertissement, édition, utilitaires, commerce ...

Si vous différenciez la définition originale de PWA, à l'exception de «installabilité» (voir «sac de carottes»), je ne pense pas que quiconque puisse prétendre que si un développeur améliore son site sur l'un des points référencés par Alex les utilisateurs acquièrent une meilleure expérience et, lorsque les utilisateurs acquièrent une meilleure expérience, ils apprécient de plus en plus le Web et ont un engagement significatif avec le Web et continuent à utiliser le Web. Alors, comment pouvons-nous appliquer le récit PWA de manière à ce que chaque entreprise et développeur sache sur quoi se concentrer?

---

I've been thinking of a slight pivot based on the challenges we've seen in the
industry, and I've tried to prioritize the importance of where developers and
businesses can focus their efforts. (Note: I might channel
[BizKin](https://twitter.com/business_kinlan))

We want businesses and developers to succeed by leveraging the web’s unique
capabilities that allow them to: Reach the most users they can at the click of a
button; Retain their users by bringing their best experiences across devices
with a single set of code; and to meaningfully engage with their users by
building a direct and ownable relationship with them.

I've tried to articulate this as a set of principles that the user should feel
when using the web. Your experience should be:
DISCOVERABLE, SAFE, FAST, SMOOTH, RELIABLE, MEANINGFUL

Make it Discoverable
: Enable users to find your experience. The web is made of links and pages.
Ideally every page and state should have a deep-link so that anyone can be sent
to it from any site, be it an aggregator, a message, an email or a billboard.
Content should be served so that any renderer can read it.

Make it Safe
: Users and content owners can trust experiences built on the web, protecting
identity, confidentiality and data integrity.

Make it Fast
: Once the user has the link to your site, then the instant they tap it they are in
your experience and able to start using it irrespective of the network or device
that the user has.

Make it Smooth
: When users are on your site the experience is responsive and interactive to all
user gestures. Animations feel smooth and crisp, feedback is instant, scrolling
is silky, navigations are instant. Ideally if you think of the web performance
in terms of
[RAIL](https://developers.google.com/web/fundamentals/performance/rail), you are
focusing on the 'RAI'.

Make it Reliable
: Users of your site perceive as few interruptions as possible when faced with
unreliable network or devices. The experience should work and be responsive 
wherever the user is.

Make it Meaningful
: You must provide value and meet your user's needs through
high-quality experiences that provide value. This can seem quite fluffy, but
[Dion Almaer described it
well](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411).
The focus is really about your site solving a need for the user, be it
entertainment, smoothing out a purchase, advancement of knowledge or quick
completion of a task. It's all about the UX.

A modern experience that meets these principle goals of **fast, reliable, safe
and smooth**. It becomes progressively more **capable** using modern APIs and
highly **discoverable** by harnessing the reach of the open web and at the core
of it. A PWA should naturally meet each of these "principle goals" based on user
expectations and continues to build on the experience as more technologies and
capabilities come in. But so should any modern experience on the web today....

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> &mdash; Progressive Web All-the-things.

This is where I want to push PWA over the next year. What do you think?

_Thanks to Harleen Batra._

{{<html>}}

<style>
dt {
  font-weight: 600;
  margin-bottom: 0.8em;
}
dd {
  margin-bottom: 1em;
}
#pw {
  font-weight: 700;
  font-size: 1em;
}
#name {
  font-size: 1em;
  font-weight: 100;
}
</style>
<script>
  const nameEl = document.getElementById('name');
  const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];
  let counter = 1;
  setInterval(()=> { 
    nameEl.textContent = names[counter];
    counter = (counter + 1) % names.length;
    nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})
  }, 2000)
</script>
{{</html>}}