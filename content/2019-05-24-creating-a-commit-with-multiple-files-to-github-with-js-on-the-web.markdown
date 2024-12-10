---
date: 2019-05-24 11:10:02.642000+00:00
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
summary: I've created a simple UI for my static site and podcast creator that allows
  me to quickly post new content. It uses Firebase Auth, EditorJS, Octokat.js, and
  Zeit's Github integration.  This post focuses on committing multiple files to Github
  using Octokat.js.  The process involves getting a reference to the repo and the
  tip of the master branch, creating blobs for each file, creating a new tree with
  these blobs, and creating a commit that points to the new tree.  The code handles
  authentication, creates blobs for images, audio (if applicable), and markdown content,
  and then creates the tree and commit.  This setup allows me to have a serverless
  static CMS.
tags:
- github
- javascript
- static site generation
- serverless
- octokat
- hugo
- zeit
- firebase
- cms
- web development
title: Creating a commit with multiple files to Github with JS on the web

---
My site is [entirely static](https://github.com/PaulKinlan/paul.kinlan.me). It's built with [Hugo](https://gohugo.io) and hosted with [Zeit](https://zeit.co). I'm pretty happy with the setup, I get near instant builds and super fast CDN'd content delivery and I can do all the things that I need to because I don't have to manage any state.

I've created a [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) for this site and also my [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) that enables me to quickly post new content to my statically hosted site.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

So. How did I do it?

It's a combination of Firebase Auth against my Github Repo, EditorJS to create edit the content (it's neat) and Octokat.js to commit to the repo and then Zeit's Github integration to do my hugo build. With this set up, I am able to have an entirely self hosted static CMS, similar to how a user might create posts in a database backed CMS like Wordpress.

In this post I am just going to focus on one part of the infrastructure - committing multiple files to Github because it took me a little while to work out.

The entire code can be seen on my [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90).

If you are building a Web UI that needs to commit directly to Github, the best library that I have found is Octokat - it works with CORS and it seems to handle the entire API surface of the Github API.

Git can be a complex beast when it comes to understanding how the tree, branches and other pieces work so I took some decisions that made it easier.

1. I will be only able to push to the master branch known as `heads/master`.
1. I will know where certain files will be stored (Hugo forces me to have a specific directory structure)


With that in mind, the general process to creating a commit with multiple files is as follows:

Get a reference to the repo.

1. Get a reference to the tip of the tree on `heads/master` branch.
1. For each file that we want to commit create a `blob` and then store the references to the `sha` identifier, path, mode in an array.
1. Create a new `tree` that contains all the blobs to add to the reference to the tip of the `heads/master` tree, and store the new `sha` pointer to this tree.
1. Create a commit that points to this new tree and then push to the `heads/master` branch.

The code pretty much follows that flow. Because I can assume the path structure for certain inputs I don't need to build any complex UI or management for the files.

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

Let me know if you've done anything similar with static hosting. I'm very excited that I can build a modern frontend for what is an entirely server-less hosting infrastructure.

What about Zeit?

Well, it's just kinda all automatic now. I use the `static-builder` to run the hugo command and that is pretty much it. :)