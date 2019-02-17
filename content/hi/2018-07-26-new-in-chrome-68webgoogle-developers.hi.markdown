---
slug: new-in-chrome-68webgoogle-developers
date: 2018-07-26T22:46:46.011Z
title: 'Add to homescreen changes in Chrome 68 - Pete LePage'
link: https://developers.google.com/web/updates/2018/07/nic68
tags: [links, pwa, a2hs]
---
पीट लीपेज क्रोम में होमस्क्रीन में जोड़ने के लिए महत्वपूर्ण बदलावों के बारे में लिखता है

> ## Add to Home Screen changes
> If your site meets the add to home screen criteria, Chrome will no longer show the add to home screen banner. Instead, you&#x2019;re in control over when and how to prompt the user.
> 
> To prompt the user, listen for the `beforeinstallprompt` event, then, save the event and add a button or other UI element to your app to indicate it can be installed.


[पूर्ण पोस्ट पढ़ें](https://developers.google.com/web/updates/2018/07/nic68)।

मुझे मूल रूप से इस बारे में मिश्रित भावनाएं थीं क्योंकि बहुत से लोग 'preinstallprompt' ईवेंट को संभाल नहीं पाते थे, इसका मतलब यह था कि अचानक वेब एपीके के इंस्टॉल की संख्या काफी कम हो जाएगी, लेकिन मुझे लगता है कि यह वास्तव में करना सही है।

लक्ष्य वेब पर होने वाले कष्टप्रद संकेतों की संख्या को कम करना है, और आखिरी चीज जो हमें उद्योग में चाहिए, वह अपेक्षाकृत बड़ी प्राप्ति के लिए है जब हमें लगता है कि उपयोगकर्ता पीडब्ल्यूए स्थापित करना चाहता है, इसके बजाय अब आपको इस बारे में सोचें कि कहां और कब ** आप ** इंस्टॉल करने के लिए संकेत देना चाहते हैं और आपको उपयोगकर्ता-इशारा के जवाब में ऐसा करना है।

साफ बात यह है कि हम (क्रोम) उपयोगकर्ता को यह जानने के अधिक परिवेश तरीकों को पेश कर रहे हैं कि एक अनुभव स्थापित करने में सक्षम है, अभी यह छोटा लोड बार है जो पहले लोड पर दिखाई देता है, और उम्मीद है कि भविष्य में हम खोज सकते हैं उपयोगकर्ता को यह बताने के अधिक सूक्ष्म तरीके वे जानते हैं कि वे कार्रवाई कर सकते हैं।
