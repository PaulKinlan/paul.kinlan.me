---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA. Aplicaciones web progresivas. Frances Berriman y Alex Russell acuñaron el término "aplicaciones web progresivas" en 2015 con lo que creo que es una publicación seminal "[Aplicaciones web progresivas: escapando pestañas sin perder nuestro alma](https://infrequently.org/2015/06/progressive -apps-escaping-tabs-without-losing-our-soul /) ".

3 años después, hemos recorrido un largo camino. De una colección suelta de tecnologías: Trabajador de servicio, Manifiesto, Agregar a pantalla de inicio, Web Push, que originalmente solo se implementaron en un motor de navegador, a una marca que comenzó a extenderse a toda la industria con empresas y desarrolladores, y todas las principales proveedores de navegador implementando la mayoría de la pila 'PWA'.

Ahora tenemos [app](https://appsco.pe/) [directorios](https://pwa-directory.appspot.com/), [herramientas](https://blog.tomayac.com/ 2018/07/09 / progressive-web-apps-in-the-http-archive-143748) que nos ayudan a entender aproximadamente cuántos PWA hay en la naturaleza, y una serie de asombrosos [estudios de casos sobre los beneficios de PWA](https://developers.google.com/web/showcase/). Pero, ¿qué define a un PWA? Frances y Alex crearon esta lista de rasgos:


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


Es importante destacar que esta descripción marcó el momento en el que todos estábamos un poco más claros sobre cómo queríamos ver la web y tenemos [herramientas](https://developers.google.com/web/tools/lighthouse/) que ayudaron nosotros entendemos si nuestro sitio es un 'PWA' o no. Alex fue aún más lejos y definió algunos de los [aspectos técnicos que hacen que un 'PWA' sea un PWA](https://infrequently.org/2016/09/what-excaly-makes-something-a-progressive-web-app/ )

Con la hipérbole de este post fuera del camino, ¿por qué no todos construyen estas cosas? [Bueno, puede ser difícil. Muy difícil](/ challenges-for-web-developers /). Les pedimos a los desarrolladores y a las empresas que hagan mucho. En algunos casos, centrarse en AppShell puede ser una nueva arquitectura completa de un sitio, en otros casos ['AppShell' no es la arquitectura correcta](/ progressive-progressive-web-apps /). Y en muchos casos, el valor o la narrativa no siempre es muy clara.

Tuve la suerte de poder hablar directamente con las empresas y los desarrolladores acerca de sus preocupaciones sobre la construcción en la web, específicamente sobre las cosas que he escuchado que las empresas y los desarrolladores dicen sobre PWA, son:


> We've got our site... but we are also making a PWA.
> We've got our site... but we are also making a PWA.



> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)
> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Interesante. ¿Son diferentes? Frecuentemente no, pero PWA es una 'cosa' de la que han oído hablar y es otro producto para lanzar. Al igual que los sitios m. * Eran la versión móvil del sitio de escritorio, los PWA pueden ser otra cosa que tienen que lanzar.


> I've got a PWA. It just does Push notifications.
> I've got a PWA. It just does Push notifications.



> &mdash; Too many people.
> &mdash; Too many people.


Wah. Eso no es un PWA, solo está usando una parte de la tecnología que las aplicaciones nativas han tenido.


> I'm only building a blog... it's not a PWA
> I'm only building a blog... it's not a PWA



> &mdash; Many bloggers we spoke to.
> &mdash; Many bloggers we spoke to.


Hmmm. Es un caso claro que no hemos podido explicar por qué es importante que los sitios de contenido hagan el cambio.


> I don't care about making it installable.. I don't need a Service Worker.
> I don't care about making it installable.. I don't need a Service Worker.



> &mdash; Many publishers we spoke to.
> &mdash; Many publishers we spoke to.


Huh. Las personas asocian las aplicaciones con las instalaciones y la idea de que un sitio o experiencia debe actuar como una instalación de la aplicación aleja a algunas personas del concepto en general. En 2015 hubo una discusión muy interesante sobre [zanahorias](https://trib.tv/2015/10/11/progressive-apps/) que te animo a diseccionar.


> I don't need an app on desktop. I just need users to click 'checkout'
> I don't need an app on desktop. I just need users to click 'checkout'



> &mdash; Many retailers we spoke to.
> &mdash; Many retailers we spoke to.


De acuerdo. Eso es bastante claro. El valor para un usuario o la empresa no está allí, y es suficiente para evitar que una empresa priorice los rasgos de una PWA.


> Progressive Web Apps are just better sites.
> Progressive Web Apps are just better sites.



> &mdash; Many developers we speak to.
> &mdash; Many developers we speak to.


En realidad, escucho mucho de muchos grandes desarrolladores web.

Los aliento a que revisen los escritos de [Jeremy Keith](https://adactio.com/) que durante un tiempo han estado presionando el 'PW' en PWA durante mucho tiempo y en una charla reciente han dicho algo similar:


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


Mi sensación personal es que todos están realmente pendientes de la A en PWA: 'App'. Es el éxito y el fracaso de la marca del concepto; "Aplicación" está en el nombre, "Aplicación" está en la conciencia de muchos usuarios y empresas, por lo que las asociaciones son bastante claras.

Para ser absolutamente claros, yo mismo y muchos otros en nuestro equipo presionamos mucho sobre el término 'Aplicación' en el contexto de PWA, específicamente en relación con la competencia con las experiencias nativas de Mobile. [La publicación de Andrew Betts](https://trib.tv/2016/06/05/progressively-less-progressive/) tuvo un buen resumen en contra de nuestro posicionamiento original, y aunque no creo que estuviéramos equivocados, lo hicimos pierden la oportunidad de ayudar a la historia más amplia específicamente en torno a factores de forma que no estaban tan centrados en dispositivos móviles.

Solía ​​preguntarle a la audiencia esto cuando hablábamos de Chrome Web Store. ¿Gmail es una aplicación o un sitio? Una aplicación, eso es fácil. ¿Twitter es una aplicación o un sitio? Una aplicación ... ¿verdad? Si solo estoy leyendo contenido, todavía se siente como un sitio web. ¿Wikipedia es una aplicación o sitio? Un sitio, absolutamente; ¿Sin embargo, lo es? Como editor, se parece mucho a una herramienta.

En última instancia, no creo que realmente importe demasiado si un sitio es una aplicación o si una aplicación es un sitio. La gente puede y crea todo en la web: 'aplicaciones', juegos, bobinas VR, tiendas minoristas o simplemente 'sitios' tradicionales, y podría ser para cualquier caso de uso específico: medios, entretenimiento, publicación, servicios públicos, comercio ...

Si deshace la definición original de PWA, con la excepción de 'installability' (vea 'bag of carrots'), no creo que nadie pueda argumentar que si un desarrollador mejora su sitio en cualquiera de los puntos a los que se refirió Alex, entonces los usuarios obtienen una mejor experiencia, y cuando los usuarios obtienen una mejor experiencia, valoran más la web y cada vez más personas tienen un compromiso significativo con la web y siguen usando la web. Entonces, ¿cómo podemos aplicar la narrativa de PWA de manera que cada empresa y desarrollador sepa en qué deberían enfocarse?

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