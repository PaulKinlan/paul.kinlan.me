---
slug: seconds-to-timecode
date: 2016-12-17T13:20:31.000Z
title: "Seconds to HH:MM:SS.MS format"
---

This is mostly for future reference. I recently built a tool trims a video and I
needed to convert from seconds to the time-code format that FFMPEG uses of
hh:mm:ss.ms

```javascript
const secondsToTimeCode = function(timeInSeconds) {

  const zeropad = function(number) {
      return (number <= 9) ? `0{$number}`: number;
  }

  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60) % 60;
  const seconds = timeInSeconds % 60;

  return `${zeropad(hours)}:${zeropad(minutes)}:${zeropad(seconds)}`;
};
```
It worked well for what I needed.