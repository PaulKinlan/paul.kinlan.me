---
slug: ML-to-help-with-developer-experience
date: 2022-12-02T02:30:29+00:00
title: Using ML to improve developer experience.
summary: 'My world has been shook. I started writing this post in March 2021 and am revisiting it today. I discussed how watching Corridor Crew inspired me to look for ways ML can improve developer experience. After researching, I identified four challenges: inferring what developers meant for the DOM, aiding with accessibility, helping with performance, and creating layouts and images. Finally, I questioned how GPT-Chat has changed my job as a DevRel lead.'
tags:
- ML

---
_I started to write this post in March 2021, and I am getting back around to it... and there's been a lot of changes._

I love watching [Corridor Crew](https://www.youtube.com/channel/UCSpFnDQr88xCZ80N-X7t0nQ). They are a bunch of amazing SFX creators out in LA who push what is possible in VFX using what appears (to me) to be commodity hardware and tools.

They recently showed a [video](https://www.youtube.com/watch?v=fmJ74774RO8) that put their team against each other to rotoscope a person out of a video and put in a new background element using a variety of techniques: traditional (by hand), modern tools, new enhanced Tools, and a special ML way.

The ML way one, it took 6 minutes to complete and is a game changer (according to
the team - the traditional way would take weeks etc). Best of all the [tool was a web app](https://runwayml.com/green-screen/)! The frikin' Web!

It made me think. What challenges do developers have that are incredibly manual, that are hard to solve with traditional software but could be inferred?

---

**Update**: In between when I started to write this post and today, there's been a lot more work in this space. [Github Co-pilot](https://github.com/features/copilot) in particular is one of the reasons why I stopped writing this, it looked like we were just heading towards better code-completion (which is still amazing BTW - also there's [still research happening](https://ai.googleblog.com/2022/07/ml-enhanced-code-completion-improves.html)) but now I see DALL-E-2 (it blew my mind) and it made me question my long-term future in software development, but specifically it got me thinking what is the future in this space and can I do anything interesting now?

---

I started to look "How ML can improve developer experience" and it's mostly vague pieces about the outcome "improved productivity", "fewer errors", "better estimates" and general puff pieces. What I'm not seeing are the products that are being built. I know I'm not searching properly.

I'm still thinking about some of the more practical results. I end up looking at the models that already exist to see if I could think of ideas for what could be created. For example: TensorFlow has a list of "[task libraries](https://www.tensorflow.org/lite/inference_with_metadata/task_library/overview)" and [models](https://github.com/tensorflow/tfjs-models) (and even a [catalogue](https://tfhub.dev/)); Meta have a similar [set](https://ai.facebook.com/tools/#libraries-and-models) - but it's still kinda hard to work out what to do.

Here's my list of challenges I want to research:

* Can we better infer what a developer meant for the DOM?
  * To aid with accessibility. "Hey that div sure looks like a button?"
  * To help with performance. "Didn't you mean async on this script element?"
* Layouts:
  * Roughly describe a layout you want based and create it
* Images:
  * Describe what is in the image more effectively for a11y?
  * Make it easy to create stock images - I've seen this being used on the [platformer.news](https://www.platformer.news/ "www.platformer.news/") - so it makes sense.

Actually, I remember why I stopped this post - I kept drawing a blank on how ML can be applied. I'm certainly interested to learn about what you're working on with the application of ML to Developer Experience (for web developers at least), I believe the opportunities are incredible, but I'm not sure where to actually start, and that is a challenge for me to process.

---

**Update 2**: In between when I started to write this post and then updating it (above) and today. GPT-Chat has just changed everything for me and I'm left questioning a lot of what I do...

---

GPT-Chat has just changed a lot of things for me, to the point where a lot of what I do as a DevRel lead (help developers understand features and concepts) has been up ended... Maybe my job is to make the materials that train the machines that can bring multiple concepts together...

### Build a webpage that has a masonry layout

<figure markdown=1>
<img src="/images/2022-12-02-chat-openai-com_chat-2.png">
</figure>

<figure markdown=1>
<img src="/images/2022-12-02-chat-openai-com_chat-3.png">
</figure>

I'm kinda shocked. It worked.

#### Add placekitten images to the masonry grid

<figure markdown=1>
<img src="/images/2022-12-02-screen-shot-2022-12-02-at-19-49-56.png">
</figure>

O.M.G
