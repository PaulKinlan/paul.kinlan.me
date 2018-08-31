---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


PWA. Progressive Web Apps. Frances Berriman und Alex Russell prägten den Begriff "progressive Web Apps" im Jahr 2015 mit dem, was ich für bahnbrechend halte "[Progressive Web Apps: Entkommene Tabs ohne unsere Seele zu verlieren](https://infrequently.org/2015/06/progressive -Apps-Escaping-Tabs-ohne-unsere-Seele zu verlieren /) ".

3 Jahre später haben wir einen langen Weg zurückgelegt. Aus einer losen Sammlung von Technologien - Service Worker, Manifest, Add to Homescreen, Web Push -, die ursprünglich nur in einer Browser-Engine implementiert wurden, bis hin zu einer Marke, die branchenübergreifend mit Unternehmen und Entwicklern und allen großen Unternehmen zusammenhängt Browser-Anbieter, die den Großteil des "PWA" Stacks implementieren.

Wir haben jetzt [app](https://appsco.pe/) [Verzeichnisse](https://pwa-directory.appspot.com/), [tools](https://blog.tomayac.com/ 2018/07/09 / progressive-web-apps-in-dem-http-archive-143748), die uns helfen, grob zu verstehen, wie viele PWA es in der Wildnis gibt, und eine Fülle von [Fallstudien über die Vorteile von PWA](https://developers.google.com/web/showcase/). Aber was definiert einen PWA? Frances und Alex haben diese Liste von Eigenschaften entwickelt:

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


Wichtig ist, dass diese Beschreibung den Moment markiert hat, in dem wir alle ein bisschen klarer darüber waren, wie wir das Web sehen wollten und wir haben [tools](https://developers.google.com/web/tools/lighthouse/), die geholfen haben wir verstehen, ob unsere Seite eine "PWA" ist oder nicht. Alex ging noch weiter und definierte einige der [technischen Aspekte, die eine 'PWA' zu einer PWA machen](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/ ).

Mit der Übertreibung dieses Beitrags aus dem Weg, warum baut nicht jeder diese Dinge? [Nun, es kann schwer sein. Sehr schwer](/ Herausforderungen-für-Web-Entwickler /). Wir fordern Entwickler und Unternehmen auf, viel zu tun. In einigen Fällen kann die Fokussierung auf AppShell eine vollständige Neuarchitektur einer Site sein, in anderen Fällen [AppShell ist nicht die richtige Architektur](/ progressive-progressive-web-apps /). Und in vielen Fällen ist der Wert oder die Erzählung nicht immer klar.

Ich hatte das Glück, direkt mit Unternehmen und Entwicklern über ihre Bedenken sprechen zu können, die im Internet auftauchten. Insbesondere die Dinge, die ich von Unternehmen und Entwicklern über PWA gehört habe, sind:

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Interessant. Sind sie anders? Häufig nicht, aber PWA ist ein "Ding" von dem sie gehört haben und es ist ein anderes Produkt, das es zu veröffentlichen gilt. Ähnlich wie m. * Sites waren die mobile Version der Desktop-Site, PWA kann eine andere Sache sein, die sie starten müssen.

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


Wah. Das ist kein PWA, sondern nutzt nur eine Technologie, die native Apps hatten.

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


Hmmm. Es ist ein klarer Fall, dass wir nicht in der Lage waren zu artikulieren, warum es für Content-Websites wichtig ist, den Schritt zu machen.

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


Huh. Leute assoziieren App's mit Installationen, und der Gedanke, dass eine Site oder eine Erfahrung sich wie eine App-Installation verhalten muss, macht manche Leute von dem Konzept als Ganzes ab. Im Jahr 2015 gab es eine sehr interessante Diskussion über [Karotten](https://trib.tv/2015/10/11/progressive-apps/), die ich Ihnen empfehlen möchte.

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


OK. Das ist ziemlich klar. Der Wert für einen Benutzer oder das Unternehmen ist nicht vorhanden und reicht aus, um ein Unternehmen daran zu hindern, die Eigenschaften eines PWA zu priorisieren.

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


Eigentlich höre ich das von vielen tollen Webentwicklern.

Ich ermutige Sie, sich die Schriften von [Jeremy Keith](https://adactio.com/) anzuschauen, die seit einiger Zeit das "PW" in PWA für eine lange Zeit schieben und in einem kürzlichen Vortrag etwas Ähnliches gesagt haben:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Mein persönliches Gefühl ist, dass alle wirklich auf dem A in PWA hängen: "App". Es ist der Erfolg und das Scheitern des Branding des Konzepts; "App" ist im Namen, "App" ist im Bewusstsein vieler Nutzer und Unternehmen und so sind die Assoziationen ziemlich klar.

Um ganz klar zu sein, haben mich und viele andere Mitglieder unseres Teams im Kontext von PWA intensiv auf den Begriff "App" gedrängt, insbesondere in Bezug auf den Wettbewerb mit mobilen nativen Erfahrungen. [Andrew Betts Beitrag](https://trib.tv/2016/06/05/progressive-less-progressive/) hatte eine gute Zusammenfassung gegen unsere ursprüngliche Positionierung, und obwohl ich nicht denke, dass wir falsch lagen, taten wir es eine Chance verpassen, der breiteren Geschichte speziell um Formfaktoren zu helfen, die nicht so mobil-zentrisch waren.

Ich habe das Publikum gefragt, als wir über den Chrome Web Store sprachen. Ist Google Mail eine App oder eine Website? Eine App, das ist einfach. Ist Twitter eine App oder eine Website? Eine App .. ist es? Wenn ich nur Inhalte lese, fühlt es sich immer noch wie eine Website an. Ist Wikipedia eine App oder eine Site? Eine Seite, absolut; ist es trotzdem? Als Redakteur fühlt es sich sehr wie ein Werkzeug an.

Letztendlich glaube ich nicht, dass es wirklich wichtig ist, ob eine Website eine App oder eine App eine Website ist. Die Leute können und werden alles im Web erschaffen: "Apps", Spiele, VR-Spulen, Einzelhandelsgeschäfte oder einfach nur traditionelle "Sites", und es könnte für jeden spezifischen Anwendungsfall sein - Medien, Unterhaltung, Verlagswesen, Versorgungsunternehmen, Handel ...

Wenn man die ursprüngliche Definition von PWA mit Ausnahme von "installability" (siehe "Beutel mit Karotten") auseinander reißt, glaube ich nicht, dass irgendjemand argumentieren könnte, wenn ein Entwickler seine Website in irgendeinem der Punkte verbessert, auf die Alex dann Bezug genommen hat Benutzer erhalten eine bessere Erfahrung, und wenn Benutzer eine bessere Erfahrung erhalten, schätzen sie das Web mehr und mehr Leute haben eine bedeutungsvolle Verbindung mit dem Netz und benutzen das Netz weiter. Wie können wir die PWA-Erzählung so anwenden, dass alle Unternehmen und Entwickler wissen, worauf sie sich konzentrieren sollten?

---

Ich habe an einen kleinen Punkt gedacht, der auf den Herausforderungen basiert, die wir in der Branche gesehen haben, und ich habe versucht, der Frage Priorität einzuräumen, wo sich Entwickler und Unternehmen konzentrieren können. (Hinweis: Ich kan [BizKin](https://twitter.com/business_kinlan) channeln)

Wir möchten, dass Unternehmen und Entwickler erfolgreich sind, indem sie die einzigartigen Funktionen des Webs nutzen, die es ihnen ermöglichen: die meisten Benutzer auf Knopfdruck zu erreichen; Bewahren Sie ihre Benutzer auf, indem Sie ihre besten Erfahrungen mit einem einzigen Code auf verschiedene Geräte übertragen; und sich mit ihren Nutzern sinnvoll auseinanderzusetzen, indem sie eine direkte und eigenverantwortliche Beziehung zu ihnen aufbauen.

Ich habe versucht, dies als eine Reihe von Prinzipien zu artikulieren, die der Benutzer fühlen sollte, wenn er das Web benutzt. Ihre Erfahrung sollte sein: ENTDECKBAR, SICHER, SCHNELL, GLATTEN, ZUVERLÄSSIG, BEDEUTEND

Machen Sie es sichtbar: Ermöglichen Sie Benutzern, Ihre Erfahrung zu finden. Das Web besteht aus Links und Seiten. Im Idealfall sollte jede Seite und jeder Status eine Deep-Link-Funktion haben, damit jeder von jeder Site aus an ihn gesendet werden kann, sei es ein Aggregator, eine Nachricht, eine E-Mail oder eine Werbefläche. Der Inhalt sollte so geschaltet werden, dass er von jedem Renderer gelesen werden kann.

Machen Sie es sicher: Benutzer und Inhaltseigentümer können auf Erfahrungen vertrauen, die im Web erstellt wurden, und schützen Identität, Vertraulichkeit und Datenintegrität.

Machen Sie es schnell: Sobald der Benutzer den Link zu Ihrer Website hat, sind sie in dem Moment, in dem er sie antippt, in Ihrer Erfahrung und in der Lage, sie unabhängig von dem Netzwerk oder dem Gerät, das der Benutzer besitzt, zu verwenden.

Glatt machen: Wenn Nutzer auf Ihrer Website sind, ist die Erfahrung reaktionsfähig und interaktiv für alle Nutzergesten. Animationen fühlen sich glatt und klar an, Feedback ist sofort, Scrollen ist seidig, Navigationen sind sofort. Im Idealfall, wenn Sie an die Leistung des Web in Bezug auf [RAIL] denken (https://developers.google.com/web/fundamentals/performance/rail), konzentrieren Sie sich auf die RAI.

Zuverlässig machen: Nutzer Ihrer Website nehmen bei unzuverlässigen Netzwerken oder Geräten so wenig Unterbrechungen wie möglich wahr. Die Erfahrung sollte funktionieren und reaktionsfähig sein, wo auch immer der Benutzer ist.

Machen Sie es sinnvoll: Sie müssen Mehrwert bieten und die Bedürfnisse Ihrer Nutzer durch qualitativ hochwertige Erfahrungen erfüllen, die einen Mehrwert bieten. Dies kann ziemlich flauschig erscheinen, aber [Dion Almaer hat es gut beschrieben](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411). Der Fokus liegt wirklich darauf, dass Ihre Website die Bedürfnisse des Nutzers löst, sei es Unterhaltung, Glättung eines Kaufs, Weiterentwicklung des Wissens oder schnelle Ausführung einer Aufgabe. Es geht nur um die UX.

Eine moderne Erfahrung, die diese Hauptziele von ** schnell, zuverlässig, sicher und reibungslos ** erfüllt. Es wird zunehmend ** fähiger ** mit modernen APIs und sehr ** auffindbar **, indem die Reichweite des offenen Webs und dessen Kern genutzt wird. Ein PWA sollte natürlich jedes dieser "Hauptziele" auf der Grundlage der Benutzererwartungen erfüllen und weiterhin auf der Erfahrung aufbauen, wenn mehr Technologien und Fähigkeiten hinzukommen. Aber so sollte jede moderne Erfahrung im Web heute sein ....

<span><span id='pw'>Progressive Web</span> <span id=name>Apps</span></span> - Progressive Web Alle Dinge.

Hier möchte ich PWA im nächsten Jahr pushen. Was denken Sie?

_Dank Harleen Batra ._

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}