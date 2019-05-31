---
slug: extracting-text-from-an-imageexperiments-with-shape-detection
date: 2019-05-13T12:39:45.039Z
title: 'Extracting text from an image: Experiments with Shape Detection'
link: 'https://copy-image-text.glitch.me/'
tags: [links, shape detection, pwa, intent, lumpy]
---
J&#39;ai eu un peu de temps après Google IO et je voulais me débarrasser de mes démangeaisons à long terme. Je veux juste pouvoir copier du texte contenu dans des images du navigateur. C&#39;est tout. Je pense que ce serait une fonctionnalité intéressante pour tout le monde.

Il n&#39;est pas facile d&#39;ajouter des fonctionnalités directement dans Chrome, mais je sais que je peux tirer parti du système d&#39;intention sur Android et que je peux maintenant le faire avec le Web (ou au moins Chrome sur Android).

Deux nouveaux ajouts à la plate-forme Web - Partage de niveau cible 2 (ou comme je l’appelle partage de fichiers) et `TextDetector` dans l’API de détection de forme - [have allowed me to build a utility that I can Share images to and get the text held inside them](https://copy-image-text.glitch.me/) .

L&#39;implémentation de base est relativement simple: vous créez une cible de partage et un gestionnaire dans le Service Worker, puis une fois que vous avez l&#39;image que l&#39;utilisateur a partagée, vous exécutez `TextDetector` dessus.

`Share Target API` permet à votre application Web de faire partie du sous-système de partage natif. Dans ce cas, vous pouvez maintenant vous enregistrer pour gérer tous les types `image/*` en le déclarant comme suit dans votre `Web App Manifest` .

```javascript
"share_target": {
  "action": "/index.html",
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
}
```

Lorsque votre PWA est installé, vous le verrez dans tous les endroits où vous partagez des images, comme suit:

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-0.jpeg"></figure>

L&#39;API `Share Target` traite le partage de fichiers comme une publication de formulaire. Lorsque le fichier est partagé avec Web App, l&#39;agent de service est activé, le gestionnaire `fetch` est `fetch` avec les données du fichier. Les données se trouvent maintenant dans Service Worker, mais j&#39;en ai besoin dans la fenêtre actuelle pour pouvoir les traiter. Le service sait quelle fenêtre a appelé la demande. Vous pouvez ainsi facilement cibler le client et lui envoyer les données.

```javascript
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST') {
    event.respondWith(Response.redirect('/index.html'));
    event.waitUntil(async function () {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId || event.clientId);
      const file = data.get('file');
      client.postMessage({ file, action: 'load-image' });
    }());
    
    return;
  }
  ...
  ...
}

```

Une fois l&#39;image dans l&#39;interface utilisateur, je la traite ensuite avec l&#39;API de détection de texte.

```javascript
navigator.serviceWorker.onmessage = (event) => {  
  const file = event.data.file;
  const imgEl = document.getElementById('img');
  const outputEl = document.getElementById('output');
  const objUrl = URL.createObjectURL(file);
  imgEl.src = objUrl;
  imgEl.onload = () => {
    const texts = await textDetector.detect(imgEl);
    texts.forEach(text => {
      const textEl = document.createElement('p');
      textEl.textContent = text.rawValue;
      outputEl.appendChild(textEl);
    });
  };
  ...
};
```

Le plus gros problème est que le navigateur ne fait pas naturellement pivoter l&#39;image (comme vous pouvez le voir ci-dessous), et l&#39;API de détection de la forme a besoin que le texte soit dans le sens de la lecture.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-1.jpeg"></figure>

J&#39;ai utilisé [EXIF-Js library](https://github.com/exif-js/exif-js) assez facile à utiliser, pour détecter la rotation, puis pour effectuer quelques manipulations de base sur la toile afin de réorienter l&#39;image.

```javascript
EXIF.getData(imgEl, async function() {
  // http://sylvana.net/jpegcrop/exif_orientation.html
  const orientation = EXIF.getTag(this, 'Orientation');
  const [width, height] = (orientation > 4) 
                  ? [ imgEl.naturalWidth, imgEl.naturalHeight ]
                  : [ imgEl.naturalHeight, imgEl.naturalWidth ];

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  // We have to get the correct orientation for the image
  // See also https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  switch(orientation) {
    case 2: context.transform(-1, 0, 0, 1, width, 0); break;
    case 3: context.transform(-1, 0, 0, -1, width, height); break;
    case 4: context.transform(1, 0, 0, -1, 0, height); break;
    case 5: context.transform(0, 1, 1, 0, 0, 0); break;
    case 6: context.transform(0, 1, -1, 0, height, 0); break;
    case 7: context.transform(0, -1, -1, 0, height, width); break;
    case 8: context.transform(0, -1, 1, 0, 0, width); break;
  }
  context.drawImage(imgEl, 0, 0);
}
```

Et voila, si vous partagez une image avec l&#39;application, celle-ci la fera pivoter puis analysera en renvoyant la sortie du texte qu&#39;elle aura trouvé.

<figure><img src="/images/2019-05-13-extracting-text-from-an-imageexperiments-with-shape-detection-2.jpeg"></figure>

C&#39;était incroyablement amusant de créer cette petite expérience et elle m&#39;a été immédiatement utile. Il met toutefois en évidence les [inconsistency of the web platform](/the-lumpy-web/) . Ces API ne sont pas disponibles dans tous les navigateurs. Elles ne sont même pas disponibles dans toutes les versions de Chrome. Cela signifie qu&#39;en écrivant cet article Chrome OS, je ne peux pas utiliser l&#39;application, mais en même temps, quand je peux l&#39;utiliser. ... OMG, tellement cool.

