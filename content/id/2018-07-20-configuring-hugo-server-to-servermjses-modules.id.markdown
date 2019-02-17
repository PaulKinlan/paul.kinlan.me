---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
Secara default, Hugo tidak melayani file .mjs dengan jenis konten yang benar. Bahkan tidak sampai baru-baru ini bahwa hugo bisa melayani lebih dari satu ekstensi file per mime-type. Sepertinya dengan v0.43 ini telah diperbaiki.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Baca posting lengkap](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

Kode di atas memungkinkan saya melayani file mjs untuk Modul ES dengan mime-type yang benar (modul catatan harus disajikan dengan 'teks / javascript'). Ini hanya diperlukan untuk pengujian lokal, hosting adalah masalah lain :)
