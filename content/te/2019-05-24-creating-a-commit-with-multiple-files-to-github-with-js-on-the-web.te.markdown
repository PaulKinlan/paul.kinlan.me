---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
నా సైట్ [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . ఇది [Hugo](https://gohugo.io) తో నిర్మించబడింది మరియు [Hugo](https://gohugo.io) తో హోస్ట్ [Zeit](https://zeit.co) . సెటప్‌తో నేను చాలా సంతోషంగా ఉన్నాను, నేను తక్షణ నిర్మాణాలు మరియు సూపర్ ఫాస్ట్ సిడిఎన్డ్ కంటెంట్ డెలివరీకి దగ్గరవుతాను మరియు నేను అవసరమైన అన్ని పనులను చేయగలను ఎందుకంటే నేను ఏ రాష్ట్రాన్ని నిర్వహించాల్సిన అవసరం లేదు.

నేను ఈ సైట్ కోసం ఒక [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) సృష్టించాను మరియు నా [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) కూడా నా స్థిరంగా హోస్ట్ చేసిన సైట్‌కు క్రొత్త కంటెంట్‌ను త్వరగా పోస్ట్ చేయడానికి వీలు కల్పిస్తుంది.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

So. నేను ఎలా చేసాను?

రెపోకు కట్టుబడి ఉండటానికి కంటెంట్‌ను సవరించడానికి (ఇది చక్కగా ఉంది) మరియు ఆక్టోకాట్.జెస్‌ను సృష్టించడానికి నా గితుబ్ రెపో, ఎడిటర్‌జెస్‌కి వ్యతిరేకంగా ఫైర్‌బేస్ ప్రమాణం యొక్క కలయిక మరియు తరువాత నా హ్యూగో బిల్డ్ చేయడానికి జైట్ యొక్క గితుబ్ ఇంటిగ్రేషన్. ఈ సెటప్‌తో, నేను పూర్తిగా స్వీయ హోస్ట్ చేసిన స్టాటిక్ CMS ని కలిగి ఉన్నాను, ఒక వినియోగదారు డేటాబేస్లో WordPress వంటి CMS మద్దతు ఉన్న CMS లో పోస్ట్‌లను ఎలా సృష్టించగలరో అదే విధంగా.

ఈ పోస్ట్‌లో నేను మౌలిక సదుపాయాల యొక్క ఒక భాగంపై దృష్టి పెట్టబోతున్నాను - గితుబ్‌కు బహుళ ఫైల్‌లను కమిట్ చేస్తున్నాను ఎందుకంటే ఇది పని చేయడానికి నాకు కొంత సమయం పట్టింది.

మొత్తం కోడ్ నా [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) చూడవచ్చు.

మీరు గితుబ్‌కు నేరుగా కట్టుబడి ఉండవలసిన వెబ్ UI ని నిర్మిస్తుంటే, నేను కనుగొన్న ఉత్తమ లైబ్రరీ ఆక్టోకాట్ - ఇది CORS తో పనిచేస్తుంది మరియు ఇది గితుబ్ API యొక్క మొత్తం API ఉపరితలాన్ని నిర్వహిస్తున్నట్లు అనిపిస్తుంది.

చెట్టు, కొమ్మలు మరియు ఇతర ముక్కలు ఎలా పని చేస్తాయో అర్థం చేసుకునేటప్పుడు Git ఒక సంక్లిష్ట మృగం కావచ్చు కాబట్టి నేను కొన్ని నిర్ణయాలు తీసుకున్నాను.

1. నేను `heads/master` అని పిలువబడే మాస్టర్ బ్రాంచ్‌కు మాత్రమే `heads/master` .
1. కొన్ని ఫైళ్ళు ఎక్కడ నిల్వ చేయబడతాయో నాకు తెలుస్తుంది (హ్యూగో ఒక నిర్దిష్ట డైరెక్టరీ నిర్మాణాన్ని కలిగి ఉండటానికి నన్ను బలవంతం చేస్తుంది)


దీన్ని దృష్టిలో ఉంచుకుని, బహుళ ఫైళ్ళతో నిబద్ధతను సృష్టించే సాధారణ ప్రక్రియ క్రింది విధంగా ఉంటుంది:

రెపోకు సూచన పొందండి.

1. `heads/master` శాఖలోని చెట్టు కొనకు సూచన పొందండి.
1. మేము కట్టుబడి ఉండాలనుకునే ప్రతి ఫైల్ కోసం ఒక `blob` సృష్టించి, ఆపై `sha` ఐడెంటిఫైయర్, పాత్, మోడ్‌కు సూచనలను `sha` నిల్వ చేయండి.
1. `heads/master` చెట్టు యొక్క కొనకు సూచనగా జోడించడానికి అన్ని `tree` కలిగి ఉన్న క్రొత్త `tree` సృష్టించండి మరియు ఈ చెట్టుకు క్రొత్త `sha` పాయింటర్‌ను నిల్వ చేయండి.
1. ఈ క్రొత్త చెట్టును సూచించే `heads/master` , ఆపై `heads/master` శాఖకు `heads/master` .

కోడ్ చాలా చక్కని ఆ ప్రవాహాన్ని అనుసరిస్తుంది. కొన్ని ఇన్‌పుట్‌ల కోసం నేను పాత్ స్ట్రక్చర్‌ను can హించగలను ఎందుకంటే ఫైల్‌ల కోసం సంక్లిష్టమైన UI లేదా నిర్వహణను నేను నిర్మించాల్సిన అవసరం లేదు.

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

మీరు స్టాటిక్ హోస్టింగ్‌తో సమానమైన ఏదైనా చేసి ఉంటే నాకు తెలియజేయండి. పూర్తిగా సర్వర్-తక్కువ హోస్టింగ్ మౌలిక సదుపాయాల కోసం నేను ఆధునిక ఫ్రంటెండ్‌ను నిర్మించగలనని చాలా సంతోషిస్తున్నాను.

జైట్ గురించి ఏమిటి?

బాగా, ఇది ఇప్పుడు అన్ని ఆటోమేటిక్. హ్యూగో ఆదేశాన్ని అమలు చేయడానికి నేను `static-builder` ని ఉపయోగిస్తాను మరియు అది చాలా `static-builder` . :)