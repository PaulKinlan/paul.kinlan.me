---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Mi sitio es [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Está construido con [Hugo](https://gohugo.io) y alojado con [Zeit](https://zeit.co) . Estoy bastante contento con la configuración, obtengo compilaciones instantáneas y entrega de contenido CDN&#39;d súper rápida y puedo hacer todo lo que necesito porque no tengo que administrar ningún estado.

He creado un [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) para este sitio y también mi [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) que me permite publicar rápidamente contenido nuevo en mi sitio alojado estáticamente.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Asi que. Como lo hice

Es una combinación de Firebase Auth contra mi Github Repo, EditorJS para crear editar el contenido (es ordenado) y Octokat.js para comprometerse con el repositorio y luego la integración de Zeit&#39;s Github para hacer mi construcción hugo. Con esta configuración, puedo tener un CMS estático totalmente autohospedado, similar a cómo un usuario podría crear publicaciones en un CMS respaldado por una base de datos como Wordpress.

En esta publicación, me voy a centrar en una parte de la infraestructura: enviar varios archivos a Github porque me tomó un poco de tiempo hacer ejercicio.

El código completo se puede ver en mi [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) .

Si está creando una interfaz de usuario web que necesita comprometerse directamente con Github, la mejor biblioteca que he encontrado es Octokat: funciona con CORS y parece manejar toda la superficie API de la API de Github.

Git puede ser una bestia compleja cuando se trata de comprender cómo funcionan el árbol, las ramas y otras piezas, por lo que tomé algunas decisiones que lo hicieron más fácil.

1. Solo podré acceder a la rama maestra conocida como `heads/master` .
1. Sabré dónde se almacenarán ciertos archivos (Hugo me obliga a tener una estructura de directorio específica)


Con eso en mente, el proceso general para crear una confirmación con múltiples archivos es el siguiente:

Obtenga una referencia al repositorio.

1. Obtenga una referencia a la punta del árbol en la rama `heads/master` .
1. Para cada archivo que queremos confirmar, cree un `blob` y luego almacene las referencias al identificador de `sha` , ruta, modo en una matriz.
1. Cree un nuevo `tree` que contenga todos los blobs para agregar a la referencia a la punta del árbol `heads/master` y almacene el nuevo puntero `sha` a este árbol.
1. Cree una confirmación que apunte a este nuevo árbol y luego empuje a la rama `heads/master` .

El código sigue más o menos ese flujo. Debido a que puedo asumir la estructura de ruta para ciertas entradas, no necesito construir una interfaz de usuario compleja o administración para los archivos.

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

Avíseme si ha hecho algo similar con el alojamiento estático. Estoy muy emocionado de poder construir una interfaz moderna para lo que es una infraestructura de alojamiento completamente sin servidor.

¿Qué hay de Zeit?

Bueno, ahora es algo automático. Uso el `static-builder` para ejecutar el comando hugo y eso es todo. :)