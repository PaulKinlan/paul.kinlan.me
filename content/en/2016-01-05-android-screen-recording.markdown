---
slug: android-screen-recording
date: 2016-01-05T12:20:31.000Z
title: "Quickly capturing screen recordings from an Android device"
description: "I have a little script that I use to keep me sane"
---

Sometimes it feels like my days consist of making neat looking screencaptures of the work that
me and my team do on the web.

Android has a really nice utility built into the platform that allows you to
record the visual output of the device.  The utility is called `screenrecord` and
can be access via `adb` over a USB cable.  Extra details can be found on the
[Android Developer site](http://developer.android.com/tools/help/shell.html#screenrecord)

Whilst it is a useful tool it can be cumbersome to use frequently because you have to
connect your device, adb into it, issue the screenrecord command and then once complete
copy the output video back to your local machine.

During the course of going through this process many times and sharing the videos I would
also get a lot of complaints that the time was at a weird time, or that the battery was not
full and it is was distracting.  You can solve this by putting the device in to 
[demo mode](https://android.googlesource.com/platform/frameworks/base/+/android-6.0.0_r1/packages/SystemUI/docs/demo_mode.md).


Because I have to do this frequently I created a little shell script that you can run 
that will make this process a lot easier. It will:

* Put the device into demo mode
* Set good default recording rates
* Start the recording
* Capture CTRL-C to finish recording and
  * Remove demo mode
  * Locally download the recorded video.
  
One nice benefit, if you have Google Photos all the videos can be automatically backed up and synced
across devices (but that has nothing to do with this script).

```shell
if [ -z "$1" ]; then
  shot_path=$(date +%Y-%m-%d-%H-%M-%S).mp4
else
  shot_path="$*"
fi

trap ctrl_c INT

function ctrl_c() {
   echo "** Trapped CTRL-C"
   echo "** Downloading screencast"
   sleep 2
   
   adb shell am broadcast -a com.android.systemui.demo -e command exit
   adb pull /sdcard/Movies/$shot_path .
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
   echo When finished press CTRL-C
}

function alldone() {
  adb shell am broadcast -a com.android.systemui.demo -e command exit
}

setup

adb shell screenrecord --bit-rate 6000000 /sdcard/Movies/$shot_path
echo "Finished"
```

In a later post I will describe the process of embedding the video in a 
device frame and also how we GIF them.