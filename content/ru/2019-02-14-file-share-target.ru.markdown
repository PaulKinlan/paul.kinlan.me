---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Я часто говорил, что для того, чтобы веб-приложения эффективно конкурировали в мире приложений, они должны быть интегрированы во все места, где пользователи ожидают, что приложения будут. Обмен данными между приложениями является одной из основных недостающих частей веб-платформы, и, в частности, одной из последних основных отсутствующих функций является общий [data out of their silo](/unintended-silos/) на уровне: веб-приложения должны иметь возможность получать [data out of their silo](/unintended-silos/) и [data out of their silo](/unintended-silos/) в другие веб-сайты и приложения; они также должны иметь возможность получать данные из других собственных приложений и сайтов.

API File Share Target - это изменение в интерфейсе API, которое теперь доступно в Chrome Canary. API расширяет [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) , [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) приложениям и сайтам обмениваться простыми ссылками и текстом с веб-сайтами, интегрируя их в функции совместного использования систем.

Этот очень статичный файловый блог использует API-интерфейс Target Web Share, поэтому я могу быстро [share links](/web-share-target-api/) который мне интересен из любого приложения Android, а также [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) на прошлой неделе. Этот пост посвящен тому, как я это сделал (и украл некоторый код у Джейка Арчибальда - он разработал множество ошибок для интеграции, которую они делают в [squoosh.app](https://squoosh.app/) .)

[File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) - это очень новый API, который полностью прогрессивен. Если ваше приложение может обрабатывать запросы Form `POST` вы можете легко интегрироваться с этим API. Основной процесс заключается в следующем: когда пользователь выбирает ваше приложение из собственного средства выбора, Chrome отправит запрос Form `POST` на ваш сервер, и вам решать, что вы с ним делаете (обрабатываете работник службы или сервер).

Чтобы добавить поддержку обмена файлами в ваше веб-приложение, вам нужно сделать две вещи:

1. Объявите о поддержке обмена файлами через файл манифеста,
2. Обработайте запрос формы `POST` у вашего сервисного работника.

Манифест объявляет хост-системе, как должен быть отображен общий доступ из хост-приложения в веб-приложение. В приведенном ниже манифесте, в сущности, говорится: «Когда пользователь совместно использует файл типа &#39;image / *&#39;, отправьте POST-запрос формы в &#39;/ share / image /&#39; и назовите данные&quot; file &quot;&quot;.

* Manifest.json *
```JSON
{
  "name": "Blog: Share Image",
  "short_name": "Blog: Share Image",
  "start_url": "/share/image/",
  "theme_color": "#000000",
  "background_color": "#000000",
  "icons": [ {
      "sizes": "192x192",
      "src": "/images/me.png",
      "type": "image/png"
  }],
  "share_target": {
    "action": "/share/image/",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "files": [
        {
          "name": "file",
          "accept": ["image/*"]
        }
      ]
    }
  },
  "display": "standalone",
  "scope": "/share/"
}
```

После того, как пользователь предоставит доступ к вашему веб-приложению, Chrome отправит веб-запрос на ваш сайт с данными файла в качестве полезной нагрузки.

Рекомендуется обрабатывать запрос POST внутри сервисного работника, чтобы 1) он был быстрым, 2) отказоустойчивым, чтобы сеть была недоступна. Вы можете сделать это следующим образом:

* serviceworker.js * - [demo](/share/image/sw.js)

```Javascript
onfetch = async (event) => {
  if (event.request.method !== 'POST') return;
  if (event.request.url.startsWith('https://paul.kinlan.me/share/image/') === false) return;

  /* This is to fix the issue Jake found */
  event.respondWith(Response.redirect('/share/image/'));
  
  event.waitUntil(async function () {
    const data = await event.request.formData();
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());
};
```

Есть несколько интересных вещей, происходящих выше, которые можно быстро суммировать как:

* Визуализировать пользовательский интерфейс как результат запроса `POST` , выполнив перенаправление.
* Прочитайте данные, которые представлены через форму через `event.request.formData()`
* Отправьте данные в открытое окно (это будет пользовательский интерфейс, на который мы перенаправили пользователя в первом пункте).

Это полностью зависит от вас, что вы делаете с данными, которые были отправлены вашему сервисному работнику, но в случае моего приложения мне нужно было показать их непосредственно в пользовательском интерфейсе, поэтому мне нужно найти окно, которое использует пользователь, и `postMessage` данные там.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

И это все. Если у вас уже есть конечная точка API для ваших веб-форм, то это простое, но мощное дополнение, которое вы можете сделать на своем сайте.

Web Share Target API - невероятно мощный примитив платформы, который преодолевает еще один барьер, который веб-приложения имеют на своих хост-платформах.