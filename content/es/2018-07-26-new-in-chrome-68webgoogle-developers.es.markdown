---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
Pete LePage escribe sobre cambios importantes para Agregar a la pantalla de inicio en Chrome

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[Leer publicación completa](https://developers.google.com/web/updates/2018/07/nic68).

Tenía sentimientos encontrados sobre esto porque mucha gente no maneja el evento `beforeinstallprompt`, significaba que, de repente, la cantidad de instalaciones de Web APK caería significativamente, pero creo que es lo correcto.

El objetivo es reducir el número de mensajes molestos que suceden en la web, y lo último que necesitamos en la industria es que aparezca un mensaje relativamente grande cuando creemos que el usuario podría querer instalar un PWA, en su lugar, ahora necesita piense en dónde y cuándo ** desea solicitar una instalación y debe hacerlo en respuesta a un gesto del usuario.

Lo bueno es que nosotros (Chrome) estamos introduciendo formas más ambientadas de dejar que el usuario sepa que se puede instalar una experiencia, ahora es la pequeña barra inferior que aparece en la primera carga, y con suerte en el futuro podemos explorar formas más sutiles de dejar que el usuario sepa que puede tomar medidas.
