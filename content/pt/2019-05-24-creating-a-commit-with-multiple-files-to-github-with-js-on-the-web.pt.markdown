---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Meu site é [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . É construído com [Hugo](https://gohugo.io) e hospedado com [Zeit](https://zeit.co) . Estou muito feliz com a configuração, chego perto de versões instantâneas e entrega de conteúdo CDN super rápida e posso fazer todas as coisas que preciso porque não preciso gerenciar nenhum estado.

Eu criei um [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) para este site e também o meu [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) que me permite publicar rapidamente novos conteúdos para o meu site estaticamente hospedado.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Assim. Como eu fiz isso?

É uma combinação do Firebase Auth com o meu Github Repo, EditorJS para criar a edição do conteúdo (é legal) e o Octokat.js para se comprometer com o repo e, em seguida, com a integração do Github do Zeit para fazer o meu hugo build. Com essa configuração, posso ter um CMS estático totalmente auto-hospedado, semelhante a como um usuário pode criar postagens em um CMS com suporte de banco de dados, como o Wordpress.

Neste post, vou me concentrar apenas em uma parte da infraestrutura - cometer vários arquivos para o Github, porque demorei um pouco para trabalhar.

O código inteiro pode ser visto no meu [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) .

Se você está construindo uma UI da Web que precisa ser submetida diretamente ao Github, a melhor biblioteca que eu encontrei é Octokat - ela funciona com o CORS e parece lidar com toda a superfície da API da API do Github.

O Git pode ser uma fera complexa quando se trata de entender como a árvore, galhos e outras peças funcionam, então tomei algumas decisões que tornaram isso mais fácil.

1. Eu só serei capaz de empurrar para o branch master conhecido como `heads/master` .
1. Eu saberei onde certos arquivos serão armazenados (Hugo me obriga a ter uma estrutura de diretórios específica)


Com isso em mente, o processo geral para criar uma confirmação com vários arquivos é o seguinte:

Obtenha uma referência ao repo.

1. Obtenha uma referência à ponta da árvore na ramificação `heads/master` .
1. Para cada arquivo que desejamos confirmar, crie um `blob` e, em seguida, armazene as referências ao identificador, caminho e modo `sha` em uma matriz.
1. Crie um novo `tree` que contenha todos os blobs para adicionar à referência à dica da árvore `heads/master` e armazene o novo ponteiro `sha` para essa árvore.
1. Crie uma confirmação que aponte para essa nova árvore e, em seguida, pressione para a ramificação `heads/master` .

O código praticamente segue esse fluxo. Como posso assumir a estrutura do caminho para determinadas entradas, não preciso criar nenhuma interface do usuário ou gerenciamento complexo para os arquivos.

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

Deixe-me saber se você fez algo parecido com hospedagem estática. Estou muito empolgado por poder construir uma interface moderna para o que é uma infraestrutura de hospedagem totalmente sem servidor.

E quanto ao Zeit?

Bem, é meio que tudo automático agora. Eu uso o `static-builder` para executar o comando hugo e é basicamente isso. :)