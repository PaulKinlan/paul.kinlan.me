---
date: 2016-12-17 13:20:31+00:00
slug: seconds-to-timecode
summary: I created a quick JavaScript function to convert seconds to an HH:MM:SS timecode
  format for use with tools like FFMPEG.  The function takes in the total seconds
  and returns a formatted string.
tags:
- javascript
- ffmpeg
- timecode
- video
- seconds
title: Seconds to HH:MM:SS.MS format

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