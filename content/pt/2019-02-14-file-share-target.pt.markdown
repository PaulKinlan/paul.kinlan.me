---
slug: file-web-share-target
date: 2019-02-15T15:52:03.183Z
title: 'File Web Share Target'
tags: [share, intents]
---

Eu sempre disse que para os aplicativos da web competirem efetivamente no mundo dos aplicativos, eles precisam estar integrados em todos os lugares que os usuários esperam que os aplicativos sejam. A comunicação entre aplicativos é uma das principais peças que faltam na plataforma da Web e, especificamente, um dos principais recursos ausentes é o compartilhamento em nível nativo: os aplicativos da Web precisam conseguir o [data out of their silo](/unintended-silos/) em outros sites e aplicativos da Web; eles também precisam receber os dados de outros aplicativos e sites nativos.

A API de destino de compartilhamento de arquivos é um divisor de águas de uma API que agora está no Chrome Canary. A API estende o [Web Share Target API](https://github.com/WICG/web-share-target/blob/master/docs/explainer.md) que permite que aplicativos e sites compartilhem links e textos simples em sites, integrando-os à funcionalidade de compartilhamento de sistemas.

Este blog de arquivo muito estático utiliza a Web Share Target API para que eu possa rapidamente [share links](/web-share-target-api/) que eu acho interessante a partir de qualquer aplicativo Android, e a partir da semana passada [I enabled the File Share Target API so that I can upload images to my blog directly from the Camera app on Android](/testing-file-share-target-from-camera/) . Este post é sobre como eu fiz isso (e roubei alguns códigos de Jake Archibald - tbf ele trabalhou muito com os bugs para uma integração que eles estão fazendo no [squoosh.app](https://squoosh.app/) .)

O [File Share Target API](https://wicg.github.io/web-share-target/level-2/#example-3-manifest-webmanifest) é uma API muito nova por ser totalmente progressiva. Se seu aplicativo puder manipular solicitações do Form `POST` , você poderá integrar-se facilmente a essa API. O fluxo básico é: quando o usuário escolhe seu aplicativo a partir do selecionador nativo, o Chrome enviará uma solicitação Form `POST` para o seu servidor, cabe a você o que você faz com ele (manipular em um service worker ou no servidor).

Para adicionar suporte ao compartilhamento de arquivos em seu aplicativo da web, você precisa fazer duas coisas:

1. Declare o suporte para compartilhar arquivos através do arquivo de manifesto,
2. Lide com a solicitação Form `POST` em seu Service Worker.

O manifesto declara ao sistema host como o compartilhamento deve ser mapeado do aplicativo host para o aplicativo da web. No manifesto abaixo, ele basicamente diz &quot;Quando um usuário compartilha um arquivo do tipo &#39;image / *&#39;, faça uma solicitação Form POST para &#39;/ share / image /&#39; e nomeie o arquivo de dados &#39;&quot;.

* manifest.json *
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

Depois que o usuário compartilhar com seu aplicativo da web, o Chrome fará a solicitação da web para o seu site com os dados do arquivo como a carga útil.

É recomendado que você manipule a solicitação POST dentro de seu service worker para que 1) seja rápido, 2) resiliente para a rede não estar disponível. Você pode fazer isso da seguinte maneira:

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

Há algumas coisas interessantes acontecendo acima, que podem ser rapidamente resumidas como:

* Renderize a interface do usuário como resultado da solicitação `POST` executando um redirecionamento.
* Leia os dados que são enviados através do formulário via `event.request.formData()`
* Envie os dados para a janela aberta (esta será a interface do usuário para a qual redirecionamos o usuário no primeiro ponto).

É inteiramente com você o que você faz com os dados que foram postados para o seu service worker, mas no caso do meu aplicativo eu precisava mostrá-lo diretamente na interface do usuário, então eu tenho que encontrar a janela que o usuário está usando e `postMessage` os dados lá.

* index.html * - [demo](/share/image/index.html)

```Javascript
navigator.serviceWorker.onmessage = (event) => {
  console.log(event);
  imageBlob = event.data.file;
  // Update the UI with the data that has been shared to it.
  imageShare.src = URL.createObjectURL(imageBlob);
};
```

E é sobre isso. Se você já tem um ponto de extremidade de API para seus formulários da Web, essa é uma adição simples, mas poderosa, que você pode fazer em seu site.

A API do Web Share Target é uma ferramenta incrivelmente poderosa e primitiva que quebra outra barreira que os aplicativos da Web tiveram em suas plataformas host.