---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
என் தளம் [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . அது கட்டப்பட்டுள்ளது [Hugo](https://gohugo.io) மற்றும் வழங்கப்பட்டுள்ளது [Zeit](https://zeit.co) . நான் அமைப்புடன் மிகவும் மகிழ்ச்சியாக இருக்கிறேன், உடனடி கட்டமைப்புகள் மற்றும் அதிவிரைவான CDN&#39;d உள்ளடக்க விநியோகத்தை நான் நெருங்கி வருகிறேன், மேலும் நான் எந்தவொரு மாநிலத்தையும் நிர்வகிக்க வேண்டிய அவசியம் இல்லை, ஏனெனில் எனக்கு தேவையான எல்லாவற்றையும் செய்ய முடியும்.

இந்த தளத்திற்கான [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) மற்றும் எனது [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) ஆகியவற்றை நான் உருவாக்கியிருக்கிறேன், இது என் உள்ளடக்கத்தை விரைவாக என் தளத்தில் இடுகையிட உதவுகிறது.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

அதனால். நான் எப்படி செய்தேன்?

இது என் Github Repo, EditorJS உள்ளடக்கத்தை தொகுக்க (இது சுத்தமாகவும்) மற்றும் Octokat.js repo செய்ய பின்னர் Zeit இன் கித்துப் ஒருங்கிணைப்பு என் ஹ்யூகோ உருவாக்க செய்ய உருவாக்க எதிராக Firebase அங்கீகாரத்தின் கலவையாகும். இந்த அமைப்பைக் கொண்டு, நான் ஒரு முற்றிலும் சுய வழங்கப்படும் நிலையான CMS, ஒரு பயனர் வேர்ட்பிரஸ் போன்ற CMS ஆதரவு போன்ற ஒரு தரவு பதிவுகள் உருவாக்க எப்படி போன்ற.

இந்த இடுகையில் நான் உள்கட்டமைப்பின் ஒரு பகுதி மீது கவனம் செலுத்தப் போகிறேன் - பல கிளிப்களைக் கோப்பிற்கு அனுப்புகிறேன், ஏனென்றால் வேலை செய்ய எனக்கு சிறிது நேரம் பிடித்தது.

முழு குறியீடு என் [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) காணலாம்.

நீங்கள் ஒரு வலை UI ஐ கட்டமைத்திருந்தால், கித்யூப்புக்கு நேரடியாகச் செய்ய வேண்டும், நான் கண்ட சிறந்த நூலகம் அக்ரோக்கேட் ஆகும் - இது CORS உடன் வேலை செய்கிறது மற்றும் கித்யூபி ஏபிஐ முழுவதுமான API மேற்பரப்பை கையாளுவது போல் தெரிகிறது.

மரம், கிளைகள் மற்றும் பிற துண்டுகள் எவ்வாறு வேலை செய்யப் போகின்றன என்பதைப் புரிந்துகொள்வது மிகவும் சிக்கலானது.

1. நான் `heads/master` என அறியப்படும் மாஸ்டர் கிளைக்கு மட்டும் தள்ள முடியும்.
1. சில கோப்புகளை சேமித்து வைத்திருப்பதை நான் அறிவேன். (ஹியூகோ ஒரு குறிப்பிட்ட கோப்பக கட்டமைப்பைக் கொண்டிருக்கிறார்)


இதை மனதில் கொண்டு, பல கோப்புகளுடன் ஒரு செயலை உருவாக்குவதற்கான பொது செயல்முறை பின்வருமாறு:

ரெப்போவைப் பற்றிய குறிப்புகளைப் பெறவும்.

1. `heads/master` கிளையில் மரத்தின் முனை குறிப்புகளைப் பெறவும்.
1. ஒவ்வொரு கோப்பிற்கும் நாம் ஒரு `blob` உருவாக்கி, பின் குறிப்புகளை `sha` அடையாளங்காட்டி, பாதை, பயன்முறையில் வரிசையில் சேமிக்க வேண்டும்.
1. புதிய `tree` உருவாக்கவும், `heads/master` மரத்தின் முனை குறிப்புக்கு சேர்க்க அனைத்து `tree` கொண்டிருக்கும், மற்றும் இந்த மரத்திற்கு புதிய `sha` சுட்டிக்காட்டி `sha` .
1. இந்த புதிய மரத்தை சுட்டிக்காட்டும், பின்னர் `heads/master` கிளைக்கு அழுத்தம் கொடுக்கும்.

குறியீடு மிகவும் அதிகமாக ஓட்டம் பின்வருமாறு. ஏனெனில் சில உள்ளீடுகளுக்கு பாதை கட்டமைப்பை நான் ஏற்றுக் கொள்ளமுடியாது, எந்த சிக்கலான UI ஐயும் அல்லது கோப்புகளுக்கான நிர்வாகத்தையும் உருவாக்க வேண்டிய அவசியமில்லை.

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

நீங்கள் நிலையான ஹோஸ்ட்டைப் போலவே ஏதாவது செய்திருந்தால் எனக்கு தெரியப்படுத்துங்கள். முற்றிலும் சர்வர்-ஹோஸ்டிங் ஹோஸ்டிங் உள்கட்டமைப்பிற்கான நவீன முன்மாதிரி ஒன்றை உருவாக்க நான் மிகவும் ஆர்வமாக உள்ளேன்.

Zeit பற்றி என்ன?

சரி, அது இப்போது தானாகவே தானாகவே இருக்கிறது. நான் ஹூகோ கட்டளையை இயக்க `static-builder` ஐ பயன்படுத்துகிறேன், அது மிகவும் அதிகமாக உள்ளது. :)