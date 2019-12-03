---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
私のサイトは[entirely static](https://github.com/PaulKinlan/paul.kinlan.me)です。 [Hugo](https://gohugo.io)で構築され、 [Hugo](https://gohugo.io)でホストされてい[Zeit](https://zeit.co) 。私はセットアップにかなり満足しています。インスタントビルドと超高速CDNによるコンテンツ配信に近づき、状態を管理する必要がないため、必要なすべてのことを実行できます。

このサイトの[podcast creator](https://github.com/PaulKinlan/podcastinabox-editor)と、静的にホストされたサイトに新しいコンテンツをすばやく投稿できる[simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image)を作成しました。

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

そう。どうやってやったの？

これは、私のGithub Repoに対するFirebase Auth、コンテンツを編集するEditorJS（それはきちんとしている）、およびリポジトリにコミットするOctokat.jsと、Hugoビルドを行うZeitのGithub統合の組み合わせです。この設定により、ユーザーがWordpressのようなCMSを使用したデータベースに投稿を作成する方法と同様に、完全に自己ホスト型の静的CMSを作成できます。

この投稿では、インフラストラクチャの一部に焦点を当てるだけです。Githubに複数のファイルをコミットするのは、少し時間がかかったためです。

コード全体は、私の[repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90)で見ることができます。

Githubに直接コミットする必要があるWeb UIを構築している場合、私が見つけた最高のライブラリはOctokatです-CORSで動作し、Github APIのAPI面全体を処理するようです。

Gitは、ツリー、ブランチ、その他の部分がどのように機能するかを理解することになると、複雑な獣になる可能性があるので、それを簡単にする決定をしました。

1. `heads/master`として知られるmasterブランチにのみプッシュできます。
1.特定のファイルが保存される場所がわかります（Hugoは特定のディレクトリ構造を強制します）


それを念頭に置いて、複数のファイルでコミットを作成する一般的なプロセスは次のとおりです。

リポジトリへの参照を取得します。

1. `heads/master`ブランチのツリーの先端への参照を取得します。
1.コミットするファイルごとに`blob`を作成し、 `sha`識別子、パス、モードへの参照を配列に保存します。
1.すべてのブロブを含む新しい`tree`を作成して、 `heads/master`ツリーの先端への参照に追加し、このツリーへの新しい`sha`ポインターを`sha`ます。
1.この新しいツリーを指すコミットを作成し、 `heads/master`ブランチにプッシュします。

コードはほとんどそのフローに従います。特定の入力のパス構造を想定できるため、複雑なUIやファイルの管理を構築する必要はありません。

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

静的ホスティングで似たようなことをしたかどうかを教えてください。完全にサーバーレスのホスティングインフラストラクチャ向けの最新のフロントエンドを構築できることに非常に興奮しています。

Zeitはどうですか？

まあ、それは今やちょっと全自動です。私は`static-builder`を使用してhugoコマンドを実行しましたが、これで`static-builder`です。 :)