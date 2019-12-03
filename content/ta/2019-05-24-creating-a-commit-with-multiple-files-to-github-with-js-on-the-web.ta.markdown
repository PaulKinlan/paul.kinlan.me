---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
எனது தளம் [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) . இது [Hugo](https://gohugo.io) உடன் கட்டப்பட்டுள்ளது மற்றும் [Hugo](https://gohugo.io) உடன் [Zeit](https://zeit.co) . அமைப்பதில் நான் மிகவும் மகிழ்ச்சியடைகிறேன், உடனடி உருவாக்கங்கள் மற்றும் அதிவேக சி.டி.என் உள்ளடக்க உள்ளடக்க விநியோகத்தை நான் நெருங்குகிறேன், நான் எந்த மாநிலத்தையும் நிர்வகிக்க வேண்டியதில்லை என்பதால் எனக்குத் தேவையான எல்லாவற்றையும் செய்ய முடியும்.

இந்த தளத்திற்காக நான் ஒரு [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) ஐ உருவாக்கியுள்ளேன், மேலும் எனது [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) ஆனது எனது நிலையான ஹோஸ்ட் செய்யப்பட்ட தளத்திற்கு புதிய உள்ளடக்கத்தை விரைவாக இடுகையிட உதவுகிறது.

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

அதனால். நான் அதை எப்படி செய்தேன்?

இது எனது கிதுப் ரெப்போ, எடிட்டர்ஜேஎஸ் ஆகியவற்றுக்கு எதிரான ஃபயர்பேஸ் அங்கீகாரத்தின் கலவையாகும், இது உள்ளடக்கத்தைத் திருத்துவதற்கு (இது சுத்தமாக இருக்கிறது) மற்றும் ஆக்டோகாட்.ஜேக்கள் ரெப்போவில் ஈடுபட வேண்டும், பின்னர் எனது ஹ்யூகோ கட்டமைப்பைச் செய்ய ஜீட்டின் கிதுப் ஒருங்கிணைப்பு. இந்த அமைப்பின் மூலம், வேர்ட்பிரஸ் போன்ற சிஎம்எஸ் ஆதரவுடைய தரவுத்தளத்தில் ஒரு பயனர் எவ்வாறு இடுகைகளை உருவாக்க முடியும் என்பதைப் போலவே, முற்றிலும் சுய ஹோஸ்ட் செய்யப்பட்ட நிலையான சிஎம்எஸ் வைத்திருக்க முடியும்.

இந்த இடுகையில் நான் உள்கட்டமைப்பின் ஒரு பகுதியில் கவனம் செலுத்தப் போகிறேன் - கிதுபிற்கு பல கோப்புகளைச் செய்கிறேன், ஏனென்றால் அது வேலை செய்ய எனக்கு சிறிது நேரம் பிடித்தது.

முழு குறியீட்டையும் எனது [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) காணலாம்.

கிதுபிற்கு நேரடியாக ஈடுபட வேண்டிய ஒரு வலை UI ஐ நீங்கள் உருவாக்குகிறீர்கள் என்றால், நான் கண்டறிந்த சிறந்த நூலகம் ஆக்டோகாட் - இது CORS உடன் வேலை செய்கிறது மற்றும் இது கிதுப் API இன் முழு API மேற்பரப்பையும் கையாளுகிறது.

மரம், கிளைகள் மற்றும் பிற துண்டுகள் எவ்வாறு செயல்படுகின்றன என்பதைப் புரிந்துகொள்ளும்போது கிட் ஒரு சிக்கலான மிருகமாக இருக்கக்கூடும், எனவே சில முடிவுகளை எடுத்தேன்.

1. நான் `heads/master` எனப்படும் முதன்மை கிளைக்கு மட்டுமே தள்ள முடியும்.
1. சில கோப்புகள் எங்கே சேமிக்கப்படும் என்பதை நான் அறிவேன் (ஹ்யூகோ ஒரு குறிப்பிட்ட அடைவு கட்டமைப்பைக் கொண்டிருக்கும்படி என்னைத் தூண்டுகிறது)


இதைக் கருத்தில் கொண்டு, பல கோப்புகளுடன் ஒரு உறுதிப்பாட்டை உருவாக்குவதற்கான பொதுவான செயல்முறை பின்வருமாறு:

ரெப்போவுக்கு ஒரு குறிப்பு கிடைக்கும்.

1. `heads/master` கிளையில் மரத்தின் `heads/master` பற்றிய `heads/master` .
1. நாம் செய்ய விரும்பும் ஒவ்வொரு கோப்பிற்கும் ஒரு `blob` உருவாக்கி, பின்னர் `sha` அடையாளங்காட்டி, பாதை, பயன்முறை பற்றிய குறிப்புகளை ஒரு வரிசையில் `sha` .
1. `heads/master` மரத்தின் நுனியில் குறிப்பைச் சேர்க்க அனைத்து `tree` கொண்ட ஒரு புதிய `tree` உருவாக்கி, புதிய `sha` சுட்டிக்காட்டி இந்த மரத்தில் `sha` .
1. இந்த புதிய மரத்தை சுட்டிக்காட்டும் ஒரு உறுதிப்பாட்டை உருவாக்கி, பின்னர் `heads/master` கிளைக்கு `heads/master` .

குறியீடு அந்த ஓட்டத்தை மிகவும் பின்பற்றுகிறது. ஏனென்றால், சில உள்ளீடுகளுக்கான பாதை கட்டமைப்பை நான் அனுமானிக்க முடியும், கோப்புகளுக்கான சிக்கலான UI அல்லது நிர்வாகத்தை நான் உருவாக்க தேவையில்லை.

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

நிலையான ஹோஸ்டிங்கிற்கு ஒத்த எதையும் நீங்கள் செய்திருந்தால் எனக்கு தெரியப்படுத்துங்கள். முற்றிலும் சேவையக-குறைவான ஹோஸ்டிங் உள்கட்டமைப்புக்கான நவீன ஃபிரான்டெண்டை உருவாக்க முடியும் என்பதில் நான் மிகவும் மகிழ்ச்சியடைகிறேன்.

ஜீட் பற்றி என்ன?

சரி, இது இப்போது தானாகவே தானாகவே இருக்கிறது. `static-builder` கட்டளையை இயக்க நான் `static-builder` ஐப் பயன்படுத்துகிறேன், அது மிகவும் அதிகம். :)