---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
ਮੇਰੀ ਸਾਈਟ [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) ਇਹ [Hugo](https://gohugo.io) ਨਾਲ [Hugo](https://gohugo.io) ਅਤੇ [Zeit](https://zeit.co) ਨਾਲ ਹੋਸਟ ਕੀਤੀ ਗਈ ਹੈ ਮੈਂ ਸੈੱਟਅੱਪ ਤੋਂ ਬਹੁਤ ਖੁਸ਼ ਹਾਂ, ਮੈਨੂੰ ਤਤਕਾਲ ਬਿਲਡਜ਼ ਅਤੇ ਸੁਪਰ ਫਾਸਟ ਸੀ ਡੀ ਐਨ ਡੀ ਕੰਟੈਂਟ ਡਲਿਵਰੀ ਦੇ ਨਜ਼ਦੀਕ ਮਿਲਦਾ ਹੈ ਅਤੇ ਮੈਂ ਉਹ ਸਭ ਕੁਝ ਕਰ ਸਕਦਾ ਹਾਂ ਜੋ ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ ਕਿਉਂਕਿ ਮੈਨੂੰ ਕਿਸੇ ਵੀ ਰਾਜ ਦਾ ਪ੍ਰਬੰਧਨ ਨਹੀਂ ਕਰਨਾ ਪੈਂਦਾ

ਮੈਂ ਇਸ ਸਾਈਟ ਲਈ ਇੱਕ [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) ਅਤੇ ਮੇਰੇ [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) ਵੀ [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) ਹੈ ਜੋ ਮੈਨੂੰ ਮੇਰੀ ਸਥਿਰ ਮੇਜ਼ਬਾਨੀ ਵਾਲੀ ਸਾਈਟ ਤੇ ਛੇਤੀ ਹੀ ਨਵੀਂ ਸਮੱਗਰੀ ਪੋਸਟ ਕਰਨ ਦੇ ਸਮਰੱਥ ਬਣਾਉਂਦਾ ਹੈ.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

ਇਸ ਤਰ੍ਹਾਂ ਮੈਂ ਇਹ ਕਿਵੇਂ ਕੀਤਾ?

ਇਹ ਮੇਰੇ ਗਿੱਠੁਬ ਰੈਪੋ ਦੇ ਵਿਰੁੱਧ ਫਾਇਰਬੇਸ ਐਥ ਦਾ ਇੱਕ ਸੰਜੋਗ ਹੈ, ਸੰਪਾਦਕ ਨੂੰ ਸੰਖੇਪ (ਇਹ ਸਾਫ਼-ਸੁਥਰੀ ਹੈ) ਅਤੇ ਓਕੋਕੈਟ.ਜੇਜ਼ ਨੂੰ ਰੈਪੋ ਦੇਣ ਲਈ ਅਤੇ ਫਿਰ ਮੇਰੇ ਹੂਗੋ ਬਿਲਡ ਨੂੰ ਕਰਨ ਲਈ ਜ਼ੀਟ ਦੇ ਗਿਥਬ ਐਂਟੀਗਰੇਸ਼ਨ ਨੂੰ ਬਣਾਉਣਾ. ਇਸ ਸਥਾਪਿਤ ਹੋਣ ਦੇ ਨਾਲ, ਮੈਂ ਪੂਰੀ ਤਰਾਂ ਸਵੈ-ਸਥਿਰ ਸਥਿਰ ਸੀਐਮਐਸ ਬਣਾ ਸਕਦਾ ਹਾਂ, ਜਿਵੇਂ ਕਿ ਇੱਕ ਉਪਭੋਗਤਾ, Wordpress ਵਰਗੇ CMS ਦੀ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਡੇਟਾਬੇਸ ਵਿੱਚ ਪੋਸਟਾਂ ਕਿਵੇਂ ਬਣਾ ਸਕਦਾ ਹੈ.

ਇਸ ਅਹੁਦੇ &#39;ਤੇ ਮੈਂ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਇਕ ਹਿੱਸੇ&#39; ਤੇ ਧਿਆਨ ਕੇਂਦਰਤ ਕਰਨ ਜਾ ਰਿਹਾ ਹਾਂ- ਗਿੱਠਬ ਵਿਚ ਬਹੁਤੀਆਂ ਫਾਈਲਾਂ ਬਣਾ ਰਿਹਾ ਹਾਂ ਕਿਉਂਕਿ ਇਸ ਨੇ ਮੈਨੂੰ ਕੰਮ ਕਰਨ ਲਈ ਥੋੜਾ ਸਮਾਂ ਲਗਾ ਲਿਆ.

ਸਾਰਾ ਕੋਡ ਮੇਰੇ [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) ਤੇ ਵੇਖਿਆ ਜਾ ਸਕਦਾ ਹੈ.

ਜੇ ਤੁਸੀਂ ਇਕ ਵੈੱਬ UI ਬਣਾ ਰਹੇ ਹੋ ਜਿਸ ਨੂੰ ਸਿੱਧੇ ਤੌਰ &#39;ਤੇ ਗਿੱਠੂਬ ਵਿਚ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਹੈ, ਤਾਂ ਮੈਨੂੰ ਮਿਲ ਗਈ ਵਧੀਆ ਲਾਇਬ੍ਰੇਰੀ ਆਕੌਕੈਟ ਹੈ- ਇਹ CORS ਨਾਲ ਕੰਮ ਕਰਦੀ ਹੈ ਅਤੇ ਇਹ ਗਿੱਠੂਬ ਏਪੀਆਈ ਦੀ ਪੂਰੀ API ਸਫਾਈ ਨੂੰ ਸੰਭਾਲਣ ਲਗਦੀ ਹੈ.

ਜਦੋਂ ਇਹ ਦਰਸਾਉਣ ਦੀ ਗੱਲ ਆਉਂਦੀ ਹੈ ਕਿ ਰੁੱਖ, ਬਰਾਂਚਾਂ ਅਤੇ ਹੋਰ ਟੁਕੜੇ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ ਤਾਂ ਗੀਟ ਇੱਕ ਗੁੰਝਲਦਾਰ ਜਾਨਵਰ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਮੈਂ ਕੁਝ ਫੈਸਲੇ ਲਏ ਜਿਨ੍ਹਾਂ ਨੇ ਇਸਨੂੰ ਆਸਾਨ ਬਣਾ ਦਿੱਤਾ ਹੈ.

1. ਮੈਂ ਕੇਵਲ `heads/master` ਵਜੋਂ ਜਾਣੇ ਜਾਣ ਵਾਲੇ ਮਾਸਟਰ ਬ੍ਰਾਂਚ ਵਿੱਚ ਧੱਕਣ ਦੇ ਯੋਗ `heads/master` .
1. ਮੈਨੂੰ ਪਤਾ ਹੋਵੇਗਾ ਕਿ ਕੁੱਝ ਫਾਈਲਾਂ ਕਿੱਥੇ ਸਟੋਰ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ (ਹੂਗੋ ਮੈਨੂੰ ਇੱਕ ਖਾਸ ਡਾਇਰੈਕਟਰੀ ਢਾਂਚਾ ਬਣਾਉਣ ਲਈ ਮਜ਼ਬੂਰ ਕਰਦਾ ਹੈ)


ਇਸਦੇ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦੇ ਹੋਏ, ਬਹੁਤੀਆਂ ਫਾਈਲਾਂ ਦੇ ਨਾਲ ਇੱਕ ਕਮਿਟ ਬਣਾਉਣ ਦੀ ਆਮ ਪ੍ਰਕਿਰਿਆ ਇਸ ਪ੍ਰਕਾਰ ਹੈ:

ਰੇਪੋ ਲਈ ਇੱਕ ਹਵਾਲਾ ਲਵੋ

1. `heads/master` ਬ੍ਰਾਂਚ ਤੇ ਦਰਖਤ ਦੀ ਟਿਪਣ ਲਈ ਇੱਕ ਹਵਾਲਾ ਲਵੋ.
1. ਹਰੇਕ ਫਾਈਲ ਲਈ ਜਿਸਨੂੰ ਅਸੀਂ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ ਇੱਕ `blob` ਅਤੇ ਫਿਰ ਹਵਾਲੇ ਇੱਕ `blob` ਵਿੱਚ `sha` ਪਛਾਣਕਰਤਾ, ਮਾਰਗ, ਮੋਡ ਨੂੰ ਸਟੋਰ ਕਰੋ.
1. ਇੱਕ ਨਵਾਂ `tree` ਬਣਾਓ ਜਿਸ ਵਿੱਚ ਸਾਰੇ `tree` ਸ਼ਾਮਿਲ ਹਨ ਜੋ `heads/master` ਟ੍ਰੀ ਦੇ `heads/master` ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਸ਼ਾਮਿਲ ਕਰਨ, ਅਤੇ ਇਸ ਰੁੱਖ ਨੂੰ ਨਵੇਂ `sha` ਪੁਆਇੰਟਰ ਨੂੰ ਸਟੋਰ ਕਰਦੇ ਹਨ.
1. ਇੱਕ ਕਮਿਟ ਬਣਾਉ ਜੋ ਇਸ ਨਵੇਂ ਰੁੱਖ ਨੂੰ `heads/master` ਅਤੇ ਫਿਰ `heads/master` ਬ੍ਰਾਂਚ ਨੂੰ ਧੱਕਦੀ ਹੈ.

ਕੋਡ ਕਾਫੀ ਹੱਦ ਤੱਕ ਇਸ ਪ੍ਰਕ੍ਰਿਆ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ. ਕਿਉਂਕਿ ਮੈਂ ਕੁਝ ਚੀਜ਼ਾਂ ਲਈ ਪਾਥ ਢਾਂਚਾ ਮੰਨ ਸਕਦਾ ਹਾਂ, ਮੈਨੂੰ ਫਾਈਲਾਂ ਲਈ ਕੋਈ ਗੁੰਝਲਦਾਰ UI ਜਾਂ ਪ੍ਰਬੰਧਨ ਬਣਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ.

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

ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਕੀ ਤੁਸੀਂ ਸਟੇਟਿਕ ਹੋਸਟਿੰਗ ਦੇ ਨਾਲ ਕੁਝ ਵੀ ਕੀਤਾ ਹੈ ਮੈਂ ਬਹੁਤ ਖੁਸ਼ ਹਾਂ ਕਿ ਮੈਂ ਇੱਕ ਆਧੁਨਿਕ ਫਰੰਟਐਂਡ ਬਣਾ ਸਕਦਾ ਹਾਂ ਜੋ ਇੱਕ ਪੂਰੀ ਸਰਵਰ-ਘੱਟ ਹੋਸਟਿੰਗ ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਹੈ.

ਜਾਇਤ ਬਾਰੇ ਕੀ?

ਠੀਕ ਹੈ, ਹੁਣੇ ਹੁਣੇ ਇਹ ਸਿਰਫ ਆਪਣੇ ਆਪ ਹੀ ਆਟੋਮੈਟਿਕ ਹੈ. ਮੈਨੂੰ ਵਰਤਣ `static-builder` Hugo ਹੁਕਮ ਨੂੰ ਚਲਾਉਣ ਲਈ ਅਤੇ ਇਹ ਹੈ ਜੋ ਇਸ ਨੂੰ ਪਰੈਟੀ ਬਹੁਤ ਕੁਝ ਹੈ. :)