---
slug: building-a-video-editor-on-the-web-with-the-web
date: 2018-10-11T11:00:00Z
title: 'Building a video editor on the web. Part 0.'
video_url: /videos/video-editor-part-0.webm
---


Debería poder crear y editar videos usando solo la web en el navegador. Debería ser posible proporcionar una interfaz de usuario similar a Screenflow que le permita crear un video de salida que combine múltiples videos, imágenes y audio en un video que se puede cargar a servicios como YouTube.

Este post es realmente solo una declaración de intenciones. Voy a comenzar el largo proceso de averiguar qué está y qué no está disponible en la plataforma y ver qué tan lejos podemos llegar hoy.

Durante algunos pensamientos sobre este proyecto, tuve un momento de Carl Sagan, así que en lugar de inventar el universo para crear una tarta de manzana, necesito al menos crear todas las herramientas necesarias para construir un editor de video, especialmente si quiero grabar El proceso de hacerlo. El hecho de que exista esta publicación es porque sé que tengo algunas de las piezas en su lugar y listas para funcionar.

No creo que vaya a crear un "editor de video" masivamente monolítico, que puede ser un negocio para otra persona, pero planeo tratar de resolver todas las piezas que son necesarias para que sea más fácil cree excelentes videos en la web y, con suerte, muestre a mucha gente lo que es posible en la web.

A continuación se muestra mi plan de proyecto aproximado de una página:


** Casos de uso que tengo: **


* Normalmente tengo que grabar todas las demostraciones de dispositivos para Google I / O y Chrome DevSummit y agregar las superposiciones, etc. Todos los miembros del equipo deben poder hacer esto.
* El equipo a menudo graba screencasts y me gustaría permitirles hacerlo rápidamente desde un sitio web simple y poder limpiar la salida final.
* Necesito construir algunos productos para mantenerlos afilados. ;)


**Entrada:**


* [p0] Graba audio desde un micrófono
* [p0] Grabar video desde una cámara web [listo - ver más abajo]
* [p0] Incrustar videos externos alojados en la web.
* [p0] Graba el escritorio
* [p1] Graba un flujo remoto
* [p1] Grabar un & lt; lienzo & gt; elemento
* [p0] Cargar un archivo desde el dispositivo local
* [p1] Comparte un archivo desde el dispositivo local (intención de compartir en Android)


**Manipulación:**


* [p1] Añadir marcas de agua
* [p1] Añadir efectos de filtro a la imagen
* [p0] Añadir en imágenes personalizadas como capas
* [p0] Videos de cola y superposición
* [p0] Superponer pistas separadas de audio y video
* [p1] Superposición de texto en momentos específicos
* [p0] Cortar video a tamaño
* [p0] Habilita el posicionamiento y redimensionamiento del video.
* [p0] Recortar video / audio
* [p0] Splice video / audio


**Salida:**


* [p0] Archivo de video en formato webm.
* [p1] información de MTB
* [p1] Archivo de video en formato xyz

[Código para este video](https://glitch.com/edit/\#!/camera-recorder?path=script.js:1:0) [Demo]([https://camera-recorder.glitch.me/](https://camera-recorder.glitch.me/))


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

