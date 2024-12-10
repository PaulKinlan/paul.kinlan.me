---
date: 2016-07-29
slug: android-screen-recording-and-device-framing
summary: In a previous post, I discussed screen recording from Android.  This post
  details how I automated the process of adding a device frame to those recordings,
  making them look more professional. Previously, this was a tedious manual process
  involving Screenflow, but now I've automated it using ffmpeg.  The ffmpeg command
  scales the screen recording and overlays it onto a background image of a device
  frame. The code, available on GitHub, handles the entire process, including setting
  up the Android device for recording, pulling the recording, and applying the frame.  While
  the current solution works well, I'm open to suggestions for improvement from ffmpeg
  experts.
tags:
- android
- screen recording
- device frame
- ffmpeg
- automation
- video editing
- bash
- shell script
- github
title: Automating Android screen recording and device framing
video_url: /videos/record-device-frame.mp4

---
 
[I wrote about screen recording from Android](/android-screen-recording/) a little while ago and whilst
it is cool, I didn't document anything of the process that I had to get it into the device frame and
make the screen recordings look all "profesh".

The process in the past was pretty cumbersome, I would grab the screen recording using my script and 
then use `Screenflow` to overlay the video on the device frame and then do export that out to the 
mp4 followed by a quick bit of GIF hakery.

I needed to automate this because each video was probably about 20 minutes worth of work.

I have known for a long time of [ffmpeg](https://ffmpeg.org).  O.M.G, it's incredibly powerful and incredibly complex
especially for a noob like me to get started. 

I needed to have a background layer and then to overlay the screen recording on top of it.  Pretty simple stuff,
one little gotcha was that the video produced by the Android screen recording tool is high resolution so I needed
to also scale down the video size.

This is the commandline that I came up with and it seems to work reasonably well.

```shell
ffmpeg \
  -i n6-background.png \
  -i screenrecording.mp4 \
  -filter_complex "[1:v]scale=480:-1[scaled_overlay],[0:v][scaled_overlay]overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2" \
  output.mp4
```

* n6-background is white backgroud with a device frame on it at 1920x1080 resolution.
* screenrecording.pn4 is, well, the screenrecording from the device.
* fileter_complex is the ffmpeg processing language you have to use.  In this case takes the 2nd video stream and scales it
  and then overlays and centers it on top of the video stream that is created by the background image
 
It works pretty well.  Now on to also making a GIF out of it... ;)

This code is on [github if you want to keep up to date with it](https://gist.github.com/PaulKinlan/2fdb0c8a6b6f6a646f87) and
I've included it below.  I will say if you are an ffmpeg expert and you see something I can improve let me know.

```shell
if [ -z "$1" ]; then
  shot_path=$(date +%Y-%m-%d-%H-%M-%S).mp4
else
  shot_path="$*"
fi

ffmpeg="ffmpeg"
n6_frame="n6-background.png"

trap ctrl_c INT

function ctrl_c() {
  echo "** Trapped CTRL-C"
  echo "** Downloading screencast"
  sleep 2

  adb shell am broadcast -a com.android.systemui.demo -e command exit
  adb pull /sdcard/Movies/$shot_path .

  if [ -x $(which "$ffmpeg") ] && [ -e "$n6_frame" ]
  then
    $ffmpeg -i $n6_frame -i $shot_path  -filter_complex "[1:v]scale=480:-1[scaled_overlay],[0:v][scaled_overlay]overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2" $shot_path-frame.mp4
  fi

  alldone
}

function setup() {
   adb shell settings put global sysui_demo_allowed 1
   adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e datatype lte -e level 4
   adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false
   adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4
   # Tweak this if you want the clock to changed
   adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 0440
   # Remove this if you want notifications to be availalbe
   adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false
   echo When finished, run: adb shell am broadcast -a com.android.systemui.demo -e command exit
}

function alldone() {
  adb shell am broadcast -a com.android.systemui.demo -e command exit
}

setup

adb shell screenrecord --bit-rate 6000000 /sdcard/Movies/$shot_path

echo "Finished"
```