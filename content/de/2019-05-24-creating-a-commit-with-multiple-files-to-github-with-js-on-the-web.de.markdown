---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
Meine Seite ist [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . Es wurde mit [Hugo](https://gohugo.io) und mit [Zeit](https://zeit.co) gehostet. Ich bin ziemlich zufrieden mit dem Setup, erhalte beinahe sofortige Builds und eine superschnelle Lieferung von CDN-Inhalten und kann all die Dinge tun, die ich brauche, weil ich keinen Zustand verwalten muss.

Ich habe ein [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) für diese Site und auch mein [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) , mit dem ich schnell neue Inhalte auf meiner statisch gehosteten Site veröffentlichen kann.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

So. Wie habe ich das gemacht?

Es ist eine Kombination aus Firebase Auth gegen mein Github Repo, EditorJS zum Erstellen, Bearbeiten des Inhalts (es ist ordentlich) und Octokat.js zum Festschreiben des Repos und dann der Github-Integration von Zeit, um mein Hugo-Build durchzuführen. Mit dieser Einrichtung kann ich ein vollständig selbst gehostetes statisches CMS haben, ähnlich wie ein Benutzer Beiträge in einem datenbankgestützten CMS wie Wordpress erstellen könnte.

In diesem Beitrag werde ich mich nur auf einen Teil der Infrastruktur konzentrieren - das Festschreiben mehrerer Dateien an Github, da ich eine Weile gebraucht habe, um das zu klären.

Der gesamte Code ist auf meinem [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) zu sehen.

Wenn Sie eine Web-Benutzeroberfläche erstellen, die direkt an Github übergeben werden muss, ist Octokat die beste Bibliothek, die ich gefunden habe. Es funktioniert mit CORS und scheint die gesamte API-Oberfläche der Github-API zu verwalten.

Git kann ein komplexes Biest sein, wenn es darum geht zu verstehen, wie der Baum, die Zweige und andere Teile funktionieren. Ich habe einige Entscheidungen getroffen, die es einfacher gemacht haben.

1. Ich kann nur auf den als `heads/master` bekannten `heads/master` .
1. Ich werde wissen, wo bestimmte Dateien gespeichert werden (Hugo zwingt mich, eine bestimmte Verzeichnisstruktur zu haben)


In diesem Sinne sieht der allgemeine Vorgang zum Erstellen eines Commits mit mehreren Dateien wie folgt aus:

Holen Sie sich einen Verweis auf das Repo.

1. Holen Sie sich einen Verweis auf die Spitze des Baums in der Verzweigung `heads/master` .
1. Erstellen `blob` für jede Datei, für die ein Commit ausgeführt werden soll, ein `blob` und speichern `blob` dann die Verweise auf den `sha` Bezeichner, den Pfad und den Modus in einem Array.
1. Erstellen Sie ein neues `tree` , das alle Blobs enthält, die dem Verweis auf die Spitze des `heads/master` Baums `heads/master` werden sollen, und speichern Sie den neuen `sha` Zeiger auf diesen Baum.
1. Erstellen Sie ein Commit, das auf diesen neuen Baum verweist, und `heads/master` dann zum Zweig `heads/master` .

Der Code folgt diesem Ablauf ziemlich genau. Da ich die Pfadstruktur für bestimmte Eingaben übernehmen kann, muss ich keine komplexe Benutzeroberfläche oder Verwaltung für die Dateien erstellen.

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

Lassen Sie mich wissen, wenn Sie etwas Ähnliches mit statischem Hosting gemacht haben. Ich freue mich sehr, dass ich ein modernes Frontend für eine vollständig serverlose Hosting-Infrastruktur aufbauen kann.

Was ist mit Zeit?

Nun, es ist jetzt einfach alles automatisch. Ich benutze das `static-builder` , um den Hugo-Befehl `static-builder` , und das ist so ziemlich `static-builder` . :)