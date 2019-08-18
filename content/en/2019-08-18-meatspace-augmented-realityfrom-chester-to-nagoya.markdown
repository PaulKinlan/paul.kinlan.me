---
slug: meatspace-augmented-realityfrom-chester-to-nagoya
date: 2019-08-18T15:00:23.686Z
title: 'Meatspace Augmented Reality: From Chester to Nagoya'
link: ''
tags: [AR]
---

I love [Chester](<a href="https://en.wikipedia.org/wiki/Chester">https://en.wikipedia.org/wiki/Chester</a>) - it's a Roman fort town in the North of England, with a heap of history. On a walk through the Roman Gardens we came across a real-world Augmented Reality experience that described the breach of the walls in the time of the English Civil War.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-0.jpeg"></figure>

I thought it was rather neat, with the associated information on the board it gave me a sense of what was happening in that period. The experience got me thinking about Augmented Reality on modern smartphones and the headset's (I've been lucky enough to play with a Magic Leap) - the usecases we demo with these devices are just not worth the cost of development right now. 

The AR space will need some sort of content creation tooling much like the web offered with HTML to be even slightly useful, and when I costed out what it would take to create this above demo I could quite easily see an agency costing this out to be in the region of $30k to $50k to to mention the cost of the device and that you would still need some real-world signage that describes that you activate an AR experience.

This brings me on to the following Real (in the true digital sense) AR experience that I saw in Nagoya Castle.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-1.jpeg"></figure>

There's a nice big sign that tells you to use a proper browser and not the ones inside Line or Twitter - I suspect this is because they don't normally have access to the camera or other API's consistently (I believe this is a bigger issue on iOS)

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-2.jpeg"></figure>

Then you get some premium real-estate describing what to do (take a photo of one of the signs) so that you can get access to some extra content.

Pointing [qrsnapper.com](https://qrsnapper.com) at it, it loads up the web page.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-5.jpeg"></figure>

Which then loads up another Web App that uses the camera to let you scan the special symbols dotted around the castle.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-3.jpeg"></figure>

Finally, I can then load up the experience and get some more information in a rather cute video overlay on the real-world.

<figure><img src="/images/2019-08-18-meatspace-augmented-realityfrom-chester-to-nagoya-4.jpeg"></figure>

This is not the AR demos you see in an Apple Keynote, but it is AR and it is contextual, so whilst I found this incredibly neat and I am also incredibly grateful for the exhibition to be able to offer an experience like this bypassing the Native apps in favour of a quick to load and use Web experience, I didn't find that it added much value to what could have been written text on a placard and I wonder what the cost was to build this and place the instructional signs in the building.

The fact that I had to load up two camera applications: my QR scanner, and then the Web apps scanner; is a major concern of how discoverable AR based experiences will be for the foreseeable future. If they are not easily discoverable and useable, they well, won't be used. Apps won't solve this problem because you still need bootstrap into the discover, so the only place I can see this being solved is in the Camera app directly with a Web Content layer over it that allows people to create and host content for it quickly

I've got a small amount of hope for the [Web Perception Toolkit](https://perceptiontoolkit.dev/getting-started/) if they can get this integrated in to the Camera of multiple OS's - until then, I don't see AR really taking off for the consumer use-cases that we talk the most about and the one in Chester sufficed.
