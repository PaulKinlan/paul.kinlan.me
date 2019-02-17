---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
tags: ['video editor', 'wasm', 'webrtc', 'getusermedia', 'pwa']
---


Sie sollten Videos nur über das Web im Browser erstellen und bearbeiten können. Es sollte möglich sein, eine Benutzeroberfläche ähnlich wie bei Screenflow bereitzustellen, mit der Sie ein Ausgabevideo erstellen können, das mehrere Videos, Bilder und Audio zu einem Video kombiniert, das zu Diensten wie YouTube hochgeladen werden kann.

Dieser Beitrag ist wirklich nur eine Absichtserklärung. Ich werde mit dem langen Prozess beginnen, herauszufinden, was auf der Plattform verfügbar ist und was nicht, und sehen, wie weit wir heute kommen können.

Während einiger Gedanken zu diesem Projekt hatte ich einen Moment von Carl Sagan - also, anstatt das Universum zu erfinden, um einen Apfelkuchen zu kreieren, muss ich zumindest alle Werkzeuge erstellen, um einen Videoeditor zu erstellen, besonders wenn ich aufnehmen möchte der Prozess es zu tun. Die Tatsache, dass dieser Beitrag existiert, ist, weil ich weiß, dass ich einige der Stücke an Ort und Stelle habe und bereit zu gehen.

Ich denke nicht, dass ich einen massiv monolithischen "Videoeditor" erstellen werde, der ein Geschäft für jemand anderen sein kann, aber ich habe vor, alles zu erarbeiten, was ich brauche, damit ich es leicht machen kann Erstelle tolle Videos im Internet und zeige vielen Leuten, was im Internet möglich ist.

Unten ist mein grober einseitiger Projektplan:


** Anwendungsfälle, die ich habe: **


* Normalerweise muss ich alle Gerätedemos für Google I / O und Chrome DevSummit aufzeichnen und die Overlays usw. hinzufügen. Jeder im Team sollte dies tun können.
* Das Team nimmt oft Screencasts auf und ich möchte es ihnen ermöglichen, dies schnell von einer einfachen Website aus zu tun und in der Lage zu sein, die endgültige Ausgabe zu bereinigen.
* Ich muss einige Produkte bauen, um scharf zu bleiben. ;)


**Eingang:**


* [p0] Nehmen Sie Audio von einem Mikrofon auf
* [p0] Video von einer Webkamera aufnehmen [fertig - siehe unten]
* [p0] Betten Sie externe Videos ein, die im Internet gehostet werden
* [p0] Zeichnen Sie den Desktop auf
* [p1] Zeichnen Sie einen Remote-Stream auf
* [p1] Zeichnen Sie ein & lt; canvas & gt; Element
* [p0] Laden Sie eine Datei vom lokalen Gerät
* [p1] Teilen Sie eine Datei vom lokalen Gerät (Android Share Intent)


**Manipulation:**


* [p1] Wasserzeichen hinzufügen
* [p1] Fügt dem Bild Filtereffekte hinzu
* [p0] Fügen Sie benutzerdefinierte Bilder als Ebenen hinzu
* [p0] Queue Videos und Overlay
* [p0] Überlagern Sie separate Spuren von Audio und Video
* [p1] Text zu bestimmten Zeiten überlagern
* [p0] Video auf Größe zuschneiden
* [p0] Aktivieren Sie die Positionierung und Größenanpassung des Videos
* [p0] Video / Audio kürzen
* [p0] Splice Video / Audio


**Ausgabe:**


* [p0] Videodatei im Webm-Format
* [p1] MTB-Informationen
* [p1] Videodatei im xyz-Format

[Code für dieses Video](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) [Demo](https://camera-recorder.glitch.me/)


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

