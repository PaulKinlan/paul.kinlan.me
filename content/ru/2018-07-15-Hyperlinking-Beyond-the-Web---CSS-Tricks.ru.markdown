---
slug: hyperlinking-beyond-the-web---css-tricks
date: 2018-07-15T17:28:21.103Z
title: Hyperlinking Beyond the Web - CSS-Tricks
link: https://css-tricks.com/hyperlinking-beyond-the-web/
tags: ['link', 'intents']
---
Atishay Jain на CSS Tricks пишет о области, близкой моему сердцу, связывая:

> Hyperlinks are the oldest and the most popular feature of the web. The word hypertext (which is the ht in http/s) means text having hyperlinks. The ability to link to other people&#x2019;s hypertext made the web, a web &#x2014; a set of connected pages. This fundamental feature has made the web a very powerful platform and it is obvious that the world of apps needs this feature. All modern platforms support a way for apps to register a URI (custom protocol) and also have universal links (handling web links in an app).
> 
> Let&#x2019;s see why we&#x2019;d want to take advantage of this feature and how to do it.


[Читать полный пост](https://css-tricks.com/hyperlinking-beyond-the-web/).

Это была отличная статья, которая охватывает все типы гиперссылок, доступных для приложений и сайтов. Я занимаюсь большим количеством исследований в этом пространстве с тех пор, как веб-намерения и состояние передовых ссылок на веб-сайте оставляет желать лучшего, imo.

Одна из причин, почему я люблю Интернет, заключается в том, что за ссылкой есть прямой доступ к ресурсу, я не знаю никакой другой платформы, которая могла бы объединить ссылку и фактический ресурс таким же образом, но это могло бы быть soooo much Больше. Стандартная ссылка обеспечивает, по сути, намерение VIEW, которое содержит состояние (url) и контекст (текст между якорями), и вы можете взломать его с помощью пользовательских протоколов, но нам нужно идти намного дальше.

* Нам нужно расширить словарь для `registerProtocolHandler` для получения большего доступа к более родным схемам * Все, что зарегистрировано в обработчике протокола, должно быть системным. * Мы должны иметь возможность иметь веб-сайты для работы с открытием ряда типов контента и иметь доступные страницы для регистрации в качестве обработчика системных файлов. * Нам нужно иметь более высокие действия для разработчиков, VIEW - это замечательно, нам нужен согласованный набор основных действий, таких как PICK, SAVE, EDIT, чтобы мы могли более эффективно понимать возможности сайта или приложения, а также возможность расширения их с семантикой более высокого порядка. У Android есть это, Сири получает его, используя «Intents», и Web должен иметь его.

Это одна из причин, почему я так волнуюсь о аббревиатурах обмена сообщениями, таких как [Comlink](https://github.com/GoogleChromeLabs/comlink), которые устраняют бремя безумия postMessage и позволяют думать об экспонировании функции другим приложения, а затем, как только вы выставляете функцию, вам нужно более легко включить обнаружение этой функции ... и это то, что позволяет включить ссылки.
