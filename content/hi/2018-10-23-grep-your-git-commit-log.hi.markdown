---
slug: grep-your-git-commit-log
date: 2018-10-23T09:59:01.080Z
title: 'Grep your git commit log'
description: 'Finding code that was changed in a commit'
tags: [git]
---


यह भविष्य में मेरे संदर्भ के लिए अधिक है। लेकिन यदि आप खोजना चाहते हैं तो आप एक विशिष्ट शब्द के लिए इतिहास प्रतिबद्ध करते हैं जो आपके किसी एक काम में बदल जाता है, तो आप निम्न आदेश जारी कर सकते हैं:


```
git grep your-regex-here $(git rev-list --all)
```


उदाहरण के लिए मैंने [git grep "\ 'load" $ (गिट rev-list --all)' को खोजने के लिए [प्रतिबद्ध किया है जो मुझे 'लोड' हटा रहा था](/performance-and-resiliencestress-testing-third-parties-by-css-wizardry/)।

साफ।
