---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

J&#39;aime beaucoup <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . Cela me permet de créer une interface très simple hébergée sur le Web pour mon blog statique Hugo.

EditorJS a presque tout ce dont j&#39;ai besoin dans un éditeur simple basé sur des blocs. Il possède un plugin pour les en-têtes, le code et même un moyen simple d&#39;ajouter des images à l&#39;éditeur sans nécessiter une infrastructure d&#39;hébergement. Jusqu&#39;à présent, il ne disposait pas d&#39;un moyen simple d&#39;ajouter des vidéos à l&#39;éditeur.

J&#39;ai pris le référentiel de plug <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> in <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> ai modifié (juste un peu) pour créer un <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> plug <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> in <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ( <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ). Maintenant, je peux facilement inclure des vidéos dans ce blog.

Si vous êtes familier avec EditorJS, il est assez simple d&#39;inclure dans vos projets. Il suffit de l&#39;installer comme suit

```
npm i simple-video-editorjs
```

Et ensuite, incluez-le dans votre projet comme bon vous semble.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

L&#39;éditeur propose des options simples vous permettant de configurer le mode d&#39;hébergement de la vidéo dans la page:

1. Lecture automatique - la vidéo sera-t-elle lue automatiquement lorsque la page sera chargée?
1. muet - le son de la vidéo n’est-il pas activé par défaut (nécessaire pour la lecture automatique)
1. contrôles - la vidéo aura-t-elle les contrôles HTML par défaut.

Vous trouverez ci-dessous un exemple rapide de vidéo intégrée (et montrant certaines des options).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

Quoi qu’il en soit, je me suis amusé à créer ce petit plugin. Ce n’était pas si difficile à créer et la seule chose que j’ai fait est de différer la conversion en base64 qui utilise des images simples et d’utiliser plutôt les URLs Blob.