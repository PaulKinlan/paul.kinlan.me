---
slug: configuring-hugo-server-to-servermjses-modules
date: 2018-07-20T14:17:29.072Z
title: "Configuring hugo server to serve 'mjs' ES modules"
link: https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5
tags: [links, hugo, es modules, javascript]
---
முன்னிருப்பாக ஹ்யூகோ சரியான உள்ளடக்க வகையுடன் .mjs கோப்புகளைப் பரிமாறாது. உண்மையில், சமீபத்தில் வரை ஹ்யூகோ ஒரு MIME வகைக்கு ஒன்றுக்கும் மேற்பட்ட கோப்பு நீட்டிப்புகளை வழங்க முடியும். இது v0.43 உடன் தெரிகிறது, இது சரி செய்யப்பட்டது.

> [mediaTypes]
>   [mediaTypes."text/javascript"]
>      suffixes = ["js", "mjs"]


[முழு இடுகையைப் படிக்கவும்](https://github.com/PaulKinlan/paul.kinlan.me/commit/43224a694d420fa5ede1e9e6eda042a562d5a6c5).

மேலே உள்ள குறியீடு சரியான MIME வகை (குறிப்பு தொகுதிகள் 'உரை / ஜாவாஸ்கிரிப்ட்' உடன் வழங்கப்பட வேண்டும்) உடன் ES Modules க்கான mjs கோப்புகளைப் பரிமாற உதவுகிறது. இந்த உள்ளூர் சோதனை தேவைப்படுகிறது, ஹோஸ்டிங் மற்றொரு சிக்கல் :)
