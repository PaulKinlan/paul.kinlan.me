---
slug: creating-a-commit-with-multiple-files-to-github-with-js-on-the-web
date: 2019-05-24T11:10:02.642Z
title: 'Creating a commit with multiple files to Github with JS on the web'
tags: [hugo, serverless, octokat]
---
मेरी साइट [entirely static](https://github.com/PaulKinlan/paul.kinlan.me) । यह [Hugo](https://gohugo.io) साथ बनाया गया है और [Zeit](https://zeit.co) साथ होस्ट किया [Zeit](https://zeit.co) । मैं सेटअप के साथ बहुत खुश हूं, मुझे तत्काल बिल्ड और सुपर फास्ट सीडीएनआईडी कंटेंट डिलीवरी के पास मिलता है और मैं उन सभी चीजों को कर सकता हूं जिनकी मुझे आवश्यकता है क्योंकि मुझे किसी भी राज्य का प्रबंधन करने की आवश्यकता नहीं है।

मैंने इस साइट के लिए एक [simple UI](https://github.com/PaulKinlan/paul.kinlan.me/tree/main/static/share/image) बनाया है और मेरा [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) भी है जो मुझे अपने [podcast creator](https://github.com/PaulKinlan/podcastinabox-editor) रूप से होस्ट की गई साइट पर नई सामग्री पोस्ट करने में सक्षम बनाता है।

<figure><img src="/images/2019-05-24-creating-a-commit-with-multiple-files-to-github-with-js-on-the-web-0.jpeg"></figure>

इसलिए। मैंने इसे कैसे किया?

यह मेरे गिथब रेपो, EditorJS के खिलाफ फायरबेस प्रमाणीकरण का एक संयोजन है जो सामग्री को संपादित करने के लिए (यह साफ है) और ऑक्टोकैट.जेएस को रेपो के लिए प्रतिबद्ध करता है और फिर मेरे ह्यूगो का निर्माण करने के लिए ज़ीइट्स गीथब एकीकरण करता है। इस सेट अप के साथ, मैं एक पूरी तरह से स्व-होस्ट किए गए स्थिर सीएमएस को सक्षम कर सकता हूं, इसी तरह एक उपयोगकर्ता वर्डप्रेस जैसे डेटाबेस समर्थित सीएमएस में पोस्ट कैसे बना सकता है।

इस पोस्ट में मैं सिर्फ इंफ्रास्ट्रक्चर के एक हिस्से पर ध्यान केंद्रित करने जा रहा हूं - जीथब को कई फाइलें देना क्योंकि मुझे काम करने में थोड़ा समय लगा।

पूरा कोड मेरे [repo](https://github.com/PaulKinlan/podcastinabox-editor/blob/master/record/javascripts/main.mjs#L90) पर देखा जा सकता है।

यदि आप एक वेब यूआई का निर्माण कर रहे हैं, जिसे सीधे जीथब करने की आवश्यकता है, तो मुझे जो सबसे अच्छा पुस्तकालय मिला है, वह है ऑक्टोकैट - यह कोर के साथ काम करता है और यह जीथब एपीआई की पूरी एपीआई सतह को संभालने के लिए लगता है।

Git एक जटिल जानवर हो सकता है जब यह समझने की बात आती है कि पेड़, शाखाएं और अन्य टुकड़े कैसे काम करते हैं तो मैंने कुछ फैसले लिए जिससे यह आसान हो गया।

1. मैं केवल मास्टर शाखा में काम करने में सक्षम `heads/master` जिसे `heads/master` नाम से जाना जाता है।
1. मुझे पता चल जाएगा कि कुछ फाइलें कहाँ संग्रहीत होंगी (ह्यूगो ने मुझे एक विशिष्ट निर्देशिका संरचना के लिए बाध्य किया है)


इसे ध्यान में रखते हुए, एकाधिक फ़ाइलों के साथ एक कमेटी बनाने की सामान्य प्रक्रिया इस प्रकार है:

रेपो का संदर्भ लें।

1. `heads/master` शाखा पर पेड़ की नोक का संदर्भ `heads/master` ।
1. प्रत्येक फ़ाइल के लिए जिसे हम एक `blob` बनाना चाहते हैं और फिर एक सरणी में `sha` पहचानकर्ता, पथ, मोड के संदर्भों को संग्रहीत करते हैं।
1. एक नया `tree` बनाएं, जिसमें `heads/master` पेड़ की नोक के संदर्भ में जोड़ने के लिए सभी `heads/master` , और नए `sha` पॉइंटर को इस पेड़ में संग्रहीत करें।
1. इस नए पेड़ को `heads/master` करने वाली एक `heads/master` और फिर `heads/master` शाखा में `heads/master` ।

कोड बहुत अधिक उस प्रवाह का अनुसरण करता है। क्योंकि मैं कुछ निविष्टियों के लिए पथ संरचना ग्रहण कर सकता हूं, इसलिए मुझे फ़ाइलों के लिए किसी भी जटिल UI या प्रबंधन का निर्माण करने की आवश्यकता नहीं है।

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

मुझे पता है कि क्या आपने स्थैतिक होस्टिंग के साथ भी कुछ ऐसा ही किया है। मैं बहुत उत्साहित हूं कि मैं एक आधुनिक फ्रंटएंड बना सकता हूं जो कि पूरी तरह से सर्वर-कम होस्टिंग इन्फ्रास्ट्रक्चर है।

Zeit के बारे में क्या?

खैर, यह अभी थोड़े स्वचालित है। मैं ह्यूगो कमांड को चलाने के लिए `static-builder` का उपयोग करता `static-builder` और यह बहुत ज्यादा है। :)