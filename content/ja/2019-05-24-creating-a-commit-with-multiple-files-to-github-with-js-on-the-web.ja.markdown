---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
私のサイトは[entirely static](https://github.com/PaulKinlan/paul.kinlan.me)です。それは[Hugo](https://gohugo.io)で構築され、 [Hugo](https://gohugo.io)でホストされてい[Zeit](https://zeit.co) 。私はセットアップにとても満足していて、インスタントビルドと超高速CDNによるコンテンツ配信に近づいています。また、状態を管理する必要がないので、必要なことはすべて実行できます。

このサイト用の[podcast creator](https://github.com/PaulKinlan/podcastinabox-editor)と、静的にホストされたサイトに新しいコンテンツをすばやく投稿できるようにするための[simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image)を作成しました。

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

そう。どうやってやったの？

それは私のGithubリポジトリに対するFirebase認証、コンテンツを編集するためのEditorJS（それはきれいです）、そしてリポジトリにコミットするためのOctokat.jsそして私のHugoビルドを行うためのZeitのGithub統合の組み合わせです。これで、Wordpressのようにデータベースで保護されたCMSでユーザーが投稿を作成するのと同じように、完全に自己管理型の静的CMSを作成できます。

この記事では、インフラストラクチャの一部、つまり複数のファイルをGithubにコミットすることに集中していきます。

コード全体は私の[repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90)で見ることができます。

Githubに直接コミットする必要があるWeb UIを構築している場合、私が見つけた最高のライブラリはOctokatです。これはCORSと連携し、Github APIのAPIサーフェス全体を処理するようです。

ツリー、ブランチ、その他の部分がどのように機能するのかを理解することになると、Gitは複雑な獣になる可能性があるので、それを簡単にするいくつかの決定を下しました。

1. `heads/master`呼ばれるマスターブランチにしかプッシュでき`heads/master` 。
1.私は特定のファイルがどこに格納されるか知っているでしょう（Hugoは私に特定のディレクトリ構造を持たせるように強制します）


それを念頭に置いて、複数のファイルでコミットを作成する一般的なプロセスは次のとおりです。

リポジトリへの参照を取得します。

1. `heads/master`ブランチのツリーの先端への参照を取得します。
1.コミットしたいファイルごとに`blob`を作成してから、 `sha` ID、パス、モードへの参照を配列に保管します。
1. `heads/master`ツリーの先端への参照に追加するすべての`tree`を含む新しい`tree`を作成し、新しい`sha`ポインタをこのツリーに`sha`ます。
1.この新しいツリーを指すコミットを作成してから、 `heads/master`ブランチにプッシュします。

コードはその流れにほぼ従っています。特定の入力に対してパス構造を想定できるので、複雑なUIやファイルの管理を構築する必要はありません。

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

静的ホスティングで同様のことをしたかどうかを教えてください。私は、完全にサーバーレスのホスティングインフラストラクチャのための現代のフロントエンドを構築できることをとても嬉しく思います。

Zeitはどうですか？

まあ、それはちょっとすべて自動です。 hugoコマンドを実行するために`static-builder`を使用し`static-builder`たが、それはほとんど問題ありません。 :)