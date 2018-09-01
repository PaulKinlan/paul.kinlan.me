---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
Standardmäßig liefert Hugo keine .mjs-Dateien mit dem richtigen Inhaltstyp. In der Tat war es bis vor kurzem, dass hugo mehr als eine Dateierweiterung pro Mimetyp anbieten konnte. Es sieht aus wie mit v0.43 das wurde behoben.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[Vollständigen Beitrag lesen](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

Der obige Code ermöglicht es mir, mjs-Dateien für ES-Module mit dem richtigen Mime-Typ zu liefern (Hinweismodule müssen mit 'text / javascript' geliefert werden). Dies ist nur für lokale Tests erforderlich, Hosting ist ein anderes Problem :)
