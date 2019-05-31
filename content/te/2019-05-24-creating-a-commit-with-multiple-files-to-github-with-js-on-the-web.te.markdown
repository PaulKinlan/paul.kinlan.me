---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
నా సైట్ [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . ఇది [Hugo](https://gohugo.io) తో నిర్మించబడింది మరియు [Hugo](https://gohugo.io) తో హోస్ట్ [Zeit](https://zeit.co) . నేను సెటప్ తో చాలా సంతోషంగా ఉన్నాను, నేను తక్షణ బిల్డ్స్ మరియు సూపర్ ఫాస్ట్ CDN&#39;d కంటెంట్ డెలివరీ దగ్గరికి వచ్చేలా మరియు నేను ఏ దేశాన్ని నిర్వహించనందున నేను అవసరమైన అన్ని విషయాలను చేయగలను.

నేను ఈ సైట్ కోసం ఒక [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) సృష్టించాను మరియు నా [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) కూడా క్రొత్త కంటెంట్ని నా [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) హోస్ట్ చేసిన సైట్కు త్వరగా పోస్ట్ [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) .

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

So. నేను ఎలా చేసాను?

ఇది నా Github రెపో వ్యతిరేకంగా Firebase Auth కలయిక, ఎడిటర్ JS సవరించడానికి కంటెంట్ సవరించడానికి (అది చక్కగా ఉంది) మరియు Octokat.js repo కట్టుబడి మరియు అప్పుడు Zeit యొక్క Github ఇంటిగ్రేషన్ నా హ్యూగో బిల్డ్ చేయడానికి. ఈ సెట్ అప్ తో, నేను ఒక యూజర్ WordPress వంటి CMS మద్దతు ఒక డేటాబేస్ లో పోస్ట్స్ సృష్టించడానికి ఎలా పోలి ఒక పూర్తిగా స్వీయ హోస్ట్ స్టాటిక్ CMS, కలిగి సామర్థ్యం am.

ఈ పోస్ట్ లో నేను మౌలిక సదుపాయంలో ఒక భాగాన దృష్టి సారించబోతున్నాను - గిథబ్ కు బహుళ ఫైళ్ళను చేస్తున్నందున నేను పని చేయటానికి కొంచెం సమయం పట్టింది.

మొత్తం కోడ్ నా [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) చూడవచ్చు.

మీరు Github నేరుగా కట్టుబడి అవసరం వెబ్ UI నిర్మాణ ఉంటే, నేను కనుగొన్న ఉత్తమ లైబ్రరీ Octokat ఉంది - ఇది CORS పనిచేస్తుంది మరియు అది Github API మొత్తం API ఉపరితలం నిర్వహించడానికి తెలుస్తోంది.

చెట్టు, శాఖలు మరియు ఇతర ముక్కలు ఎలా పని చేస్తాయో అర్థం చేసుకోవటానికి వచ్చినప్పుడు జిట్ అనేది ఒక సంక్లిష్ట మృగం కావచ్చు, అందువల్ల నేను కొన్ని నిర్ణయాలు తీసుకున్నాను.

1. నేను `heads/master` అని పిలవబడే మాస్టర్ బ్రాంచ్కి మాత్రమే `heads/master` .
1. కొన్ని ఫైల్లు ఎక్కడ నిల్వ చేయబడతాయో నాకు తెలుసు. (హ్యూగో నాకు నిర్ధిష్టమైన డైరెక్టరీ నిర్మాణం కలిగివుంటుంది)


మనసులో, బహుళ ఫైళ్ళతో ఒక నిబద్ధతను సృష్టించటానికి సాధారణ ప్రక్రియ క్రింది విధంగా ఉంది:

రెపో సూచనను పొందండి.

1. `heads/master` శాఖలో చెట్టు యొక్క కొనకు సూచన పొందండి.
ప్రతి ఒక్క ఫైల్ కోసం మేము ఒక `blob` సృష్టించి, ఆ తరువాత `sha` ఐడెంటిఫైయర్, `sha` , మోడ్లో మోడ్ లను `sha` .
1. `heads/master` ట్రీ యొక్క `heads/master` సూచనగా జోడించడానికి అన్ని `tree` కలిగి ఉన్న క్రొత్త `tree` సృష్టించండి మరియు ఈ చెట్టుకు కొత్త `sha` పాయింటర్ను నిల్వ చేయండి.
1. ఈ కొత్త చెట్టుకు సూచించే `heads/master` మరియు తరువాత `heads/master` బ్రాంచ్కి `heads/master` .

కోడ్ అందంగా చాలా ఆ ప్రవాహం అనుసరిస్తుంది. నేను కొన్ని ఇన్పుట్లను కోసం మార్గం నిర్మాణం భావించవచ్చు ఎందుకంటే నేను ఫైళ్లు కోసం ఏ క్లిష్టమైన UI లేదా నిర్వహణ నిర్మించడానికి అవసరం లేదు.

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

మీరు స్టాటిక్ హోస్టింగ్ మాదిరిగానే ఏదైనా చేసినట్లయితే నాకు తెలియజేయండి. పూర్తిగా ఆధునిక తక్కువ హోస్టింగ్ మౌలిక సదుపాయాల కోసం నేను ఆధునిక ఫ్రంటెండ్ను నిర్మించగలనని చాలా సంతోషిస్తున్నాను.

Zeit గురించి ఏమిటి?

బాగా, ఇది ఇప్పుడు అన్ని ఆటోమేటిక్ గా జస్ట్ ఉంది. నేను `static-builder` ఆదేశాన్ని అమలు చేయడానికి `static-builder` ను ఉపయోగిస్తాను మరియు అది చాలా `static-builder` . :)