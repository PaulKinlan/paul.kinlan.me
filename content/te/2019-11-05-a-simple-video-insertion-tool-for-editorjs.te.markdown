---
slug: a-simple-video-insertion-tool-for-editorjs
date: 2019-11-05T00:48:57.389Z
title: A simple video insertion tool for EditorJS
link: 'https://github.com/PaulKinlan/simple-video'
tags: [links, editor]
---

నేను నిజంగా <a <span class="notranslate">href=&quot;https://editorjs.io/&quot; &gt;EditorJS</a> . ఇది నా స్టాటిక్ హ్యూగో బ్లాగ్ కోసం చాలా సులభమైన వెబ్-హోస్ట్ ఇంటర్‌ఫేస్‌ను సృష్టించనివ్వండి.

సాధారణ బ్లాక్-ఆధారిత ఎడిటర్‌లో ఎడిటర్‌జేఎస్‌లో నాకు చాలా అవసరం ఉంది. దీనికి శీర్షికలు, కోడ్ మరియు హోస్టింగ్ మౌలిక సదుపాయాలు అవసరం లేకుండా ఎడిటర్‌కు చిత్రాలను జోడించే సరళమైన మార్గం కోసం ప్లగిన్ ఉంది. ఇప్పటి వరకు వీడియోలను ఎడిటర్‌కు జోడించడానికి దీనికి సాధారణ మార్గం లేదు.

నేను పట్టింది <a <span class="notranslate">href=&quot;https://github.com/editor-js/simple-image&quot; &gt;simple-image</a> ప్లగ్ఇన్ రిపోజిటరీ మరియు అది అప్ (కేవలం ఒక టాడ్) ఒక సృష్టించడానికి మార్చారు <a <span class="notranslate">href=&quot;https://github.com/PaulKinlan/simple-video&quot; &gt;simple-video</a> ప్లగ్ఇన్ ( <a <span class="notranslate">href=&quot;https://www.npmjs.com/package/simple-video-editorjs&quot; &gt;npm module</a> ). ఇప్పుడు నేను ఈ బ్లాగులో వీడియోలను సులభంగా చేర్చగలను.

మీరు ఎడిటర్‌జెఎస్‌తో ఫ్యామిలర్‌గా ఉంటే, మీ ప్రాజెక్ట్‌లలో చేర్చడం చాలా సులభం. ఈ క్రింది విధంగా ఇన్‌స్టాల్ చేయండి

```
npm i simple-video-editorjs
```

మీరు సరిపోయేటట్లు చూసేటప్పుడు దాన్ని మీ ప్రాజెక్ట్‌లో చేర్చండి.

```
const SimpleVideo = require('simple-video-editorjs');

var editor = EditorJS({
  ...
  
  tools: {
    ...
    video: SimpleVideo,
  }
  
  ...
});
```

ఎడిటర్ కొన్ని సాధారణ ఎంపికలను కలిగి ఉంది, ఇది వీడియోను పేజీలో ఎలా హోస్ట్ చేయాలో కాన్ఫిగర్ చేయడానికి మిమ్మల్ని అనుమతిస్తుంది:

1. ఆటోప్లే - పేజీ లోడ్ అయినప్పుడు వీడియో స్వయంచాలకంగా ప్లే అవుతుంది
1. మ్యూట్ చేయబడింది - వీడియో అప్రమేయంగా ధ్వనిని కలిగి ఉండదు (ఆటోప్లే కోసం అవసరం)
1. నియంత్రణలు - వీడియో డిఫాల్ట్ HTML నియంత్రణలను కలిగి ఉంటుంది.

పొందుపరిచిన వీడియో యొక్క శీఘ్ర ఉదాహరణ క్రింద ఉంది (మరియు కొన్ని ఎంపికలను చూపిస్తుంది).

<figure><video src="/videos/2019-11-06-a-simple-video-insertion-tool-for-editorjs-0.mp4" alt="Showing Options for EditorJS simple video." autoplay muted></video></figure>

ఏదేమైనా, ఈ చిన్న ప్లగ్‌ఇన్‌ను సృష్టించడం నాకు చాలా ఆనందంగా ఉంది - ఇది సృష్టించడం చాలా కష్టం కాదు మరియు నేను చేసిన ఏకైక విషయం ఏమిటంటే బేస్ 64 కి మార్పిడిని వాయిదా వేయడం, ఇది సాధారణ చిత్రాలు ఉపయోగిస్తుంది మరియు బదులుగా బొట్టు URL లను ఉపయోగిస్తుంది.