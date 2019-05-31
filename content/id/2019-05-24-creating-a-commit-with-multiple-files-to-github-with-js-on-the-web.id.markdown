---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Situs saya adalah [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Dibangun dengan [Hugo](https://gohugo.io) dan di-host dengan [Zeit](https://zeit.co) . Saya cukup senang dengan pengaturannya, saya mendapatkan build instan dan pengiriman konten CDN yang sangat cepat dan saya dapat melakukan semua hal yang saya perlukan karena saya tidak perlu mengatur negara.

Saya telah membuat [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) untuk situs ini dan juga [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) saya yang memungkinkan saya memposting konten baru dengan cepat ke situs yang dihosting secara statis.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

Begitu. Bagaimana saya melakukannya?

Merupakan kombinasi Firebase Auth terhadap Github Repo saya, EditorJS untuk membuat edit konten (rapi) dan Octokat.js untuk berkomitmen pada repo dan kemudian integrasi Github Zeit untuk melakukan hugo build saya. Dengan pengaturan ini, saya dapat memiliki CMS statis yang sepenuhnya dihosting sendiri, mirip dengan bagaimana pengguna dapat membuat posting di database yang didukung CMS seperti Wordpress.

Dalam posting ini saya hanya akan fokus pada satu bagian dari infrastruktur - melakukan banyak file ke Github karena butuh beberapa saat untuk menyelesaikannya.

Seluruh kode dapat dilihat di [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) saya.

Jika Anda sedang membangun UI Web yang perlu berkomitmen langsung ke Github, perpustakaan terbaik yang saya temukan adalah Octokat - ia bekerja dengan CORS dan tampaknya menangani seluruh permukaan API dari API Github.

Git bisa menjadi binatang yang kompleks ketika harus memahami bagaimana pohon, cabang dan potongan lainnya bekerja jadi saya mengambil beberapa keputusan yang membuatnya lebih mudah.

1. Saya hanya akan bisa mendorong ke cabang master yang dikenal sebagai `heads/master` .
1. Saya akan tahu di mana file-file tertentu akan disimpan (Hugo memaksa saya untuk memiliki struktur direktori tertentu)


Dengan mengingat hal itu, proses umum untuk membuat komit dengan banyak file adalah sebagai berikut:

Dapatkan referensi ke repo.

1. Dapatkan referensi ke ujung pohon di cabang `heads/master` .
1. Untuk setiap file yang ingin kita komit, buat `blob` dan simpan referensi ke pengenal, jalur, mode `sha` dalam array.
1. Buat `tree` baru yang berisi semua gumpalan untuk menambahkan referensi ke ujung pohon `heads/master` , dan menyimpan pointer `sha` baru ke pohon ini.
1. Buat komit yang menunjuk ke pohon baru ini dan kemudian tekan ke cabang `heads/master` .

Kode cukup banyak mengikuti alur itu. Karena saya dapat mengasumsikan struktur jalur untuk input tertentu, saya tidak perlu membuat UI atau manajemen kompleks untuk file.

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

Beritahu saya jika Anda telah melakukan sesuatu yang mirip dengan hosting statis. Saya sangat senang bahwa saya dapat membangun antarmuka modern untuk apa yang sepenuhnya merupakan infrastruktur hosting tanpa server.

Bagaimana dengan Zeit?

Yah, sekarang sudah agak otomatis. Saya menggunakan `static-builder` untuk menjalankan perintah hugo dan itu sudah cukup. :)