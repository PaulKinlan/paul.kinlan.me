---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
Ricky Mondello en el equipo de Safari recientemente compartió una nota sobre cómo Twitter está utilizando la especificación ./well-known/change-password.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

La función me pasó por completo, pero es una buena idea: dado un archivo en una ubicación bien conocida, ¿puede el navegador ofrecer una IU al usuario que le permita restablecer rápidamente su contraseña sin tener que navegar por la IU compleja del sitio?

La especificación es aparentemente simple: el archivo conocido simplemente contiene la URL para dirigir al usuario cuando quiere realizar la acción. Esto me lleva a pensar, ¿podemos ofrecer más de estas características?

* Una ubicación bien conocida para los modelos de consentimiento basados en GDPR (consentimiento de cookies): los propietarios del sitio podrían ofrecer un enlace a la página donde un usuario puede administrar y revocar potencialmente todas las cookies y otros elementos de consentimiento de datos.
* Una ubicación bien conocida para la administración de permisos del navegador: los propietarios de sitios pueden ofrecer un lugar rápido para que los usuarios puedan revocar permisos para cosas como ubicación geográfica, notificaciones y otras primitivas.
* Una ruta bien conocida para la eliminación de cuentas y cambios
* Una ruta bien conocida para la gestión de suscripciones a listas de correo.

La lista continúa ... Realmente me gusta la idea de que los archivos de redireccionamiento simples ayuden a los usuarios a descubrir acciones comunes de los usuarios, y una forma en que el navegador pueda resaltarlo.

* Actualización: * [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) un [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .