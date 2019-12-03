---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Mon site est [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Il est construit avec [Hugo](https://gohugo.io) et hébergé avec [Zeit](https://zeit.co) . Je suis assez content de la configuration, je reçois des versions quasi-instantanées et une livraison de contenu CDN très rapide, et je peux faire tout ce dont j&#39;ai besoin car je ne dois gérer aucun état.

J&#39;ai créé un [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) pour ce site ainsi que mon [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) qui me permet de publier rapidement un nouveau contenu sur mon site hébergé de manière statique.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Alors. Comment l&#39;ai-je fait?

C’est une combinaison de Firebase Auth et de mon Repo Github, EditorJS pour créer le contenu (c’est soigné) et Octokat.js pour s’engager dans le repo, puis de l’intégration Github de Zeit pour effectuer ma construction hugo. Avec cette configuration, je peux avoir un CMS statique entièrement auto-hébergé, similaire à la manière dont un utilisateur peut créer des publications dans un CMS sauvegardé sur une base de données comme Wordpress.

Dans cet article, je vais me concentrer sur une partie de l&#39;infrastructure, à savoir l&#39;envoi de plusieurs fichiers à Github, car il m&#39;a fallu un peu de temps pour y arriver.

Le code entier peut être vu sur mon [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) .

Si vous construisez une interface Web qui doit s’engager directement dans Github, la meilleure bibliothèque que j’ai trouvée est Octokat. Elle fonctionne avec CORS et semble gérer l’ensemble de la surface de l’API de Github.

Git peut être une bête complexe quand il s&#39;agit de comprendre le fonctionnement de l&#39;arbre, des branches et d&#39;autres éléments, j&#39;ai donc pris des décisions qui ont facilité la tâche.

1. Je ne pourrai que pousser sur la branche principale connue sous le nom de `heads/master` .
1. Je saurai où certains fichiers seront stockés (Hugo me force à avoir une structure de répertoires spécifique)


Dans cet esprit, le processus général pour créer un commit avec plusieurs fichiers est le suivant:

Obtenez une référence au repo.

1. Obtenez une référence à la pointe de l’arbre sur la branche `heads/master` .
1. Pour chaque fichier que nous voulons valider, créez un `blob` , puis stockez les références à l&#39;identificateur, au chemin d&#39;accès et au mode de `sha` dans un tableau.
1. Créez un nouveau `tree` contenant tous les blobs à ajouter à la référence au sommet de l’arbre `heads/master` et stockez le nouveau pointeur `sha` dans cet arbre.
1. Créez un commit qui pointe vers cette nouvelle arborescence, puis appuyez sur la branche `heads/master` .

Le code suit à peu près ce flux. Comme je peux assumer la structure du chemin pour certaines entrées, je n&#39;ai pas besoin de créer d&#39;interface utilisateur ni de gestion complexe pour les fichiers.

```JavaScript
const createCommit = async (repositoryUrl, filename, data, images, commitMessage, recording) => {
  try {
    const token = localStorage.getItem('accessToken');
    const github = new Octokat({ 'token': token });
    const [user, repoName] = repositoryUrl.split('/');

    if(user === null || repoName === null) {
      alert('Please specifiy a repo');
      return;
    }
    
    const markdownPath = `site/content/${filename}.markdown`.toLowerCase();
    let repo = await github.repos(user, repoName).fetch();
    let main = await repo.git.refs('heads/master').fetch();
    let treeItems = [];

    for(let image of images) {
      let imageGit = await repo.git.blobs.create({ content: image.data, encoding: 'base64' });
      let imagePath = `site/static/images/${image.name}`.toLowerCase();
      treeItems.push({
        path: imagePath,
        sha: imageGit.sha,
        mode: "100644",
        type: "blob"
        });
    }

    if (recording) {
      let audioGit = await repo.git.blobs.create({ content: recording.data, encoding: 'base64' });
      let audioPath = `site/static/audio/${recording.name}.${recording.extension}`.toLowerCase();
      treeItems.push({
        path: audioPath,
        sha: audioGit.sha,
        mode: "100644",
        type: "blob"
        });
    }

    let markdownFile = await repo.git.blobs.create({ content: btoa(jsonEncode(data)), encoding: 'base64' });
    treeItems.push({
      path: markdownPath,
      sha: markdownFile.sha,
      mode: "100644",
      type: "blob"
    });

    let tree = await repo.git.trees.create({
      tree: treeItems,
      base_tree: main.object.sha
    });
  
    let commit = await repo.git.commits.create({
      message: `Created via Web - ${commitMessage}`,
      tree: tree.sha,
      parents: [main.object.sha]});

    main.update({sha: commit.sha})

    logToToast('Posted');
  } catch (err) {
    console.error(err);
    logToToast(err);
  }
}
```

Faites-moi savoir si vous avez fait quelque chose de similaire avec l&#39;hébergement statique. Je suis très heureux de pouvoir construire une interface moderne pour une infrastructure d&#39;hébergement entièrement sans serveur.

Qu&#39;en est-il de Zeit?

Eh bien, c&#39;est juste un peu tout automatique maintenant. J&#39;utilise `static-builder` pour exécuter la commande hugo et c&#39;est à peu près tout. :)