import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import CodeTool from '@editorjs/code';
import SimpleImage from '@editorjs/simple-image';
import Table from '@editorjs/table'
import Quote from '@editorjs/quote';
import SimpleVideo from 'simple-video-editorjs';
import Octokat from 'octokat';

import {firebase} from '@firebase/app';
import '@firebase/auth';

let data = {};
var config = {
  apiKey: "AIzaSyBRVhojhh2btgeWnOW1klF7GT_l6GBUa9M",
  authDomain: "paulkinlanme.firebaseapp.com",
  projectId: "paulkinlanme"
};

let editor;

navigator.serviceWorker.register('sw.js');

const initEditor = (imageBlobs) => {
  const editorElement = document.getElementById('editor');
  editorElement.innerHTML = '';

  if (imageBlobs) {
    data = {
      blocks: imageBlobs.map(imageBlob => {
        return {
          type: 'image',
          data: {
            url: URL.createObjectURL(imageBlob)
          }
        };
      })
    };
  }

  editor = new EditorJS({
    holderId: 'editor',
    tools: {
      list: {
        class: List,
        inlineToolbar: true,
      },
      image: SimpleImage,
      video: SimpleVideo,
      header: Header,
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      code: {
        class: CodeTool,
        shortcut: 'CMD+SHIFT+C'
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+O',
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
      },
      table: {
        class: Table,
      }
    },
    data: data
  });
};

initEditor();

const auth = async () => {
  firebase.initializeApp(config);
  var provider = new firebase.auth.GithubAuthProvider();
  provider.addScope('repo');

  try {
    const result = await firebase.auth().signInWithPopup(provider);
    const noteForm = document.getElementById('noteform');

    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(result.user.toJSON()));
    noteform.classList.add('authenticated');
    logToToast(`Welcome ${result.user}`);
    return result;
  } catch (error) {
    // Handle Errors here.
    console.log(error);
    logToToast(`Unable to login: ${error.message}`)
  }
};

const createCommit = async (repositoryUrl, filename, data, images, commitMessage) => {
  try {
    const token = localStorage.getItem('accessToken');
    const github = new Octokat({ 'token': token });
    const [user, repoName] = repositoryUrl.split('/');

    if (user === null || repoName === null) {
      alert('Please specifiy a repo');
      return;
    }

    const markdownPath = `content/en/${filename}.markdown`.toLowerCase();
    let repo = await github.repos(user, repoName).fetch();
    let main = await repo.git.refs('heads/main').fetch();
    let treeItems = [];

    for (let image of images) {
      let imageGit = await repo.git.blobs.create({ content: image.data, encoding: 'base64' });
      let imagePath = `static/images/${image.name}`.toLowerCase();
      treeItems.push({
        path: imagePath,
        sha: imageGit.sha,
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
      parents: [main.object.sha]
    });

    main.update({ sha: commit.sha })

    logToToast('Posted');
  } catch (err) {
    console.error(err);
    logToToast(err);
  }
};

const htmlEncode = (str) => {
  str = str.replace(/[^\x00-\x7F]/g, function (char) {
    var hex = char.charCodeAt(0).toString(16);
    while (hex.length < 4) hex = '0' + hex;

    return '&#x' + hex + ';';
  });

  return str;
};

const jsonEncode = (str) => {
  str = str.replace(/[^\x00-\x7F]/g, function (char) {
    var hex = char.charCodeAt(0).toString(16);
    while (hex.length < 4) hex = '0' + hex;

    return '\\u' + hex;
  });

  return str;
};

const logToToast = (str) => {
  const output = document.getElementById('output');
  output.textContent += str + '\n';
};

onload = async () => {
  const noteForm = document.getElementById('noteform');
  const authenticate = document.getElementById('authenticate');
  const reposEl = document.getElementById('repos');
  const repoEl = document.getElementById('repo');

  const accessToken = localStorage.getItem('accessToken');
  let githubRepo = localStorage.getItem('githubRepo');
  let github;

  if (accessToken !== null) {
    noteform.classList.add('authenticated');
    github = new Octokat({ 'token': accessToken });
    github.user.repos.fetchAll().then(repos => {
      const repoFragment = document.createDocumentFragment();
      repos.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.fullName;
        repoFragment.appendChild(option);
      });
      reposEl.appendChild(repoFragment);
    });
  }

  if (githubRepo !== null) {
    repoEl.value = githubRepo;
  }

  authenticate.onclick = async (event) => {
    event.preventDefault();
    await auth();
  };

  navigator.serviceWorker.onmessage = (event) => {
    initEditor(event.data.files);
  };

  noteForm.onsubmit = async (event) => {
    event.preventDefault();
    const repo = repoEl.value;

    if (repo === undefined || repo === null || repo === "" || repo.indexOf('/') === -1) {
      alert('You need specify a repo to commit to');
      return;
    }

    localStorage.setItem('githubRepo', repo);

    const editorData = await editor.save();

    if (localStorage.getItem('accessToken') === null) {
      alert('Please Auth');
      logToToast('Please Authenticate')
    }

    const name = document.getElementById('name').value;
    const cleanName = name.replace(/[^a-zA-Z0-9\-_]/g, '-')
                          .replace(/-{2,}/g, '-')
                          .replace(/-$/,'');
    const dateParts = new Date().toISOString().split('T');
    const fileName = `${dateParts[0]}-${cleanName}`;
    const url = document.getElementById('url').value;
    const tags = document.getElementById('tags').value;
    let images = [];

    const main = editorData.blocks.map((cur) => {
      if (cur.type === 'paragraph') return cur.data.text + '\n';
      if (cur.type === 'quote') return `> ${htmlEncode(cur.data.text).split('\n').join('\n> ')}\n\n${cur.data.caption}\n`;
      if (cur.type === 'list') return cur.data.items.join(`\n${(cur.data.style === 'ordered') ? '1. ' : '* '}`) + `\n\n`;
      if (cur.type === 'code') return `\`\`\`\n${cur.data.code}\n\`\`\`\n`;
      if (cur.type === 'header') return `${'#'.repeat(cur.data.level)} ${cur.data.text}`;
      if (cur.type === 'image') {
        let currImageID = images.length;
        let name = `${fileName.toLowerCase()}-${currImageID}.jpeg`;
        images.push({ name: name, data: cur.data.url.replace(/([^,]+),/, "") });
        return `<figure><img src="/images/${fileName.toLowerCase()}-${currImageID}.jpeg" alt="${cur.data.caption}"></figure>\n`;
      }
    }, '');
    const body = `---
slug: ${cleanName.toLowerCase()}
date: ${dateParts.join('T')}
title: ${name}
link: '${url}'
tags: [${tags}]
---

${main.join('\n')}
`;
    createCommit(repo, fileName, body, images, cleanName);
  };
}