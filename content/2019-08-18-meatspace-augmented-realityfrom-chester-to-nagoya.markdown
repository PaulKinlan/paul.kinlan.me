---
date: 2019-08-18 15:00:23.686000+00:00
description: Some thoughts on AR after finding some during my travels. TL;DR - cheaper
  content creation and better discovery tools are needed.
slug: meatspace-augmented-realityfrom-chester-to-nagoya
summary: 'During my travels, I encountered two distinct augmented reality (AR) experiences:
  one in Chester, UK, and another in Nagoya, Japan. The Chester experience, focusing
  on the city''s historical siege, was simple but effective. The Nagoya Castle experience,
  accessed via QR codes and a web app, offered additional information through video
  overlays. Both sparked thoughts about the current state of AR. While impressed,
  I question the cost-effectiveness of such experiences, given the high development
  expenses and the need for clear user instructions.  A major hurdle for AR adoption
  is discoverability.  QR codes, while functional, add extra steps.  Ideally, AR experiences
  should be seamlessly integrated into camera apps, enabling easy access to web-based
  content.  While projects like the Web Perception Toolkit offer a glimmer of hope,
  deeper OS integration is crucial for AR to truly flourish.  For now, simpler, analog
  approaches like the one in Chester may be more practical.'
tags:
- AR
- Augmented Reality
- Chester
- Nagoya
- QR Codes
- Web AR
- Discoverability
- Cost Effectiveness
- Content Creation
- Web Perception Toolkit
title: 'Meatspace Augmented Reality: From Chester to Nagoya'

---

I love [Chester](https://en.wikipedia.org/wiki/Chester) - it's a walled Roman fort town in the North West of England, with a heap of history. On a walk through the Roman Gardens we came across a real-world Augmented Reality experience that described the breach of the walls in the time of the English Civil War.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-0.jpeg"></figure>

I thought it was rather neat, with the associated information on the board it gave me a sense of what was happening in that period. The experience got me thinking about Augmented Reality on modern smartphones and the headset's (I've been lucky enough to play with a Magic Leap) - the usecases we demo with these devices are just not worth the cost of development right now.

I costed out what I thought it would take to create this above experience but as a digital interactive, and I could quite easily see an agency costing this out to be in the region of $30k to $50k at a minimum, not to mention the cost of the devices that you need to run an experience and the real-world signage that describes how you activate the AR experience.

This brings me on to the following Real (in the true digital sense) AR experience that I saw in Nagoya Castle.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-1.jpeg"></figure>

There's a nice big sign that tells you to use a proper browser and not the ones inside Line or Twitter - I suspect this is because they don't normally have access to the camera or other API's consistently (I believe this is a bigger issue on iOS)

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-2.jpeg"></figure>

Then you get some premium real-estate describing what to do (take a photo of one of the signs) so that you can get access to some extra content.

Pointing [qrsnapper.com](https://qrsnapper.com) at it, it loads up Nagoya Castle's AR experience (note: I had to take screenshots after the fact because I forgot to take proper photos whilst using the site).

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-5.jpeg"></figure>

Which then loads up another Web App that uses the camera to let you scan the special symbols dotted around the castle.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-3.jpeg"></figure>

Finally, I can then load up the experience and get some more information in a rather cute video overlay on the real-world.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-4.jpeg"></figure>

This is not the AR demos you see in an Apple Keynote, but it is AR and it is contextual, so whilst I found this incredibly neat and I am also incredibly grateful for the exhibition to be able to offer an experience like this bypassing the Native apps in favour of a quick to load and use Web experience. However, I didn't find that it added much value to what could have been written text on a placard and I wonder what the cost was to build this and place the instructional signs in the building - and I wonder if it was worth the cost in the long run.

Next, the other big issue was discoverability. I had to load up two camera applications: my QR scanner to get to the web page, and then the Web app's object scanner. This should be a major concern for any AR based experiences for the foreseeable future. If they are not easily discoverable and useable, they won't be used. Apps won't solve the discovery problem (everyone will have to scan that QR code) just to get the priviledge of a huge one-time use download. The only place I can see this being solved is in the Camera app directly with a (Web ideally) Content layer over it that allows people to create and host content for it quickly

I've got a small amount of hope (biased) for projects like the [Web Perception Toolkit](https://perceptiontoolkit.dev/getting-started/) that are attempting to make it easier to build experiences that can be discovered off non-QR based anchors. But there would need to be deeper integration of discovery in to the Camera of multiple OSs to get AR really taking off for the consumer use-cases that we talk about. And we haven't even talked about the content creation aspect of this. It's not cheap.

Right now, the experience in Chester will have to suffice. And maybe that is okay.
