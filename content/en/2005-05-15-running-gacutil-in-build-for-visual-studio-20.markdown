---
slug: running-gacutil-in-build-for-visual-studio-20
date: 2005-05-15
 
title: Running GACUtil in Build for Visual Studio 2005
published: true
---
It took me absolutly ages to find why I couldn't run GACUtil or the RegAsm.exe from a build script. It is because VS2005 Beta 2 doesn't seem to load the PATH Envionment variables at build time. This results in VS2005 Beta 2 not being able to find the files it needs. There is a simple cure to this problem<p />The Following doesn't work and causes build errors (because the build script doesn't run)<br /><blockquote style="margin-top: 0; margin-bottom: 0;"><div style="MARGIN-RIGHT: 0px;">cd $(ProjectDir)\bin\Release<p />gacutil.exe /if Favorites.dll<br />regasm Favorites.dll</div></blockquote><div style="MARGIN-RIGHT: 0px;">If you add the following line in: <strong><em>CALL "%VS80COMNTOOLS%\vsvars32.bat" &gt; NULL</em></strong><br />so that you get:</div><blockquote style="margin-top: 0; margin-bottom: 0;"><div style="MARGIN-RIGHT: 0px;">CALL "%VS80COMNTOOLS%\vsvars32.bat" &gt; NULL<br />cd $(ProjectDir)\bin\Release<p />gacutil.exe /if Favorites.dll<br />regasm Favorites.dll</div></blockquote><div style="MARGIN-RIGHT: 0px;">It works fine. The extra line in the build script seems to load the environment varibles that VS2005 Beta 2 needs.<p />
</div><p />

