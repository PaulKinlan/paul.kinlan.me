---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Мой сайт [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Он построен на [Hugo](https://gohugo.io) и размещен на [Zeit](https://zeit.co) . Я очень доволен настройкой, у меня почти мгновенные сборки и сверхбыстрая доставка контента CDN, и я могу делать все, что мне нужно, потому что мне не нужно управлять каким-либо состоянием.

Я создал [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) для этого сайта, а также мой [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) который позволяет мне быстро публиковать новый контент на моем статически размещенном сайте.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Так. Как я это сделал?

Это комбинация Firebase Auth против моего Github Repo, EditorJS для создания, редактирования содержимого (оно аккуратное) и Octokat.js для фиксации в репо, а затем интеграции Zeit с Github для создания моей сборки hugo. С этой настройкой я могу иметь полностью самостоятельно размещаемую статическую CMS, аналогично тому, как пользователь может создавать посты в CMS на основе базы данных, такой как Wordpress.

В этой статье я просто сосредоточусь на одной части инфраструктуры - передаче нескольких файлов на Github, потому что мне потребовалось немного времени, чтобы разобраться.

Весь код можно увидеть на моих [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) .

Если вы создаете веб-интерфейс, который должен фиксироваться непосредственно в Github, лучшая библиотека, которую я нашел, это Octokat - она работает с CORS и, похоже, обрабатывает всю поверхность API Github API.

Git может быть сложным зверем, когда дело доходит до понимания того, как работают дерево, ветви и другие части, поэтому я принял некоторые решения, которые облегчили его.

1. Я смогу только нажать на ветку master, известную как `heads/master` .
1. Я буду знать, где будут храниться определенные файлы (Хьюго заставляет меня иметь определенную структуру каталогов)


Учитывая это, общий процесс создания коммита с несколькими файлами выглядит следующим образом:

Получить ссылку на репо.

1. Получить ссылку на верхушку дерева на ветке `heads/master` .
1. Для каждого файла, который мы хотим зафиксировать, создайте `blob` а затем сохраните ссылки на идентификатор `sha` , путь, режим в массиве.
1. Создайте новый `tree` который содержит все `tree` для добавления к ссылке на `heads/master` дерева `heads/master` , и сохраните новый указатель `sha` на это дерево.
1. Создайте коммит, который указывает на это новое дерево, а затем нажмите на ветку `heads/master` .

Код в значительной степени следует за этим потоком. Поскольку я могу предположить структуру пути для определенных входных данных, мне не нужно создавать какой-либо сложный интерфейс или управление для файлов.

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

Дайте мне знать, если вы сделали что-то подобное со статическим хостингом. Я очень взволнован тем, что могу создать современный интерфейс для полностью серверной хостинг-инфраструктуры.

А как насчет Zeit?

Ну, теперь все как будто автоматически. Я использую `static-builder` для запуска команды hugo, и это почти все. :)