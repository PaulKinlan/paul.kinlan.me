---
date: 2018-04-15 13:20:31+00:00
description: Possibly the world's best jake.
slug: jakehorner
summary: I've created the world's best Jake Horner! He's a PWA airhorn with custom
  styling and animation, complete with a bobbing head. Check out the live demo and
  code on my blog!
tags:
- pwa
- airhorn
- jake
- jake horner
- progressive web app
- sound
- audio
- animation
- web development
- javascript
title: JakeHorner

---
The worlds best jake.

{{<html>}}
<script src="/javascripts/air-horner.js"></script>
<style>
  air-horner {
    display: block;
    height: 300px;
  }
</style>

<air-horner id="jakehorner" src="/audio/yo.mp3" loopStart="0.616" loopEnd="1.078">
 <style>
  .head .face, .head .mouth {
    position:absolute;
  }
  .head {
    position: relative;
  }
  @keyframes jaking {
    0% {
      transform: translate(0, 8px);
    }
    100% {
      transform: translate(0, 12px);
    }
  }
  #jakehorner.horning .mouth {
    animation-name: jaking;
    -webkit-animation-name: jaking;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-direction: alternate;
    animation-direction: alternate;
    animation-duration: 10ms;
    animation-delay: 200ms;
    transform: translate(0, 10px) .2s cubic-bezier(.4, 0, 1, 1);
  }
 </style>
 <div class="head">
  <img class="face" src="/images/jakehorner/jakehead.png">
  <img class="mouth" src="/images/jakehorner/jakemouth.png">
 </div>
</air-horner>
{{</html>}}