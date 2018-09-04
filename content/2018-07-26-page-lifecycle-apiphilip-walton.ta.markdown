---
slug: page-lifecycle-apiphilip-walton
date: 2018-07-26T23:10:28.198Z
title: 'Page Lifecycle API - Philip Walton'
link: https://developers.google.com/web/updates/2018/07/page-lifecycle-api
tags: [links, lifecycle, pwa]
---
ஃபிலிப் வால்டன் உங்கள் தாவல்களை உலாவி போது பதிலளிக்க எப்படி பதிலளிக்க (டெவலப்பர்) கட்டுப்பாட்டை கொடுக்க Chrome குழு ஒரு புதிய ஏபிஐ ஒரு அற்புதமான ஆழமான டைவ் உள்ளது.

> Application lifecycle is a key way that modern operating systems manage resources. On Android, iOS, and recent Windows versions, apps can be started and stopped at any time by the OS. This allows these platforms to streamline and reallocate resources where they best benefit the user.
> 
> On the web, there has historically been no such lifecycle, and apps can be kept alive indefinitely. With large numbers of web pages running, critical system resources such as memory, CPU, battery, and network can be oversubscribed, leading to a bad end-user experience.
> 
> While the web platform has long had events that related to lifecycle states &#x2014; like load, unload, and visibilitychange &#x2014; these events only allow developers to respond to user-initiated lifecycle state changes. For the web to work reliably on low-powered devices (and be more resource conscious in general on all platforms) browsers need a way to proactively reclaim and re-allocate system resources.
> 
> In fact, browsers today already do take active measures to conserve resources for pages in background tabs, and many browsers (especially Chrome) would like to do a lot more of this &#x2014; to lessen their overall resource footprint.
> 
> The problem is developers currently have no way to prepare for these types of system-initiated interventions or even know that they're happening. This means browsers need to be conservative or risk breaking web pages.
> 
> The Page Lifecycle API attempts to solve this problem by:
> 
> * Introducing and standardizing the concept of lifecycle states on the web.
> * Defining new, system-initiated states that allow browsers to limit the resources that can be consumed by hidden or inactive tabs.
> * Creating new APIs and events that allow web developers to respond to transitions to and from these new system-initiated states.
> * This solution provides the predictability web developers need to build applications resilient to system interventions, and it allows browsers to more aggressively optimize system resources, ultimately benefiting all web users.
> 
> The rest of this post will introduce the new Page Lifecycle features shipping in Chrome 68 and explore how they relate to all the existing web platform states and events. It will also give recommendations and best-practices for the types of work developers should (and should not) be doing in each state.


[முழு இடுகையைப் படிக்கவும்](https://developers.google.com/web/updates/2018/07/page-lifecycle-api).

என் முதல் கருத்து நீங்கள் பிலிப்ஸ் படிக்க வேண்டும் என்று ஆகிறது. அது நம்பமுடியாதது.

மொபைல் போனில், பயனர் அதைப் பயன்படுத்தாதபோது (உதாரணமாக, நீங்கள் தாவல்களை இடமாற்றம் செய்யும்போது அல்லது Android பயன்பாட்டில் Chrome பயன்பாட்டிலிருந்து நகரும்போது), உலாவி பின்னணியில் உங்கள் உலாவியில் (உறைதல் அல்லது விலக்குதல்) பக்கம் மிகவும் ஆக்கிரோஷமாக இருக்க முடியும். ஒரு டெவலப்பராக நீங்கள் ஒரு பாரம்பரியமாக டெவலப்பராக இருப்பதால், நீங்கள் எளிதாக நிலைத்திருக்க முடியாது அல்லது திறந்த ஆதாரங்களை மூடுவதும், நீங்கள் பயன்பாட்டில் இருக்கும்போது, ​​முக்கியமாக, அரசு மீண்டும் மீண்டும் ஹைட்ரேட் நிலைக்கு வந்தால், அதை எளிதாக செய்ய முடியாது. டெவலப்பர்கள் கட்டுப்பாட்டுடன் இருக்கும்போது, ​​அதிகமான தகவல் தெரிவுகளை உருவாக்க முடியும், இதன் விளைவாக பயனர் அல்லது டெவெலப்பர் அனுபவத்தை கடுமையாக பாதிக்காமல் உலாவியில் எதிர்கால ஆதாரங்களை பாதுகாப்பதில் உலாவி மிகவும் கடுமையாக இருக்கும்.

இறுதியாக, கீழேயுள்ள வரைபடம் அது அழகாக தோற்றமளிக்கிறது.

<figure><img src="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png" /><figcaption> <a href="https://developers.google.com/web/updates/images/2018/07/page-lifecycle-api-state-event-flow.png">பக்கம் வாழ்க்கை சுழற்சி ஏபிஐ</a> </figcaption></figure>


