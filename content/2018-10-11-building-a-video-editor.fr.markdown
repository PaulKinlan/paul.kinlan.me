---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
---


Vous devriez pouvoir créer et éditer des vidéos en utilisant uniquement le Web dans le navigateur. Il devrait être possible de fournir une interface utilisateur semblable à Screenflow qui vous permet de créer une sortie vidéo combinant plusieurs vidéos, images et son en une seule vidéo pouvant être téléchargée vers des services tels que YouTube.

Ce message est vraiment juste une déclaration d'intention. Je vais commencer le long processus consistant à déterminer ce qui est disponible ou non sur la plate-forme et à voir jusqu'où nous pouvons aller aujourd'hui.

Au cours de certaines réflexions sur ce projet, j’ai eu un moment Carl Sagan - au lieu d’inventer l’univers pour créer une tarte aux pommes, je dois au moins créer tous les outils nécessaires à la création d’un éditeur de vidéo, surtout si je veux enregistrer. le processus de le faire. Le fait que cet article existe est dû au fait que je sais que certaines de ces pièces sont en place et prêtes à fonctionner.

Je ne pense pas que je vais créer un "éditeur de vidéo" massivement monolithique, qui puisse être une affaire pour quelqu'un d'autre, mais je prévois d'essayer de mettre au point tous les éléments nécessaires pour pouvoir facilement Créez de superbes vidéos sur le Web et, espérons-le, montrez à beaucoup de gens ce qui est possible sur le Web.

Vous trouverez ci-dessous mon plan de projet approximatif d'une page:


** Cas d'utilisation que j'ai: **


* Je dois normalement enregistrer toutes les démonstrations d'appareils pour Google I / O et Chrome DevSummit, puis ajouter les incrustations, etc. Tous les membres de l'équipe doivent pouvoir le faire.
* L’équipe enregistre souvent des captures d’écran et j’aimerais leur permettre de le faire rapidement à partir d’un simple site Web et d’être en mesure de nettoyer la sortie finale.
* J'ai besoin de construire des produits pour rester forte. ;)


**Contribution:**


* [p0] Enregistrer le son d'un microphone
* [p0] Enregistrer une vidéo à partir d'une caméra Web [terminé - voir ci-dessous]
* [p0] Intégrer des vidéos externes hébergées sur le Web
* [p0] Enregistrez le bureau
* [p1] Enregistrer un flux distant
* [p1] Enregistrez une & lt; toile & gt; élément
* [p0] Charge un fichier depuis le périphérique local
* [p1] Partager un fichier à partir du périphérique local (intention de partage Android)


**Manipulation:**


* [p1] Ajouter des filigranes
* [p1] Ajouter des effets de filtre à l'image
* [p0] Ajouter des images personnalisées en tant que calques
* [p0] Mettre les vidéos en file d'attente et les superposer
* [p0] Superposition de pistes audio et vidéo séparées
* [p1] Texte superposé à des moments spécifiques
* [p0] Recadrer la vidéo à la taille
* [p0] Activer le positionnement et le redimensionnement de la vidéo
* [p0] Découper vidéo / audio
* [p0] Splice vidéo / audio


**Sortie:**


* [p0] Fichier vidéo au format webm
* [p1] VTT information
* [p1] Fichier vidéo au format xyz

[Code pour cette vidéo](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) [Démo]([https://camera-recorder.glitch.me/](https://camera-recorder.glitch.me/))


```javascript  
const init = () => {  
  let blobs;  
  let rec;  
  let stream;  
    
  captureBtn.onclick = async () => {  
    stream = await navigator.mediaDevices.getUserMedia({video: { width: 1280, 
height: 720 }, audio: true});

    videoElement.srcObject = stream;  
    let opts = {mimeType: 'video/webm; codecs=vp9,opus'};  
    blobs = [];  
    download.style.display = 'none'

    rec = new MediaRecorder(stream, opts);  
    rec.ondataavailable = (e) => blobs.push(e.data);  
    rec.onstop = async () => {  
      let blob = new Blob(blobs, {type: 'video/webm'});  
      let url = window.URL.createObjectURL(blob);  
      download.href = url;  
      download.download = 'test.webm';  
      download.style.display = 'block';  
    };  
    startBtn.disabled = false;  
    captureBtn.disabled = true;  
  };

  startBtn.onclick = () => {  
    startBtn.disabled = true;  
    stopBtn.disabled = false;  
    rec.start();  
  };

  stopBtn.onclick = () => {  
    captureBtn.disabled = false;  
    startBtn.disabled = true;  
    stopBtn.disabled = true;

    rec.stop();  
    stream.getTracks().forEach(s=>s.stop())  
    videoElement.srcObject = null  
    stream = null;  
  };  
};

window.addEventListener('load', init);  
```

