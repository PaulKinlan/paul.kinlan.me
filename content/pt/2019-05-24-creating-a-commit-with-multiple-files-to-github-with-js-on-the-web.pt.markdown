---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Meu site é [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Ele foi construído com o [Hugo](https://gohugo.io) e hospedado com o [Zeit](https://zeit.co) . Estou muito feliz com a configuração, chego perto de compilações instantâneas e entrega de conteúdo super rápida com CDN e posso fazer tudo o que preciso, porque não preciso gerenciar nenhum estado.

Eu criei um [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) para este site e também o meu [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) que me permite publicar rapidamente novo conteúdo no meu site hospedado estaticamente.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Tão. Como eu fiz isso?

É uma combinação do Firebase Auth no meu Github Repo, EditorJS para criar, editar o conteúdo (é legal) e Octokat.js para confirmar o repo e, em seguida, a integração do Zeit no Github para fazer meu hugo build. Com essa configuração, sou capaz de ter um CMS estático totalmente auto-hospedado, semelhante à maneira como um usuário pode criar postagens em um CMS baseado em banco de dados como o Wordpress.

Neste post, focarei apenas uma parte da infraestrutura - enviando vários arquivos ao Github porque demorei um pouco para me exercitar.

O código inteiro pode ser visto em minhas [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) .

Se você estiver criando uma interface de usuário da Web que precisa se comprometer diretamente com o Github, a melhor biblioteca que eu encontrei é o Octokat - ela funciona com o CORS e parece lidar com toda a superfície da API da API do Github.

O Git pode ser um animal complexo quando se trata de entender como a árvore, os galhos e outras peças funcionam, então tomei algumas decisões que facilitavam as coisas.

1. Só poderei enviar para o ramo principal conhecido como `heads/master` .
1. Vou saber onde certos arquivos serão armazenados (Hugo me obriga a ter uma estrutura de diretórios específica)


Com isso em mente, o processo geral para criar uma confirmação com vários arquivos é o seguinte:

Obtenha uma referência ao repositório.

1. Obtenha uma referência à ponta da árvore no ramo `heads/master` .
1. Para cada arquivo que queremos confirmar, crie uma `blob` e, em seguida, armazene as referências ao identificador `sha` , caminho, modo em uma matriz.
1. Crie um novo `tree` que contenha todos os blobs a serem adicionados à referência na ponta da árvore do `heads/master` e armazene o novo ponteiro do `sha` nessa árvore.
1. Crie uma confirmação que aponte para essa nova árvore e pressione a ramificação `heads/master` .

O código praticamente segue esse fluxo. Como posso assumir a estrutura do caminho para certas entradas, não preciso criar nenhuma interface ou gerenciamento complexo para os arquivos.

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

Deixe-me saber se você fez algo semelhante com hospedagem estática. Estou muito animado por poder criar uma interface moderna para uma infraestrutura de hospedagem totalmente sem servidor.

E o Zeit?

Bem, agora é tudo automático. Eu uso o `static-builder` para executar o comando hugo e é isso mesmo. :)