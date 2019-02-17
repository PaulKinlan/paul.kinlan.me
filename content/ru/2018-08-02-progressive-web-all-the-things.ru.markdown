---
slug: pwa-progressive-web-all-the-things
date: 2018-08-02T14:56:13.506Z
title: 'PWA: Progressive Web All-the-things'
description: ""
tags: ['pwa']
---


Ведомство общественных работ Прогрессивные веб-приложения. Фрэнсис Берриман и Алекс Рассел придумали термин «прогрессивные веб-приложения» в 2015 году с тем, что, по моему мнению, является серьезным сообщением «[Прогрессивные веб-приложения: экранирование вкладок без потери нашей души](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)».

3 года спустя, мы прошли долгий путь. Из свободной коллекции технологий - Service Worker, Manifest, Add to Homescreen, Web Push, которые первоначально были реализованы только в одном браузере, бренду, который начал сталкиваться с отраслью с предприятиями и разработчиками, и все основные поставщиков браузеров, реализующих большую часть стека PWA.

Теперь у нас есть [приложение](https://appsco.pe/) [справочники](https://pwa-directory.appspot.com/), [инструменты](https://blog.tomayac.com/2018/07/09/progressive-web-apps-in-the-http-archive-143748), которые помогают нам понять примерно то, сколько PWA есть в дикой природе, и множество удивительных [тематических исследований о преимуществах PWA](https://developers.google.com/web/showcase/). Но что определяет PWA? Фрэнсис и Алекс придумали этот список черт:

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


Важно отметить, что это описание ознаменовало момент, когда мы все поняли, как мы хотели видеть веб-сайт, и у нас есть [tools](https://developers.google.com/web/tools/lighthouse/), которые помогли нам понять, является ли наш сайт «PWA» или нет. Алекс пошел еще дальше и определил некоторые из [технических аспектов, которые делают «PWA» PWA](https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/).

С гиперболой этого поста в сторону, почему не все строят эти вещи? [Ну, это может быть сложно. Очень сложно](/challenges-for-web-developers/). Мы просим разработчиков и предпринимателей сделать многое. В некоторых случаях сосредоточение внимания на AppShell может быть полной реорганизацией сайта, в других случаях [«AppShell» не является правильной архитектурой](/progressive-progressive-web-apps/). И во многих случаях ценность или повествование не всегда достаточно ясны.

Мне посчастливилось поговорить напрямую с предприятиями и разработчиками о своих проблемах, связанных с сетью, в частности, о том, что я слышал о том, что компании и разработчики говорят о PWA:

> We've got our site... but we are also making a PWA.


> &mdash; Many B2B sites we spoke (actually, I saw this a lot in India)


Интересно. Разве они разные? Часто нет, но PWA - это «вещь», о которой они слышали, и это еще один продукт для запуска. Так же, как и m. * Сайты были мобильной версией рабочего стола, PWA может быть другой задачей, которую они должны запустить.

> I've got a PWA. It just does Push notifications.


> &mdash; Too many people.


Вах. Это не PWA, это просто использование технологии, которую имеют собственные приложения.

> I'm only building a blog... it's not a PWA


> &mdash; Many bloggers we spoke to.


Хммм. Ясно, что нам не удалось сформулировать, почему важно, чтобы контент-сайты делали ход.

> I don't care about making it installable.. I don't need a Service Worker.


> &mdash; Many publishers we spoke to.


Да. Люди связывают App с установками, и мысль о том, что сайт или опыт должен действовать как приложение, превращает некоторых людей в концепцию в целом. В 2015 году была очень интересная дискуссия о [моркови](https://trib.tv/2015/10/11/progressive-apps/), которую я призываю вас к общению.

> I don't need an app on desktop. I just need users to click 'checkout'


> &mdash; Many retailers we spoke to.


ОК. Это довольно ясно. Значение для пользователя или бизнеса отсутствует, и этого достаточно, чтобы остановить бизнес, определяющий приоритеты PWA.

> Progressive Web Apps are just better sites.


> &mdash; Many developers we speak to.


На самом деле, я слышу это от многих крупных веб-разработчиков.

Я рекомендую вам ознакомиться с трудами [Джереми Кейт](https://adactio.com/), которые какое-то время подталкивали «PW» в PWA в течение длительного времени и в недавнем разговоре говорили что-то похожее:

> There's a common misconception that making a Progressive Web App means
> creating a Single Page App with an app-shell architecture. But the truth is
> that literally any website can benefit from the performance boost that results
> from the combination of HTTPS + Service Worker + Web App Manifest.


> &mdash; Jeremy Keith. "[Any Site can be a Progressive Web 
> App](https://noti.st/adactio/d1zSa7/any-site-can-be-a-progressive-web-app)" 


Мое личное чувство в том, что все на самом деле повесились на A в PWA: «App». Это успех и неудача брендинга концепции; «Приложение» находится в названии, «Приложение» находится в сознании многих пользователей и предприятий, и поэтому ассоциации совершенно ясны.

Чтобы быть абсолютно ясно, я и многие другие по всей нашей команде трудно толкнул на термин «приложение» в контексте PWA, в частности, по отношению к конкуренции с мобильными носителями опыта. [Сообщение Эндрю Бетца](https://trib.tv/2016/06/05/progressively-less-progressive/) имело хорошее резюме против нашего первоначального позиционирования, и хотя я не думаю, что мы ошибались, у нас не хватило шанса помочь более широкой истории конкретно в отношении форм-факторов, которые не были такими мобильными центрическими ,

Раньше я спрашивал аудиторию, когда мы говорили о Интернет-магазине Chrome. Является ли Gmail приложением или сайтом? Приложение, это просто. Является ли Twitter приложением или сайтом? Приложение ... не так ли? Если я просто читаю контент, он по-прежнему чувствует себя как веб-сайт. Википедия - приложение или сайт? Сайт, абсолютно; это правда? Как редактор, он очень похож на инструмент.

В конечном счете, я не думаю, что на самом деле это слишком важно, если сайт является приложением или приложение - это сайт. Люди могут создавать и создавать все в Интернете: «приложения», игры, брелоки VR, розничные магазины или просто традиционные «сайты», и это может быть для любого конкретного случая использования - для СМИ, развлечений, публикации, утилит, коммерции ...

Если вы дразните первоначальное определение PWA, за исключением «installability» (см. «Мешок с морковкой»), я не думаю, что кто-нибудь мог утверждать, что если разработчик улучшит свой сайт в любой из точек, на которые ссылается Алекс пользователи получают лучший опыт, и когда пользователь получает лучший опыт, они ценят Интернет все больше и больше людей имеют значимое взаимодействие с сетью и продолжают пользоваться Интернетом. Итак, как мы можем применить повествование PWA так, чтобы каждый бизнес и разработчик знали, на что они должны сосредоточиться?

---

Я подумывал о небольшом стержне, основанном на проблемах, которые мы видели в отрасли, и я попытался определить приоритетность того, где разработчики и бизнес могут сосредоточить свои усилия. (Примечание: я могу направить [BizKin](https://twitter.com/business_kinlan))

Мы хотим, чтобы предприятия и разработчики добились успеха, используя уникальные возможности Интернета, которые позволяют им: охватить большинство пользователей, которых они могут одним нажатием кнопки; Сохраняйте своих пользователей, принося свой лучший опыт на всех устройствах с помощью одного набора кода; и сознательно взаимодействовать со своими пользователями, создавая с ними прямые и управляемые отношения.

Я попытался сформулировать это как набор принципов, которые пользователь должен чувствовать при использовании Интернета. Ваш опыт должен быть: ОТКРЫТЫЙ, БЕЗОПАСНЫЙ, БЫСТРЫЙ, ГЛАДКИЙ, НАДЕЖНЫЙ, ЗНАЧИТЕЛЬНЫЙ

Сделайте его доступным для просмотра: разрешите пользователям находить свой опыт. Веб создан из ссылок и страниц. В идеале каждая страница и государство должны иметь глубокую ссылку, чтобы любой мог быть отправлен на нее с любого сайта, будь то агрегатор, сообщение, электронное письмо или рекламный щит. Содержимое должно обслуживаться таким образом, чтобы любой визуализатор мог его прочитать.

Обеспечьте безопасность: пользователи и владельцы контента могут доверять опыту, созданному в Интернете, защищая личность, конфиденциальность и целостность данных.

Сделайте это быстро: как только у пользователя появится ссылка на ваш сайт, то в тот момент, когда они нажимают на них, они находятся в вашем опыте и могут начать использовать его независимо от сети или устройства, которое имеет пользователь.

Сделайте его гладким: когда пользователи на вашем сайте, опыт реагирует и интерактивен во всех пользовательских жестах. Анимации выглядят гладкими и четкими, обратная связь мгновенная, прокрутка шелковистая, навигационные операции мгновенные. В идеале, если вы думаете о производительности сети с точки зрения [RAIL](https://developers.google.com/web/fundamentals/performance/rail), вы фокусируетесь на «RAI».

Сделайте его надежным: пользователи вашего сайта воспринимают как можно меньше перерывов, когда сталкиваются с ненадежной сетью или устройствами. Опыт должен работать и реагировать везде, где есть пользователь.

Сделайте это значащим: вы должны обеспечить ценность и удовлетворить потребности своего пользователя благодаря высококачественному опыту, который обеспечивает ценность. Это может показаться довольно пушистым, но [Дион Алмаер описал это хорошо](https://medium.com/ben-and-dion/mission-improve-the-web-ecosystem-for-developers-3a8b55f46411). Основное внимание уделяется тому, как ваш сайт решает проблему для пользователя, будь то развлечение, сглаживание покупки, продвижение знаний или быстрое выполнение задачи. Это все о UX.

Современный опыт, который отвечает этим основным целям: * быстрый, надежный, безопасный и плавный **. Он становится все более и более совершенным ** с использованием современных API-интерфейсов и высоко ** обнаруживаемым **, используя доступность открытой сети и в ее основе. PWA должен, естественно, соответствовать каждой из этих «основных целей», основанной на ожиданиях пользователей, и продолжает основываться на опыте по мере того, как появляются новые технологии и возможности. Но так должно быть любой современный опыт в Интернете сегодня ...

<span><span id='pw'>Прогрессивные веб-</span> <span id=name>приложения</span></span> - прогрессивные веб-версии.

Вот где я хочу подтолкнуть PWA в течение следующего года. Как вы думаете?

_Спасибо Харлоу Батра.

{{ <html> }}

<style> dt {   font-weight: 600;   margin-bottom: 0.8em; } dd {   margin-bottom: 1em; } #pw {   font-weight: 700;   font-size: 1em; } #name {   font-size: 1em;   font-weight: 100; } </style><script>   const nameEl = document.getElementById('name');   const names = ['Apps', 'Sites', 'Stores', 'Blogs', 'Forums', 'Magazines', 'Block-chain doo-dads', 'Experiences', 'Wikis', 'Utilities', 'Games'];   let counter = 1;   setInterval(()=> {      nameEl.textContent = names[counter];     counter = (counter + 1) % names.length;     nameEl.animate([{opacity: 0}, {opacity: 1}], {duration: 1000, easing: 'cubic-bezier(1,.01,1,.99)'})   }, 2000) </script> {{ </html> }}