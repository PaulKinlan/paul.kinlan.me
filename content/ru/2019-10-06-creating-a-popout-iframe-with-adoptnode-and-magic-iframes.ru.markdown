---
slug: creating-a-popout-iframe-with-adoptnode-and-magic-iframes
date: 2019-10-06T20:58:16.791Z
title: 'Creating a pop-out iframe with adoptNode and "magic iframes"'
tags: [iframe, popout, adoptNode]
---

Обновление ### : 8 октября - Значительные проблемы с этим документом.

Я догнал [Jake Archibald](https://jakearchibald.com/) об этом посте, потому что я думал, что у меня есть что-то новое, во время разговора мы обнаружили много вещей, которые делают часть этого поста недействительной, и я также многому научился в процессе, который я не думаю, что большинство разработчиков знать.

* `.append()` и `.appendChild()` принимают узел. Это делает использование `adoptNode` в этом случае бесполезным, потому что алгоритм добавления гарантирует, что узел принят. Это не упоминалось в документах MDN, но есть в [spec](https://dom.spec.whatwg.org/#concept-node-append) . Мне нужно вернуться и потренироваться, почему у меня возникла проблема раньше, но я подозреваю, что это потому, что я изначально пытался добавить `DocumentFragment` . Это означает, что и `w.document.body.appendChild(document.adoptNode(airhornerIframe));` и `w.document.body.appendChild(airhornerIframe);` будут иметь одинаковый эффект.
* Пока элементы DOM сохраняют свое состояние (проверьте пользовательский элемент), если iframe перемещается в DOM, он перезагружается. Период. Это означает, что перемещение его между iframes не сохранит состояние, как я тестировал изначально, я думаю, это произошло из-за того, что SW загрузил страницу невероятно быстро. Это может не повлиять на API порталов, поэтому в будущем этот опыт должен работать :)

Концепция перемещения элементов между документами по-прежнему актуальна и интересна, но преимущества для фреймов не существует. Я заметил, что элементы видео сбрасывались при перемещении между окнами, и я должен был быть более прилежным, проверяя, что iframe фактически не сбрасывает свое состояние.

Как всегда, вы можете увидеть [commit history for this post](https://github.com/PaulKinlan/paul.kinlan.me/commits/main/content/en/2019-10-06-creating-a-popout-iframe-with-adoptnode-and-magic-iframes.markdown) .

### Оригинальное сообщение Когда я присоединился к Google в 2010 году, я наткнулся на документ, в котором упоминалась концепция в gmail, называемая « [magic iframes](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf) », у него было классное имя, и концепция была новой.

> * Targeted at apps with multiple windows
> * All code and data go into an IFRAME
> * If window hosting the IFRAME unloads, it gets adopted by another of the windows
> * In Gmail for example:
>   * Tearoff / pop-out compose creates bare window that is filled by code in IFRAME in main window
>   * If you close the main window, the code looks for a tear-off that can accept the IFRAME and moves it
>   * You finish your compose and can still send the email
> * Old way: create new instance of Gmail tailored to the task.

- [Adam de Boor](https://www.usenix.org/legacy/events/webapps10/tech/slides/deboor.pdf)

Концепция заключается в том, что многим приложениям приходится загружать много сложного JavaScript даже для «небольшого компонента», такого как окно компоновки в gmail, компоненты приложения могут быть загружены в `iframe` , с которым пользователь может взаимодействовать, в главном окне, чтобы потом можно было «оторвать» и перейти к новому окну, когда используются кнопки «создать в новом окне». У меня не было достаточно уверенности, чтобы поговорить с автором (и я до сих пор этого не сделал, и я не посмотрел на источник для gmail, чтобы узнать, действительно ли он когда-либо использовался), но он остался в моей памяти, главным образом, потому, что название было загадочным ,

Хоп продвинулся на 10 лет вперед, и я долго путешествовал на поезде и начал исследовать область, которую я мало знаю об API `adoptNode` . Я играл с [lot of ideas](https://nifty-meadowlark.glitch.me/) и понял, что можно перемещать элементы DOM, их текущее состояние и подключенные обработчики событий в новые окна. Это напомнило мне о «волшебных iframes» и в конечном итоге привело к мысли, что вы можете создать всплывающий iframe (всплывающий iframe - это видео «картинка в картинке», но для элементов iframe)

Код для всплывающего iframe довольно прост:

```html
<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>
```

<iframe src="https://airhorner.com" id="airhorner"> </iframe>

<button id="adoptIframeButton">
  Popout iframe into new window (adoptNode)
</button>

<script>
 adoptIframeButton.addEventListener("click", () => {
    const airhornerIframe = document.getElementById("airhorner");
    const width = airhornerIframe.clientWidth;
    const height = airhornerIframe.clientHeight;
    const w = window.open("/blank.html", "", `top=100,width=${width},height=${height}`);
    w.addEventListener("load", () => {
      w.document.body.appendChild(airhornerIframe);
    });
 });
</script>

`adoptNode` позволяет перемещать элементы DOM с их текущим состоянием, сохраняя при этом существующие обработчики связанных событий, между документами в браузере - это может быть новый DOM внутри текущего окна или, как в случае с этой демонстрацией, это может быть перемещение уже загрузил `iframe` в другое окно того же источника. (См. Обновление выше).

Перемещение iframe интересно, потому что это означает, что вам не нужно перезагружать содержимое iframe, экземпляр просто перемещается. Есть несколько недостатков:

1. URL остается на текущем источнике, а не на источнике iframe, хотя это может быть чем-то, что может решить API `<portal>` .
2. Если вы перемещаете пользовательский элемент или что-то с его логикой, размещенной на открывателе - если вы закроете открыватель, выполнение остановится.

Помимо недостатков, я думал, что этот механизм IPC уровня DOM очень и очень интересен. [demo page](https://nifty-meadowlark.glitch.me/) с [demo page](https://nifty-meadowlark.glitch.me/) ( [src](https://glitch.com/edit/#!/nifty-meadowlark?path=script.js) ) и дайте мне знать, если у вас есть интересные идеи, где это можно использовать.

