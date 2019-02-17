---
slug: introduction-to-feature-policy
date: 2018-07-12T18:07:06.141Z
title: Introduction to Feature Policy
link: https://developers.google.com/web/updates/2018/06/feature-policy
tags: ['link', 'performance']
---
Eric Bidelman di pembaruan Web Pengembang Google, menulis:

> Building for the web is a rocky adventure. It's hard enough to build a top-notch web app that nails performance and uses all the latest best practices. It's even harder to keep that experience great over time. As your project evolves, developers come on board, new features land, and the codebase grows. That Great Experience &#x2122; you once achieved may begin to deteriorate and UX starts to suffer! Feature Policy is designed to keep you on track.
> 
> With Feature Policy, you opt-in to a set of "policies" for the browser to enforce on specific features used throughout your site. These policies restrict what APIs the site can access or modify the browser's default behavior for certain features.
> 
> Here are examples of things you can do with Feature Policy:
> 
> * Change the default behavior of autoplay on mobile and third party videos.
> * Restrict a site from using sensitive APIs like camera or microphone.
> * Allow iframes to use the fullscreen API.
> * Block the use of outdated APIs like synchronous XHR and document.write().
> * Ensure images are sized properly (e.g. prevent layout thrashing) and are not too big for the viewport (e.g. waste user's bandwidth).
> 
> Policies are a contract between developer and browser. They inform the browser about what the developer's intent is and thus, help keep us honest when our app tries to go off the rails and do something bad. If the site or embedded third-party content attempts to violate any of the developer's preselected rules, the browser overrides the behavior with better UX or blocks the API altogether.


[Baca pos lengkap](https://developers.google.com/web/updates/2018/06/feature-policy).

Saya tertarik untuk melihat bagaimana tanah ini. Saya khawatir bahwa pengembang tidak akan peduli tentang ini, atau bahwa mereka akan ditekan. Seperti yang saya katakan [di Twitter](https://twitter.com/Paul_Kinlan/status/1016445358401040386), saya khawatir tentang insentif dan kita perlu menggabungkan fakta bahwa fitur ini akan memungkinkan pengembang mengontrol sejumlah besar fitur yang tersedia yang baik mengambil memori, dapat memperlambat halaman ke bawah, atau secara tidak sengaja membocorkan privasi pengguna ke pihak ketiga yang disematkan, dengan hal-hal yang dapat dijual oleh pengembang ke bisnis mereka. Salah satu contohnya adalah bahwa ** jika ** Play Store pernah mencantumkan PWA, maka mereka dapat datang dengan serangkaian kebijakan yang secara otomatis diterapkan saat aplikasi diluncurkan, dan Anda sebagai pengembang akan menyetujui ini untuk manfaat berada di toko.

Saya senang melihat apa yang terjadi dengan API ini, dan saya ingin melihatnya diadopsi, bahkan jika itu hanya digunakan oleh pengembang untuk memastikan bahwa tim mereka tidak mundur.
