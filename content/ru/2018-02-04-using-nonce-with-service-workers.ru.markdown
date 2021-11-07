---
slug: using-nonce-with-service-workers
date: 2018-02-04T13:20:31.000Z
title: "Using CSP Nonces effectively with service worker"
tags: ['service worker', 'csp', 'security', 'google analytics']
description: "CSP nonce values can help you securely run inline content on you site. But it can 
be hard to get it working with Service Workers... until now."
---


В [недавнем проекте](https://webgdedeck.com/) я хотел поделиться как можно большей логикой между сервером, рабочим сервисом и клиентом. Проект является, по сути, простым читателем RSS-каналов, он берет RSS-каналы, анализирует данные и объединяет их в хороший набор столбцов (так же, как и TweetDeck), а также один объединенный список.

Поскольку я беру RSS-каналы и показываю на своей странице, мне нужно быть как можно увереннее, что это не делает ничего гнусного. Я могу санировать вход так, как я хочу, однако я знаю свои собственные способности, и я уверен, что люди могут манипулировать RSS-каналом таким образом, что я буду запускать скрипты, импортировать изображения или любые другие сторонние контекст моего сайта.

Веб-платформа предлагает возможность блокировки сайта через Content-Security-Policy (CSP). CSP может блокировать внешние источники, из которых мы можем запрашивать такие контексты, как сценарий, стили, изображения и т. Д. Вы даже можете заблокировать возможность запуска страницы сценариев в строке - что может предотвратить все усадьбы типов атак типа XSS.

Было довольно просто добавить его в приложение.


```
`default-src 'self';`
```


Однако ... У меня было несколько вопросов.

1. Я генерирую стили на странице и, следовательно, мне нужно запустить скрипты inline. 2. Мне нужно было включить Google Analytics, для чего на странице должен быть запущен встроенный скрипт.

CSP позволяет запускать сценарии и стили встроенными, позволяя вам включать опцию «unsafe-eval» скриптов, однако это в значительной степени обходит любые защиты, предоставляемые CSP.

Чтобы запустить встроенные скрипты и по-прежнему иметь защиту CSP, CSP предлагает несколько инструментов. Тот, который я использовал, называется «nonce». Nonce - это случайный идентификатор, который вы задаете в заголовке HTTP CSP и который вы связываете с связанным встроенным скриптом.

** Строка CSP в заголовке HTTP **


```
`default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-script-${nonce.analytics}'; connect-src 'self'; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'nonce-style-${nonce.style}'
```


** Встроенный скрипт с использованием nonce **


```html
<script src="https://www.googletagmanager.com/gtag/js?id=1111"></script>
<script nonce="script-{nonce.analytics}">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{=it.config.then(config=>config.site.googleAnalytics)}}');
</script>
```


Вышеприведенный код работает хорошо и упрощает работу аналитики, когда мы обеспечиваем безопасность сайта с помощью CSP.

Для каждого отдельного веб-запроса вам нужно иметь уникальное значение «nonce», и я делаю это с помощью `{nonce.analytics}`, который является значением, которое я генерирую на сервере и применяю с помощью шаблона. Если вы повторно используете значение nonce, браузер откажется выполнять контент в скрипте.

У меня была небольшая проблема с получением значений nonce. Мне нужно было что-то, что создало бы уникальное значение, которое не будет повторно использоваться одним и тем же пользователем. Я чувствовал, что значение nonce формата [источник] - [date.now + request-count] будет достаточным.

«Источник» позволяет мне добавить пространство имен в nonce, а date.now () + возрастающий счетчик запросов дает мне относительно стабильный неизменяемый набор значений.

Я генерирую nonce, используя следующую функцию:


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


Выглядит неплохо. Тем не менее, я кэширую все свои страницы в рабочем работнике, а это означает, что если бы я просто просто обслуживал содержимое из кеша, значения nonce будут повторно использоваться и, следовательно, не выполняться.

К счастью, я использую логику обмена между моим сервером и рабочим сервисом, что позволяет мне генерировать все, что мне нужно, в одном центральном месте моего кода. Я использую параметр «source» в моей функции «generateIncrementalNonce», чтобы добавить «сервер» или «рабочий-сервис» к значению nonce, и я сделал это в каждом из обработчиков запросов как на сервере, так и на обслуживании. Использование этого параметра источника означает, что я могу гарантировать, что значение nonce, сгенерированное с помощью сервера, никогда не столкнется со страницей, загруженной через сервисного работника.

Эта модель послужила мне хорошей идеей. Это позволило мне разрешить необходимые встроенные скрипты для Google Analytics, оставив третью сторону от ввода или запуска ненадежного кода на моей странице.

Ниже приведен код, который я использовал в проекте. На моих страницах есть несколько разных мест, для которых мне нужны значения nonce, я генерирую их для каждого запроса, а затем применяю его к моей функции шаблонов и HTTP-заголовку одновременно.

#### common.js - общая логика


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


#### service-worker.js - обработчик fetch


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


#### server.js - обработчик запросов


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