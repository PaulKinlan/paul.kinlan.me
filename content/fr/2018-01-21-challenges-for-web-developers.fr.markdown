---
slug: challenges-for-web-developers
date: 2018-01-21T13:20:31+01:00
title: "Challenges for web developers"
description: "Summary of the challenges that I beleive we developers face every day."
---


A l'origine, j'ai écrit ceci pour décrire les défis de l'écosystème de développement plus large que mon équipe (Chrome et Web Developer Relations) doit relever pour aider le secteur à prospérer, afin d'aider davantage de personnes à construire sur le Web et à aider. les développeurs construisent des expériences que plus de gens aiment utiliser.

Après avoir partagé le manifeste [Web et Chrome DevRel](/ web-developer-relations-manifesto /), je voulais continuer à partager mes réflexions sur certains des défis que nous souhaitons aider les développeurs à résoudre.

En fait, je n'ai pas envoyé cet article, mais maintenant que j'ai du temps et que c'est la nouvelle année, j'ai pensé que ce serait un bon moment pour partager cela.

Comprendre les défis auxquels les développeurs sont confrontés chaque jour m'aide à déterminer comment nous pouvons changer la façon dont nous travaillons pour aider autant de développeurs que possible.

J'aimerais vos commentaires. Ai-je tort? Voyez-vous des problèmes d'écosystèmes plus larges que j'ai manqués?

Je ferai des articles plus approfondis sur nombre de ces problèmes.

## Web Development est facile à démarrer, mais difficile à faire progresser et à maîtriser

* Le support des API variables et les priorités des fournisseurs rendent les expériences cohérentes difficiles ou impossibles à construire. * Les considérations héritées du passé, par exemple les anciens systèmes de gestion de contenu, les implémentations existantes, impliquent un énorme élan qui doit être surmonté. * Les problèmes de plate-forme et de compatibilité entraînent une énorme frustration et des quantités inutiles de tests supplémentaires. * Il y a un grand nombre d'abstractions créées qui éloignent les développeurs de la compréhension de la plate-forme. * Absence de primitives au niveau de la plate-forme pour les interactions de type application: vues, modèles, contrôleurs, recycleurs, transitions de héros, transitions de vue. * Les développeurs Web doivent être performants: hors ligne, accessibilité, localisation, performance, sécurité ...

## Les développeurs sont enthousiasmés par PWA, mais ils peuvent être difficiles à construire et difficiles à bien faire

* L'absence de prise en charge du navigateur principal pour les PWA rend difficile la justification de la création d'une application * De bout en bout, il est trop difficile de créer une application Web progressive. HTTPS, les travailleurs du service sont difficiles à démarrer. * La valeur de PWA n’est pas clairement définie, en particulier dans les systèmes d’exploitation (Safari, Desktop, etc.) et c’est une raison simple de ne pas l’adopter. * Il est presque impossible de construire une "PWA exemplaire" et personne ne se soucie vraiment de leur choix. * Les développeurs doivent souvent redémarrer et ne pas migrer leurs expériences existantes. * Les développeurs et les entreprises ne savent pas pourquoi ils devraient créer une application Web progressive. * La facilité de recherche des applications Web existantes est un problème majeur. * "Progressif" n'est pas valorisé. Difficile d’offrir une expérience / des fonctionnalités cohérentes manquantes dans les différents navigateurs / systèmes d’exploitation Web * Les applications Web progressives en cours de création ne sont pas réactives et augmentent donc les coûts de maintenance puisque vous devez vous occuper d’un site de bureau distinct

## Il est trop difficile de créer une expérience qui fonctionne bien (UI / UX)

* La barre assez bonne pour les développeurs est trop faible. Ce qui est bon? Pourquoi c'est important? Comment vous y rendre? * Il est facile d'être un mauvais acteur lorsque des composants, A11Y, la mise en page et les performances sont difficiles à construire et non hiérarchisés par les développeurs * Les développeurs ne voient pas la valeur des composants Web et des outils de plate-forme ne croyez pas que les composants Web doivent être utilisés et que cela peut ne pas être correct - les développeurs ne le savent pas * Les développeurs veulent une structure d’interface comme Bootstrap pour éliminer les douleurs de l’interface utilisateur et leur permettre de se concentrer sur le produit de nombreuses expériences sont trop difficiles à construire et à construire: menus, nav, transitions, prises de contrôle, reliure de données, vues, contrôleurs * Il est difficile de construire des expériences performantes - Les primitives sont un problème (la plate-forme n'a pas ou ils sont là mais personne ne sait ou se soucie) * Une prise en charge inégale des animations de type API rend impossible aux développeurs d’adopter de nouvelles primitives de plate-forme - les primitves sont normalement fondamentaux et pratiquement impossibles à reproduire il

## C'est trop dur de construire un site rapide

* Les développeurs Web développent des expériences lentes avec de terribles UX et qui ne sont pas accessibles. Ils veulent faire mieux, mais ils ne savent pas comment * Les développeurs et les entreprises ne donnent pas la priorité aux performances car il n'y a pas de nouvelles directives claires sur l'impact que cela peut avoir sur leur entreprise * Les développeurs ne comprennent pas pourquoi un site est lent * est trop difficile de construire un site de chargement rapide - il y a beaucoup de footguns et de nombreux navigateurs * Les développeurs ne savent pas à quels objectifs ils doivent viser * Les développeurs ne disposent pas des conseils nécessaires pour atteindre les objectifs qui leur sont assignés (Le modèle PRPL, le découpage basé sur l'itinéraire, le streaming sont des problèmes marginaux en ce moment et n'ont pas de documents concrets, etc.) * Les outils et les frameworks de développeur ne sont pas rapides et les développeurs ne savent pas DX & gt; UX * Les développeurs ne testent pas le matériel sur lequel leurs utilisateurs s'exécutent et se sentent donc «suffisamment bons» * Les développeurs ne disposent pas de toutes les informations sur leur base d'utilisateurs et de l'impact de leurs décisions. plus qu’ils ne donnent la priorité aux performances «in page» * Il est trop difficile de faire fonctionner l’interface utilisateur de votre site sur tous les périphériques. * L’impression publique augmente et met les développeurs à l’abri de tout souci. tout le temps et donc éteindre

## Il est trop difficile de construire un site sécurisé

* La migration vers les HTTPs est un bloqueur pour l'adoption de nombreuses nouvelles technologies * Les développeurs et les entreprises ne voient pas la nécessité de sécuriser leurs sites (par exemple, pourquoi ai-je besoin d'un site de nouvelles?) * Difficile à définir up HTTPS * Il peut encore être coûteux pour les développeurs de configurer un site HTTPS - tout le monde ne peut pas utiliser LetsEncrypt. Les grands et les petits sites doivent payer beaucoup plus pour le privilège * Les développeurs ne comprennent pas la valeur des «technologies sécurisées» telles que le CSP et leur adoption est faible

## Les entreprises et les développeurs ne savent pas pourquoi ils devraient "Web"

* Il est difficile de convertir un utilisateur sur le Web mobile, ce qui complique la tâche. * Les analyses de rentabilisation et les besoins varient selon les régions, les secteurs et les publics. Il semble que vous ne devriez pas utiliser le Web * Le Web ne fait que passer à un modèle d’application, alors pourquoi ne pas simplement faire l’application? Le manque de prise en charge multi-navigateur des principales API empêche les entreprises de justifier leurs investissements. effacer la valeur du Web quand il y a tellement de plates-formes concurrentes

## Le web est grumeleux et cause beaucoup de douleur aux développeurs

* Les navigateurs changent fréquemment via des ajouts ou des suppressions tactiques de la plate-forme Web et ils ne savent pas ce qui se passe, comment rester à jour ou comment changer. Cela cause de la douleur aux développeurs * Chrome brise constamment la plate-forme avec ses "interventions" * Les cycles de mise à jour du navigateur créent de l'incertitude et des "sables variables" * Les lecteurs de la plateforme ne sont pas tous alignés. Safari, UC, Edge et différentes priorités * Les développeurs doivent tout faire fonctionner partout (d'iOS à UC Browser) et ils disposent des outils, des conseils ou des données pour sauvegarder leurs décisions.

## Le Web est un écosystème dynamique, mais bruyant

* Un grand nombre d'opinions est généré chaque jour et les meilleures pratiques sont définies qui ne sont ni précises ni exhaustives et les développeurs se tournent vers Google et d'autres pour présenter un guide unifié * Il existe un grand nombre d'outils, de bibliothèques et de frameworks Built et les développeurs ne savent pas quoi choisir * Google a un grand nombre de frameworks et les développeurs ne savent pas trop quoi utiliser * Nous créons beaucoup de contenu et il n'est pas présenté de manière uniforme * Beaucoup d'outils et de développeurs concurrents ne sont pas savoir ce qu'ils devraient utiliser * De nombreux frameworks et développeurs concurrents ne savent pas à quoi ils doivent recourir * De nombreux conseils et développeurs concurrents ne savent pas à quoi ils doivent suivre ou faire confiance

## Le web est mondial

* Les développeurs ne sont pas seulement anglophones. De nombreux développeurs viennent de pays que nous n'avons jamais ciblés: Chine, Inde, Indonésie, Thaïlande, Pakistan, etc. et nous devons les aider * De nombreux développeurs occidentaux voient les expériences «Lite» comme des «marchés émergents» et ne sont pas très fidèles

### Mises à jour Edit 1 (23-Jan-2018): Ajout d'une note en haut de la page.

Edit 2 (28-Jan-2018): Nettoyage de quelques bits.
