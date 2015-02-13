---
layout: post
title: "Installing Chrome for Android on an emulator"
date: 2013-06-11 17:13
comments: false
categories: chrome, android
---
Let me start by saying it is not possible.  But I have a half solution.

If you have tried to install Chrome for Android before on an emulator you will be intimately familiar with the series of errors that occur, most noteably:

<img src="/images/chromeandroidfail.png" />

Arghhh... I am not going to document how you get this far because I will just be spreading alot of useless facts that ultimately lead you nowhere...

The problem stems from the fact that Chrome for Android is only available from the Play Store and is not available for general download.  Luckily Chromium is an Open Source project and whilst we don't have a full Chromium client available we do have access to the Test Shell.

The Test Shell is Chromium without Chrome's Chrome.  It doesn't look as pretty but it is fully functional as a Browser (minus all the cool stuff such as bookmarking, sync etc).  It even includes the ability for you to connect the Remote Debugger to it from your Desktop. Brilliant!

You can find all the recent builds at [http://commondatastorage.googleapis.com/chromium-browser-continuous/index.html?path=Android/](http://commondatastorage.googleapis.com/chromium-browser-continuous/index.html?path=Android/) and install the builds on your Android device or emulator by running the following command:

    adb install [path to the APK you just downloaded]

This is all pretty cool but still a pain.  Ideally what you want is a way to quickly install the latest build of the Chrome on Android Test Shell on all the connected devices and emulators.  Fortunately, this is possible.  The kind engineers on the chromium project have a file called [LAST_CHANGE](http://commondatastorage.googleapis.com/chromium-browser-continuous/Android/LAST_CHANGE) which gives us a pointer to the directory that contains the latest build.  With this in hand we can script the entire process.

The following script will determine the latest build of ChromiumTestShell, download it to a temporary file, extract ChromiumTestShell from the archive (into another temporary file) and then install it on your connected devices and emulators.

    #! /bin/sh

    LATEST=`curl -s http://commondatastorage.googleapis.com/chromium-browser-continuous/Android/LAST_CHANGE`

    echo Latest Chromium Android at $LATEST

    TMP_DL=`mktemp -t chrome-android.XXXX`
    TMP_APK=`mktemp -t chrome-android.XXXX`
    REMOTE_APK=http://commondatastorage.googleapis.com/chromium-browser-continuous/Android/$LATEST/chrome-android.zip
     
    echo Downlaoding $REMOTE_APK to $TMP_DL
    curl $REMOTE_APK -o $TMP_DL
     
    echo Extracting ChromiumTestShell.apk to $TMP_APK
    unzip -p $TMP_DL chrome-android/apks/ChromiumTestShell.apk >> $TMP_APK
    adb install $TMP_APK

And that's it.

I recongnise that there probably a lot of things wrong with this, so I have made it available for modification and improvement on GitHub - [https://github.com/PaulKinlan/chromium-android-installer](https://github.com/PaulKinlan/chromium-android-installer).
