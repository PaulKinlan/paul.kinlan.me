---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
ਮੇਰੀ ਸਾਈਟ [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . ਇਹ [Hugo](https://gohugo.io) ਨਾਲ ਬਣਾਇਆ ਗਿਆ ਹੈ ਅਤੇ [Hugo](https://gohugo.io) ਨਾਲ ਹੋਸਟ ਕੀਤਾ [Zeit](https://zeit.co) . ਮੈਂ ਸੈੱਟਅਪ ਤੋਂ ਬਹੁਤ ਖੁਸ਼ ਹਾਂ, ਮੈਂ ਤਤਕਾਲ ਬਿਲਡਜ਼ ਅਤੇ ਸੁਪਰ ਫਾਸਟ ਸੀਡੀਐਨ ਡੀ ਸਮੱਗਰੀ ਡਿਲਿਵਰੀ ਦੇ ਨੇੜੇ ਹਾਂ ਅਤੇ ਮੈਂ ਉਹ ਸਭ ਕੁਝ ਕਰ ਸਕਦਾ ਹਾਂ ਜਿਨ੍ਹਾਂ ਦੀ ਮੈਨੂੰ ਜ਼ਰੂਰਤ ਹੈ ਕਿਉਂਕਿ ਮੈਨੂੰ ਕਿਸੇ ਵੀ ਰਾਜ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਨਹੀਂ ਹੈ.

ਮੈਂ ਇਸ ਸਾਈਟ ਲਈ ਇੱਕ [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) ਬਣਾਇਆ ਹੈ ਅਤੇ ਇਹ ਵੀ ਮੇਰਾ [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) ਜੋ ਮੇਰੀ ਸਥਿਰ ਮੇਜ਼ਬਾਨੀ ਵਾਲੀ ਸਾਈਟ ਤੇ ਨਵੀਂ ਸਮੱਗਰੀ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਪੋਸਟ ਕਰਨ ਦੇ ਯੋਗ ਕਰਦਾ ਹੈ.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

ਸੋ. ਮੈਂ ਇਹ ਕਿਵੇਂ ਕੀਤਾ?

ਇਹ ਮੇਰੇ ਗਿਤੁਬ ਰੈਪੋ, ਐਡੀਟਰ ਜੇਐਸ ਦੇ ਵਿਰੁੱਧ ਫਾਇਰਬੇਸ uthਥ ਦਾ ਸੁਮੇਲ ਹੈ ਜੋ ਸਮੱਗਰੀ ਨੂੰ ਸੋਧਣ ਲਈ ਤਿਆਰ ਕਰਦਾ ਹੈ (ਇਹ ਸਾਫ ਹੈ) ਅਤੇ ਓਕਟੋਕਾਟ.ਜਜ਼ ਰੈਪੋ ਨੂੰ ਵਚਨਬੱਧ ਕਰਨ ਲਈ ਅਤੇ ਫਿਰ ਜ਼ੀਟ ਦੇ ਗਿੱਥੂਬ ਏਕੀਕਰਣ ਨੂੰ ਮੇਰੇ ਹੂਗੋ ਬਣਾਉਣ ਲਈ. ਇਸ ਸੈਟ ਅਪ ਦੇ ਨਾਲ, ਮੈਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਵੈ ਹੋਸਟਡ ਸਟੈਟਿਕ ਸੀ.ਐੱਮ.ਐੱਸ. ਦੇ ਸਮਰੱਥ ਹਾਂ, ਜਿਵੇਂ ਕਿ ਉਪਭੋਗਤਾ ਵਰਡਪਰੈਸ ਵਰਗੇ ਸੀ.ਐੱਮ.ਐੱਸ.

ਇਸ ਪੋਸਟ ਵਿਚ ਮੈਂ ਬੁਨਿਆਦੀ ofਾਂਚੇ ਦੇ ਇਕ ਹਿੱਸੇ &#39;ਤੇ ਧਿਆਨ ਕੇਂਦਰਿਤ ਕਰਨ ਜਾ ਰਿਹਾ ਹਾਂ - ਕਈ ਫਾਈਲਾਂ ਨੂੰ ਗੀਥਬ ਨੂੰ ਸੌਂਪਣਾ ਕਿਉਂਕਿ ਇਹ ਕੰਮ ਕਰਨ ਵਿਚ ਮੈਨੂੰ ਥੋੜਾ ਸਮਾਂ ਲੈ ਗਿਆ.

ਪੂਰਾ ਕੋਡ ਮੇਰੇ [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) ਤੇ ਵੇਖਿਆ ਜਾ ਸਕਦਾ ਹੈ.

ਜੇ ਤੁਸੀਂ ਇੱਕ ਵੈਬ UI ਬਣਾ ਰਹੇ ਹੋ ਜਿਸਨੂੰ ਸਿੱਧੇ ਗੀਥਬ ਨਾਲ ਵਚਨਬੱਧ ਕਰਨ ਦੀ ਜ਼ਰੂਰਤ ਹੈ, ਸਭ ਤੋਂ ਉੱਤਮ ਲਾਇਬ੍ਰੇਰੀ ਜੋ ਮੈਂ ਲੱਭੀ ਹੈ ਓਕਟੋਕਾਟ ਹੈ - ਇਹ ਕੋਰਜ਼ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਅਜਿਹਾ ਲੱਗਦਾ ਹੈ ਕਿ ਇਹ ਗਿੱਥਬ ਏਪੀਆਈ ਦੀ ਪੂਰੀ ਏਪੀਆਈ ਸਤਹ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ.

ਗੀਟ ਇਕ ਗੁੰਝਲਦਾਰ ਦਰਿੰਦਾ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਇਹ ਸਮਝਣ ਦੀ ਗੱਲ ਆਉਂਦੀ ਹੈ ਕਿ ਰੁੱਖ, ਟਹਿਣੀਆਂ ਅਤੇ ਹੋਰ ਟੁਕੜੇ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ ਇਸ ਲਈ ਮੈਂ ਕੁਝ ਅਜਿਹੇ ਫੈਸਲੇ ਲਏ ਜਿਨ੍ਹਾਂ ਨੇ ਇਸਨੂੰ ਸੌਖਾ ਬਣਾ ਦਿੱਤਾ.

1. ਮੈਂ ਸਿਰਫ ਮਾਸਟਰ ਬ੍ਰਾਂਚ ਨੂੰ ਧੱਕਣ ਦੇ ਯੋਗ `heads/master` ਜੋ `heads/master` ਵਜੋਂ ਜਾਣਿਆ ਜਾਂਦਾ ਹੈ.
1. ਮੈਂ ਜਾਣਾਂਗਾ ਕਿ ਕੁਝ ਫਾਈਲਾਂ ਕਿੱਥੇ ਸਟੋਰ ਕੀਤੀਆਂ ਜਾਣਗੀਆਂ (ਹਿugਗੋ ਮੈਨੂੰ ਇੱਕ ਵਿਸ਼ੇਸ਼ ਡਾਇਰੈਕਟਰੀ structureਾਂਚਾ ਰੱਖਣ ਲਈ ਮਜ਼ਬੂਰ ਕਰਦੀ ਹੈ)


ਇਸ ਨੂੰ ਧਿਆਨ ਵਿਚ ਰੱਖਦਿਆਂ, ਮਲਟੀਪਲ ਫਾਈਲਾਂ ਨਾਲ ਇਕ ਵਚਨਬੱਧਤਾ ਬਣਾਉਣ ਦੀ ਆਮ ਪ੍ਰਕਿਰਿਆ ਹੇਠਾਂ ਦਿੱਤੀ ਹੈ:

ਰੈਪੋ ਦਾ ਹਵਾਲਾ ਲਓ.

1. `heads/master` ਸ਼ਾਖਾ &#39;ਤੇ ਦਰੱਖਤ ਦੇ ਸਿਰੇ ਦਾ ਹਵਾਲਾ `heads/master` .
1. ਹਰੇਕ ਫਾਈਲ ਲਈ ਜੋ ਅਸੀਂ ਇੱਕ `blob` ਬਣਾਉਣ ਲਈ ਵਚਨਬੱਧ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹਾਂ ਅਤੇ ਫਿਰ `sha` ਪਛਾਣਕਰਤਾ, ਮਾਰਗ, ਮੋਡ ਦੇ ਹਵਾਲਿਆਂ ਨੂੰ ਇੱਕ ਐਰੇ ਵਿੱਚ ਸਟੋਰ ਕਰਨਾ ਹੈ.
1. ਇੱਕ ਨਵਾਂ `tree` ਬਣਾਓ ਜਿਸ ਵਿੱਚ `heads/master` ਦਰੱਖਤ ਦੇ ਸੰਕੇਤ ਦੇ ਸੰਦਰਭ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰਨ ਲਈ ਸਾਰੇ `tree` ਸ਼ਾਮਲ ਹੋਣ, ਅਤੇ ਇਸ ਰੁੱਖ ਨੂੰ ਨਵਾਂ `sha` ਪੁਆਇੰਟਰ ਸਟੋਰ ਕਰੋ.
1. ਇਕ `heads/master` ਬਣਾਓ ਜੋ ਇਸ ਨਵੇਂ ਰੁੱਖ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰੇ ਅਤੇ ਫਿਰ `heads/master` ਸ਼ਾਖਾ ਵੱਲ ਧੱਕੋ.

ਕੋਡ ਬਹੁਤ ਜ਼ਿਆਦਾ ਉਸ ਪ੍ਰਵਾਹ ਨੂੰ ਮੰਨਦਾ ਹੈ. ਕਿਉਂਕਿ ਮੈਂ ਕੁਝ ਇੰਪੁੱਟਾਂ ਲਈ ਮਾਰਗ structureਾਂਚਾ ਮੰਨ ਸਕਦਾ ਹਾਂ ਮੈਨੂੰ ਫਾਈਲਾਂ ਲਈ ਕੋਈ ਗੁੰਝਲਦਾਰ UI ਜਾਂ ਪ੍ਰਬੰਧਨ ਦੀ ਜ਼ਰੂਰਤ ਨਹੀਂ ਹੈ.

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

ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਸਥਿਰ ਹੋਸਟਿੰਗ ਦੇ ਨਾਲ ਕੁਝ ਅਜਿਹਾ ਕੀਤਾ ਹੈ. ਮੈਂ ਬਹੁਤ ਉਤਸ਼ਾਹਿਤ ਹਾਂ ਕਿ ਮੈਂ ਇੱਕ ਆਧੁਨਿਕ ਫਰੰਟੈਂਡ ਬਣਾ ਸਕਦਾ ਹਾਂ ਇਸ ਲਈ ਜੋ ਇੱਕ ਸਰਵਰ-ਘੱਟ ਹੋਸਟਿੰਗ infrastructureਾਂਚਾ ਹੈ.

ਜ਼ੀਤ ਬਾਰੇ ਕੀ?

ਖੈਰ, ਇਹ ਹੁਣ ਬਿਲਕੁਲ ਆਟੋਮੈਟਿਕ ਹੈ. ਮੈਂ ਹੂਗੋ ਕਮਾਂਡ ਨੂੰ ਚਲਾਉਣ ਲਈ ਡਬਲਯੂਡਬਲਯੂਐਸ `static-builder` ਵਰਤੋਂ ਕਰਦਾ ਹਾਂ ਅਤੇ ਇਹ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ. :)